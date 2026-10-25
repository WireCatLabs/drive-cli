import { resolve } from "node:path"
import { syncDocuments } from "@wirecat/cli-core/documents"
import { storePath } from "@wirecat/cli-core/store"
import { activeProfile, textLimit } from "./config.js"
import { googleError } from "./errors.js"
import { type DocumentIndex, type FileMetadata, FOLDER, type GoogleSource, type Skip } from "./model.js"
import { lockProfile } from "./profile-lock.js"
import { readState, readWalk, removeSnapshot, removeWalk, saveSnapshot, saveState, saveWalk } from "./state.js"
import { MAX_ENTRIES, supported, tooManyEntries } from "./supported.js"
import { VERSION } from "./version.js"

export type { SyncResult } from "@wirecat/cli-core/documents"
export { within } from "./scope.js"

const MESSAGE_LINKS_VERSION = 1

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

export const sync = async (
  source: GoogleSource | undefined,
  index: DocumentIndex,
  env: NodeJS.ProcessEnv,
  name: string,
  max: number,
  signal?: AbortSignal,
  rescan = false,
) => {
  const profile = activeProfile(env, name)
  const lock = await lockProfile(env, name)
  try {
    await index.registerProfile?.(name, profile.principal)
    const before = readState(env, name, profile.principal)
    const started = new Date().toISOString()
    const result = await syncDocuments({
      source,
      index,
      principal: profile.principal,
      roots: profile.roots,
      max,
      signal,
      rescan,
      pictures: profile.picture_search,
      textLimit: textLimit(env, name),
      maxEntries: MAX_ENTRIES,
      limitError: tooManyEntries,
      isFolder: (file) => file.mime === FOLDER,
      skipReason,
      retryable,
      errorOf: googleError,
      assertHeld: () => lock.assertHeld(),
      storeVersion: VERSION,
      state: {
        read: () => readState(env, name, profile.principal),
        save: (state) => saveState(env, name, { ...state, store: resolve(storePath(env)) }),
        readWalk: (scope) => readWalk(env, name, scope),
        saveWalk: (walk) => saveWalk(env, name, walk),
        removeWalk: () => removeWalk(env, name),
        saveSnapshot: (content) => saveSnapshot(env, name, content),
        removeSnapshot: (id) => removeSnapshot(env, name, id),
      },
    })
    if (index.linkMessages) {
      const state = readState(env, name, profile.principal)
      const documents = Object.entries(state.documents).map(([fileId, doc]) => ({ fileId, reference: doc.reference }))
      const changed = documents.filter(
        ({ fileId, reference }) =>
          before.linksVersion !== MESSAGE_LINKS_VERSION ||
          before.linksPending ||
          !before.linkedThrough ||
          before.documents[fileId]?.hash !== state.documents[fileId]?.hash ||
          before.documents[fileId]?.reference !== reference,
      )
      lock.assertHeld()
      state.linksPending = true
      saveState(env, name, state)
      await index.linkMessages(changed)
      await index.linkMessages(documents, before.linkedThrough)
      lock.assertHeld()
      delete state.linksPending
      state.linksVersion = MESSAGE_LINKS_VERSION
      state.linkedThrough = started
      saveState(env, name, state)
    }
    return result
  } finally {
    await lock.release()
  }
}
