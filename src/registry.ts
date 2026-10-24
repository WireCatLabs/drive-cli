import { CliError } from "@wirecat/cli-base"
import {
  annotate,
  type CommandInfo,
  type CommandsDocument,
  describeProgram,
  type OptionInfo,
  commandsDocument as sharedCommandsDocument,
} from "@wirecat/cli-base/commands"
import type { Effects } from "@wirecat/cli-base/standards"
import type { Command } from "commander"
import { VERSION } from "./version.js"

/** These commands do not select an account or load account configuration. */
export const ACCOUNT_FREE_COMMANDS = new Set([
  "commands",
  "complete",
  "doctor",
  "upgrade",
  "api show",
  "api list",
  "help",
  "guide",
  "skill show",
  "skill install",
  "models download",
  "images models download",
])

/** Calls Google and keeps nothing on this machine, unlike cli-core's REMOTE_READ and REMOTE_WRITE. */
export const GOOGLE_READ: Effects = { remote: "read", local: "none" }
export const GOOGLE_WRITE: Effects = { remote: "write", local: "none" }

/** Examples go into `commands --json` for agents and under the options in `--help` for people. */
export const examples = (command: Command, lines: string[]): Command => annotate(command, { examples: lines })

/** The major version of the JSON drive's commands print; raise it when a field is removed or renamed. */
export const CONTRACT = 4

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

/** cli-base's `commands --json` document, with drive's `<profile>` usage and a `commands <path>` scope. */
export const commandsDocument = (program: Command, path: string[] = []): CommandsDocument => {
  const all = describeDriveProgram(program)
  const inherited: { path: string[]; options: OptionInfo[] }[] = []
  let available: CommandInfo[] = all
  let found: CommandInfo | undefined
  for (const word of path) {
    if (found?.options.length) inherited.push({ path: [...found.path], options: [...found.options] })
    found = available.find((command) => command.name === word)
    if (!found) throw new CliError("not_found", "command path was not found")
    available = [...found.commands]
  }
  return {
    ...sharedCommandsDocument(program, { cli: "drive", version: VERSION, contract: CONTRACT }),
    ...(found ? { scope: [...found.path], inherited_options: inherited } : {}),
    commands: found ? [found] : all,
  }
}
