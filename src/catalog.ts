import type { CatalogEntry, CatalogInput, CatalogQuery } from "@wirecat/cli-core/store"
import { type FileMetadata, FOLDER } from "./model.js"

export const catalogInput = (file: FileMetadata): CatalogInput => ({
  externalId: `${file.id}.md`,
  kind: file.mime === FOLDER ? "folder" : "file",
  name: file.name,
  parents: file.parents.map((id) => `${id}.md`),
  url: file.url,
  mime: file.mime,
  size: file.size,
  createdAt: file.createdAt,
  modifiedAt: file.modifiedAt,
  description: file.description,
  actors: [
    ...(file.owners ?? []).map((actor) => ({ ...actor, role: "owner" })),
    ...(file.lastModifiedBy ? [{ ...file.lastModifiedBy, role: "editor" }] : []),
  ],
  metadata: file.providerMetadata ?? file,
  frontMatter: {
    source: "google-drive",
    sourceUrl: file.url,
    fileId: file.id,
    mime: file.mime,
    owners: file.owners ?? [],
    lastModifiedBy: file.lastModifiedBy ?? null,
  },
})
export interface SourceCatalog {
  import(principal: string, files: FileMetadata[]): Promise<{ entries: number; retired: number }>
  get(principal: string, id: string): Promise<CatalogEntry | undefined>
  list(principal: string, query?: CatalogQuery): Promise<{ items: CatalogEntry[]; hasMore: boolean }>
}
export { catalogFiles } from "@wirecat/cli-core/documents"
