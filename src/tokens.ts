import { CliError, isCliError, isMovedRun, type KeyringStore, systemKeyring } from "@wirecat/cli-base"
import { type FetchLike, hostFetch } from "@wirecat/cli-base/http"
import { providerRequest } from "@wirecat/cli-core/cli"
import {
  credentialStorage,
  driveSessionCodec,
  googleProvider,
  type OAuthClient,
  oauthAccount,
  type StoredTokens,
  type TokenKeeper,
  type TokenStorage,
  tokenKeeper,
} from "@wirecat/cli-core/oauth"
import { OAuth2Client } from "google-auth-library"
import { activeProfile, paths } from "./config.js"
import { googleError } from "./errors.js"
import { DESKTOP, DRIVE_APP } from "./identity.js"
import { PROVIDER, READ_SCOPE, WRITE_SCOPE } from "./scopes.js"

export { ACTIVITY_SCOPE, APPS_SCOPE, PROVIDER, READ_SCOPE, WRITE_SCOPE } from "./scopes.js"

// Made per call: hostFetch takes the global fetch when it is made, and a test that stubs fetch stubs it later.
const viaDeclaredHosts =
  (timeoutMs?: number): FetchLike =>
  (input, init) =>
    hostFetch({ hosts: DESKTOP.hosts, ...(timeoutMs ? { timeoutMs } : {}) })(input, init)
export const googleFetch = viaDeclaredHosts()
// gaxios bounds each request with its own `timeout` and a streamed download with an idle timer; hostFetch's whole-
// exchange deadline must not cut a long download short.
const sdkFetch = viaDeclaredHosts(24 * 60 * 60_000)
/** The Google SDK client's transport: drive's request bound, and only the declared hosts. */
export const transporterOptions = (signal?: AbortSignal) => ({
  timeout: 30000,
  fetchImplementation: sdkFetch,
  ...(signal ? { signal } : {}),
})
/**
 * The entry `session start` keeps, as cli-core's session command addresses it. Versions before 0.78 kept it under the
 * bare profile name; the first read copies it, so nobody signs in again.
 */
export const sessionStorage = (env: NodeJS.ProcessEnv, name: string, keyring?: KeyringStore): TokenStorage =>
  credentialStorage({
    credentials: {
      configDir: paths(env).config,
      service: DRIVE_APP.appName,
      storage: "auto",
      env,
      isolated: isMovedRun({ appName: DRIVE_APP.appName, prefix: DRIVE_APP.envPrefix, env }),
      keyring: keyring ?? systemKeyring,
    },
    account: oauthAccount(PROVIDER, name),
    legacyAccounts: [name],
    codec: driveSessionCodec,
  })
/** One profile's saved sign-in, refreshed and saved under a lock every drive process shares. */
export const sessionKeeper = (options: {
  env: NodeJS.ProcessEnv
  name: string
  client: OAuthClient
  keyring?: KeyringStore
  signal?: AbortSignal
  fetch?: typeof fetch
}): TokenKeeper =>
  tokenKeeper({
    provider: googleProvider(options.client),
    storage: sessionStorage(options.env, options.name, options.keyring),
    lockDir: paths(options.env).config,
    fetch: options.fetch ?? googleFetch,
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
  activeProfile(env, name)
  let saved: StoredTokens | undefined
  try {
    saved = sessionStorage(env, name, keyring).read()
  } catch {
    throw new CliError(
      "authentication_error",
      `could not load Google sign-in — run drive ${name} session start again`,
      {
        reason: "oauth.expired",
      },
    )
  }
  if (!saved?.client)
    throw new CliError(
      "authentication_error",
      `this profile has no saved Google sign-in — run drive ${name} session start`,
      { reason: "session.missing" },
    )
  const { client: app, tokens } = saved
  const keeper = sessionKeeper({
    env,
    name,
    client: app,
    ...(keyring ? { keyring } : {}),
    ...(signal ? { signal } : {}),
  })
  const client = new OAuth2Client({
    clientId: app.clientId,
    clientSecret: app.clientSecret,
    transporterOptions: transporterOptions(signal),
  })
  // Without the refresh token the client cannot refresh on its own: every refresh goes through the keeper's
  // lock, so two drive processes never spend the same refresh token.
  client.refreshHandler = async () => {
    try {
      const fresh = await keeper.tokens()
      if (!fresh.accessToken || fresh.expiresAt === undefined) throw new Error("no access token")
      return { access_token: fresh.accessToken, expiry_date: fresh.expiresAt }
    } catch (error) {
      if (isCliError(error) && error.code !== "authentication_error") throw error
      throw new CliError("authentication_error", `Google sign-in expired — run drive ${name} session start again`, {
        reason: "oauth.expired",
      })
    }
  }
  client.setCredentials({
    access_token: tokens.accessToken ?? null,
    expiry_date: tokens.expiresAt ?? null,
    ...(tokens.scopes.length ? { scope: tokens.scopes.join(" ") } : {}),
    token_type: tokens.tokenType ?? null,
  })
  return observeRequests(client)
}
/** Whose an access token is, asked before a sign-in is kept. */
export const tokenSource = async (accessToken: string, signal?: AbortSignal) => {
  const { googleSource } = await import("./google.js")
  const client = new OAuth2Client({ transporterOptions: transporterOptions(signal) })
  client.setCredentials({ access_token: accessToken })
  return googleSource(client)
}
export const covers = (granted: readonly string[], required: string): boolean =>
  granted.includes(required) || (required === READ_SCOPE && granted.includes(WRITE_SCOPE))
/**
 * The scopes the saved sign-in was granted, read without a network call. None when there is no readable sign-in;
 * `undefined` when the saved tokens do not say, so nothing is assumed.
 */
export const grantedScopes = (env: NodeJS.ProcessEnv, name: string, keyring?: KeyringStore): string[] | undefined => {
  try {
    const saved = sessionStorage(env, name, keyring).read()
    if (!saved) return []
    return saved.tokens.scopes.length ? saved.tokens.scopes : undefined
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
        { reason: "oauth.scope-missing" },
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

/** Google's own key for a refusal, `rateLimitExceeded`, from an answer's parsed body; nothing else is read. */
const reasonOf = (data: unknown): string | undefined => {
  const error = (data as { error?: { errors?: { reason?: unknown }[]; status?: unknown } } | null)?.error
  const reason = error?.errors?.[0]?.reason ?? error?.status
  return typeof reason === "string" ? reason : undefined
}

type GaxiosOptions = NonNullable<Parameters<OAuth2Client["transporter"]["request"]>[0]>
type Adapter = NonNullable<GaxiosOptions["adapter"]>

/**
 * Every Google call a signed-in client makes goes through its transporter, the SDK's and our own alike. Each attempt
 * is its own request line: gaxios retries inside one `request`, so the line is written from its per-attempt adapter.
 */
export const observeRequests = (client: OAuth2Client): OAuth2Client => {
  const transporter = client.transporter
  const request = transporter.request.bind(transporter)
  transporter.request = (async (options: GaxiosOptions) => {
    const method = (options.method ?? "GET").toUpperCase()
    const operation = operationOf(method, options.url)
    const call = { method, endpointTemplate: operation.slice(method.length + 1), transport: "http" as const }
    let ended: number | undefined
    const adapter: Adapter = async (prepared, next) => {
      const attempt = (prepared.retryConfig?.currentRetryAttempt ?? 0) + 1
      const waitMs = ended === undefined ? undefined : Math.round(performance.now() - ended)
      const answered = providerRequest(operation, undefined, {
        ...call,
        attempt,
        ...(waitMs === undefined ? {} : { waitMs }),
      })
      try {
        const response = await (options.adapter ? options.adapter(prepared, next) : next(prepared))
        const failed = !(prepared.validateStatus?.(response.status) ?? response.status < 400)
        const providerError = failed ? reasonOf(response.data) : undefined
        answered({
          status: response.status,
          ...(failed ? { errorCode: "provider_error" } : {}),
          ...(providerError ? { providerError } : {}),
        })
        return response
      } catch (error) {
        answered({ error, errorCode: googleError(error).code })
        throw error
      } finally {
        ended = performance.now()
      }
    }
    try {
      return await request({ ...options, adapter })
    } catch (error) {
      if (ended === undefined)
        providerRequest(operation, undefined, { ...call, attempt: 1 })({ error, errorCode: googleError(error).code })
      throw error
    }
  }) as typeof transporter.request
  return client
}
