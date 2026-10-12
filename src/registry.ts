import { type CommandInfo, describeProgram } from "@wirecat/cli-base/commands"
import type { Command } from "commander"

/** These commands do not select an account or load account configuration. */
export const ACCOUNT_FREE_COMMANDS = new Set(["commands", "complete", "schema", "api methods"])

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
