import { CliError } from "@wirecat/cli-base"
import { annotate } from "@wirecat/cli-base/commands"
import { itemOf, LOCAL_READ, LOCAL_WRITE, REMOTE_WRITE } from "@wirecat/cli-core/cli"
import type { Command } from "commander"
import { activeProfile, application, configuredSessions, readConfig, writeConfig } from "../config.js"
import { bindQuery, SESSIONS_QUERY, sessionRow, termsOf } from "../list-queries.js"
import { permissionNames } from "../policy.js"
import { examples } from "../registry.js"
import type { CommandContext } from "./context.js"

const GRANTS = ["write", "activity", "apps"] as const
type Grant = (typeof GRANTS)[number]
const grants = (raw: string): Set<Grant> => {
  const values = raw.split(",").map((value) => value.trim())
  const unknown = values.filter((value) => !(GRANTS as readonly string[]).includes(value))
  if (unknown.length)
    throw new CliError("validation_error", `--grant takes ${GRANTS.join(", ")}; got ${unknown.join(", ")}`)
  return new Set(values as Grant[])
}

export const installSessionCommands = (program: Command, context: CommandContext) => {
  const { env, streams, options, selected, output, policyFlags } = context
  const session = annotate(program.command("session"), { effects: LOCAL_READ }).description(
    "sign in to Google and manage local profiles",
  )
  examples(
    annotate(session.command("start"), { mcp: false, effects: REMOTE_WRITE }).description(
      "sign in to Google in the browser; read-only unless you pass --grant write",
    ),
    ["drive personal session start", "drive work session start --grant write,activity"],
  )
    .option("--client-file <file>", "path to your own Desktop OAuth client JSON, used instead of WireCat's")
    .option(
      "--credential-storage <storage>",
      "where the sign-in is kept: keyring, or file for a private file",
      "keyring",
    )
    .option("--no-browser", "print the sign-in URL instead of opening a browser")
    .option(
      "--grant <scopes>",
      "also ask for these permissions, comma-separated: write (change Drive files and Docs), " +
        "activity (read Drive Activity history), apps (see installed Drive apps)",
      grants,
    )
    .action(async (args: { clientFile?: string; credentialStorage: string; browser: boolean; grant?: Set<Grant> }) => {
      if (args.credentialStorage !== "keyring" && args.credentialStorage !== "file")
        throw new CliError("validation_error", "credential storage is keyring or file")
      const signal = context.signal()
      const { login } = await import("../login.js")
      output(
        itemOf(
          await login({
            env,
            profile: selected(),
            application: application(env, args.clientFile),
            storage: args.credentialStorage,
            ...Object.fromEntries([...(args.grant ?? [])].map((grant) => [grant, true])),
            ...(options.keyring ? { keyring: options.keyring } : {}),
            ...(signal ? { signal } : {}),
            openBrowser: args.browser ? (options.openBrowser ?? (async () => {})) : async () => {},
            showUrl: (url) => streams.diagnostic(`Open Google sign-in: ${url}\n`),
          }),
        ),
      )
    })
  bindQuery(
    examples(
      annotate(session.command("list"), { effects: LOCAL_READ }).description(
        "list the configured profiles; credentials are never printed",
      ),
      ["drive session list"],
    ),
    SESSIONS_QUERY,
    sessionRow,
  ).action((words: string[]) => {
    const filter = termsOf(words, SESSIONS_QUERY, "session list")
    return output(
      itemOf({
        scope: "all-configured-profiles",
        items: configuredSessions(env, filter, permissionNames(policyFlags().permissionKeys ?? new Set())),
      }),
    )
  })
  examples(
    annotate(session.command("end"), { mcp: false, effects: LOCAL_WRITE }).description(
      "sign this profile out; imported documents stay",
    ),
    ["drive personal session end"],
  ).action(async () => {
    const name = selected()
    const config = readConfig(env)
    const profile = activeProfile(env, name)
    const { credentials } = await import("../tokens.js")
    credentials(env, profile.storage, options.keyring).remove(name)
    // Preserve the principal and roots so reauthorization resumes the same source identities.
    writeConfig(env, config)
    output(itemOf({ profile: name, signed_out: true, cached_data: "retained" }))
  })
}
