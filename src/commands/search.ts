import { annotate } from "@wirecat/cli-base/commands"
import { itemOf, LOCAL_READ } from "@wirecat/cli-core/cli"
import type { Command } from "commander"
import { activeProfile, pictureSearch } from "../config.js"
import { examples } from "../registry.js"
import { readState } from "../state.js"
import { type CommandContext, positive } from "./context.js"

export const installSearchCommand = (program: Command, { env, selected, output, withIndex }: CommandContext) => {
  examples(
    annotate(program.command("search"), { effects: LOCAL_READ })
      .argument("<query>", "words to look for")
      .description("search imported documents by words, and by meaning when indexed"),
    ["drive personal search budget", `drive personal search "quarterly plan" --exact --limit 5`],
  )
    .option("--limit <n>", "how many results to return", positive, 20)
    .option("--page <n>", "which page to return", positive, 1)
    .option("--exact", "match the words exactly: no word forms, no meaning")
    .action(async (query: string, { page, ...args }: { limit: number; page: number; exact?: boolean }) => {
      const name = selected()
      const profile = activeProfile(env, name)
      const result = await withIndex((index) =>
        index.search(profile.principal, query, {
          ...args,
          offset: (page - 1) * args.limit,
          exact: args.exact ?? false,
          ...(pictureSearch(env, name) ? { pictures: true } : {}),
        }),
      )
      const hint = notImported(
        name,
        profile.roots.length,
        Object.keys(readState(env, name, profile.principal).documents),
      )
      output(itemOf(hint ? { ...(result as object), not_imported: hint } : result))
    })
}

// An empty answer over an empty import reads to an agent as "no such document".
const notImported = (name: string, folders: number, documents: string[]): string | undefined => {
  if (documents.length > 0) return undefined
  return folders === 0
    ? `profile ${name} has no folders selected, so nothing is imported to search — ` +
        `drive ${name} folders add FOLDER_ID, then drive ${name} sync`
    : `profile ${name} has imported no documents yet — drive ${name} sync`
}
