import { readFileSync, statSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { memoryKeyring } from "@wirecat/cli-base"
import { describe, expect, it } from "vitest"
import { application, paths } from "./config.js"
import { googleError } from "./errors.js"
import { fixture } from "./testing.js"
import { authorizedClient, saveSession } from "./tokens.js"

describe("shared credential persistence", () => {
  const session = {
    principal: "synthetic-principal",
    clientId: "fixture-client",
    clientSecret: "fixture-client-secret",
    tokens: { refresh_token: "fixture-refresh", access_token: "fixture-access" },
  }
  it("preserves refresh credentials when a refresh response only supplies an access token", () => {
    const f = fixture()
    const keyring = memoryKeyring()
    saveSession(f.env, "default", session, "keyring", keyring)
    const client = authorizedClient(f.env, "default", keyring)
    client.emit("tokens", { access_token: "fixture-next" })
    const reread = authorizedClient(f.env, "default", keyring)
    expect(reread.credentials.refresh_token).toBe("fixture-refresh")
    expect(reread.credentials.access_token).toBe("fixture-next")
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
})
