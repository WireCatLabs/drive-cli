import { resolve } from "node:path"
import { writeArtifacts } from "@wirecat/cli-base/codegen"
import { COMMANDS_PAGE_LABELS, commandsPage, describeOptions } from "@wirecat/cli-base/commands"
import { commandHelpMarkdown } from "@wirecat/cli-core/cli"
import { createProgram } from "../dist/program.js"
import { describeDriveProgram } from "../dist/registry.js"

const root = resolve(import.meta.dirname, "..")
const program = createProgram({ env: {} })
const content = commandsPage({
  cli: "drive",
  commands: describeDriveProgram(program),
  options: describeOptions(program),
  labels: COMMANDS_PAGE_LABELS.en,
  details: (command) => commandHelpMarkdown(program, command.path),
  text: {
    banner: "<!-- Generated from the command tree by pnpm generate. Do not edit. -->",
    title: "Drive commands",
    intro:
      "Look up every supported command and option here. Account operations require an explicit profile: `drive personal documents show DOC_ID` or `drive --profile personal documents show DOC_ID`. Help, scenarios, the agent skill, model downloads, discovery, API method listings, schemas and shell completion do not select an account. See [recipes](recipes.md) for complete workflows and [import and storage](usage.md) for file-type and disk-use limits.",
    globalHeading: "Global options",
    globalIntro: "These options apply to the selected profile and current invocation.",
    mutates: "This command can change Google data or send data to the configured model.",
    mutatesLocal: "This command changes local state.",
    exitHeading: "Exit codes",
    exitIntro: "Failures use the shared WireCat error contract.",
    outro: "",
  },
})
const stale = writeArtifacts([{ path: "docs/commands.md", content: content.replace(/\n{3,}/g, "\n\n") }], {
  root,
  check: process.argv.includes("--check"),
})
if (process.argv.includes("--check") && stale.length) {
  process.stderr.write("Command reference is stale; run pnpm generate\n")
  process.exitCode = 1
}
