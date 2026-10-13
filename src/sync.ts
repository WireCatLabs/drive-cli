import { createHash } from "node:crypto"
import { CliError, isCliError } from "@wirecat/cli-base"
import { catalogFiles } from "./catalog.js"
import { activeProfile, textLimit } from "./config.js"
import { googleError } from "./errors.js"
import { MAX_ENTRIES, supported, tooManyEntries } from "./google.js"
import {
  type DocumentContent,
  type DocumentIndex,
  type FileMetadata,
  FOLDER,
  type GoogleSource,
  type Skip,
  type SyncState,
  type WorkItem,
} from "./model.js"
import { lockProfile } from "./profile-lock.js"
import { within } from "./scope.js"
import { readState, removeSnapshot, saveSnapshot, saveState } from "./state.js"
import { VERSION } from "./version.js"

const scopeHash = (roots: string[]) =>
  createHash("sha256")
    .update(JSON.stringify([...roots].sort()))
    .digest("hex")
const skipReason = (file: FileMetadata) =>
  !file.canDownload ? "downloads restricted" : supported(file) ? undefined : `unsupported type: ${file.mime}`
// Skips decided by type are retried once a newer version reads the type; length skips once the limit is raised.
const retryable = (skip: Skip, limit: number) =>
  skip.reason === "downloads restricted" ||
  skip.reason.startsWith("unsupported type: ") ||
  (skip.textLimit !== undefined && skip.textLimit < limit) ||
  // The store's own bounds change only with the shared package drive pins.
  (skip.storeRefusedIn !== undefined && skip.storeRefusedIn !== VERSION) ||
  // 0.2.0 and earlier skipped text over 200 000 characters with this reason and no recorded limit.
  (skip.reason.startsWith("document exceeds the ingestion bound") && limit > 200000)
const changedSince = (previous: FileMetadata, file: FileMetadata) =>
  previous.version !== file.version ||
  previous.modifiedAt !== file.modifiedAt ||
  previous.name !== file.name ||
  previous.canDownload !== file.canDownload ||
  JSON.stringify(previous.parents) !== JSON.stringify(file.parents)
const hashText = (text: string) => createHash("sha256").update(text).digest("hex")

export { within } from "./scope.js"

const plan = async (
  source: GoogleSource | undefined,
  state: SyncState,
  roots: string[],
  limit: number,
  abandoned: string[] = [],
): Promise<NonNullable<SyncState["pending"]>> => {
  const scope = scopeHash(roots)
  if (!roots.length)
    return {
      scope,
      cursor: state.cursor ?? "",
      folders: {},
      skipped: [],
      jobs: [...new Set([...Object.keys(state.documents), ...abandoned])].map((id) => ({ id, kind: "remove" })),
    }
  if (!source) throw new CliError("configuration_error", "selected folders require an authenticated Google source")
  const initial = !state.cursor || scope !== state.scope
  const cursor = initial ? (roots.length ? await source.startToken() : (state.cursor ?? "")) : (state.cursor as string)
  const folders: Record<string, FileMetadata> = initial ? {} : structuredClone(state.folders)
  const files = new Map<string, FileMetadata>(
    Object.values(state.documents).map((doc) => [doc.metadata.id, doc.metadata]),
  )
  const changed = new Set<string>()
  for (const skipped of state.skipped) if (skipped.file) files.set(skipped.id, skipped.file)
  const visited = new Set<string>()
  let discovered = 0
  const crawl = async (folder: FileMetadata, ancestry = new Set<string>()): Promise<void> => {
    if (ancestry.has(folder.id)) throw new CliError("invalid_response", "folder traversal contains a cycle")
    if (visited.has(folder.id)) return
    visited.add(folder.id)
    folders[folder.id] = folder
    for (const file of await source.children(folder.id)) {
      if (++discovered > MAX_ENTRIES) throw tooManyEntries()
      if (file.mime === FOLDER) await crawl(file, new Set([...ancestry, folder.id]))
      else {
        files.set(file.id, file)
        changed.add(file.id)
      }
    }
  }
  let finalCursor = cursor
  if (initial) {
    files.clear()
    for (const root of roots) {
      if (visited.has(root)) continue
      const folder = await source.metadata(root)
      if (folder.mime !== FOLDER || folder.trashed)
        throw new CliError("validation_error", "configured root is not an accessible folder")
      await crawl(folder)
    }
  } else {
    const page = await source.changes(cursor)
    finalCursor = page.cursor
    const latest = new Map(page.items.map((change) => [change.id, change]))
    const entering: FileMetadata[] = []
    // Apply all ancestry changes before classifying document scope.
    for (const change of latest.values()) {
      if (change.removed || change.file?.trashed) {
        files.delete(change.id)
        if (folders[change.id]) folders[change.id] = { ...(folders[change.id] as FileMetadata), trashed: true }
      } else if (change.file?.mime === FOLDER) {
        folders[change.id] = change.file
        entering.push(change.file)
      } else if (change.file) {
        files.set(change.id, change.file)
        changed.add(change.id)
      } else if (state.documents[change.id] || folders[change.id])
        throw new CliError("invalid_response", "known source changed without metadata; checkpoint preserved")
    }
    // Drive-level access changes may not emit an event for every descendant file.
    for (const root of roots) {
      const previous = folders[root]
      try {
        const current = await source.metadata(root)
        if (current.id !== root || current.mime !== FOLDER)
          throw new CliError("invalid_response", "selected folder metadata is inconsistent")
        folders[root] = current
        if (previous?.trashed && !current.trashed) entering.push(current)
      } catch (error) {
        const safe = googleError(error)
        if (safe.code !== "not_found" || !previous) throw safe
        folders[root] = { ...previous, trashed: true }
      }
    }
    for (const folder of entering) if (!visited.has(folder.id) && within(folder, roots, folders)) await crawl(folder)
  }
  const jobs: WorkItem[] = []
  const skipped: SyncState["skipped"] = []
  for (const root of roots)
    if (folders[root]?.trashed) skipped.push({ id: root, reason: "selected folder is unavailable" })
  for (const [id, file] of files) {
    if (!within(file, roots, folders)) continue
    const previousSkip = state.skipped.find((item) => item.id === id)
    const reason = skipReason(file)
    const retry = previousSkip && !reason && retryable(previousSkip, limit)
    if (previousSkip && !changed.has(id) && !initial && !retry && !(reason && !state.documents[id])) {
      skipped.push({ ...previousSkip, file })
      continue
    }
    const known = state.documents[id]
    if (reason) {
      skipped.push({ id, reason, file })
      if (initial || !known || known.notRead !== reason || changedSince(known.metadata, file))
        jobs.push({ id, kind: "save", file })
      continue
    }
    if (changed.has(id) || retry || known?.notRead) {
      if (!known || known.notRead || changedSince(known.metadata, file) || initial)
        jobs.push({ id, kind: "save", file })
    }
  }
  for (const id of new Set([...Object.keys(state.documents), ...abandoned])) {
    const file = files.get(id)
    if (!file || !within(file, roots, folders)) jobs.push({ id, kind: "remove" })
  }
  // Only retain metadata for selected ancestry; the account-wide feed includes unrelated folders.
  const scopedFolders = Object.fromEntries(
    Object.entries(folders).filter(([, file]) => within(file, roots, folders) || roots.includes(file.id)),
  )
  return { scope, cursor: finalCursor, folders: scopedFolders, jobs, skipped }
}

export interface SyncResult {
  saved: number
  names_only: number
  removed: number
  unchanged: number
  pending: number
  skipped: { id: string; reason: string }[]
  errors: { id: string; code: string; message: string }[]
  coverage: string
}
export const sync = async (
  source: GoogleSource | undefined,
  index: DocumentIndex,
  env: NodeJS.ProcessEnv,
  name: string,
  max: number,
  signal?: AbortSignal,
  rescan = false,
): Promise<SyncResult> => {
  const profile = activeProfile(env, name)
  if (signal?.aborted) throw new CliError("cancelled", "sync was cancelled")
  const lock = await lockProfile(env, name)
  const result: SyncResult = {
    saved: 0,
    names_only: 0,
    removed: 0,
    unchanged: 0,
    pending: 0,
    skipped: [],
    errors: [],
    coverage: "selected folders only; unsupported files are reported",
  }
  try {
    if (profile.roots.length && (!source || (await source.identity()) !== profile.principal))
      throw new CliError("authentication_error", "signed-in Google account does not match this profile", {
        reason: "profile.wrong-account",
      })
    const state = readState(env, name, profile.principal)
    const limit = textLimit(env, name)
    const currentScope = scopeHash(profile.roots)
    const abandoned =
      state.pending && (state.pending.scope !== currentScope || rescan) ? state.pending.jobs.map((job) => job.id) : []
    if (state.pending?.scope !== currentScope || rescan) delete state.pending
    if (rescan) delete state.cursor
    if (!state.pending) {
      state.pending = await plan(source, state, profile.roots, limit, abandoned)
      state.skipped = state.pending.skipped
      saveState(env, name, state)
    }
    const pending = state.pending
    if (!pending) throw new CliError("invalid_response", "could not prepare a sync batch")
    if (index.catalog) await index.catalog.import(profile.principal, catalogFiles(state, profile.roots))
    result.skipped = state.skipped.map(({ id, reason }) => ({ id, reason }))
    const saveNamesOnly = async (file: FileMetadata, reason: string) => {
      const doc: DocumentContent = { metadata: file, markdown: "", text: "", tabs: [], notRead: reason }
      const hash = hashText("")
      const previous = state.documents[file.id]
      const reference = await index.save(profile.principal, doc, hash)
      saveSnapshot(env, name, doc)
      state.documents[file.id] = { metadata: file, hash, reference, tabs: 0, notRead: reason }
      if (previous?.notRead === reason && !changedSince(previous.metadata, file)) result.unchanged++
      else result.names_only++
    }
    const jobs = [...pending.jobs].slice(0, max)
    for (const job of jobs) {
      if (signal?.aborted) throw new CliError("cancelled", "sync was cancelled; pending operations are retained")
      lock.assertHeld()
      try {
        if (job.kind === "remove") {
          await index.remove(profile.principal, job.id)
          removeSnapshot(env, name, job.id)
          delete state.documents[job.id]
          result.removed++
        } else if (job.file && skipReason(job.file)) {
          await saveNamesOnly(job.file, skipReason(job.file) as string)
        } else {
          if (!source) throw new CliError("configuration_error", "a pending save requires Google sign-in")
          const content = await source.content(job.id, limit)
          if (!within(content.metadata, profile.roots, pending.folders)) {
            await index.remove(profile.principal, job.id)
            removeSnapshot(env, name, job.id)
            delete state.documents[job.id]
            result.removed++
          } else {
            const hash = hashText(content.text)
            const previous = state.documents[job.id]
            const reference = await index.save(profile.principal, content, hash).catch((error: unknown) => {
              if (!isCliError(error) || error.code !== "validation_error") throw error
              throw new CliError("validation_error", `the local store refused this text: ${error.message}`, {
                reason: "store.refused",
                store_refused_in: VERSION,
              })
            })
            saveSnapshot(env, name, content)
            state.documents[job.id] = { metadata: content.metadata, hash, reference, tabs: content.tabs.length }
            if (previous?.hash === hash) result.unchanged++
            else result.saved++
          }
        }
        pending.jobs = pending.jobs.filter((item) => item !== job)
        saveState(env, name, state)
      } catch (error) {
        const safe = googleError(error)
        if (safe.code === "cancelled") throw safe
        if (job.kind === "save" && (safe.code === "not_found" || safe.code === "validation_error")) {
          const skipped: Skip = {
            id: job.id,
            reason: safe.message,
            ...(job.file ? { file: job.file } : {}),
            ...(safe.details.text_limit ? { textLimit: limit } : {}),
            ...(safe.details.store_refused_in ? { storeRefusedIn: VERSION } : {}),
          }
          if (job.file && safe.code === "validation_error") await saveNamesOnly(job.file, skipped.reason)
          else {
            await index.remove(profile.principal, job.id)
            removeSnapshot(env, name, job.id)
            delete state.documents[job.id]
          }
          state.skipped = state.skipped.filter((item) => item.id !== job.id)
          state.skipped.push(skipped)
          result.skipped.push({ id: skipped.id, reason: skipped.reason })
          pending.jobs = pending.jobs.filter((item) => item !== job)
          saveState(env, name, state)
          continue
        }
        result.errors.push({ id: job.id, code: safe.code, message: safe.message })
      }
    }
    result.pending = pending.jobs.length
    if (!pending.jobs.length) {
      state.cursor = pending.cursor
      state.scope = pending.scope
      state.folders = pending.folders
      delete state.pending
      state.lastSync = new Date().toISOString()
      saveState(env, name, state)
    }
    return result
  } finally {
    await lock.release()
  }
}
