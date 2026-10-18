import { CliError } from "@wirecat/cli-base"
import { annotate, describeOptions } from "@wirecat/cli-base/commands"
import { formatSuggestions, suggest } from "@wirecat/cli-base/completion"
import { NO_EFFECTS } from "@wirecat/cli-core/cli"
import type { Command } from "commander"
import { commandsDocument, describeDriveProgram, examples } from "../registry.js"
import type { CommandContext } from "./context.js"

export const installCompleteCommand = (program: Command, { streams }: CommandContext) => {
  examples(
    annotate(program.command("complete"), { effects: NO_EFFECTS }).description(
      "print a shell completion script, or complete words",
    ),
    ["drive complete zsh"],
  )
    .argument("[words...]", "a shell name, or after -- the words typed so far")
    .allowUnknownOption()
    .helpOption(false)
    .action(async function (this: Command, words: string[]) {
      if (!(program as Command & { rawArgs: string[] }).rawArgs.includes("--")) {
        // The help option stays off: during a Tab, `--help` is a word being completed, not a request.
        if (words[0] === "--help" || words[0] === "-h") return streams.data(this.helpInformation())
        if (!["bash", "zsh", "fish", "powershell"].includes(words[0] ?? ""))
          throw new CliError("validation_error", "choose a supported shell")
        const { script } = await import("@bomb.sh/tab")
        script(words[0] as "zsh", "drive", "drive")
      } else
        streams.data(
          formatSuggestions(
            suggest({ commands: describeDriveProgram(program), globalOptions: describeOptions(program), words }),
          ),
        )
    })
}

export const installCommandsCommand = (program: Command, { print }: CommandContext) => {
  examples(
    annotate(program.command("commands"), { effects: NO_EFFECTS }).description(
      "print the command tree and its options as data",
    ),
    ["drive commands --json", "drive commands files copy --json"],
  )
    .argument("[path...]", "only this command or group, as words")
    .action((path: string[]) => print((renderer) => renderer.result(commandsDocument(program, path))))
}
