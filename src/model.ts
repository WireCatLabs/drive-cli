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
  lastModifiedBy?: GoogleUser
}
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
  content(id: string): Promise<DocumentContent>
}
export interface IndexedDocument {
  metadata: FileMetadata
  hash: string
  reference: string
  tabs: number
}
export interface WorkItem {
  id: string
  kind: "save" | "remove"
  file?: FileMetadata
}
export interface SyncState {
  version: 1
  principal: string
  scope: string
  cursor?: string
  folders: Record<string, FileMetadata>
  documents: Record<string, IndexedDocument>
  skipped: { id: string; reason: string; file?: FileMetadata }[]
  pending?: {
    cursor: string
    scope: string
    folders: Record<string, FileMetadata>
    jobs: WorkItem[]
    skipped: { id: string; reason: string; file?: FileMetadata }[]
  }
  lastSync?: string
}
export interface DocumentIndex {
  knowledge?: import("./knowledge.js").DocumentKnowledge
  save(principal: string, content: DocumentContent, hash: string): Promise<string>
  remove(principal: string, id: string): Promise<void>
  search(principal: string, query: string, options: { limit: number; offset: number; exact: boolean }): Promise<unknown>
  embed(max: number): Promise<unknown>
  close(): Promise<void>
}
