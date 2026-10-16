import { CliError } from "@wirecat/cli-base"
import { annotate } from "@wirecat/cli-base/commands"
import { FETCH, itemOf, LOCAL_READ } from "@wirecat/cli-core/cli"
import type { Command } from "commander"
import { activeProfile } from "../config.js"
import { MAX_ENTRIES } from "../google.js"
import { skipJson } from "../model.js"
import { examples } from "../registry.js"
import { readState } from "../state.js"
import { sync } from "../sync.js"
import { type CommandContext, positive } from "./context.js"

export const installSyncCommands = (program: Command, context: CommandContext) => {
  const { env, streams, selected, output, source, withIndex } = context
  examples(
    annotate(program.command("sync"), { effects: FETCH })
      .summary("import what changed in the chosen folders, and finish an unfinished sync")
      .description(
        "import what changed in the chosen folders, and finish an unfinished sync; " +
          `one sync reads at most ${MAX_ENTRIES} entries under the chosen folders, and as many changes`,
      ),
    ["drive personal sync", "drive personal sync --rescan --limit 500"],
  )
    .option("--limit <n>", "how many documents to read from Google in this run", positive, 200)
    .option("--rescan", "read every chosen folder again instead of only what changed")
    .option("--embed", "also index pending text for meaning search, with a model already downloaded")
    .action(async (args: { limit: number; embed?: boolean; rescan?: boolean }) => {
      const remote = activeProfile(env, selected()).roots.length ? await source() : undefined
      const result = await withIndex(async (index) => ({
        ...(await sync(remote, index, env, selected(), args.limit, context.signal(), args.rescan)),
        ...(args.embed ? { embeddings: await index.embed(600) } : {}),
      }))
      output(itemOf(result))
      if (result.errors.length || result.pending)
        streams.diagnostic(`${result.pending} source operations remain; run drive ${selected()} sync again\n`)
      if (result.errors.length)
        throw new CliError("provider_error", "sync completed partially; failed operations remain pending", {
          reason: "sync.partial",
        })
    })
  examples(
    annotate(program.command("status"), { effects: LOCAL_READ }).description(
      "show the last sync, imported documents and pending work",
    ),
    ["drive personal status"],
  ).action(() => {
    const name = selected()
    const profile = activeProfile(env, name)
    const state = readState(env, name, profile.principal)
    output(
      itemOf({
        profile: name,
        selected_folders: profile.roots,
        documents: Object.keys(state.documents).length,
        pending: state.pending?.jobs.length ?? 0,
        skipped: state.skipped.map(skipJson),
        last_sync: state.lastSync ?? null,
        coverage:
          "Google Docs/Sheets, PDF/DOCX/XLSX and Markdown/TXT/CSV/TSV; native export layout, tab fidelity and assets are not verified",
        remote_checked: false,
      }),
    )
  })
}
