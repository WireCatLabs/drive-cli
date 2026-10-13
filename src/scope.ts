import { CliError } from "@wirecat/cli-base"
import type { FileMetadata } from "./model.js"

export const within = (
  file: FileMetadata,
  roots: string[],
  folders: Record<string, FileMetadata>,
  seen = new Set<string>(),
): boolean => {
  if (file.trashed) return false
  if (roots.includes(file.id)) return true
  if (seen.has(file.id)) throw new CliError("invalid_response", "folder ancestry contains a cycle")
  const next = new Set([...seen, file.id])
  return file.parents.some((id) => {
    const folder = folders[id]
    return folder ? within(folder, roots, folders, next) : roots.includes(id)
  })
}
