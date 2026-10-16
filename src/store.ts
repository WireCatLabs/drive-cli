import { CliError, isCliError } from "@wirecat/cli-base"
import { documentIngestion } from "@wirecat/cli-core/documents"
import type { MessageStore } from "@wirecat/cli-core/store"
import { catalogInput } from "./catalog.js"
import { documentKnowledge, saveContributors } from "./knowledge.js"
import type { DocumentIndex } from "./model.js"
import { prepareStore } from "./store-transition.js"

export const openIndex = async (env: NodeJS.ProcessEnv, name?: string, rescan = false): Promise<DocumentIndex> => {
  const { ensureSqlite } = await import("@wirecat/cli-core/sqlite-runtime")
  await ensureSqlite()
  const { openStore, storePath } = await import("@wirecat/cli-core/store")
  if (env.DRIVE_STORE)
    throw new CliError(
      "configuration_error",
      "DRIVE_STORE has been retired; use MESSAGING_STORE to select the shared database",
      { reason: "store.override-retired" },
    )
  const store = await openStore({ path: storePath(env), env, command: "drive" })
  const index = indexOver(store, env)
  try {
    if (name) await prepareStore(index, env, name, rescan)
    return index
  } catch (error) {
    await store.close()
    throw error
  }
}
// cli-core names one app's download command; drive has none and reads the models tg and max download.
const modelAdvice = (text: string) =>
  text.replace(
    /`tg ((?:images )?models (?:text )?download [^`]+)`(?: fetches it)?/,
    "tg or max downloads it: `tg $1` or `max $1`",
  )
const withModelAdvice = async <T>(act: () => Promise<T>): Promise<T> => {
  try {
    return await act()
  } catch (error) {
    if (isCliError(error) && error.details.reason === "model.not-downloaded")
      throw new CliError(error.code, modelAdvice(error.message), error.details)
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
    collectionName: (principal) => `google-drive:${principal}`,
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
      await store.accounts.saveProfile("drive", name, { provider: "folder", account: `google-drive:${principal}` })
    },
    linkMessages: (documents, since) => store.notes.linkMessages({ documents, ...(since ? { since } : {}) }),
    knowledge: documentKnowledge(store, async (principal) => (await folder(principal, false))?.id),
    openPictures: async () => {
      const { openPictureEmbedderFor, savePicture } = await import("@wirecat/cli-core/services")
      const embedder = pictureEmbedder ?? (await withModelAdvice(() => openPictureEmbedderFor({ env, command: "tg" })))
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
          has_more: false,
          meaning_skipped: "this Google account has no imported sources",
        }
      const { searchNotes } = await import("@wirecat/cli-core/services")
      const result = await withModelAdvice(() =>
        searchNotes(store, query, {
          ...options,
          folderIds: selected ? [selected.id] : [],
          env,
          command: "tg",
          ...(pictureEmbedder ? { pictureEmbedder } : {}),
        }),
      )
      const pictures = await Promise.all(
        (result.pictures ?? []).map(async (picture) => {
          const note = await store.notes.note(picture.ref)
          const metadata = note.frontMatter as { sourceUrl?: unknown } | null
          return {
            ...picture,
            title: note.title,
            source_url: typeof metadata?.sourceUrl === "string" ? metadata.sourceUrl : null,
          }
        }),
      )
      const { pictures: _, pictures_skipped, meaning_skipped, ...rest } = result
      return {
        ...rest,
        ...(meaning_skipped ? { meaning_skipped: modelAdvice(meaning_skipped) } : {}),
        ...(result.pictures ? { pictures } : {}),
        ...(pictures_skipped ? { pictures_skipped: modelAdvice(pictures_skipped) } : {}),
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
      return withModelAdvice(() => embedNotes(store, { maxChunks: max, env, command: "tg" }))
    },
    close: () => store.close(),
  }
}
