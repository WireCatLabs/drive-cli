import { annotate } from "@wirecat/cli-base/commands"
import { writes } from "@wirecat/cli-base/standards"
import { REMOTE_WRITE } from "@wirecat/cli-core/cli"
import type { Command } from "commander"
import { allOf } from "../output.js"
import { examples } from "../registry.js"
import type { CommandContext, ProgramOptions } from "./context.js"

export const installMcpCommand = (
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
