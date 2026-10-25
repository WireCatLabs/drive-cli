import { CliError, isCliError, type KeyringStore } from "@wirecat/cli-base"
import { OAuth2Client } from "google-auth-library"
import { type OAuthApplication, profileName, readConfig, writeConfig } from "./config.js"
import { googleSource } from "./google.js"
import { ACTIVITY_SCOPE, APPS_SCOPE, notSaved, READ_SCOPE, sessionKeeper, WRITE_SCOPE } from "./tokens.js"

export interface LoginOptions {
  env: NodeJS.ProcessEnv
  profile: string
  application: OAuthApplication
  storage: "keyring" | "file"
  keyring?: KeyringStore
  openBrowser: (url: string) => Promise<void>
  showUrl: (url: string) => void
  timeoutMs?: number
  signal?: AbortSignal
  /** Google's token endpoint; tests answer it without the network. */
  fetch?: typeof fetch
  identity?: (client: OAuth2Client) => Promise<string>
  write?: boolean
  activity?: boolean
  apps?: boolean
}
// The shared keeper names its failures oauth.*; drive's own reasons are the ones its docs and scripts know.
const signInError = (error: unknown): unknown => {
  if (!isCliError(error)) return error
  const reason = error.details.reason
  if (reason === "oauth.declined")
    return new CliError("authentication_error", "Google sign-in was declined", { reason: "sign-in.declined" })
  if (reason === "oauth.not-saved") return notSaved()
  if (typeof reason === "string" && reason.startsWith("oauth.") && reason !== "oauth.timeout")
    return new CliError("authentication_error", "Google token exchange failed; credential details were not logged", {
      reason: "sign-in.failed",
    })
  return error
}
export const login = async (options: LoginOptions): Promise<{ profile: string; signed_in: true; storage: string }> => {
  const name = profileName(options.profile)
  const keeper = sessionKeeper({
    env: options.env,
    name,
    storage: options.storage,
    client: options.application,
    ...(options.keyring ? { keyring: options.keyring } : {}),
    ...(options.signal ? { signal: options.signal } : {}),
    ...(options.fetch ? { fetch: options.fetch } : {}),
  })
  let principal = ""
  try {
    await keeper.signIn({
      scopes: [
        options.write ? WRITE_SCOPE : READ_SCOPE,
        ...(options.activity ? [ACTIVITY_SCOPE] : []),
        ...(options.apps ? [APPS_SCOPE] : []),
      ],
      openBrowser: options.openBrowser,
      showUrl: options.showUrl,
      ...(options.timeoutMs ? { timeoutMs: options.timeoutMs } : {}),
      // Runs before anything is saved, so a refused account leaves the profile's sign-in as it was.
      accept: async (tokens) => {
        const client = new OAuth2Client({
          clientId: options.application.clientId,
          clientSecret: options.application.clientSecret,
          transporterOptions: { timeout: 30000, ...(options.signal ? { signal: options.signal } : {}) },
        })
        client.setCredentials({ access_token: tokens.accessToken ?? null })
        principal = await (options.identity?.(client) ?? googleSource(client).identity())
        const config = readConfig(options.env)
        const previous = config.profiles[name]
        if (previous && previous.principal !== principal)
          throw new CliError("authentication_error", "this profile belongs to another account; use a new profile", {
            reason: "profile.wrong-account",
          })
        if (
          Object.entries(config.profiles).some(([other, profile]) => other !== name && profile.principal === principal)
        )
          throw new CliError(
            "validation_error",
            "this Google account already has a profile; reuse it to preserve source identity",
          )
        // A client without a secret must not inherit the secret of the app this profile signed in with before.
        return { principal, clientSecret: undefined }
      },
    })
  } catch (error) {
    throw signInError(error)
  }
  const config = readConfig(options.env)
  config.profiles[name] = { principal, roots: config.profiles[name]?.roots ?? [], storage: options.storage }
  writeConfig(options.env, config)
  return { profile: name, signed_in: true, storage: options.storage }
}
