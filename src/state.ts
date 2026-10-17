import { mkdirSync, readFileSync, unlinkSync } from "node:fs"
import { join } from "node:path"
import { CliError, writeSecurely } from "@wirecat/cli-base"
import * as v from "valibot"
import { fileId, paths, profileName } from "./config.js"
import type { DocumentContent, SyncState } from "./model.js"

const ID = v.pipe(v.string(), v.regex(/^[A-Za-z0-9_-]{1,200}$/))
const User = v.object({ id: v.optional(v.string()), email: v.optional(v.string()), name: v.optional(v.string()) })
const File = v.object({
  id: ID,
  name: v.string(),
  mime: v.string(),
  parents: v.array(ID),
  version: v.optional(v.string()),
  modifiedAt: v.optional(v.string()),
  url: v.string(),
  trashed: v.boolean(),
  canDownload: v.boolean(),
  size: v.optional(v.number()),
  createdAt: v.optional(v.string()),
  description: v.optional(v.string()),
  driveId: v.optional(v.string()),
  owners: v.optional(v.array(User)),
  lastModifiedBy: v.optional(User),
  providerMetadata: v.optional(v.unknown()),
})
const Skip = v.object({
  id: ID,
  reason: v.string(),
  file: v.optional(File),
  textLimit: v.optional(v.number()),
  storeRefusedIn: v.optional(v.string()),
})
const State = v.object({
  version: v.literal(1),
  store: v.optional(v.string()),
  linkedThrough: v.optional(v.string()),
  linksPending: v.optional(v.boolean()),
  linksVersion: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1))),
  principal: v.string(),
  scope: v.string(),
  cursor: v.optional(v.string()),
  folders: v.record(ID, File),
  documents: v.record(
    ID,
    v.object({
      metadata: File,
      hash: v.string(),
      reference: v.string(),
      tabs: v.number(),
      notRead: v.optional(v.string()),
      picture: v.optional(v.picklist(["saved", "too-large"])),
    }),
  ),
  skipped: v.array(Skip),
  lastSync: v.optional(v.string()),
  pending: v.optional(
    v.object({
      cursor: v.string(),
      scope: v.string(),
      folders: v.record(ID, File),
      jobs: v.array(v.object({ id: ID, kind: v.picklist(["save", "remove"]), file: v.optional(File) })),
      skipped: v.array(Skip),
    }),
  ),
})

const Walk = v.object({
  scope: v.string(),
  cursor: v.string(),
  stack: v.array(v.object({ id: ID, ancestry: v.array(ID), folder: v.optional(File) })),
  visited: v.array(ID),
  folders: v.record(ID, File),
  files: v.array(File),
  discovered: v.number(),
})
export type Walk = v.InferOutput<typeof Walk>

export const profileDir = (env: NodeJS.ProcessEnv, name: string) =>
  join(paths(env).state, "profiles", profileName(name))
export const statePath = (env: NodeJS.ProcessEnv, name: string) => join(profileDir(env, name), "state.json")
export const readState = (env: NodeJS.ProcessEnv, name: string, principal: string): SyncState => {
  let value: unknown
  try {
    value = JSON.parse(readFileSync(statePath(env, name), "utf8"))
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT")
      return { version: 1, principal, scope: "", folders: {}, documents: {}, skipped: [] }
    throw new CliError("configuration_error", "sync state is unreadable; refusing to reset its checkpoint", {
      reason: "state.invalid",
    })
  }
  const parsed = v.safeParse(State, value)
  if (!parsed.success || parsed.output.principal !== principal)
    throw new CliError("configuration_error", "sync state is invalid or belongs to another Google account", {
      reason: "state.invalid",
    })
  return parsed.output
}
export const saveState = (env: NodeJS.ProcessEnv, name: string, state: SyncState): void => {
  writeSecurely(statePath(env, name), `${JSON.stringify(state)}\n`, 0o600)
}
const walkPath = (env: NodeJS.ProcessEnv, name: string) => join(profileDir(env, name), "walk.json")
/** The first folder walk of a scope, saved as it goes so an interrupted walk resumes where it stopped. */
export const readWalk = (env: NodeJS.ProcessEnv, name: string, scope: string): Walk | undefined => {
  try {
    const parsed = v.safeParse(Walk, JSON.parse(readFileSync(walkPath(env, name), "utf8")))
    return parsed.success && parsed.output.scope === scope ? parsed.output : undefined
  } catch {
    return undefined
  }
}
export const saveWalk = (env: NodeJS.ProcessEnv, name: string, walk: Walk): void => {
  writeSecurely(walkPath(env, name), `${JSON.stringify(walk)}\n`, 0o600)
}
export const removeWalk = (env: NodeJS.ProcessEnv, name: string): void => {
  try {
    unlinkSync(walkPath(env, name))
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error
  }
}
export const ensureProfileDir = (env: NodeJS.ProcessEnv, name: string): void => {
  mkdirSync(profileDir(env, name), { recursive: true, mode: 0o700 })
}
export const snapshotPath = (env: NodeJS.ProcessEnv, name: string, id: string) =>
  join(profileDir(env, name), "documents", `${fileId(id)}.json`)
export const saveSnapshot = (env: NodeJS.ProcessEnv, name: string, content: DocumentContent) => {
  const path = snapshotPath(env, name, content.metadata.id)
  writeSecurely(path, `${JSON.stringify(content)}\n`, 0o600)
  writeSecurely(path.replace(/\.json$/, ".md"), content.markdown, 0o600)
}
export const removeSnapshot = (env: NodeJS.ProcessEnv, name: string, id: string) => {
  const path = snapshotPath(env, name, id)
  for (const file of [path, path.replace(/\.json$/, ".md")]) {
    try {
      unlinkSync(file)
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error
    }
  }
}
export const readSnapshot = (env: NodeJS.ProcessEnv, name: string, id: string): DocumentContent => {
  try {
    return JSON.parse(readFileSync(snapshotPath(env, name, id), "utf8")) as DocumentContent
  } catch {
    throw new CliError("not_found", "source snapshot is unavailable — run drive <profile> sync --rescan", {
      reason: "state.snapshot-missing",
    })
  }
}
