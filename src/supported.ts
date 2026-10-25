import { CliError } from "@wirecat/cli-base"
import { DOC, type FileMetadata, SHEET } from "./model.js"

/** Every entry of a scan or a change list is held in memory, and in one checkpoint, until the sync ends. */
export const MAX_ENTRIES = 10_000

export const tooManyEntries = () =>
  new CliError(
    "provider_error",
    `the chosen folders hold more than ${MAX_ENTRIES} entries, the most one sync reads; ` +
      "choose fewer or smaller folders with `folders remove` and `folders add`",
    { reason: "listing.too-large" },
  )
export const XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
export const READABLE = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  XLSX,
  "text/csv",
  "text/tab-separated-values",
])
export const supported = (file: FileMetadata): boolean => {
  if (file.mime === DOC || file.mime === SHEET || READABLE.has(file.mime)) return true
  if (file.mime.startsWith("application/vnd.google-apps.")) return false
  return file.mime === "text/plain" || file.mime === "text/markdown" || /\.(md|markdown|txt)$/i.test(file.name)
}
