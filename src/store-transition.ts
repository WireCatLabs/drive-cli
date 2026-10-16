import { existsSync } from "node:fs"
import { join, resolve } from "node:path"
import { CliError, isCliError } from "@wirecat/cli-base"
import { catalogFiles } from "@wirecat/cli-core/documents"
import { openStore, storePath } from "@wirecat/cli-core/store"
import { activeProfile, paths } from "./config.js"
import type { DocumentContent, DocumentIndex } from "./model.js"
import { lockProfile } from "./profile-lock.js"
import { readSnapshot, readState, saveState } from "./state.js"

// Old row numbers are meaningful only in their original database, even when the new row happens to exist.
export const prepareStore = async (index: DocumentIndex, env: NodeJS.ProcessEnv, name: string, rescan = false) => {
  const profile = activeProfile(env, name)
  const lock = await lockProfile(env, name)
  try {
    const state = readState(env, name, profile.principal)
    const target = resolve(storePath(env))
    const previous = resolve(state.store ?? join(paths(env).state, "drive.db"))
    if (previous !== target && existsSync(previous)) {
      const old = await openStore({ path: previous, env, command: "drive" })
      try {
        const folder = (await old.notes.folders()).find((item) => item.name === `google-drive:${profile.principal}`)
        const counts = { tags: 0, notes: 0, memories: 0, facts: 0, links: 0 }
        if (folder) {
          for (let offset = 0; ; offset += 500) {
            const page = await old.notes.notes({ folderId: folder.id, source: "file", limit: 500, offset })
            for (const note of page.items) {
              counts.tags += (await old.notes.noteTags(note.ref)).length
              counts.notes += (await old.notes.notes({ source: "internal", about: note.ref, limit: 1 })).items.length
              counts.memories += (await old.memories.list({ subject: note.ref, limit: 1 })).length
              counts.facts += (await old.facts.list({ subject: note.ref, limit: 1 })).length
              counts.links += (await old.notes.links({ from: note.ref })).filter(
                (link) => link.origin !== "file",
              ).length
              counts.links += (await old.notes.links({ to: note.ref })).length
            }
            if (!page.hasMore) break
          }
        }
        if (Object.values(counts).some(Boolean))
          throw new CliError(
            "configuration_error",
            `the previous Drive database has annotations (${Object.entries(counts)
              .map(([key, count]) => `${key}: ${count}`)
              .join(", ")}); ` +
              "it was retained. Set MESSAGING_STORE to that database to keep using its references; annotation transfer is required before switching stores",
            {
              reason: "store.annotations-present",
              annotation_counts: Object.entries(counts)
                .map(([key, count]) => `${key}: ${count}`)
                .join(", "),
            },
          )
      } finally {
        await old.close()
      }
    }
    if (previous !== target) {
      // Read every snapshot before writing anything. A missing file must not leave a partly rewritten checkpoint.
      const contents = Object.entries(state.documents).flatMap(([id, doc]) => {
        let content: DocumentContent
        try {
          content = readSnapshot(env, name, id)
        } catch (error) {
          if (!rescan || !isCliError(error) || error.code !== "not_found") throw error
          delete state.documents[id]
          delete state.cursor
          delete state.pending
          return []
        }
        if (content.metadata.id !== id)
          throw new CliError("configuration_error", "source snapshot identity does not match its checkpoint", {
            reason: "state.invalid",
          })
        return [{ id, doc, content }]
      })
      await index.catalog?.import(profile.principal, catalogFiles(state, profile.roots))
      for (const { id, doc, content } of contents) {
        lock.assertHeld()
        state.documents[id] = {
          ...doc,
          reference: await index.save(profile.principal, content, doc.hash),
          picture: undefined,
        }
      }
      delete state.linkedThrough
    }
    lock.assertHeld()
    state.store = target
    await index.registerProfile?.(name, profile.principal)
    saveState(env, name, state)
  } finally {
    await lock.release()
  }
}
