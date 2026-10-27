import { existsSync, mkdirSync, writeFileSync } from "node:fs"
import { createServer } from "node:net"
import { dirname } from "node:path"
import {
  Client,
  type OAuthClientProvider,
  StreamableHTTPClientTransport,
  UnauthorizedError,
} from "@modelcontextprotocol/client"
import { captureStreams } from "@wirecat/cli-base"
import { describe, expect, it, vi } from "vitest"
import { readConfig, writeConfig } from "./config.js"
import { httpTokenFile } from "./mcp.js"
import { createProgram } from "./program.js"
import { ensureProfileDir, profileSetTokenFile } from "./state.js"
import { fixture } from "./testing.js"

const REDIRECT = "http://localhost/callback"

const freePort = (): Promise<number> =>
  new Promise((resolve, reject) => {
    const probe = createServer()
    probe.once("error", reject)
    probe.listen(0, "127.0.0.1", () => {
      const address = probe.address()
      probe.close(() => resolve(typeof address === "object" && address ? address.port : 0))
    })
  })

/** Logs in the way a browser app does: registers, types the terminal's code on the consent page, swaps it for tokens. */
const loggedInClient = async (base: URL, loginCode: () => string) => {
  const endpoint = new URL("/mcp", base)
  const saved: { info?: object; tokens?: object; verifier?: string; consentAt?: URL } = {}
  const authProvider: OAuthClientProvider = {
    get redirectUrl() {
      return REDIRECT
    },
    get clientMetadata() {
      return {
        client_name: "Test app",
        redirect_uris: [REDIRECT],
        token_endpoint_auth_method: "none",
        grant_types: ["authorization_code", "refresh_token"],
        response_types: ["code"],
      }
    },
    clientInformation: () => saved.info as never,
    saveClientInformation: (info) => {
      saved.info = info
    },
    tokens: () => saved.tokens as never,
    saveTokens: (tokens) => {
      saved.tokens = tokens
    },
    redirectToAuthorization: (url) => {
      saved.consentAt = url
    },
    saveCodeVerifier: (verifier) => {
      saved.verifier = verifier
    },
    codeVerifier: () => saved.verifier ?? "",
  }
  const first = new StreamableHTTPClientTransport(endpoint, { authProvider })
  try {
    await new Client({ name: "test", version: "1" }).connect(first)
  } catch (error) {
    if (!(error instanceof UnauthorizedError)) throw error
  }
  if (!saved.consentAt) throw new Error("the server did not ask the client to log in")
  const typed = new URLSearchParams(saved.consentAt.searchParams)
  typed.set("login_code", loginCode())
  const answer = await fetch(new URL("/authorize", base), { method: "POST", body: typed, redirect: "manual" })
  const location = answer.headers.get("location")
  if (answer.status !== 302 || !location) throw new Error(`consent refused: ${answer.status}`)
  await first.finishAuth(new URL(location).searchParams.get("code") ?? "")
  const client = new Client({ name: "test", version: "1" })
  await client.connect(new StreamableHTTPClientTransport(endpoint, { authProvider }))
  return client
}

const run = async (f: ReturnType<typeof fixture>, argv: string[], options: { signal?: AbortSignal } = {}) => {
  const streams = captureStreams()
  const call = vi.fn(async () => ({ id: "fixture-file" }))
  const running = createProgram({ env: f.env, api: { call }, streams, ...options }).parseAsync(argv, { from: "user" })
  return { streams, call, running }
}

const addWork = (f: ReturnType<typeof fixture>) => {
  const config = readConfig(f.env)
  const { default: profile } = config.profiles
  if (profile) writeConfig(f.env, { ...config, profiles: { ...config.profiles, work: profile } })
}

describe("drive mcp serve --http", () => {
  it("serves the guarded commands behind the owner login, with saved and per-server permissions", async () => {
    const f = fixture()
    const config = readConfig(f.env)
    config.profiles.default = {
      ...(config.profiles.default as NonNullable<typeof config.profiles.default>),
      permissions: { sheets: "deny" },
    }
    writeConfig(f.env, config)
    const port = await freePort()
    const stop = new AbortController()
    const base = new URL(`http://127.0.0.1:${port}`)
    const { streams, call, running } = await run(
      f,
      [
        "default",
        "mcp",
        "serve",
        "--http",
        "--public-url",
        base.href,
        "--port",
        String(port),
        "--permission",
        "files.get=deny",
      ],
      { signal: stop.signal },
    )
    await vi.waitFor(() => expect(streams.stderr.join("\n")).toContain("serving profile default on"))
    const code = () => /login code for a new browser app: (\S+)/.exec(streams.stderr.join("\n"))?.[1] ?? ""
    const client = await loggedInClient(base, code)
    try {
      const read = (command: string, args: Record<string, unknown>) =>
        client.callTool({ name: "drive_read", arguments: { command, arguments: args } })
      expect(await read("api drive-about-get", { fields: "user" })).toMatchObject({
        structuredContent: { item: { id: "fixture-file" } },
      })
      for (const command of ["files get", "sheets show"])
        expect(await read(command, { file_id: "synthetic", spreadsheet: "synthetic", range: "A1" })).toMatchObject({
          isError: true,
          structuredContent: { error: { code: "permission_error" } },
        })
      expect(call).toHaveBeenCalledTimes(1)
    } finally {
      await client.close()
      stop.abort()
      await running
    }
    const anonymous = await fetch(new URL("/mcp", base), { method: "POST" }).catch((error: Error) => error)
    expect(anonymous).toBeInstanceOf(Error)
    expect(existsSync(httpTokenFile(f.env, "default"))).toBe(true)
  })

  it("shows a running server and its current login code in mcp server status, and frees the lock when it stops", async () => {
    const f = fixture()
    const port = await freePort()
    const stop = new AbortController()
    const base = new URL(`http://127.0.0.1:${port}`)
    const { streams, running } = await run(
      f,
      ["default", "mcp", "serve", "--http", "--public-url", base.href, "--port", String(port)],
      { signal: stop.signal },
    )
    await vi.waitFor(() => expect(streams.stderr.join("\n")).toContain("serving profile default on"))
    const code = /login code for a new browser app: (\S+)/.exec(streams.stderr.join("\n"))?.[1]
    const status = async () => {
      const asked = await run(f, ["default", "mcp", "server", "status", "--json"])
      await asked.running
      return JSON.parse(asked.streams.stdout.join("")).item
    }
    try {
      expect(await status()).toMatchObject({
        profile: "default",
        running: true,
        by: "hand",
        port,
        connector_url: new URL("/mcp", base).href,
        login_code: { code },
      })
    } finally {
      stop.abort()
      await running
    }
    expect(await status()).toMatchObject({ running: false })
  })

  it("forgets every browser login on mcp revoke", async () => {
    const f = fixture()
    ensureProfileDir(f.env, "default")
    writeFileSync(httpTokenFile(f.env, "default"), "{}")
    const { streams, running } = await run(f, ["default", "mcp", "revoke", "--json"])
    await running
    expect(JSON.parse(streams.stdout.join(""))).toMatchObject({ item: { revoked: true, profile: "default" } })
    expect(existsSync(httpTokenFile(f.env, "default"))).toBe(false)
  })

  it("forgets the logins of the server of every profile on drive mcp revoke --profiles all", async () => {
    const f = fixture()
    mkdirSync(dirname(profileSetTokenFile(f.env, "all")), { recursive: true })
    writeFileSync(profileSetTokenFile(f.env, "all"), "{}")
    const { streams, running } = await run(f, ["mcp", "revoke", "--profiles", "all", "--json"])
    await running
    expect(JSON.parse(streams.stdout.join(""))).toMatchObject({
      item: { revoked: true, profile: null, profiles: "all" },
    })
    expect(existsSync(profileSetTokenFile(f.env, "all"))).toBe(false)
  })

  it("keeps a list's login apart from every profile's", async () => {
    const f = fixture()
    addWork(f)
    mkdirSync(dirname(profileSetTokenFile(f.env, "all")), { recursive: true })
    writeFileSync(profileSetTokenFile(f.env, "all"), "{}")
    writeFileSync(profileSetTokenFile(f.env, "default,work"), "{}")
    const { streams, running } = await run(f, ["mcp", "revoke", "--profiles", "work,default", "--json"])
    await running
    expect(JSON.parse(streams.stdout.join(""))).toMatchObject({ item: { profiles: "default,work" } })
    expect(existsSync(profileSetTokenFile(f.env, "default,work"))).toBe(false)
    expect(existsSync(profileSetTokenFile(f.env, "all"))).toBe(true)
  })

  it.each([
    [["mcp", "serve"], "validation_error", /name the profiles to serve: .*profiles here: default, work/],
    [["default", "mcp", "serve", "--profiles", "work"], "validation_error", /not both/],
    [["mcp", "serve", "--profiles", "work,nobody"], "validation_error", /no profile named "nobody"/],
    [["mcp", "serve", "--profiles", "all,work"], "validation_error", /`all` alone/],
    [["mcp", "revoke"], "validation_error", /name the profiles to serve/],
    [["mcp", "server", "status", "--profiles", "nobody"], "validation_error", /no profile named "nobody"/],
    [["mcp", "serve", "--profiles", "work", "--tools"], "validation_error", /--tools lists one profile/],
  ])("refuses %j", async (argv, code, message) => {
    const f = fixture()
    addWork(f)
    const { running } = await run(f, [...argv, "--json"])
    await expect(running).rejects.toMatchObject({ code, message: expect.stringMatching(message) })
  })

  it("lets --profiles name only the locked profile", async () => {
    const f = fixture()
    addWork(f)
    const { running } = await run({ ...f, env: { ...f.env, DRIVE_PROFILE_LOCK: "default" } }, [
      "mcp",
      "revoke",
      "--profiles",
      "work",
      "--json",
    ])
    await expect(running).rejects.toMatchObject({ code: "permission_error" })
  })

  it.each([[["--read-only"]], [["default", "--read-only"]]])(
    "refuses mcp revoke after %j and keeps the logins",
    async (before) => {
      const f = fixture()
      mkdirSync(dirname(profileSetTokenFile(f.env, "all")), { recursive: true })
      writeFileSync(profileSetTokenFile(f.env, "all"), "{}")
      ensureProfileDir(f.env, "default")
      writeFileSync(httpTokenFile(f.env, "default"), "{}")
      const { running } = await run(f, [...before, "mcp", "revoke", "--json"])
      await expect(running).rejects.toMatchObject({ code: "permission_error" })
      expect(existsSync(profileSetTokenFile(f.env, "all"))).toBe(true)
      expect(existsSync(httpTokenFile(f.env, "default"))).toBe(true)
    },
  )

  it("says so when drive mcp serve --profiles all has no profile to serve", async () => {
    const f = fixture()
    writeConfig(f.env, { profiles: {} })
    const { running } = await run(f, ["mcp", "serve", "--profiles", "all", "--json"])
    await expect(running).rejects.toThrow(/no drive profile here yet/)
  })

  it.each([
    [["--http"], "configuration_error"],
    [["--http", "--public-url", "http://device.example"], "validation_error"],
    [["--http", "--public-url", "https://device.example/drive?x=1"], "validation_error"],
    [["--http", "--public-url", "https://device.example", "--port", "70000"], "validation_error"],
  ])("refuses %j before listening", async (args, code) => {
    const { running } = await run(fixture(), ["default", "mcp", "serve", ...args, "--json"])
    await expect(running).rejects.toMatchObject({ code })
  })
})
