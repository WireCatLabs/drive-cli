import { annotate } from "@wirecat/cli-base/commands"
import { itemOf, LOCAL_READ } from "@wirecat/cli-core/cli"
import type { Command } from "commander"
import { activeProfile, pictureSearch } from "../config.js"
import { examples } from "../registry.js"
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
    .action(async (query: string, { page, ...args }: { limit: number; page: number; exact?: boolean }) =>
      output(
        itemOf(
          await withIndex((index) =>
            index.search(activeProfile(env, selected()).principal, query, {
              ...args,
              offset: (page - 1) * args.limit,
              exact: args.exact ?? false,
              ...(pictureSearch(env, selected()) ? { pictures: true } : {}),
            }),
          ),
        ),
      ),
    )
}
