import { randomBytes } from "node:crypto"
import { createServer } from "node:http"
import { CliError, type KeyringStore } from "@wirecat/cli-base"
import { CodeChallengeMethod, type Credentials as GoogleTokens, OAuth2Client } from "google-auth-library"
import { type OAuthApplication, profileName, readConfig, writeConfig } from "./config.js"
import { googleSource } from "./google.js"
import { ACTIVITY_SCOPE, APPS_SCOPE, READ_SCOPE, saveSession, WRITE_SCOPE } from "./tokens.js"

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
  makeClient?: (redirect: string) => OAuth2Client
  identity?: (client: OAuth2Client) => Promise<string>
  write?: boolean
  activity?: boolean
  apps?: boolean
}
export const login = async (options: LoginOptions): Promise<{ profile: string; signedIn: true; storage: string }> => {
  const name = profileName(options.profile)
  const state = randomBytes(32).toString("base64url")
  let accept: (code: string) => void = () => {}
  let reject: (error: Error) => void = () => {}
  let settled = false
  const code = new Promise<string>((resolve, fail) => {
    accept = resolve
    reject = fail
  })
  void code.catch(() => {})
  const server = createServer((request, response) => {
    let url: URL
    try {
      url = new URL(request.url ?? "/", "http://127.0.0.1")
    } catch {
      response.writeHead(400).end()
      return
    }
    if (request.method !== "GET" || url.pathname !== "/callback") {
      response.writeHead(404).end()
      return
    }
    if (url.searchParams.get("state") !== state || settled) {
      response.writeHead(400).end("Invalid sign-in callback")
      return
    }
    const value = url.searchParams.get("code")
    if (!value && !url.searchParams.get("error")) {
      response.writeHead(400).end("Missing sign-in result")
      return
    }
    settled = true
    response.end("drive: sign-in received; you can close this tab")
    if (value) accept(value)
    else reject(new CliError("authentication_error", "Google sign-in was declined"))
  })
  const cancelled = () => reject(new CliError("cancelled", "Google sign-in was cancelled"))
  options.signal?.addEventListener("abort", cancelled, { once: true })
  const timer = setTimeout(
    () => reject(new CliError("timeout", "Google sign-in timed out")),
    options.timeoutMs ?? 300000,
  )
  try {
    if (options.signal?.aborted) throw new CliError("cancelled", "Google sign-in was cancelled")
    await new Promise<void>((resolve, fail) => {
      server.once("error", fail)
      server.listen(0, "127.0.0.1", resolve)
    })
    const address = server.address()
    if (!address || typeof address === "string")
      throw new CliError("configuration_error", "could not start Google sign-in callback")
    const redirect = `http://127.0.0.1:${address.port}/callback`
    const client =
      options.makeClient?.(redirect) ??
      new OAuth2Client({
        clientId: options.application.clientId,
        clientSecret: options.application.clientSecret,
        redirectUri: redirect,
        transporterOptions: { timeout: 30000, ...(options.signal ? { signal: options.signal } : {}) },
      })
    const { codeVerifier, codeChallenge } = await client.generateCodeVerifierAsync()
    const url = client.generateAuthUrl({
      access_type: "offline",
      prompt: "select_account consent",
      scope: [
        options.write ? WRITE_SCOPE : READ_SCOPE,
        ...(options.activity ? [ACTIVITY_SCOPE] : []),
        ...(options.apps ? [APPS_SCOPE] : []),
      ],
      state,
      code_challenge: codeChallenge,
      code_challenge_method: CodeChallengeMethod.S256,
    })
    options.showUrl(url)
    void options.openBrowser(url).catch(() => {})
    const authorizedCode = await code
    let tokens: GoogleTokens
    try {
      tokens = (await client.getToken({ code: authorizedCode, codeVerifier })).tokens
    } catch {
      throw new CliError("authentication_error", "Google token exchange failed; credential details were not logged")
    }
    if (!tokens.refresh_token)
      throw new CliError("authentication_error", "Google returned no offline refresh token; retry sign-in")
    client.setCredentials(tokens)
    if (options.signal?.aborted) throw new CliError("cancelled", "Google sign-in was cancelled")
    const principal = await (options.identity?.(client) ?? googleSource(client).identity())
    const config = readConfig(options.env)
    const previous = config.profiles[name]
    if (previous && previous.principal !== principal)
      throw new CliError("authentication_error", "this profile belongs to another account; use a new profile")
    if (Object.entries(config.profiles).some(([other, profile]) => other !== name && profile.principal === principal))
      throw new CliError(
        "validation_error",
        "this Google account already has a profile; reuse it to preserve source identity",
      )
    saveSession(
      options.env,
      name,
      { principal, ...options.application, tokens: { ...tokens, refresh_token: tokens.refresh_token } },
      options.storage,
      options.keyring,
    )
    config.profiles[name] = { principal, roots: previous?.roots ?? [], storage: options.storage }
    writeConfig(options.env, config)
    return { profile: name, signedIn: true, storage: options.storage }
  } finally {
    clearTimeout(timer)
    options.signal?.removeEventListener("abort", cancelled)
    server.closeAllConnections()
    await new Promise<void>((resolve) => server.close(() => resolve()))
  }
}
