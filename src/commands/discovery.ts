import { annotate, type CommandInfo, customizeSharedCommand } from "@wirecat/cli-base/commands"
import {
  addContractInfo,
  commandsText,
  DISCOVERY_DESCRIPTIONS,
  environmentOf,
  NO_EFFECTS,
  sharedCommandTemplate,
} from "@wirecat/cli-core/cli"
import type { Command } from "commander"
import { reviewedOverrides, SHELL_OVERRIDES } from "../contract-overrides.js"
import { DRIVE_APP } from "../policy.js"
import { commandsDocument, examples } from "../registry.js"
import type { CommandContext } from "./context.js"

const installCommandsCommandDefinition = (program: Command, { print, streams }: CommandContext) => {
  examples(
    annotate(program.command("commands"), { effects: NO_EFFECTS }).description(DISCOVERY_DESCRIPTIONS.commands),
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

export const installCommandsCommand = (...args: Parameters<typeof installCommandsCommandDefinition>) => {
  const [program, context] = args
  const reference = sharedCommandTemplate(DRIVE_APP, "commands")
  customizeSharedCommand(
    reference,
    "Drive binds discovery to its profile-aware usage renderer while retaining the shared command document and evidence endpoint.",
    () => {
      installCommandsCommandDefinition(...args)
      addContractInfo(program, (value) => context.streams.data(JSON.stringify(value)))
      const command = program.commands.find((command) => command.name() === "commands")
      if (!command) throw new Error("discovery builder did not install its command")
      return command
    },
    reviewedOverrides(reference, SHELL_OVERRIDES.commands),
  )
}
