import { CliError } from "@wirecat/cli-base"
import type { CatalogEntry, CatalogInput, CatalogQuery } from "@wirecat/cli-core/store"
import { type FileMetadata, FOLDER, type SyncState } from "./model.js"
import { within } from "./scope.js"

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
export const catalogFiles = (state: SyncState, roots: string[]): FileMetadata[] => {
  const folders = state.pending?.folders ?? state.folders
  const files = new Map<string, FileMetadata>(
    Object.values(state.documents).map((doc) => [doc.metadata.id, doc.metadata]),
  )
  for (const skip of state.skipped) if (skip.file) files.set(skip.id, skip.file)
  for (const file of Object.values(folders)) files.set(file.id, file)
  for (const job of state.pending?.jobs ?? []) {
    if (job.kind === "remove") files.delete(job.id)
    else if (job.file) files.set(job.id, job.file)
  }
  return [...files.values()].filter((file) => within(file, roots, folders))
}
export interface CatalogTree {
  item: Pick<CatalogEntry, "ref" | "name" | "kind" | "url" | "content"> & { id: string }
  children: CatalogTree[]
  truncated: boolean
}
export const catalogTree = (entries: CatalogEntry[], roots: string[], depth: number): CatalogTree[] => {
  if (!Number.isSafeInteger(depth) || depth < 0 || depth > 50)
    throw new CliError("validation_error", "tree depth must be between 0 and 50")
  const byId = new Map(entries.map((entry) => [entry.externalId, entry]))
  const children = new Map<string, CatalogEntry[]>()
  for (const entry of entries)
    for (const parent of entry.parents) {
      const list = children.get(parent) ?? []
      list.push(entry)
      children.set(parent, list)
    }
  let count = 0
  const node = (item: CatalogEntry, level: number, ancestors: Set<string>): CatalogTree => {
    if (ancestors.has(item.externalId)) throw new CliError("invalid_response", "local folder ancestry contains a cycle")
    if (++count > 10000)
      throw new CliError("validation_error", "tree output exceeds 10000 nodes; choose a smaller folder")
    const found = children.get(item.externalId) ?? []
    const next = new Set([...ancestors, item.externalId])
    return {
      item: {
        id: catalogId(item),
        ref: item.ref,
        name: item.name,
        kind: item.kind,
        url: item.url,
        content: item.content,
      },
      children: level >= depth ? [] : found.map((child) => node(child, level + 1, next)),
      truncated: level >= depth && found.length > 0,
    }
  }
  return roots.map((id) => {
    const entry = byId.get(id)
    if (entry?.kind !== "folder")
      throw new CliError("not_found", "folder is not in the active local catalog; run catalog import or sync")
    return node(entry, 0, new Set())
  })
}
export const catalogId = (entry: CatalogEntry): string => entry.externalId.replace(/\.md$/, "")
export const catalogOutput = (entry: CatalogEntry) => ({
  id: catalogId(entry),
  ref: entry.ref,
  kind: entry.kind,
  name: entry.name,
  parents: entry.parents.map((id) => id.replace(/\.md$/, "")),
  url: entry.url,
  mime: entry.mime,
  size: entry.size,
  created_at: entry.createdAt,
  modified_at: entry.modifiedAt,
  observed_at: entry.observedAt,
  description: entry.description,
  actors: entry.actors,
  provider_metadata: entry.metadata,
  active: entry.active,
  content: entry.content,
})
