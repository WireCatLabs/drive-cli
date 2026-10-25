import {
  CliError,
  Credentials,
  isCliError,
  type KeyringStore,
  pathsAreOverridden,
  systemKeyring,
} from "@wirecat/cli-base"
import {
  credentialStorage,
  driveSessionCodec,
  type OAuthClient,
  type OAuthProvider,
  type TokenKeeper,
  tokenKeeper,
} from "@wirecat/cli-core/oauth"
import { OAuth2Client } from "google-auth-library"
import * as v from "valibot"
import { activeProfile, paths } from "./config.js"
import { googleError } from "./errors.js"
import { providerEvent } from "./run-recording.js"

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
const credentialOptions = (env: NodeJS.ProcessEnv, storage: "keyring" | "file", keyring?: KeyringStore) => ({
  configDir: paths(env).config,
  service: "drive-cli",
  storage,
  env,
  isolated: pathsAreOverridden({ appName: "drive-cli", prefix: "DRIVE", env }),
  ...(keyring ? { keyring } : {}),
})
export const credentials = (env: NodeJS.ProcessEnv, storage: "keyring" | "file", keyring?: KeyringStore): Credentials =>
  new Credentials(credentialOptions(env, storage, keyring))
export const notSaved = () =>
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
export const googleProvider = (client: OAuthClient): OAuthProvider => ({
  id: "google",
  name: "Google",
  authorizeUrl: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenUrl: "https://oauth2.googleapis.com/token",
  revokeUrl: "https://oauth2.googleapis.com/revoke",
  client,
  redirect: { kind: "loopback" },
  // Without offline access Google returns no refresh token; without consent it does not return one again.
  authorizeParams: { access_type: "offline", prompt: "select_account consent" },
})
/** One profile's saved sign-in, refreshed and saved under a lock every drive process shares. */
export const sessionKeeper = (options: {
  env: NodeJS.ProcessEnv
  name: string
  storage: "keyring" | "file"
  client: OAuthClient
  keyring?: KeyringStore
  signal?: AbortSignal
  fetch?: typeof fetch
}): TokenKeeper =>
  tokenKeeper({
    provider: googleProvider(options.client),
    storage: credentialStorage({
      credentials: { ...credentialOptions(options.env, options.storage), keyring: options.keyring ?? systemKeyring },
      account: options.name,
      codec: driveSessionCodec,
    }),
    lockDir: paths(options.env).config,
    fetch: options.fetch ?? globalThis.fetch,
    signInCommand: `drive ${options.name} session start`,
    // Above the client's own 5-minute early refresh, so a token it asks to replace is replaced.
    freshForMs: 6 * 60_000,
    ...(options.signal ? { signal: options.signal } : {}),
  })
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
  const keeper = sessionKeeper({
    env,
    name,
    storage: profile.storage,
    client: { clientId: session.clientId, ...(session.clientSecret ? { clientSecret: session.clientSecret } : {}) },
    ...(keyring ? { keyring } : {}),
    ...(signal ? { signal } : {}),
  })
  const client = new OAuth2Client({
    clientId: session.clientId,
    clientSecret: session.clientSecret,
    transporterOptions: { timeout: 30000, ...(signal ? { signal } : {}) },
  })
  // Without the refresh token the client cannot refresh on its own: every refresh goes through the keeper's
  // lock, so two drive processes never spend the same refresh token.
  client.refreshHandler = async () => {
    try {
      const tokens = await keeper.tokens()
      if (!tokens.accessToken || tokens.expiresAt === undefined) throw new Error("no access token")
      return { access_token: tokens.accessToken, expiry_date: tokens.expiresAt }
    } catch (error) {
      if (isCliError(error) && error.code !== "authentication_error") throw error
      throw new CliError("authentication_error", `Google sign-in expired — run drive ${name} session start again`, {
        reason: "sign-in.expired",
      })
    }
  }
  const { refresh_token: _refresh, ...current } = session.tokens
  client.setCredentials(current)
  return observeRequests(client)
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

const WORD = /^[a-z][a-z_]{0,23}$/
// Google's custom methods (`:batchUpdate`, `:export`) are fixed names from the API, never the caller's words.
const VERB = /^[a-z][A-Za-z]{0,31}$/
const segment = (part: string): string => {
  if (/^v\d+$/.test(part) || WORD.test(part)) return part
  const verb = part.split(":")[1]
  return verb !== undefined && VERB.test(verb) ? `:id:${verb}` : ":id"
}

/** `GET /drive/v3/files/:id`: host, query, ids and names dropped, so a run log never holds what was asked for. */
export const operationOf = (method: string | undefined, url: string | URL | undefined): string => {
  let path = ""
  try {
    path = new URL(String(url ?? "")).pathname
  } catch {}
  const template = path
    .split("/")
    .filter(Boolean)
    .map((part) => segment(decodeURIComponent(part)))
    .join("/")
  return `${(method ?? "GET").toUpperCase()} /${template}`
}

/** Every Google call a signed-in client makes goes through its transporter, the SDK's and our own alike. */
export const observeRequests = (client: OAuth2Client): OAuth2Client => {
  const transporter = client.transporter
  const request = transporter.request.bind(transporter)
  transporter.request = (async (options: { method?: string; url?: string | URL }) => {
    const operation = operationOf(options.method, options.url)
    const started = performance.now()
    const durationMs = () => Math.round(performance.now() - started)
    providerEvent({ event: "request", operation })
    try {
      const response = await request(options as Parameters<typeof request>[0])
      const failed = response.status >= 400
      providerEvent({
        event: "response",
        operation,
        status: response.status,
        durationMs: durationMs(),
        outcome: failed ? "error" : "ok",
        ...(failed ? { errorCode: "provider_error" } : {}),
      })
      return response
    } catch (error) {
      const { status, response } = (error ?? {}) as { status?: number; response?: { status?: number } }
      const code = status ?? response?.status
      providerEvent({
        event: "response",
        operation,
        ...(typeof code === "number" ? { status: code } : {}),
        durationMs: durationMs(),
        outcome: "error",
        errorCode: googleError(error).code,
      })
      throw error
    }
  }) as typeof transporter.request
  return client
}
