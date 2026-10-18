import { CliError, Credentials, type KeyringStore, pathsAreOverridden } from "@wirecat/cli-base"
import { OAuth2Client } from "google-auth-library"
import * as v from "valibot"
import { activeProfile, paths } from "./config.js"
import { googleError } from "./errors.js"

export const READ_SCOPE = "https://www.googleapis.com/auth/drive.readonly"
export const WRITE_SCOPE = "https://www.googleapis.com/auth/drive"
export const ACTIVITY_SCOPE = "https://www.googleapis.com/auth/drive.activity.readonly"
export const APPS_SCOPE = "https://www.googleapis.com/auth/drive.apps.readonly"
const Session = v.object({
  principal: v.string(),
  clientId: v.string(),
  clientSecret: v.optional(v.string()),
  tokens: v.object({
    access_token: v.optional(v.nullable(v.string())),
    refresh_token: v.pipe(v.string(), v.minLength(1)),
    expiry_date: v.optional(v.nullable(v.number())),
    scope: v.optional(v.string()),
    token_type: v.optional(v.nullable(v.string())),
  }),
})
export type Session = v.InferOutput<typeof Session>
export const credentials = (env: NodeJS.ProcessEnv, storage: "keyring" | "file", keyring?: KeyringStore): Credentials =>
  new Credentials({
    configDir: paths(env).config,
    service: "drive-cli",
    storage,
    env,
    isolated: pathsAreOverridden({ appName: "drive-cli", prefix: "DRIVE", env }),
    ...(keyring ? { keyring } : {}),
  })
const notSaved = () =>
  new CliError(
    "configuration_error",
    "could not save Google sign-in; use an available keyring or explicitly choose --credential-storage file",
    { reason: "sign-in.not-saved" },
  )
/** Before the browser opens: a missing keyring found only after consent makes the owner sign in twice. */
export const checkSessionStorage = (
  env: NodeJS.ProcessEnv,
  name: string,
  storage: "keyring" | "file",
  keyring?: KeyringStore,
): void => {
  if (storage === "file") return
  try {
    credentials(env, storage, keyring).read(name)
  } catch {
    throw notSaved()
  }
}
export const saveSession = (
  env: NodeJS.ProcessEnv,
  name: string,
  session: Session,
  storage: "keyring" | "file",
  keyring?: KeyringStore,
): void => {
  try {
    credentials(env, storage, keyring).write(name, JSON.stringify(session))
  } catch {
    throw notSaved()
  }
}
export const authorizedClient = (
  env: NodeJS.ProcessEnv,
  name: string,
  keyring?: KeyringStore,
  signal?: AbortSignal,
): OAuth2Client => {
  const profile = activeProfile(env, name)
  let parsed: v.SafeParseResult<typeof Session>
  try {
    const secret = credentials(env, profile.storage, keyring).read(name)?.secret
    if (!secret) throw new Error("missing login")
    parsed = v.safeParse(Session, JSON.parse(secret))
  } catch {
    throw new CliError(
      "authentication_error",
      `could not load Google sign-in — run drive ${name} session start again`,
      {
        reason: "sign-in.expired",
      },
    )
  }
  if (!parsed.success || parsed.output.principal !== profile.principal)
    throw new CliError("authentication_error", "saved sign-in is invalid or belongs to another account", {
      reason: "sign-in.expired",
    })
  const session = parsed.output
  const client = new OAuth2Client({
    clientId: session.clientId,
    clientSecret: session.clientSecret,
    transporterOptions: { timeout: 30000, ...(signal ? { signal } : {}) },
  })
  client.setCredentials(session.tokens)
  // Token refresh can rotate the refresh token; keep it with the same profile's application.
  client.on("tokens", (tokens) => {
    session.tokens = {
      ...session.tokens,
      ...tokens,
      refresh_token: tokens.refresh_token ?? session.tokens.refresh_token,
    }
    saveSession(env, name, session, profile.storage, keyring)
  })
  return client
}
export const covers = (granted: readonly string[], required: string): boolean =>
  granted.includes(required) || (required === READ_SCOPE && granted.includes(WRITE_SCOPE))
/**
 * The scopes the saved sign-in was granted, read without a network call. None when there is no readable sign-in;
 * `undefined` when the saved tokens do not say, so nothing is assumed.
 */
export const grantedScopes = (env: NodeJS.ProcessEnv, name: string, keyring?: KeyringStore): string[] | undefined => {
  try {
    const secret = credentials(env, activeProfile(env, name).storage, keyring).read(name)?.secret
    const parsed = secret ? v.safeParse(Session, JSON.parse(secret)) : undefined
    if (!parsed?.success) return []
    return parsed.output.tokens.scope?.split(/\s+/).filter(Boolean)
  } catch {
    return []
  }
}
export const checkAuthorization = async (client: OAuth2Client, required = READ_SCOPE): Promise<void> => {
  try {
    const { token } = await client.getAccessToken()
    if (!token) throw new CliError("authentication_error", "Google returned no access token")
    const info = await client.getTokenInfo(token)
    if (!covers(info.scopes, required))
      throw new CliError(
        "permission_error",
        "sign-in lacks the required permission; run drive <profile> session start --grant write, activity or apps when needed",
        { reason: "sign-in.scope-missing" },
      )
  } catch (error) {
    throw googleError(error)
  }
}
