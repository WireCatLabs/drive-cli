import { syncDocuments } from "@wirecat/cli-core/documents"
import { activeProfile, textLimit } from "./config.js"
import { googleError } from "./errors.js"
import { MAX_ENTRIES, supported, tooManyEntries } from "./google.js"
import { type DocumentIndex, type FileMetadata, FOLDER, type GoogleSource, type Skip } from "./model.js"
import { lockProfile } from "./profile-lock.js"
import { readState, readWalk, removeSnapshot, removeWalk, saveSnapshot, saveState, saveWalk } from "./state.js"
import { VERSION } from "./version.js"

export type { SyncResult } from "@wirecat/cli-core/documents"
export { within } from "./scope.js"

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
    return await syncDocuments({
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
        save: (state) => saveState(env, name, state),
        readWalk: (scope) => readWalk(env, name, scope),
        saveWalk: (walk) => saveWalk(env, name, walk),
        removeWalk: () => removeWalk(env, name),
        saveSnapshot: (content) => saveSnapshot(env, name, content),
        removeSnapshot: (id) => removeSnapshot(env, name, id),
      },
    })
  } finally {
    await lock.release()
  }
}
