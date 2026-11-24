import { CliError } from "@wirecat/cli-base"
import { readableFile } from "@wirecat/cli-core/documents"
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
const PLAIN = /\.(md|markdown|txt)$/i

/** Read as it is, without a document reader. */
export const plainText = (file: FileMetadata) =>
  file.mime === "text/plain" || file.mime === "text/markdown" || PLAIN.test(file.name)

export const supported = (file: FileMetadata): boolean => {
  if (file.mime === DOC || file.mime === SHEET) return true
  if (file.mime.startsWith("application/vnd.google-apps.")) return false
  return readableFile(file)
}
