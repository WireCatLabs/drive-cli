import { join } from "node:path"
import { CliError } from "@wirecat/cli-base"
import { walkQuery } from "@wirecat/cli-base/query"
import type { MessageStore, Note } from "@wirecat/cli-core/store"
import { catalogInput } from "./catalog.js"
import { paths } from "./config.js"
import { documentKnowledge, saveContributors } from "./knowledge.js"
import type { DocumentIndex } from "./model.js"

export const openIndex = async (env: NodeJS.ProcessEnv): Promise<DocumentIndex> => {
  const { ensureSqlite } = await import("@wirecat/cli-core/sqlite-runtime")
  await ensureSqlite()
  const { openStore } = await import("@wirecat/cli-core/store")
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
    catalog: {
      import: async (principal, files) => {
        if (files.length > 10000)
          throw new CliError("validation_error", "catalog scope exceeds 10000 entries", {
            reason: "catalog.scope-limit",
          })
        const selected = await folder(principal, true)
        if (!selected) throw new CliError("configuration_error", "catalog collection could not be registered")
        for (let start = 0; start < files.length; start += 200) {
          await store.catalog.upsert(selected.id, files.slice(start, start + 200).map(catalogInput))
        }
        for (const file of files) {
          const entry = await store.catalog.get(selected.id, `${file.id}.md`)
          if (entry) await saveContributors(store, principal, file, entry.ref.slice("document:".length))
        }
        const retired = await store.catalog.reconcile(
          selected.id,
          files.map((file) => `${file.id}.md`),
        )
        documents.delete(principal)
        return { entries: files.length, retired }
      },
      get: async (principal, id) => {
        const selected = await folder(principal, false)
        return selected ? store.catalog.get(selected.id, `${id}.md`) : undefined
      },
      list: async (principal, query = {}) => {
        const selected = await folder(principal, false)
        const ast = query.ast ? structuredClone(query.ast) : undefined
        if (ast) for (const node of walkQuery(ast.root)) if (node.field === "parent") node.value = `${node.value}.md`
        return selected
          ? store.catalog.list(selected.id, {
              ...query,
              ...(ast ? { ast } : {}),
              ...(query.parent === undefined ? {} : { parent: `${query.parent}.md` }),
            })
          : { items: [], hasMore: false }
      },
    },
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
          mime: content.metadata.mime,
          size: content.metadata.size ?? null,
          owners: content.metadata.owners ?? [],
          lastModifiedBy: content.metadata.lastModifiedBy ?? null,
          modifiedAt: content.metadata.modifiedAt ?? null,
          sourceVersion: content.metadata.version ?? null,
          tabs: content.tabs.map(({ id, title }) => ({ id, title })),
          ...(content.notRead ? { notRead: content.notRead } : {}),
        },
      })
      await store.catalog.upsert(selected.id, [catalogInput(content.metadata)])
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
        const retired = note ? undefined : await store.catalog.get(selected.id, path, true)
        const ref = note?.ref ?? retired?.ref
        if (ref) await stale(ref)
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
      const { searchNotes } = await import("@wirecat/cli-core/services")
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
            const metadata = note.frontMatter as { sourceUrl?: unknown; tabs?: unknown; notRead?: unknown } | null
            const entry = note.path ? await store.catalog.get(selected.id, note.path) : undefined
            return {
              ...hit,
              source_url: typeof metadata?.sourceUrl === "string" ? metadata.sourceUrl : null,
              tabs: Array.isArray(metadata?.tabs) ? metadata.tabs : [],
              kind: entry?.kind ?? "file",
              content: entry?.content ?? "indexed",
              not_read:
                typeof metadata?.notRead === "string"
                  ? metadata.notRead
                  : entry?.content === "metadata"
                    ? entry.kind === "folder"
                      ? "folder metadata only"
                      : "content is not indexed yet"
                    : null,
            }
          }),
        ),
      }
    },
    embed: async (max) => {
      const { embedNotes } = await import("@wirecat/cli-core/services")
      return embedNotes(store, { maxChunks: max, env, command: "tg" })
    },
    close: () => store.close(),
  }
}
