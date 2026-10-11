import { join } from "node:path"
import { CliError } from "@wirecat/cli-base"
import type { MessageStore, Note } from "@wirecat/cli-messaging/store"
import { paths } from "./config.js"
import { documentKnowledge, saveContributors } from "./knowledge.js"
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
  const documents = new Map<string, Map<string, Note>>()
  const cached = async (principal: string) => {
    const known = documents.get(principal)
    if (known) return known
    const notes = new Map<string, Note>()
    const selected = await folder(principal, false)
    if (selected) {
      for (let offset = 0; ; offset += 500) {
        const page = await store.notes.notes({ folderId: selected.id, source: "file", limit: 500, offset })
        for (const note of page.items) if (note.path) notes.set(note.path, note)
        if (!page.hasMore) break
        if (offset >= 10000) throw new CliError("provider_error", "local document listing exceeded its bound")
      }
    }
    documents.set(principal, notes)
    return notes
  }
  const stale = async (ref: string) => {
    for (const status of ["proposed", "confirmed"] as const) {
      for (let batch = 0; ; batch++) {
        const memories = await store.memories.list({ subject: ref, status, limit: 500 })
        for (const memory of memories) await store.memories.markStale(memory.ref)
        if (memories.length < 500) break
        if (batch >= 20) throw new CliError("provider_error", "memory invalidation exceeded its batch bound")
      }
    }
  }
  return {
    knowledge: documentKnowledge(store, async (principal) => (await folder(principal, false))?.id),
    save: async (principal, content, hash) => {
      const selected = await folder(principal, true)
      if (!selected) throw new Error("folder registration failed")
      const notes = await cached(principal)
      const path = `${content.metadata.id}.md`
      const before = notes.get(path)
      if (before && before.contentHash !== hash) await stale(before.ref)
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
          owners: content.metadata.owners ?? [],
          lastModifiedBy: content.metadata.lastModifiedBy ?? null,
          modifiedAt: content.metadata.modifiedAt ?? null,
          sourceVersion: content.metadata.version ?? null,
          tabs: content.tabs.map(({ id, title }) => ({ id, title })),
        },
      })
      await saveContributors(store, principal, content.metadata, note.id)
      notes.set(path, note)
      return note.ref
    },
    remove: async (principal, id) => {
      const selected = await folder(principal, false)
      if (selected) {
        const notes = await cached(principal)
        const path = `${id}.md`
        const note = notes.get(path)
        if (note) await stale(note.ref)
        await store.notes.deleteFileNotes(selected.id, [path])
        notes.delete(path)
      }
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
