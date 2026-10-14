export const FOLDER = "application/vnd.google-apps.folder"
export const DOC = "application/vnd.google-apps.document"
export const SHEET = "application/vnd.google-apps.spreadsheet"
export interface GoogleUser {
  id?: string
  email?: string
  name?: string
}
export interface FileMetadata {
  id: string
  name: string
  mime: string
  parents: string[]
  version?: string
  modifiedAt?: string
  url: string
  trashed: boolean
  canDownload: boolean
  size?: number
  createdAt?: string
  description?: string
  driveId?: string
  owners?: GoogleUser[]
  providerMetadata?: unknown
  lastModifiedBy?: GoogleUser
}
/** What drive prints for a file: the stored metadata under snake_case keys. */
export const metadataJson = ({
  modifiedAt,
  canDownload,
  createdAt,
  driveId,
  lastModifiedBy,
  providerMetadata,
  ...rest
}: FileMetadata) => ({
  ...rest,
  ...(providerMetadata === undefined ? {} : { provider_metadata: providerMetadata }),
  ...(modifiedAt === undefined ? {} : { modified_at: modifiedAt }),
  can_download: canDownload,
  ...(createdAt === undefined ? {} : { created_at: createdAt }),
  ...(driveId === undefined ? {} : { drive_id: driveId }),
  ...(lastModifiedBy === undefined ? {} : { last_modified_by: lastModifiedBy }),
})
export const skipJson = ({ file, textLimit, storeRefusedIn, ...rest }: Skip) => ({
  ...rest,
  ...(file ? { file: metadataJson(file) } : {}),
  ...(textLimit === undefined ? {} : { text_limit: textLimit }),
  ...(storeRefusedIn === undefined ? {} : { store_refused_in: storeRefusedIn }),
})
export interface TabText {
  id: string
  title: string
  text: string
}
export interface DocumentContent {
  metadata: FileMetadata
  markdown: string
  text: string
  tabs: TabText[]
  notRead?: string
  raw?: unknown
}
export interface Change {
  id: string
  removed: boolean
  file?: FileMetadata
}
export interface GoogleSource {
  identity(): Promise<string>
  metadata(id: string): Promise<FileMetadata>
  children(id: string): Promise<FileMetadata[]>
  startToken(): Promise<string>
  changes(token: string): Promise<{ items: Change[]; cursor: string }>
  content(id: string, maxChars?: number): Promise<DocumentContent>
  bytes(id: string): Promise<Uint8Array>
}
export interface IndexedDocument {
  metadata: FileMetadata
  hash: string
  reference: string
  tabs: number
  notRead?: string
  picture?: "saved" | "too-large"
}
export interface WorkItem {
  id: string
  kind: "save" | "remove"
  file?: FileMetadata
}
export interface Skip {
  id: string
  reason: string
  file?: FileMetadata
  textLimit?: number
  storeRefusedIn?: string
}
export interface SyncState {
  version: 1
  principal: string
  scope: string
  cursor?: string
  folders: Record<string, FileMetadata>
  documents: Record<string, IndexedDocument>
  skipped: Skip[]
  pending?: {
    cursor: string
    scope: string
    folders: Record<string, FileMetadata>
    jobs: WorkItem[]
    skipped: Skip[]
  }
  lastSync?: string
}
export interface PictureWriter {
  save(reference: string, bytes: Uint8Array): Promise<"saved" | "unchanged">
  close(): Promise<void>
}
export interface DocumentIndex {
  catalog?: import("./catalog.js").SourceCatalog
  knowledge?: import("./knowledge.js").DocumentKnowledge
  save(principal: string, content: DocumentContent, hash: string): Promise<string>
  remove(principal: string, id: string): Promise<void>
  openPictures(): Promise<PictureWriter>
  search(
    principal: string,
    query: string,
    options: { limit: number; offset: number; exact: boolean; pictures?: boolean },
  ): Promise<unknown>
  embed(max: number): Promise<unknown>
  close(): Promise<void>
}
