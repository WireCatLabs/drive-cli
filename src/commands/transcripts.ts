import { annotate } from "@wirecat/cli-base/commands"
import { LOCAL_READ } from "@wirecat/cli-core/cli"
import type { Command } from "commander"
import { transcriptsOf } from "../config.js"
import { bindQuery, TRANSCRIPTS_QUERY, termsOf, transcriptRow } from "../list-queries.js"
import { allOf } from "../output.js"
import { examples, GOOGLE_READ } from "../registry.js"
import { findTranscripts } from "../transcripts.js"
import type { CommandContext } from "./context.js"

const TRANSCRIPTS_HELP = `
Each item, a Google Doc whose name holds one of the transcript words (--json prints them under "items"):
  id            the Google file id
  name          the document's name as Google shows it
  url           where it opens in Google Docs
  owned_by_me   false for a document in the meeting organizer's Drive, shared with this account
  modified_at   when it last changed
Whether sync takes them is the profile's transcripts setting: include imports them wherever they sit, skip (or unset)
leaves them alone, exclude leaves them out even inside a chosen folder (drive <profile> config set transcripts
'"include"'). transcript_words replaces the words that find them.`

export const installTranscriptCommands = (program: Command, context: CommandContext) => {
  const { env, selected, output, source } = context
  const transcripts = annotate(program.command("transcripts"), { effects: LOCAL_READ }).description(
    "meet transcripts and Gemini notes in this account's Drive or shared with it",
  )
  bindQuery(
    examples(
      annotate(transcripts.command("list"), { effects: GOOGLE_READ })
        .summary("list Google Docs named like Meet transcripts or Gemini notes")
        .description(
          "list the Google Docs named like Meet transcripts or Gemini notes, wherever they sit; imports nothing",
        ),
      ["drive personal transcripts list --json", "drive personal transcripts list owned_by_me:false"],
    ),
    TRANSCRIPTS_QUERY,
    transcriptRow,
  )
    .addHelpText("after", TRANSCRIPTS_HELP)
    .action(async (words: string[]) => {
      const filter = termsOf(words, TRANSCRIPTS_QUERY, "transcripts list")
      const remote = await source()
      const found = await findTranscripts(remote.search, transcriptsOf(env, selected()).words)
      const rows = found.map((file) => ({
        id: file.id,
        name: file.name,
        url: file.url,
        owned_by_me: (file.providerMetadata as { ownedByMe?: boolean } | undefined)?.ownedByMe ?? null,
        modified_at: file.modifiedAt ?? null,
      }))
      output(
        allOf(rows.filter((row) => filter.owned_by_me === undefined || String(row.owned_by_me) === filter.owned_by_me)),
      )
    })
}
