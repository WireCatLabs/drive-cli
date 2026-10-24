import { annotate, customizeSharedCommand } from "@wirecat/cli-base/commands"
import { writes } from "@wirecat/cli-base/standards"
import { REMOTE_WRITE, sharedCommandTemplate } from "@wirecat/cli-core/cli"
import type { Command } from "commander"
import { SHELL_OVERRIDES } from "../contract-overrides.js"
import { allOf } from "../output.js"
import { examples } from "../registry.js"
import type { CommandContext, ProgramOptions } from "./context.js"

const installMcpCommandDefinition = (
  program: Command,
  { env, options, selected, output, policyFlags, signal }: CommandContext,
  createProgram: (options: ProgramOptions) => Command,
) => {
  examples(
    annotate(program.command("mcp"), { effects: REMOTE_WRITE, lifetime: "persistent", mcp: false }).description(
      "serve drive's commands to an agent over MCP: search, then read or write",
    ),
    ["drive personal mcp", "drive personal mcp --tools"],
  )
    .option("--tools", "list the commands the server offers instead of starting it")
    .action(async (args: { tools?: boolean }) => {
      const { mcpTools, serveMcp } = await import("../mcp.js")
      if (args.tools)
        output(
          allOf(
            mcpTools(createProgram, { ...options, env }, selected(), policyFlags()).map(
              ({ schema, command, availability }) => ({
                command: command.path.join(" "),
                writes: writes(command.effects),
                input_schema: schema,
                effects: command.effects,
                availability: availability?.() ?? { available: true },
              }),
            ),
          ),
        )
      else {
        const active = signal()
        await serveMcp(
          createProgram,
          { ...options, env, ...(active ? { signal: active } : {}) },
          selected(),
          policyFlags(),
        )
      }
    })
}

const DRIVE_CONTRACT_APP = {
  command: "drive",
  appName: "drive-cli",
  envPrefix: "DRIVE",
  description: "Google Drive",
  version: "",
}

export const installMcpCommand = (...args: Parameters<typeof installMcpCommandDefinition>) =>
  customizeSharedCommand(
    sharedCommandTemplate(DRIVE_CONTRACT_APP, "mcp"),
    "Drive exposes Google document tools over stdio using OAuth grants and its own permission adapter; it has no HTTP transport.",
    () => {
      installMcpCommandDefinition(...args)
      const command = args[0].commands.find((command) => command.name() === "mcp")
      if (!command) throw new Error("mcp builder did not install its command")
      return command
    },
    SHELL_OVERRIDES.mcp,
  )
