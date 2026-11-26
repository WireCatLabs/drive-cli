import { writeFileSync } from "node:fs"
import { join } from "node:path"
import { captureStreams, memoryKeyring, systemKeyring } from "@wirecat/cli-base"
import type { Command } from "commander"
import { afterEach, describe, expect, it, vi } from "vitest"
import { paths, readConfig, writeConfig } from "./config.js"
import { commandResult, testProgram as createProgram, fixture, sessionAccount } from "./testing.js"
import { ACTIVITY_SCOPE, APPS_SCOPE, authorizedClient, grantedScopes, READ_SCOPE, WRITE_SCOPE } from "./tokens.js"

// Every temp-folder run is a moved run; the owner's own run, which copies an old entry, is only reached this way.
const owner = vi.hoisted(() => ({ run: false }))
vi.mock("@wirecat/cli-base", async (original) => {
  const base = await original<typeof import("@wirecat/cli-base")>()
  return {
    ...base,
    isMovedRun: (options: Parameters<typeof base.isMovedRun>[0]) => !owner.run && base.isMovedRun(options),
  }
})

const OLD_ENTRY = JSON.stringify({
  principal: "synthetic-principal",
  clientId: "fixture-client",
  clientSecret: "fixture-client-secret",
  tokens: { refresh_token: "fixture-refresh", access_token: "fixture-access", scope: READ_SCOPE },
})

const drive = async (options: Parameters<typeof createProgram>[0], args: string[]) => {
  const streams = captureStreams()
  await createProgram({ ...options, streams }).parseAsync([...args, "--json"], { from: "user" })
  return commandResult(streams.stdout.join(""))
}

/** The sign-in Google would give: the browser comes back to the loopback with a code, the token endpoint answers. */
const google = (scope = READ_SCOPE) => {
  const authorized: URL[] = []
  const tokenCalls: URLSearchParams[] = []
  const openBrowser = vi.fn(async (url: string, _command?: Command) => {
    const authorization = new URL(url)
    authorized.push(authorization)
    const back = new URL(authorization.searchParams.get("redirect_uri") ?? "")
    back.search = new URLSearchParams({
      state: authorization.searchParams.get("state") ?? "",
      code: "fixture-code",
    }).toString()
    await fetch(back)
  })
  const token = (async (_url: string | URL | Request, init?: RequestInit) => {
    tokenCalls.push(new URLSearchParams(String(init?.body)))
    return Response.json({ access_token: "fixture-access", refresh_token: "fixture-refresh", expires_in: 3600, scope })
  }) as typeof fetch
  return { authorized, tokenCalls, openBrowser, fetch: token }
}

afterEach(() => {
  owner.run = false
  vi.restoreAllMocks()
})

describe("drive session on cli-core's oauthSessionCommand", () => {
  it("signs in with --grant and --client-file, and keeps the entry and the principal", async () => {
    const f = fixture()
    const keyring = memoryKeyring()
    const g = google(`${WRITE_SCOPE} ${ACTIVITY_SCOPE} ${APPS_SCOPE}`)
    const clientFile = join(f.directory, "desktop-client.json")
    writeFileSync(clientFile, JSON.stringify({ installed: { client_id: "file.apps", client_secret: "file-secret" } }), {
      mode: 0o600,
    })

    const started = await drive({ env: f.env, keyring, source: async () => f.source, ...g } as never, [
      "default",
      "session",
      "start",
      "--grant",
      "write,activity,apps",
      "--client-file",
      clientFile,
    ])

    expect(started).toMatchObject({ profile: "default", signed_in: true, account: "synthetic-principal" })
    const asked = g.authorized[0]
    expect(asked?.searchParams.get("scope")).toBe(`${WRITE_SCOPE} ${ACTIVITY_SCOPE} ${APPS_SCOPE}`)
    expect(asked?.searchParams.get("client_id")).toBe("file.apps")
    expect(g.tokenCalls[0]?.get("client_secret")).toBe("file-secret")
    const entry = JSON.parse(keyring.get("drive-cli", sessionAccount("default")) ?? "{}")
    expect(entry).toMatchObject({
      principal: "synthetic-principal",
      clientId: "file.apps",
      clientSecret: "file-secret",
    })
    expect(readConfig(f.env).profiles.default).toMatchObject({ principal: "synthetic-principal", storage: "keyring" })
    expect(grantedScopes(f.env, "default", keyring)).toEqual([WRITE_SCOPE, ACTIVITY_SCOPE, APPS_SCOPE])
  })

  it("signs in with --client-id and does not keep the secret of the app it signed in with before", async () => {
    const f = fixture()
    const keyring = memoryKeyring()
    keyring.set("drive-cli", sessionAccount("default"), OLD_ENTRY)
    const g = google()

    await drive({ env: f.env, keyring, source: async () => f.source, ...g } as never, [
      "default",
      "session",
      "start",
      "--client-id",
      "flag.apps",
    ])

    expect(g.authorized[0]?.searchParams.get("client_id")).toBe("flag.apps")
    const entry = JSON.parse(keyring.get("drive-cli", sessionAccount("default")) ?? "{}")
    expect(entry.clientId).toBe("flag.apps")
    expect(entry.clientSecret).toBeUndefined()
  })

  it("refuses another Google account for a profile and leaves its sign-in as it was", async () => {
    const f = fixture()
    const keyring = memoryKeyring()
    keyring.set("drive-cli", sessionAccount("default"), OLD_ENTRY)
    const g = google()
    const source = async () => ({ ...f.source, identity: async () => "other-principal" })

    await expect(
      drive({ env: f.env, keyring, source, ...g } as never, ["default", "session", "start"]),
    ).rejects.toMatchObject({ details: { reason: "profile.wrong-account" } })
    expect(keyring.get("drive-cli", sessionAccount("default"))).toBe(OLD_ENTRY)
    expect(readConfig(f.env).profiles.default?.principal).toBe("synthetic-principal")
  })

  it("lists the configured profiles as top-level items, the shape Desktop reads", async () => {
    const f = fixture()
    const keyring = memoryKeyring()
    keyring.set("drive-cli", "default", OLD_ENTRY)
    const config = readConfig(f.env)
    config.profiles.work = { principal: "synthetic-work", roots: [], storage: "keyring" }
    writeConfig(f.env, config)
    const streams = captureStreams()

    await createProgram({ env: f.env, keyring, streams }).parseAsync(["session", "list", "--json"], { from: "user" })

    const answer = JSON.parse(streams.stdout.join(""))
    expect(answer.item).toBeUndefined()
    expect(answer.items).toEqual([
      { profile: "default", signed_in: true, state: "saved" },
      { profile: "work", signed_in: false, state: "missing" },
    ])
  })

  it("refuses a missing profile and lists the profiles to choose from", async () => {
    const f = fixture()
    for (const words of [["status"], ["end"]])
      await expect(drive({ env: f.env, keyring: memoryKeyring() }, ["session", ...words])).rejects.toMatchObject({
        code: "validation_error",
        details: { profiles: ["default"] },
      })
  })
})

describe("a sign-in kept by drive before 0.78, under the bare profile name", () => {
  it("is copied to the new entry in the owner's run, with no new sign-in, and account remove removes both", async () => {
    owner.run = true
    const f = fixture()
    const keyring = memoryKeyring()
    keyring.set("drive-cli", "default", OLD_ENTRY)

    expect(authorizedClient(f.env, "default", keyring).credentials.access_token).toBe("fixture-access")
    expect(keyring.get("drive-cli", sessionAccount("default"))).toBe(OLD_ENTRY)
    expect(keyring.get("drive-cli", "default")).toBe(OLD_ENTRY)
    expect(await drive({ env: f.env, keyring }, ["default", "session", "status"])).toMatchObject({
      state: "saved",
      scopes: [READ_SCOPE],
    })

    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("{}")),
    )
    try {
      await createProgram({ env: f.env, keyring, streams: captureStreams() }).parseAsync(
        ["default", "account", "remove", "--json", "--yes", "--keep-data"],
        { from: "user" },
      )
    } finally {
      vi.unstubAllGlobals()
    }
    expect(keyring.get("drive-cli", sessionAccount("default"))).toBeNull()
    expect(keyring.get("drive-cli", "default")).toBeNull()
  })

  it("is read from the private file a profile kept it in", async () => {
    const f = fixture()
    writeFileSync(join(paths(f.env).config, "credentials.json"), JSON.stringify({ default: { secret: OLD_ENTRY } }), {
      mode: 0o600,
    })

    expect(await drive({ env: f.env, keyring: memoryKeyring() }, ["default", "session", "status"])).toMatchObject({
      state: "saved",
    })
  })
})

describe("a run with moved folders, against the system keyring", () => {
  const OWNER = "drive-cli\u0000default"
  const keyringOf = () => {
    const entries = new Map<string, string>()
    const key = (service: string, account: string) => `${service}\u0000${account}`
    vi.spyOn(systemKeyring, "get").mockImplementation((service, account) => entries.get(key(service, account)) ?? null)
    vi.spyOn(systemKeyring, "set").mockImplementation((service, account, secret) => {
      entries.set(key(service, account), secret)
    })
    vi.spyOn(systemKeyring, "delete").mockImplementation((service, account) => entries.delete(key(service, account)))
    entries.set(OWNER, OLD_ENTRY)
    return entries
  }

  it("reads the owner's sign-in and never writes or removes it", async () => {
    const f = fixture()
    const entries = keyringOf()

    expect(await drive({ env: f.env }, ["default", "session", "status"])).toMatchObject({ state: "saved" })
    expect(authorizedClient(f.env, "default").credentials.access_token).toBe("fixture-access")
    const g = google()
    await drive({ env: f.env, source: async () => f.source, ...g } as never, ["default", "session", "start"])
    expect([...entries.keys()]).toEqual([OWNER, `drive-cli:${paths(f.env).config}\u0000${sessionAccount("default")}`])
    const ended = await drive({ env: f.env }, ["default", "session", "end"])

    expect(ended).toMatchObject({ profile: "default", ended: false, why: expect.stringContaining("moved folders") })
    expect([...entries.keys()]).toEqual([OWNER])
    expect(entries.get(OWNER)).toBe(OLD_ENTRY)
  })
})

describe("drive commands", () => {
  it("marks the commands cli-core builds, so the standards lint finds them (WC-CMD-34)", async () => {
    const discover = async (...path: string[]) => {
      const streams = captureStreams()
      await createProgram({ env: fixture().env, streams }).parseAsync(["commands", ...path, "--json"], { from: "user" })
      return JSON.parse(streams.stdout.join(""))
    }
    const { commands } = await discover()
    const origin = (name: string) => commands.find((command: { name: string }) => command.name === name)?.origin
    for (const name of ["doctor", "mcp", "complete", "session"]) expect(origin(name)).toBe("cli-core")
    expect(origin("files")).toBe("handwritten")
    const scoped = await discover("doctor")
    expect(scoped.commands[0].origin).toBe("cli-core")
  })
})
