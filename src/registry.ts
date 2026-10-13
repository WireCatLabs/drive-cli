import { CliError, EXIT_CODES, GENERIC_FAILURE } from "@wirecat/cli-base"
import {
  annotate,
  type CommandInfo,
  describeOptions,
  describeProgram,
  type OptionInfo,
} from "@wirecat/cli-base/commands"
import type { Command } from "commander"
import { VERSION } from "./version.js"

/** These commands do not select an account or load account configuration. */
export const ACCOUNT_FREE_COMMANDS = new Set(["commands", "complete", "api show", "api list"])

/** Examples go into `commands --json` for agents and under the options in `--help` for people. */
export const examples = (command: Command, lines: string[]): Command =>
  annotate(command, { examples: lines }).addHelpText(
    "after",
    `Examples:\n${lines.map((line) => `  ${line}`).join("\n")}\n`,
  )

/** The major version of the JSON drive's commands print; raise it when a field is removed or renamed. */
export const CONTRACT = 0

/** Preserve shared registry paths/anchors while making executable usage show the account boundary. */
export const describeDriveProgram = (program: Command): CommandInfo[] => {
  const scoped = (info: CommandInfo): CommandInfo => ({
    ...info,
    usage: ACCOUNT_FREE_COMMANDS.has(info.path.join(" "))
      ? info.usage
      : info.usage.replace(/^drive /, "drive <profile> "),
    commands: info.commands.map(scoped),
  })
  return describeProgram(program).map(scoped)
}

/** cli-base's `commands --json` document, built here until drive runs on a cli-base that exports it. */
export const commandsDocument = (program: Command, path: string[] = []) => {
  const all = describeDriveProgram(program)
  const inheritedOptions: { path: readonly string[]; options: readonly OptionInfo[] }[] = []
  let available: readonly CommandInfo[] = all
  let found: CommandInfo | undefined
  for (const word of path) {
    if (found?.options.length) inheritedOptions.push({ path: found.path, options: found.options })
    found = available.find((command) => command.name === word)
    if (!found) throw new CliError("not_found", "command path was not found")
    available = found.commands
  }
  return {
    cli: "drive",
    version: VERSION,
    contract: CONTRACT,
    description: program.description(),
    globalOptions: describeOptions(program),
    ...(found ? { scope: found.path, inheritedOptions } : {}),
    commands: found ? [found] : all,
    exitCodes: { ok: 0, internal_error: GENERIC_FAILURE, ...EXIT_CODES },
  }
}
