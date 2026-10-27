import { annotate, customizeSharedCommand } from "@wirecat/cli-base/commands"
import { writes } from "@wirecat/cli-base/standards"
import { itemOf, mcpServerCommand, REMOTE_WRITE, sharedCommandTemplate } from "@wirecat/cli-core/cli"
import type { Command } from "commander"
import { readConfig } from "../config.js"
import { SHELL_OVERRIDES } from "../contract-overrides.js"
import { allOf } from "../output.js"
import { DRIVE_APP, permissionNames } from "../policy.js"
import { examples } from "../registry.js"
import { everyProfileTokenFile, httpTokenFile } from "../state.js"
import type { CommandContext, ProgramOptions } from "./context.js"

const DEFAULT_PORT = 8765

const installMcpCommandDefinition = (
  program: Command,
  { env, streams, options, selected, output, policyFlags, signal, profileWord }: CommandContext,
  createProgram: (options: ProgramOptions) => Command,
) => {
  // No profile named anywhere: `drive mcp` serves every profile, and each tool takes one.
  const every = () => !(profileWord() ?? env.DRIVE_PROFILE ?? env.DRIVE_PROFILE_LOCK)
  const profiles = () =>
    Object.keys(readConfig(env, permissionNames(policyFlags().permissionKeys ?? new Set())).profiles).sort()
  examples(
    annotate(program.command("mcp"), { effects: REMOTE_WRITE, lifetime: "persistent", mcp: false }).description(
      "serve drive's commands to an agent over MCP: search, then read or write",
    ),
    [
      "drive personal mcp --tools",
      "drive personal mcp",
      "drive personal mcp --http --public-url https://laptop.example.ts.net",
      "drive mcp",
    ],
  )
    .option("--tools", "list the commands the server offers instead of starting it")
    .option(
      "--http",
      "serve over HTTP on 127.0.0.1 for ChatGPT and Claude in the browser, behind your tunnel; the profile's permissions decide",
    )
    .option("--port <port>", `the local port for --http (default ${DEFAULT_PORT})`)
    .option(
      "--public-url <url>",
      "the tunnel's https address the browser apps use, e.g. https://<name>.ts.net or https://<name>.ts.net/drive",
    )
    .option("--revoke", "forget every login given to a browser app; each must log in again")
    .addCommand(
      mcpServerCommand({
        example: "drive personal",
        target: () =>
          every()
            ? {
                invocation: "drive",
                envPrefix: DRIVE_APP.envPrefix,
                env,
                tokenFile: everyProfileTokenFile(env),
                argv: ["mcp", "--http"],
                version: DRIVE_APP.version,
              }
            : {
                invocation: `drive ${selected()}`,
                profile: selected(),
                envPrefix: DRIVE_APP.envPrefix,
                env,
                tokenFile: httpTokenFile(env, selected()),
                argv: [selected(), "mcp", "--http"],
                version: DRIVE_APP.version,
              },
        answer: (_self, item) => output(itemOf(item)),
      }),
    )
    .action(async (args: { tools?: boolean; http?: boolean; port?: string; publicUrl?: string; revoke?: boolean }) => {
      const { mcpTools, serveMcp, serveMcpOverHttp, serveEveryProfile } = await import("../mcp.js")
      const { portOf, publicUrlOf } = await import("@wirecat/cli-core/mcp")
      const tunnel = () =>
        publicUrlOf(args.publicUrl, { missing: "--http", reaches: "the browser apps reach drive", path: true })
      if (every() && !args.tools) {
        if (args.revoke) {
          const { revokeAll } = await import("@wirecat/cli-core/mcp")
          revokeAll(everyProfileTokenFile(env))
          output(itemOf({ revoked: true, profile: null }))
          return
        }
        const active = signal()
        await serveEveryProfile({
          env,
          profiles,
          permissions: policyFlags().permission ?? [],
          note: (text) => streams.diagnostic(text),
          ...(active ? { signal: active } : {}),
          ...(args.http ? { http: { publicUrl: tunnel(), port: portOf(args.port, DEFAULT_PORT) } } : {}),
        })
        return
      }
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
            publicUrl: tunnel(),
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
