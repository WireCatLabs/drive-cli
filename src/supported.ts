import { CliError } from "@wirecat/cli-base"
import { DOC, type FileMetadata, SHEET } from "./model.js"

/** One folder's listing, a transcript search or a change list is read whole into memory in one sync. */
export const MAX_ENTRIES = 10_000

export const tooManyEntries = (what: string, fix: string) =>
  new CliError(
    "provider_error",
    `the ${what} has more than ${MAX_ENTRIES} entries, the most drive reads at once; ${fix}`,
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
