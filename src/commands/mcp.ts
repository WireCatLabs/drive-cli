import { CliError } from "@wirecat/cli-base"
import { annotate, customizeSharedCommand } from "@wirecat/cli-base/commands"
import { writes } from "@wirecat/cli-base/standards"
import {
  itemOf,
  LOCAL_READ,
  LOCAL_WRITE,
  mcpServerCommand,
  REMOTE_WRITE,
  readOnlyRefusal,
  sharedCommandTemplate,
} from "@wirecat/cli-core/cli"
import type { Command } from "commander"
import { readConfig } from "../config.js"
import { SHELL_OVERRIDES } from "../contract-overrides.js"
import { allOf } from "../output.js"
import { DRIVE_APP, permissionNames, refuseUnderReadOnly } from "../policy.js"
import { examples } from "../registry.js"
import { httpTokenFile, type ProfileSet, profileSetLabel, profileSetTokenFile } from "../state.js"
import type { CommandContext, ProgramOptions } from "./context.js"

const DEFAULT_PORT = 8765

const installMcpCommandDefinition = (
  program: Command,
  { env, streams, options, selected, output, policyFlags, signal, profileWord }: CommandContext,
  createProgram: (options: ProgramOptions) => Command,
) => {
  const profiles = () =>
    Object.keys(readConfig(env, permissionNames(policyFlags().permissionKeys ?? new Set())).profiles).sort()
  // The handbook rule WC-MCP-9: the profiles a server serves are always named, as cli-core's `servedProfiles` does.
  const served = (given: string | undefined, words: string): { profile: string } | { set: ProfileSet } => {
    const word = profileWord()
    const listed = () => `profiles here: ${profiles().join(", ") || "none"}`
    if (given === undefined && (word ?? env.DRIVE_PROFILE ?? env.DRIVE_PROFILE_LOCK)) return { profile: selected() }
    if (given !== undefined && word !== undefined)
      throw new CliError(
        "validation_error",
        `name one profile or --profiles, not both: \`drive ${word} ${words}\` or \`drive ${words} --profiles ${given}\``,
        { profiles: profiles() },
      )
    if (given === undefined) {
      if (profiles().length === 0)
        throw new CliError(
          "configuration_error",
          "no drive profile here yet; create one with drive personal session start (any name in place of personal)",
        )
      throw new CliError(
        "validation_error",
        `name the profiles to serve: \`drive <profile> ${words}\`, or \`drive ${words} --profiles <a,b>\` or ` +
          `\`--profiles all\` — ${listed()}`,
        { profiles: profiles() },
      )
    }
    const names = [...new Set(given.split(",").map((one) => one.trim()))].filter(Boolean).sort()
    const lock = env.DRIVE_PROFILE_LOCK?.trim()
    if (lock && names.some((one) => one !== lock))
      throw new CliError(
        "permission_error",
        `this process is locked to profile ${lock} (DRIVE_PROFILE_LOCK) — --profiles may name only ${lock}`,
        { reason: "profile.lock-refused" },
      )
    if (lock) return { set: { option: lock, profiles: () => [lock] } }
    if (names.length === 1 && names[0] === "all") return { set: { option: "all", profiles } }
    if (names.length === 0 || names.includes("all"))
      throw new CliError(
        "validation_error",
        "--profiles takes profile names, comma-separated, or `all` alone for every profile — a profile named all " +
          `is served as \`drive all ${words}\`; ${listed()}`,
        { profiles: profiles() },
      )
    const unknown = names.filter((one) => !profiles().includes(one))
    if (unknown.length > 0)
      throw new CliError(
        "validation_error",
        `no profile named ${unknown.map((one) => `"${one}"`).join(", ")} — ${listed()}`,
        { profiles: profiles() },
      )
    return { set: { option: names.join(","), profiles: () => names } }
  }
  const withProfiles = (command: Command) =>
    command.option(
      "--profiles <names|all>",
      "serve several profiles from one server instead of one: names, comma-separated, or all for every profile",
    )
  const group = annotate(program.command("mcp"), { effects: LOCAL_READ, mcp: false })
    .summary("serve this profile's commands to an AI agent, and set that up")
    .description(
      "serve this profile to an agent over MCP and set it up — `claude mcp add drive -- drive <profile> mcp serve`",
    )
  const serve = examples(
    annotate(group.command("serve"), { effects: REMOTE_WRITE, lifetime: "persistent", mcp: false })
      .summary("serve this profile's commands to an AI agent")
      .description(
        "serve this profile to an agent over MCP, on stdin and stdout — `claude mcp add drive -- drive <profile> mcp serve`; `drive mcp serve --profiles a,b` or `--profiles all` serves those profiles from one server and each tool asks which",
      ),
    [
      "drive personal mcp serve --tools",
      "drive personal mcp serve",
      "drive personal mcp serve --http --public-url https://laptop.example.ts.net",
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
  withProfiles(serve).action(
    async (args: { tools?: boolean; http?: boolean; port?: string; publicUrl?: string; profiles?: string }) => {
      const { mcpTools, serveMcp, serveMcpOverHttp, serveProfiles } = await import("../mcp.js")
      const { portOf, publicUrlOf } = await import("@wirecat/cli-core/mcp")
      const tunnel = () =>
        publicUrlOf(args.publicUrl, { missing: "--http", reaches: "the browser apps reach drive", path: true })
      const one = served(args.profiles, "mcp serve")
      if ("set" in one) {
        if (args.tools)
          throw new CliError(
            "validation_error",
            "--tools lists one profile's commands: `drive <profile> mcp serve --tools`",
          )
        const active = signal()
        await serveProfiles({
          env,
          set: one.set,
          permissions: policyFlags().permission ?? [],
          note: (text) => streams.diagnostic(text),
          ...(active ? { signal: active } : {}),
          ...(args.http ? { http: { publicUrl: tunnel(), port: portOf(args.port, DEFAULT_PORT) } } : {}),
        })
      } else if (args.http) {
        const active = signal()
        await serveMcpOverHttp(
          createProgram,
          { ...options, env, ...(active ? { signal: active } : {}) },
          one.profile,
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
            mcpTools(createProgram, { ...options, env }, one.profile, policyFlags()).map(
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
          one.profile,
          policyFlags(),
        )
      }
    },
  )
  withProfiles(
    examples(
      annotate(group.command("revoke"), { effects: LOCAL_WRITE, mcp: false })
        .summary("forget every login given to a browser app")
        .description(
          "forget every login `mcp serve --http` gave a browser app, of this profile or of the server `--profiles` names; each app must log in again",
        ),
      ["drive personal mcp revoke"],
    ),
  ).action(async (args: { profiles?: string }) => {
    refuseUnderReadOnly(env, "forget the browser logins")
    if (policyFlags().readOnly) throw readOnlyRefusal("--read-only", "forget the browser logins")
    const { revokeAll } = await import("@wirecat/cli-core/mcp")
    const one = served(args.profiles, "mcp revoke")
    if ("set" in one) {
      revokeAll(profileSetTokenFile(env, one.set.option))
      output(itemOf({ revoked: true, profile: null, profiles: one.set.option }))
    } else {
      revokeAll(httpTokenFile(env, one.profile))
      output(itemOf({ revoked: true, profile: one.profile }))
    }
  })
  const server = mcpServerCommand({
    example: "drive personal",
    profiles: true,
    target: (self) => {
      const one = served(self.opts<{ profiles?: string }>().profiles, `mcp server ${self.name()}`)
      if ("set" in one)
        return {
          invocation: "drive",
          // drive 0.45 marked every set's server "default"; a new key would leave those servers unstoppable.
          profiles: { option: one.set.option, key: "default", label: profileSetLabel(one.set) },
          envPrefix: DRIVE_APP.envPrefix,
          env,
          tokenFile: profileSetTokenFile(env, one.set.option),
          argv: ["mcp", "serve", "--http", "--profiles", one.set.option],
          version: DRIVE_APP.version,
        }
      return {
        invocation: `drive ${one.profile}`,
        profile: one.profile,
        envPrefix: DRIVE_APP.envPrefix,
        env,
        tokenFile: httpTokenFile(env, one.profile),
        argv: [one.profile, "mcp", "serve", "--http"],
        version: DRIVE_APP.version,
      }
    },
    answer: (_self, item) => output(itemOf(item)),
  })
  group.addCommand(server)
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
