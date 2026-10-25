import { annotate, customizeSharedCommand } from "@wirecat/cli-base/commands"
import { writes } from "@wirecat/cli-base/standards"
import { itemOf, REMOTE_WRITE, sharedCommandTemplate } from "@wirecat/cli-core/cli"
import type { Command } from "commander"
import { SHELL_OVERRIDES } from "../contract-overrides.js"
import { allOf } from "../output.js"
import { DRIVE_APP } from "../policy.js"
import { portOf, publicUrlOf } from "../public-url.js"
import { examples } from "../registry.js"
import type { CommandContext, ProgramOptions } from "./context.js"

const DEFAULT_PORT = 8765

const installMcpCommandDefinition = (
  program: Command,
  { env, streams, options, selected, output, policyFlags, signal }: CommandContext,
  createProgram: (options: ProgramOptions) => Command,
) => {
  examples(
    annotate(program.command("mcp"), { effects: REMOTE_WRITE, lifetime: "persistent", mcp: false }).description(
      "serve drive's commands to an agent over MCP: search, then read or write",
    ),
    [
      "drive personal mcp",
      "drive personal mcp --http --public-url https://<name>.ts.net",
      "drive personal mcp --revoke",
    ],
  )
    .option("--tools", "list the commands the server offers instead of starting it")
    .option(
      "--http",
      "serve over HTTP on 127.0.0.1 for ChatGPT and Claude in the browser, behind your tunnel; the profile's permissions decide",
    )
    .option("--port <port>", `the local port for --http (default ${DEFAULT_PORT})`)
    .option("--public-url <url>", "the tunnel's https address the browser apps use, e.g. https://<name>.ts.net")
    .option("--revoke", "forget every login given to a browser app; each must log in again")
    .action(async (args: { tools?: boolean; http?: boolean; port?: string; publicUrl?: string; revoke?: boolean }) => {
      const { httpTokenFile, mcpTools, serveMcp, serveMcpOverHttp } = await import("../mcp.js")
      if (args.revoke) {
        const { revokeAll } = await import("@wirecat/cli-core/mcp")
        revokeAll(httpTokenFile(env, selected()))
        output(itemOf({ revoked: true, profile: selected() }))
      } else if (args.http) {
        const active = signal()
        await serveMcpOverHttp(
          createProgram,
          { ...options, env, ...(active ? { signal: active } : {}) },
          selected(),
          policyFlags(),
          {
            publicUrl: publicUrlOf(args.publicUrl),
            port: portOf(args.port, DEFAULT_PORT),
            note: (text) => streams.diagnostic(text),
          },
        )
      } else if (args.tools)
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

export const installMcpCommand = (...args: Parameters<typeof installMcpCommandDefinition>) =>
  customizeSharedCommand(
    sharedCommandTemplate(DRIVE_APP, "mcp"),
    "Drive exposes Google document tools over stdio and HTTP using OAuth grants and its document permission adapter; its tool listing and command catalogue replace the messenger setup commands.",
    () => {
      installMcpCommandDefinition(...args)
      const command = args[0].commands.find((command) => command.name() === "mcp")
      if (!command) throw new Error("mcp builder did not install its command")
      return command
    },
    SHELL_OVERRIDES.mcp,
  )
