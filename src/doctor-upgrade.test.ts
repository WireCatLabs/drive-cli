import { captureStreams } from "@wirecat/cli-base"
import { describe, expect, it, vi } from "vitest"
import { readConfig, writeConfig } from "./config.js"
import { createProgram } from "./program.js"
import { commandResult, fixture } from "./testing.js"

const run = async (env: NodeJS.ProcessEnv, args: string[], options: Parameters<typeof createProgram>[0] = {}) => {
  const streams = captureStreams()
  await createProgram({ env, streams, ...options }).parseAsync(["--json", ...args], { from: "user" })
  return commandResult(streams.stdout.join(""))
}

describe("doctor", () => {
  it("is a command, not a profile, and lists the profiles without opening the keyring or store", async () => {
    const f = fixture()
    const config = readConfig(f.env)
    config.profiles.work = { principal: "synthetic-principal", roots: ["root"], storage: "keyring" }
    writeConfig(f.env, config)
    const index = vi.fn(async () => f.index)
    const report = await run(f.env, ["doctor"], { index })
    expect(report).toMatchObject({
      config: { found: true, issues: [] },
      profiles: expect.arrayContaining([{ profile: "work", selected_folders: 1, storage: "keyring" }]),
      store: { exists: false },
      login: "not checked",
    })
    expect(index).not.toHaveBeenCalled()
  })
})

describe("upgrade", () => {
  const update = { fetch: async () => Response.json({ version: "99.0.0" }), scriptPath: "/usr/lib/node_modules/x" }

  it("--check asks npm and installs nothing", async () => {
    const spawn = vi.fn(() => 0)
    const result = await run(fixture().env, ["upgrade", "--check"], { update: { ...update, spawn } })
    expect(result).toMatchObject({ latest: "99.0.0", newer: true, updated: false })
    expect(spawn).not.toHaveBeenCalled()
  })

  it("is refused under DRIVE_READ_ONLY unless it only checks", async () => {
    const spawn = vi.fn(() => 0)
    const env = { ...fixture().env, DRIVE_READ_ONLY: "1" }
    await expect(run(env, ["upgrade"], { update: { ...update, spawn } })).rejects.toMatchObject({
      code: "permission_error",
    })
    expect(spawn).not.toHaveBeenCalled()
  })
})

it("refuses a new profile named after doctor or upgrade", async () => {
  for (const name of ["doctor", "upgrade"])
    await expect(run({ ...fixture().env, DRIVE_PROFILE: name }, ["session", "start"])).rejects.toThrow("is a command")
})
