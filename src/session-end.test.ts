import { captureStreams, pathsAreOverridden, systemKeyring } from "@wirecat/cli-base"
import { afterEach, describe, expect, it, vi } from "vitest"
import { writeConfig } from "./config.js"

import { commandResult, testProgram as createProgram } from "./testing.js"
import { credentials } from "./tokens.js"

const OWNER = "drive-cli\u0000default"

const movedHome = () => {
  const env: NodeJS.ProcessEnv = { HOME: process.env.HOME, PATH: process.env.PATH }
  expect(pathsAreOverridden({ appName: "drive-cli", prefix: "DRIVE", env })).toBe(false)
  writeConfig(env, { profiles: { default: { principal: "synthetic-principal", roots: ["root"], storage: "keyring" } } })
  const entries = new Map<string, string>()
  const key = (service: string, account: string) => `${service}\u0000${account}`
  vi.spyOn(systemKeyring, "get").mockImplementation((service, account) => entries.get(key(service, account)) ?? null)
  vi.spyOn(systemKeyring, "set").mockImplementation((service, account, secret) => {
    entries.set(key(service, account), secret)
  })
  const deleted = vi
    .spyOn(systemKeyring, "delete")
    .mockImplementation((service, account) => entries.delete(key(service, account)))
  const end = async () => {
    const streams = captureStreams()
    await createProgram({ env, streams }).parseAsync(["default", "session", "end", "--json"], { from: "user" })
    return commandResult(streams.stdout.join(""))
  }
  return { env, entries, deleted, end }
}

describe("drive session end with only HOME moved, against the system keyring", () => {
  afterEach(() => vi.restoreAllMocks())

  it("keeps the owner's sign-in and says so", async () => {
    const { entries, deleted, end } = movedHome()
    entries.set(OWNER, "owners-session")

    expect(await end()).toEqual({
      profile: "default",
      signed_out: false,
      kept: "owners-sign-in",
      cached_data: "retained",
    })
    expect(deleted.mock.calls.map(([service]) => service)).not.toContain("drive-cli")
    expect(entries.get(OWNER)).toBe("owners-session")
  })

  it("removes a sign-in the run made itself, from its temporary entry", async () => {
    const { env, entries, end } = movedHome()
    credentials(env, "keyring").write("default", "own-session")
    expect([...entries.keys()]).not.toContain(OWNER)

    expect(await end()).toEqual({ profile: "default", signed_out: true, cached_data: "retained" })
    expect([...entries.keys()]).toEqual([])
  })
})
