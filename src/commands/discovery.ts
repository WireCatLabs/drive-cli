import { CliError } from "@wirecat/cli-base"
import { annotate, type CommandInfo, describeOptions } from "@wirecat/cli-base/commands"
import { formatSuggestions, suggest } from "@wirecat/cli-base/completion"
import { commandsText, environmentOf, NO_EFFECTS } from "@wirecat/cli-core/cli"
import type { Command } from "commander"
import { commandsDocument, describeDriveProgram, examples } from "../registry.js"
import type { CommandContext } from "./context.js"

export const installCompleteCommand = (program: Command, { streams }: CommandContext) => {
  examples(
    annotate(program.command("complete"), { mcp: false, effects: NO_EFFECTS }).description(
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

export const installCommandsCommand = (program: Command, { print, streams }: CommandContext) => {
  examples(
    annotate(program.command("commands"), { effects: NO_EFFECTS }).description(
      "every command by section, one line each; --json: the command tree as data",
    ),
    ["drive commands", "drive commands files copy --json"],
  )
    .argument("[path...]", "only this command or group, as words")
    .action((path: string[]) => {
      const document = commandsDocument(program, path)
      const annotateAvailability = (commands: readonly CommandInfo[]): CommandInfo[] =>
        commands.map((command) => {
          const availability = environmentOf(program).discoveryAvailability?.(command)
          return {
            ...command,
            ...(availability ? { availability } : {}),
            commands: annotateAvailability(command.commands),
          }
        })
      document.commands = annotateAvailability(document.commands)
      const { json, jsonl } = program.opts<{ json?: boolean; jsonl?: boolean }>()
      // By format, not by terminal: piped, a reader got hundreds of kilobytes of JSON it never asked for.
      if (!json && !jsonl)
        return streams.data(commandsText(program, document.commands, document.scope).replace(/\n$/, ""))
      print((renderer) => renderer.result(document))
    })
}
