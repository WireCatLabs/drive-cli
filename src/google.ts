import { docs } from "@googleapis/docs"
import { drive, type drive_v3 } from "@googleapis/drive"
import { CliError } from "@wirecat/cli-core"
import type { OAuth2Client } from "google-auth-library"
import { documentTabs } from "./documents.js"
import { googleError } from "./errors.js"
import { DOC, type FileMetadata, type GoogleSource } from "./model.js"

const FIELDS = "id,name,mimeType,parents,version,modifiedTime,trashed,webViewLink,capabilities(canDownload)"
const MAX_PAGES = 1000
const MAX_BYTES = 50 * 1024 * 1024
export const metadataOf = (file: drive_v3.Schema$File): FileMetadata => {
  if (!file.id || !file.mimeType || file.name === undefined || file.name === null)
    throw new CliError("invalid_response", "Google returned incomplete file metadata")
  return {
    id: file.id,
    name: file.name,
    mime: file.mimeType,
    parents: file.parents ?? [],
    url: file.webViewLink ?? `https://drive.google.com/file/d/${file.id}/view`,
    trashed: file.trashed ?? false,
    canDownload: file.capabilities?.canDownload !== false,
    ...(file.version ? { version: file.version } : {}),
    ...(file.modifiedTime ? { modifiedAt: file.modifiedTime } : {}),
  }
}
export const supported = (file: FileMetadata): boolean => {
  if (file.mime === DOC) return true
  if (file.mime.startsWith("application/vnd.google-apps.")) return false
  return file.mime === "text/plain" || file.mime === "text/markdown" || /\.(md|markdown|txt)$/i.test(file.name)
}

export const googleSource = (auth: OAuth2Client): GoogleSource => {
  const api = drive({ version: "v3", auth })
  const documents = docs({ version: "v1", auth })
  const safe = async <T>(fn: () => Promise<T>): Promise<T> => {
    try {
      return await fn()
    } catch (error) {
      throw googleError(error)
    }
  }
  const metadata = (id: string) =>
    safe(async () =>
      metadataOf(
        (await api.files.get({ fileId: id, fields: FIELDS, supportsAllDrives: true }, { timeout: 30000 })).data,
      ),
    )
  return {
    metadata,
    identity: () =>
      safe(async () => {
        const id = (await api.about.get({ fields: "user(permissionId)" }, { timeout: 30000 })).data.user?.permissionId
        if (!id) throw new CliError("invalid_response", "Google did not identify the signed-in account")
        return id
      }),
    children: (id) =>
      safe(async () => {
        const files: FileMetadata[] = []
        const seen = new Set<string>()
        let pageToken: string | undefined
        for (let page = 0; page < MAX_PAGES; page++) {
          const { data } = await api.files.list(
            {
              q: `'${id}' in parents and trashed = false`,
              fields: `nextPageToken,incompleteSearch,files(${FIELDS})`,
              pageSize: 1000,
              supportsAllDrives: true,
              includeItemsFromAllDrives: true,
              ...(pageToken ? { pageToken } : {}),
            },
            { timeout: 30000 },
          )
          if (data.incompleteSearch)
            throw new CliError("provider_error", "Google folder listing was incomplete; sync state was preserved")
          files.push(...(data.files ?? []).map(metadataOf))
          if (files.length > 10000)
            throw new CliError("provider_error", "folder listing exceeded 10000 entries; checkpoint preserved")
          if (!data.nextPageToken) return files
          if (seen.has(data.nextPageToken))
            throw new CliError("invalid_response", "Google repeated a folder page token")
          seen.add(data.nextPageToken)
          pageToken = data.nextPageToken
        }
        throw new CliError("provider_error", "folder pagination exceeded its bound; sync state was preserved")
      }),
    startToken: () =>
      safe(async () => {
        const token = (await api.changes.getStartPageToken({ supportsAllDrives: true }, { timeout: 30000 })).data
          .startPageToken
        if (!token) throw new CliError("invalid_response", "Google returned no change-feed token")
        return token
      }),
    changes: (token) =>
      safe(async () => {
        const items: Awaited<ReturnType<GoogleSource["changes"]>>["items"] = []
        const seen = new Set<string>()
        let pageToken = token
        for (let page = 0; page < MAX_PAGES; page++) {
          if (seen.has(pageToken)) throw new CliError("invalid_response", "Google repeated a change-feed page token")
          seen.add(pageToken)
          const { data } = await api.changes.list(
            {
              pageToken,
              pageSize: 1000,
              includeRemoved: true,
              includeCorpusRemovals: true,
              supportsAllDrives: true,
              includeItemsFromAllDrives: true,
              fields: `nextPageToken,newStartPageToken,changes(fileId,removed,file(${FIELDS}))`,
            },
            { timeout: 30000 },
          )
          for (const change of data.changes ?? []) {
            if (!change.fileId) continue
            items.push({
              id: change.fileId,
              removed: change.removed ?? false,
              ...(change.file ? { file: metadataOf(change.file) } : {}),
            })
          }
          if (items.length > 10000)
            throw new CliError("provider_error", "change feed exceeded 10000 entries; retry with drive sync --rescan")
          if (data.nextPageToken) {
            pageToken = data.nextPageToken
            continue
          }
          if (!data.newStartPageToken)
            throw new CliError("invalid_response", "Google returned no final change-feed token")
          return { items, cursor: data.newStartPageToken }
        }
        throw new CliError("provider_error", "change-feed pagination exceeded its bound; sync state was preserved")
      }),
    content: (id) =>
      safe(async () => {
        const before = await metadata(id)
        if (!before.canDownload) throw new CliError("permission_error", "downloads are restricted for this source")
        if (!supported(before))
          throw new CliError("validation_error", "this source type is not supported for text ingestion")
        let markdown: string
        let text: string
        let tabs: ReturnType<typeof documentTabs> = []
        let raw: unknown
        if (before.mime === DOC) {
          raw = (
            await documents.documents.get(
              { documentId: id, includeTabsContent: true, suggestionsViewMode: "PREVIEW_WITHOUT_SUGGESTIONS" },
              { timeout: 30000 },
            )
          ).data
          tabs = documentTabs(raw as import("@googleapis/docs").docs_v1.Schema$Document)
          if (tabs.length === 0) throw new CliError("invalid_response", "Google returned no document tabs")
          const exported = (
            await api.files.export({ fileId: id, mimeType: "text/markdown" }, { responseType: "text", timeout: 30000 })
          ).data
          if (typeof exported !== "string")
            throw new CliError("invalid_response", "Google returned a non-text Markdown export")
          markdown = exported
          // Search covers all tabs independently of the native export's tab-flattening behaviour.
          text = tabs.map((tab) => `${tab.title ? `# ${tab.title}\n\n` : ""}${tab.text}`).join("\n\n")
        } else {
          markdown = (
            await api.files.get(
              { fileId: id, alt: "media", supportsAllDrives: true },
              { responseType: "text", timeout: 30000 },
            )
          ).data as string
          text = markdown
        }
        if (Buffer.byteLength(markdown) > MAX_BYTES || text.length > 200000)
          throw new CliError("validation_error", "document exceeds the ingestion bound; it was not silently truncated")
        const after = await metadata(id)
        if (after.version !== before.version || after.modifiedAt !== before.modifiedAt)
          throw new CliError("provider_error", "document changed during export; retry sync", { retryable: true })
        const result = { metadata: after, markdown, text: text.replace(/\r\n?/g, "\n"), tabs, ...(raw ? { raw } : {}) }
        if (Buffer.byteLength(JSON.stringify(result)) > MAX_BYTES)
          throw new CliError("validation_error", "document snapshot exceeds the ingestion bound")
        return result
      }),
  }
}
