import { CliError } from "@wirecat/cli-base"
import type { ProviderEntry } from "@wirecat/cli-core"
import { documentIngestion } from "@wirecat/cli-core/documents"
import type { MessageStore } from "@wirecat/cli-core/store"
import { catalogInput } from "./catalog.js"
import { activeProfile } from "./config.js"
import { documentKnowledge, saveContributors } from "./knowledge.js"
import type { DocumentIndex } from "./model.js"
import { prepareStore } from "./store-transition.js"
import { VERSION } from "./version.js"

// Other tools (memo show, search hits) read this to print `drive <profile> documents show document:N`.
export const DRIVE_PROVIDER: ProviderEntry = {
  name: "google-drive",
  kind: "documents",
  aliases: [],
  command: "drive",
  opens: { document: "documents show" },
}

/** The live, readable document a sync of any Drive profile made of this Google file. */
const syncedDocument = async (store: MessageStore, driveFileId: string): Promise<string | undefined> => {
  for (const account of await store.notes.documentsAccounts()) {
    if (account.account?.provider !== DRIVE_PROVIDER.name) continue
    const entry = await store.catalog.get(account.id, `${driveFileId}.md`)
    if (entry?.active && entry.content === "indexed") return entry.ref
  }
  return undefined
}

export const openIndex = async (env: NodeJS.ProcessEnv, name?: string, rescan = false): Promise<DocumentIndex> => {
  if (name) activeProfile(env, name)
  const { ensureSqlite } = await import("@wirecat/cli-core/sqlite-runtime")
  await ensureSqlite()
  const { openStore, storePath } = await import("@wirecat/cli-core/store")
  if (env.DRIVE_STORE)
    throw new CliError(
      "configuration_error",
      "DRIVE_STORE has been retired; use MESSAGING_STORE to select the shared database",
      { reason: "store.override-retired" },
    )
  const store = await openStore({ path: storePath(env), env, command: "drive", version: VERSION })
  const index = indexOver(store, env)
  try {
    await store.accounts.registerProvider(DRIVE_PROVIDER)
    if (name) await prepareStore(index, env, name, rescan)
    return index
  } catch (error) {
    await store.close()
    throw error
  }
}
type PictureEmbedder = Awaited<ReturnType<typeof import("@wirecat/cli-core/services")["openPictureEmbedderFor"]>>
export const indexOver = (
  store: MessageStore,
  env: NodeJS.ProcessEnv,
  pictureEmbedder?: PictureEmbedder,
): DocumentIndex => {
  const ingestion = documentIngestion(store, {
    provider: "google-drive",
    externalId: (id) => `${id}.md`,
    catalogInput,
    observed: (principal, file, id) => saveContributors(store, principal, file, id),
    frontMatter: (content) => ({
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
    }),
  })
  const folder = ingestion.collection
  return {
    ...ingestion,
    registerProfile: async (name, principal) => {
      await folder(principal, true)
      await store.accounts.saveProfile("drive", name, { provider: "google-drive", account: principal })
    },
    addSource: async (input, driveFileId) => {
      const synced = driveFileId === undefined ? undefined : await syncedDocument(store, driveFileId)
      if (!synced) return store.notes.saveAddedSource(input)
      for (const subject of input.subjects ?? [])
        await store.notes.addLink({ from: synced, to: subject, kind: "about", origin: "owner", by: input.by })
      const subjects = (await store.notes.links({ from: synced, kind: "about" })).flatMap((link) => link.to ?? [])
      return { note: await store.notes.note(synced), created: false, duplicateOf: synced, kept: null, subjects }
    },
    linkMessages: (documents, since) => store.notes.linkMessages({ documents, ...(since ? { since } : {}) }),
    knowledge: documentKnowledge(store, async (principal) => (await folder(principal, false))?.id),
    openPictures: async () => {
      const { openPictureEmbedderFor, savePicture } = await import("@wirecat/cli-core/services")
      const embedder = pictureEmbedder ?? (await openPictureEmbedderFor({ env, command: "drive" }))
      return {
        save: (reference, bytes) => savePicture(store, { ref: reference }, bytes, { embedder }),
        close: () => (pictureEmbedder ? Promise.resolve() : embedder.close()),
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
          total: { value: 0, relation: "eq" },
          has_more: false,
          meaning_skipped: "this Google account has no imported sources",
        }
      const { searchNotes } = await import("@wirecat/cli-core/services")
      const result = await searchNotes(store, query, {
        ...options,
        folderIds: selected ? [selected.id] : [],
        env,
        command: "drive",
        ...(pictureEmbedder ? { pictureEmbedder } : {}),
      })
      const pictures = await Promise.all(
        (result.pictures ?? []).map(async (picture) => {
          const note = await store.notes.note(picture.ref)
          const [file] = await store.files.ofDocument(picture.ref)
          return { ...picture, title: note.title, url: file?.url ?? null }
        }),
      )
      // The answer keeps the --json names it had before cli-core's search answered a ListResult.
      const { pictures: _, items, hasMore, nextOffset, ...rest } = result
      return {
        ...rest,
        has_more: hasMore,
        ...(nextOffset === undefined ? {} : { next_offset: nextOffset }),
        ...(result.pictures ? { pictures } : {}),
        hits: await Promise.all(
          items.map(async (hit) => {
            const note = await store.notes.note(hit.ref)
            const metadata = note.frontMatter as { tabs?: unknown; notRead?: unknown } | null
            const entry = note.path ? await store.catalog.get(selected.id, note.path) : undefined
            return {
              ...hit,
              tabs: Array.isArray(metadata?.tabs) ? metadata.tabs : [],
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
      return embedNotes(store, { maxChunks: max, env, command: "drive" })
    },
    close: () => store.close(),
  }
}
