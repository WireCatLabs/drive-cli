import { execFileSync } from "node:child_process"
import { chmodSync, statSync } from "node:fs"
import { dirname } from "node:path"
import { captureStreams } from "@wirecat/cli-base"
import { describe, expect, it, vi } from "vitest"
import { configPath, readConfig, writeConfig } from "./config.js"

import { commandResult, testProgram as createProgram, fixture } from "./testing.js"

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
      profiles: ["default", "work"],
      store: { exists: false },
      oauth_client: { client: "wirecat" },
    })
    expect(await run(f.env, ["session", "list"])).toMatchObject({
      items: expect.arrayContaining([{ profile: "work", selected_folders: 1, storage: "keyring" }]),
    })
    expect(index).not.toHaveBeenCalled()
  })

  it.skipIf(process.platform === "win32")(
    "names a config file and folder others can read, with the chmod",
    async () => {
      const f = fixture()
      const config = readConfig(f.env)
      config.profiles.work = { principal: "synthetic-principal", roots: [], storage: "keyring" }
      writeConfig(f.env, config)
      const file = configPath(f.env)
      expect(statSync(file).mode & 0o777).toBe(0o600)
      chmodSync(file, 0o644)
      chmodSync(dirname(file), 0o775)
      const streams = captureStreams()
      await createProgram({ env: f.env, streams }).parseAsync(["--json", "doctor"], { from: "user" })
      expect(commandResult(streams.stdout.join("")).files).toEqual({
        checked: true,
        ok: false,
        problems: [
          { path: file, mode: "0644", want: "0600" },
          { path: dirname(file), mode: "0775", want: "0700" },
        ],
      })
      const fixes = streams.stderr.flatMap((line) => line.match(/^to make it private: (.*)$/)?.slice(1) ?? [])
      expect(fixes).toEqual([`chmod 600 '${file}'`, `chmod 700 '${dirname(file)}'`])
      for (const fix of fixes) execFileSync("sh", ["-c", fix])
      expect(await run(f.env, ["doctor"])).toMatchObject({ files: { checked: true, ok: true, problems: [] } })
    },
  )
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
