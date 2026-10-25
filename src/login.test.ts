import { CliError, memoryKeyring } from "@wirecat/cli-base"
import { describe, expect, it, vi } from "vitest"
import { readConfig } from "./config.js"
import { type LoginOptions, login } from "./login.js"
import { fixture } from "./testing.js"
import { authorizedClient, credentials } from "./tokens.js"

const setup = () => {
  const f = fixture()
  const keyring = memoryKeyring()
  let redirect = ""
  const tokenEndpoint = vi.fn(
    async (_url: string | URL | Request, _init?: RequestInit) =>
      new Response(
        JSON.stringify({
          access_token: "fixture-access-token",
          refresh_token: "fixture-refresh-token",
          expires_in: 3600,
          scope: "https://www.googleapis.com/auth/drive.readonly",
        }),
        { headers: { "content-type": "application/json" } },
      ),
  )
  const options: LoginOptions = {
    env: f.env,
    profile: "default",
    application: { clientId: "fixture-client", clientSecret: "fixture-client-secret" },
    storage: "keyring",
    keyring,
    fetch: tokenEndpoint,
    showUrl: vi.fn((url: string) => {
      redirect = new URL(url).searchParams.get("redirect_uri") ?? ""
    }),
    identity: async () => "synthetic-principal",
    timeoutMs: 1000,
    openBrowser: async (url) => {
      const state = new URL(url).searchParams.get("state")
      await fetch(`${redirect}?state=${state}&code=fixture-code`)
    },
  }
  return { ...f, options, tokenEndpoint, keyring, redirect: () => redirect }
}
describe("browser OAuth", () => {
  it("requests broader permissions only when write/activity options are explicit", async () => {
    const f = setup()
    await login({ ...f.options, write: true, activity: true, apps: true })
    const url = new URL(vi.mocked(f.options.showUrl).mock.calls[0]?.[0] ?? "")
    expect(url.searchParams.get("scope")).toBe(
      "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.activity.readonly https://www.googleapis.com/auth/drive.apps.readonly",
    )
  })
  it("requests read-only access, exchanges PKCE and stores refresh credentials securely", async () => {
    const f = setup()
    expect(await login(f.options)).toEqual({ profile: "default", signed_in: true, storage: "keyring" })
    const url = new URL(vi.mocked(f.options.showUrl).mock.calls[0]?.[0] ?? "")
    expect(url.searchParams.get("scope")).toBe("https://www.googleapis.com/auth/drive.readonly")
    expect(url.searchParams.get("code_challenge_method")).toBe("S256")
    expect(url.searchParams.get("access_type")).toBe("offline")
    const exchange = String(f.tokenEndpoint.mock.calls[0]?.[1]?.body)
    expect(exchange).toContain("code=fixture-code")
    expect(exchange).toContain("code_verifier=")
    expect(authorizedClient(f.env, "default", f.keyring).credentials.access_token).toBe("fixture-access-token")
    expect(JSON.stringify(readConfig(f.env))).not.toContain("fixture-refresh-token")
    await expect(fetch(f.redirect())).rejects.toThrow()
  })
  it("refuses another account before saving, leaving the profile's sign-in as it was", async () => {
    const f = setup()
    await login(f.options)
    const before = credentials(f.env, "keyring", f.keyring).read("default")?.secret
    await expect(login({ ...f.options, identity: async () => "other-principal" })).rejects.toMatchObject({
      details: { reason: "profile.wrong-account" },
    })
    expect(credentials(f.env, "keyring", f.keyring).read("default")?.secret).toBe(before)
  })
  it("drops the old client secret when signing in again with an app that has none", async () => {
    const f = setup()
    await login(f.options)
    await login({ ...f.options, application: { clientId: "fixture-custom" } })
    const saved = JSON.parse(credentials(f.env, "keyring", f.keyring).read("default")?.secret ?? "{}")
    expect(saved).toMatchObject({ principal: "synthetic-principal", clientId: "fixture-custom" })
    expect(saved).not.toHaveProperty("clientSecret")
  })
  it("rejects wrong-state requests while keeping the correct callback available", async () => {
    const f = setup()
    f.options.openBrowser = async (url) => {
      expect((await fetch(`${f.redirect()}?state=wrong&code=fixture-code`)).status).toBe(400)
      await fetch(`${f.redirect()}?state=${new URL(url).searchParams.get("state")}&code=fixture-code`)
    }
    expect((await login(f.options)).signed_in).toBe(true)
  })
  it("closes its listener when consent is declined", async () => {
    const f = setup()
    f.options.openBrowser = async (url) => {
      await fetch(`${f.redirect()}?state=${new URL(url).searchParams.get("state")}&error=access_denied`)
    }
    await expect(login(f.options)).rejects.toThrow("declined")
    await expect(fetch(f.redirect())).rejects.toThrow()
  })
  it("times out and closes without storing a token", async () => {
    const f = setup()
    f.options.timeoutMs = 20
    f.options.openBrowser = async () => {}
    await expect(login(f.options)).rejects.toThrow("timed out")
    expect(f.tokenEndpoint).not.toHaveBeenCalled()
    await expect(fetch(f.redirect())).rejects.toThrow()
  })
  it("refuses an unavailable keyring before it shows the sign-in URL", async () => {
    const f = setup()
    const broken = new Error("no Secret Service")
    f.options.keyring = {
      get: () => {
        throw broken
      },
      set: () => {
        throw broken
      },
      delete: () => {
        throw broken
      },
    }
    await expect(login(f.options)).rejects.toMatchObject({ details: { reason: "sign-in.not-saved" } })
    expect(f.options.showUrl).not.toHaveBeenCalled()
  })
  it("sanitizes token-exchange failures", async () => {
    const f = setup()
    f.tokenEndpoint.mockResolvedValue(new Response(JSON.stringify({ error: "fixture-access-token" }), { status: 400 }))
    await expect(login(f.options)).rejects.toThrow("credential details were not logged")
  })
  it("cancels an in-progress sign-in and closes its listener", async () => {
    const f = setup()
    const abort = new AbortController()
    f.options.signal = abort.signal
    f.options.openBrowser = async () => {
      abort.abort()
    }
    await expect(login(f.options)).rejects.toBeInstanceOf(CliError)
    await expect(fetch(f.redirect())).rejects.toThrow()
  })
})
