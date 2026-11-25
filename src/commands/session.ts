import { CliError, Credentials } from "@wirecat/cli-base"
import { environmentOf, oauthSessionCommand } from "@wirecat/cli-core/cli"
import { driveSessionCodec, googleProvider, oauthAccount } from "@wirecat/cli-core/oauth"
import { type Command, Option } from "commander"
import { application, configuration, paths, readConfig, writeConfig } from "../config.js"
import { DRIVE_APP } from "../identity.js"
import { ACTIVITY_SCOPE, APPS_SCOPE, PROVIDER, READ_SCOPE, WRITE_SCOPE } from "../scopes.js"
import type { CommandContext, DriveEnvironment } from "./context.js"

const GRANTS = ["write", "activity", "apps"] as const
type Grant = (typeof GRANTS)[number]
const grants = (raw: string): Set<Grant> => {
  const values = raw.split(",").map((value) => value.trim())
  const unknown = values.filter((value) => !(GRANTS as readonly string[]).includes(value))
  if (unknown.length)
    throw new CliError("validation_error", `--grant takes ${GRANTS.join(", ")}; got ${unknown.join(", ")}`)
  return new Set(values as Grant[])
}

interface StartOptions {
  clientFile?: string
  clientId?: string
  grant?: Set<Grant>
}

const START_OPTIONS = [
  new Option("--client-file <file>", "path to your own Desktop OAuth client JSON, used instead of WireCat's"),
  new Option(
    "--client-id <id>",
    "your own Desktop OAuth client ID, used instead of WireCat's; its secret comes from DRIVE_GOOGLE_CLIENT_SECRET",
  ),
  new Option(
    "--grant <scopes>",
    "also ask for these permissions, comma-separated: write (change Drive files and Docs), " +
      "activity (read Drive Activity history), apps (see installed Drive apps)",
  ).argParser(grants),
]

export const sessionCommand = (context: CommandContext): Command =>
  oauthSessionCommand({
    app: DRIVE_APP,
    resolveSettings: configuration.resolveSettings,
    providerId: PROVIDER,
    service: "Google",
    startOptions: START_OPTIONS,
    preset: (command, steps) => {
      const { clientFile, clientId, grant = new Set() } = command.opts<StartOptions>()
      const client = application(context.env, { file: clientFile, clientId, profile: context.selected() })
      if (steps && !client.clientSecret)
        context.streams.diagnostic(
          "your Google app has no secret here, and Google refuses a Desktop app without one: set DRIVE_GOOGLE_CLIENT_SECRET\n",
        )
      // Google revokes on the token host, which cli-core 1.1.0 would list twice in its host check and refuse; no
      // session command revokes, `account remove` does with its own keeper.
      const { revokeUrl: _revoke, ...provider } = googleProvider(client)
      return {
        provider,
        scopes: [
          grant.has("write") ? WRITE_SCOPE : READ_SCOPE,
          ...(grant.has("activity") ? [ACTIVITY_SCOPE] : []),
          ...(grant.has("apps") ? [APPS_SCOPE] : []),
        ],
        rotating: false,
      }
    },
    codec: driveSessionCodec,
    verify: async (command, accessToken) => {
      const fake = environmentOf<DriveEnvironment>(command).source
      const principal = await (fake
        ? fake(context.selected())
        : import("../tokens.js").then((tokens) => tokens.tokenSource(accessToken, context.signal()))
      ).then((source) => source.identity())
      // A client without a secret must not inherit the secret of the app this profile signed in with before.
      return { id: principal, account: { account: principal }, extra: { principal, clientSecret: undefined } }
    },
    claim: (env, profile, principal) => {
      const { profiles } = readConfig(env)
      const previous = profiles[profile]
      if (previous && previous.principal !== principal)
        throw new CliError("authentication_error", "this profile belongs to another account; use a new profile", {
          reason: "profile.wrong-account",
        })
      if (Object.entries(profiles).some(([other, row]) => other !== profile && row.principal === principal))
        throw new CliError(
          "validation_error",
          "this Google account already has a profile; reuse it to preserve source identity",
        )
    },
    legacyAccounts: (_env, profile) => [profile],
    afterSignIn: (_command, { env, profile, id }) => {
      const kept = new Credentials({ service: DRIVE_APP.appName, configDir: paths(env).config, storage: "file", env })
      // cli-base drops the file copy once a sign-in reaches the keyring, so the file holds it only when it was kept there.
      const storage = kept.read(oauthAccount(PROVIDER, profile)) ? "file" : "keyring"
      const config = readConfig(env)
      const previous = config.profiles[profile]
      config.profiles[profile] = { ...previous, principal: id, roots: previous?.roots ?? [], storage }
      writeConfig(env, config)
    },
    profiles: (env) => Object.keys(readConfig(env).profiles).sort(),
  })
