import { CliError, memoryKeyring } from "@wirecat/cli-base"
import { OAuth2Client } from "google-auth-library"
import { describe, expect, it, vi } from "vitest"
import { readConfig } from "./config.js"
import { type LoginOptions, login } from "./login.js"
import { fixture } from "./testing.js"
import { authorizedClient } from "./tokens.js"

const setup = () => {
  const f = fixture()
  const keyring = memoryKeyring()
  let redirect = ""
  const client = new OAuth2Client("fixture-client", "fixture-client-secret")
  Object.defineProperty(client, "getToken", {
    value: vi.fn(async () => ({
      tokens: {
        access_token: "fixture-access-token",
        refresh_token: "fixture-refresh-token",
        expiry_date: Date.now() + 3600000,
      },
      res: null,
    })),
  })
  const options: LoginOptions = {
    env: f.env,
    profile: "default",
    application: { clientId: "fixture-client", clientSecret: "fixture-client-secret" },
    storage: "keyring",
    keyring,
    showUrl: vi.fn(),
    makeClient: (callback) => {
      redirect = callback
      Object.defineProperty(client, "redirectUri", { value: callback })
      return client
    },
    identity: async () => "synthetic-principal",
    timeoutMs: 1000,
    openBrowser: async (url) => {
      const state = new URL(url).searchParams.get("state")
      await fetch(`${redirect}?state=${state}&code=fixture-code`)
    },
  }
  return { ...f, options, client, keyring, redirect: () => redirect }
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
    expect(await login(f.options)).toEqual({ profile: "default", signedIn: true, storage: "keyring" })
    const url = new URL(vi.mocked(f.options.showUrl).mock.calls[0]?.[0] ?? "")
    expect(url.searchParams.get("scope")).toBe("https://www.googleapis.com/auth/drive.readonly")
    expect(url.searchParams.get("code_challenge_method")).toBe("S256")
    expect(f.client.getToken).toHaveBeenCalledWith(
      expect.objectContaining({ code: "fixture-code", codeVerifier: expect.any(String) }),
    )
    expect(authorizedClient(f.env, "default", f.keyring).credentials.refresh_token).toBe("fixture-refresh-token")
    expect(JSON.stringify(readConfig(f.env))).not.toContain("fixture-refresh-token")
    await expect(fetch(f.redirect())).rejects.toThrow()
  })
  it("rejects wrong-state requests while keeping the correct callback available", async () => {
    const f = setup()
    f.options.openBrowser = async (url) => {
      expect((await fetch(`${f.redirect()}?state=wrong&code=fixture-code`)).status).toBe(400)
      await fetch(`${f.redirect()}?state=${new URL(url).searchParams.get("state")}&code=fixture-code`)
    }
    expect((await login(f.options)).signedIn).toBe(true)
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
    expect(f.client.getToken).not.toHaveBeenCalled()
    await expect(fetch(f.redirect())).rejects.toThrow()
  })
  it("sanitizes token-exchange failures", async () => {
    const f = setup()
    vi.mocked(f.client.getToken).mockRejectedValue(new Error("fixture-access-token"))
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
