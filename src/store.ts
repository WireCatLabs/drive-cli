import { join } from "node:path"
import type { MessageStore } from "@wirecat/cli-messaging/store"
import { paths } from "./config.js"
import type { DocumentIndex } from "./model.js"

export const openIndex = async (env: NodeJS.ProcessEnv): Promise<DocumentIndex> => {
  const { ensureSqlite } = await import("@wirecat/cli-messaging/sqlite-runtime")
  await ensureSqlite()
  const { openStore } = await import("@wirecat/cli-messaging/store")
  const store = await openStore({ path: env.DRIVE_STORE ?? join(paths(env).state, "drive.db"), env, command: "drive" })
  return indexOver(store, env)
}
export const indexOver = (store: MessageStore, env: NodeJS.ProcessEnv): DocumentIndex => {
  const folder = async (principal: string, create: boolean) => {
    const name = `google-drive:${principal}`
    const found = (await store.notes.folders()).find((item) => item.name === name)
    return found ?? (create ? await store.notes.addFolder({ name, format: "markdown" }) : undefined)
  }
  return {
    save: async (principal, content, hash) => {
      const selected = await folder(principal, true)
      if (!selected) throw new Error("folder registration failed")
      const { note } = await store.notes.saveFileNote({
        folderId: selected.id,
        path: `${content.metadata.id}.md`,
        title: content.metadata.name,
        text: content.text,
        contentHash: hash,
        frontMatter: {
          source: "google-drive",
          sourceUrl: content.metadata.url,
          fileId: content.metadata.id,
          tabs: content.tabs.map(({ id, title }) => ({ id, title })),
        },
      })
      return note.ref
    },
    remove: async (principal, id) => {
      const selected = await folder(principal, false)
      if (selected) await store.notes.deleteFileNotes(selected.id, [`${id}.md`])
    },
    search: async (principal, query, options) => {
      const selected = await folder(principal, false)
      if (!selected)
        return {
          query,
          by: "words",
          hits: [],
          linked: [],
          hasMore: false,
          meaningSkipped: "this Google account has no imported sources",
        }
      const { searchNotes } = await import("@wirecat/cli-messaging/services")
      const result = await searchNotes(store, query, {
        ...options,
        folderIds: selected ? [selected.id] : [],
        env,
        command: "tg",
      })
      return {
        ...result,
        hits: await Promise.all(
          result.hits.map(async (hit) => {
            const note = await store.notes.note(hit.ref)
            const metadata = note.frontMatter as { sourceUrl?: unknown; tabs?: unknown } | null
            return {
              ...hit,
              sourceUrl: typeof metadata?.sourceUrl === "string" ? metadata.sourceUrl : null,
              tabs: Array.isArray(metadata?.tabs) ? metadata.tabs : [],
            }
          }),
        ),
      }
    },
    embed: async (max) => {
      const { embedNotes } = await import("@wirecat/cli-messaging/services")
      return embedNotes(store, { maxChunks: max, env, command: "tg" })
    },
    close: () => store.close(),
  }
}
