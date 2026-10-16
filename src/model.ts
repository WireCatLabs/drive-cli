import type {
  DocumentSource,
  IndexedSource,
  PictureWriter,
  SourceChange,
  SourceContent,
  SourceFile,
  SourceSkip,
  SourceState,
  SourceWork,
} from "@wirecat/cli-core/documents"

export type { PictureWriter, TabText } from "@wirecat/cli-core/documents"
export const FOLDER = "application/vnd.google-apps.folder"
export const DOC = "application/vnd.google-apps.document"
export const SHEET = "application/vnd.google-apps.spreadsheet"
export interface GoogleUser {
  id?: string
  email?: string
  name?: string
}
export interface FileMetadata extends SourceFile {
  driveId?: string
  owners?: GoogleUser[]
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
// documents list declares the shared document entity for its query, but answers drive's own fields.
export const DOCUMENT_LIST_FIELDS = Object.keys({
  id: true,
  name: true,
  mime: true,
  parents: true,
  version: true,
  url: true,
  trashed: true,
  size: true,
  description: true,
  owners: true,
  provider_metadata: true,
  modified_at: true,
  can_download: true,
  created_at: true,
  drive_id: true,
  last_modified_by: true,
  reference: true,
  tabs: true,
} satisfies Record<keyof ReturnType<typeof metadataJson> | "reference" | "tabs", true>)
export const skipJson = ({ file, textLimit, storeRefusedIn, ...rest }: Skip) => ({
  ...rest,
  ...(file ? { file: metadataJson(file) } : {}),
  ...(textLimit === undefined ? {} : { text_limit: textLimit }),
  ...(storeRefusedIn === undefined ? {} : { store_refused_in: storeRefusedIn }),
})
export type DocumentContent = SourceContent<FileMetadata>
export type Change = SourceChange<FileMetadata>
export type GoogleSource = DocumentSource<FileMetadata>
export type IndexedDocument = IndexedSource<FileMetadata>
export type WorkItem = SourceWork<FileMetadata>
export type Skip = SourceSkip<FileMetadata>
export type SyncState = SourceState<FileMetadata> & { store?: string; linkedThrough?: string; linksPending?: boolean }
export interface DocumentIndex {
  registerProfile?(name: string, principal: string): Promise<void>
  linkMessages?(documents: { reference: string; fileId: string }[], since?: string): Promise<number>
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
