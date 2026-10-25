import { readFileSync, statSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { memoryKeyring } from "@wirecat/cli-base"
import { describe, expect, it, vi } from "vitest"
import { application, paths } from "./config.js"
import { googleError } from "./errors.js"
import { fixture } from "./testing.js"
import { authorizedClient, credentials, grantedScopes, READ_SCOPE, saveSession } from "./tokens.js"

describe("shared credential persistence", () => {
  const session = {
    principal: "synthetic-principal",
    clientId: "fixture-client",
    clientSecret: "fixture-client-secret",
    tokens: { refresh_token: "fixture-refresh", access_token: "fixture-access" },
  }
  const expired = { ...session, tokens: { ...session.tokens, expiry_date: 1, scope: READ_SCOPE } }
  const tokenResponse = (body: Record<string, unknown>, status = 200) =>
    vi.fn(async () => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } }))
  const savedSession = (keyring: ReturnType<typeof memoryKeyring>, env: NodeJS.ProcessEnv) =>
    JSON.parse(credentials(env, "keyring", keyring).read("default")?.secret ?? "{}")

  it("refreshes through the shared keeper and keeps the entry the old drive reads", async () => {
    const f = fixture()
    const keyring = memoryKeyring()
    saveSession(f.env, "default", expired, "keyring", keyring)
    const fetch = tokenResponse({ access_token: "fixture-next", expires_in: 3600, token_type: "Bearer" })
    vi.stubGlobal("fetch", fetch)
    try {
      const client = authorizedClient(f.env, "default", keyring)
      expect(client.credentials.refresh_token).toBeUndefined()
      expect((await client.getAccessToken()).token).toBe("fixture-next")
      expect(fetch).toHaveBeenCalledTimes(1)
      const body = String((fetch.mock.calls[0] as unknown as [string, RequestInit])[1].body)
      expect(body).toContain("grant_type=refresh_token")
      expect(body).toContain("refresh_token=fixture-refresh")
      const saved = savedSession(keyring, f.env)
      expect(saved.principal).toBe("synthetic-principal")
      expect(saved.tokens).toMatchObject({
        refresh_token: "fixture-refresh",
        access_token: "fixture-next",
        scope: READ_SCOPE,
      })
      expect(grantedScopes(f.env, "default", keyring)).toEqual([READ_SCOPE])
      expect((await authorizedClient(f.env, "default", keyring).getAccessToken()).token).toBe("fixture-next")
      expect(fetch).toHaveBeenCalledTimes(1)
    } finally {
      vi.unstubAllGlobals()
    }
  })
  it("spends the refresh token once when two clients refresh together", async () => {
    const f = fixture()
    const keyring = memoryKeyring()
    saveSession(f.env, "default", expired, "keyring", keyring)
    const fetch = tokenResponse({ access_token: "fixture-next", expires_in: 3600 })
    vi.stubGlobal("fetch", fetch)
    try {
      const tokens = await Promise.all([
        authorizedClient(f.env, "default", keyring).getAccessToken(),
        authorizedClient(f.env, "default", keyring).getAccessToken(),
      ])
      expect(tokens.map((one) => one.token)).toEqual(["fixture-next", "fixture-next"])
      expect(fetch).toHaveBeenCalledTimes(1)
    } finally {
      vi.unstubAllGlobals()
    }
  })
  it("names session start when Google refuses the refresh token", async () => {
    const f = fixture()
    const keyring = memoryKeyring()
    saveSession(f.env, "default", expired, "keyring", keyring)
    vi.stubGlobal("fetch", tokenResponse({ error: "invalid_grant" }, 400))
    try {
      await expect(authorizedClient(f.env, "default", keyring).getAccessToken()).rejects.toMatchObject({
        code: "authentication_error",
        details: { reason: "sign-in.expired" },
        message: expect.stringContaining("run drive default session start"),
      })
    } finally {
      vi.unstubAllGlobals()
    }
  })
  it("makes file persistence explicit and private", () => {
    const f = fixture()
    saveSession(f.env, "default", session, "file")
    const path = join(paths(f.env).config, "credentials.json")
    expect(readFileSync(path, "utf8")).toContain("fixture-refresh")
    if (process.platform !== "win32") expect(statSync(path).mode & 0o777).toBe(0o600)
  })
  it("does not quote malformed application data in diagnostics", () => {
    const f = fixture()
    const file = join(paths(f.env).config, "desktop-client.json")
    writeFileSync(file, JSON.stringify({ web: { client_secret: "fixture-sensitive-data" } }))
    expect(() => application({}, file)).toThrow("valid Desktop OAuth client JSON")
    expect(() => authorizedClient(fixture().env, "default", memoryKeyring())).toThrow("sign-in")
  })
  it("uses WireCat by default and returns independent application objects", () => {
    const first = application({})
    expect(first.clientId.endsWith(".apps.googleusercontent.com")).toBe(true)
    expect(typeof first.clientSecret === "string" && first.clientSecret.length > 0).toBe(true)
    first.clientId = "fixture-replacement"
    expect(application({}).clientId === "fixture-replacement").toBe(false)
  })
  it("keeps custom environment clients separate from WireCat's client secret", () => {
    expect(application({ DRIVE_GOOGLE_CLIENT_ID: "fixture-custom" })).toEqual({ clientId: "fixture-custom" })
    expect(
      application({ DRIVE_GOOGLE_CLIENT_ID: "fixture-custom", DRIVE_GOOGLE_CLIENT_SECRET: "fixture-secret" }),
    ).toEqual({ clientId: "fixture-custom", clientSecret: "fixture-secret" })
    expect(() => application({ DRIVE_GOOGLE_CLIENT_SECRET: "fixture-secret" })).toThrow("requires")
  })
  it("prefers an explicit Desktop file and never falls back after an invalid file", () => {
    const f = fixture()
    const file = join(paths(f.env).config, "desktop-client.json")
    writeFileSync(
      file,
      JSON.stringify({ installed: { client_id: "fixture-file", client_secret: "fixture-file-secret" } }),
    )
    expect(application({ DRIVE_GOOGLE_CLIENT_ID: "fixture-env" }, file)).toEqual({
      clientId: "fixture-file",
      clientSecret: "fixture-file-secret",
    })
    expect(() => application({}, join(paths(f.env).config, "missing.json"))).toThrow("valid Desktop OAuth")
  })
  it("classifies OAuth rejection, quota limits and cancellation without provider messages", () => {
    expect(googleError({ response: { status: 400, data: { error: "invalid_grant" } } }).code).toBe(
      "authentication_error",
    )
    expect(
      googleError({ response: { status: 403, data: { error: { errors: [{ reason: "userRateLimitExceeded" }] } } } })
        .code,
    ).toBe("rate_limited")
    expect(googleError({ name: "AbortError" }).code).toBe("cancelled")
  })
  it("names a runnable session start in sign-in hints", () => {
    const f = fixture()
    expect(() => authorizedClient(f.env, "default", memoryKeyring())).toThrow("run drive default session start")
    const revoked = googleError({ response: { status: 400, data: { error: "invalid_grant" } } })
    const expired = googleError({ response: { status: 401 } })
    expect(revoked.message).toContain("run drive <profile> session start")
    expect(expired.message).toContain("run drive <profile> session start")
  })
})
