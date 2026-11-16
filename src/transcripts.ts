import { CliError } from "@wirecat/cli-base"
import type { SourceQuery } from "@wirecat/cli-core/documents"
import { quote } from "./list-queries.js"
import { DOC, type FileMetadata } from "./model.js"

export const TRANSCRIPT_MODES = ["include", "skip", "exclude"] as const
export type TranscriptMode = (typeof TRANSCRIPT_MODES)[number]

const folded = (text: string) => text.normalize("NFC").toLowerCase()

export const isTranscript =
  (words: readonly string[]) =>
  (file: FileMetadata): boolean =>
    file.mime === DOC && !file.trashed && words.some((word) => folded(file.name).includes(folded(word)))

/**
 * Drive's `name contains` matches the start of a word, not any part of the name, so the query asks for one word of
 * each phrase and `isTranscript` checks the whole phrase. The longest word, as a short common one ("notes") would
 * bring in far more than the phrase does.
 */
export const transcriptsDriveQuery = (words: readonly string[]): string => {
  const longest = (phrase: string) =>
    phrase
      .trim()
      .split(/\s+/)
      .reduce((a, b) => (b.length > a.length ? b : a), "")
  const asked = [...new Set(words.map(longest).filter(Boolean))]
  return `mimeType = '${DOC}' and trashed = false and (${asked.map((word) => `name contains ${quote(word)}`).join(" or ")})`
}

export const findTranscripts = async (
  search: ((q: string) => Promise<FileMetadata[]>) | undefined,
  words: readonly string[],
): Promise<FileMetadata[]> => {
  if (!search) throw new CliError("configuration_error", "finding transcripts needs a signed-in Google account")
  const matches = isTranscript(words)
  return (await search(transcriptsDriveQuery(words))).filter(matches)
}

/** The sync scope `transcripts` asks for; none when it is unset or `skip`, so nothing is imported without a yes. */
export const transcriptQuery = (
  mode: TranscriptMode | undefined,
  words: readonly string[],
  search?: (q: string) => Promise<FileMetadata[]>,
): SourceQuery<FileMetadata> | undefined => {
  if (mode === undefined || mode === "skip") return undefined
  // The key changes the sync scope, and a new scope reads every chosen folder again: only a real change should.
  const key = JSON.stringify([...new Set(words.map(folded))].sort())
  const query = { key, mode, matches: isTranscript(words) }
  return mode === "include" ? { ...query, list: () => findTranscripts(search, words) } : query
}
