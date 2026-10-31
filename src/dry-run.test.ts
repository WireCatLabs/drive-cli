import { existsSync, readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { captureStreams } from "@wirecat/cli-base"
import { describe, expect, it, vi } from "vitest"
import { inspectConfig, paths, readConfig, writeConfig } from "./config.js"
import { run as runProgram } from "./program.js"

import { commandResult, testProgram as createProgram, fixture } from "./testing.js"

const setup = () => {
  const f = fixture()
  const env: NodeJS.ProcessEnv = { ...f.env, HOME: join(f.env.DRIVE_CONFIG_DIR as string, "..", "home") }
  const config = readConfig(env)
  config.profiles.default = {
    ...(config.profiles.default as NonNullable<typeof config.profiles.default>),
    max_text_chars: 1000,
    permissions: { files: "allow", "mcp.authority": "allow" },
  }
  config.defaults = { permissions: { files: "allow" } }
  writeConfig(env, config)
  const file = inspectConfig(env).path
  const saved = readFileSync(file)
  const spawn = vi.fn(() => 0)
  const update = { fetch: async () => Response.json({ version: "99.0.0" }), scriptPath: "/x", spawn }
  const run = async (...args: string[]) => {
    const streams = captureStreams()
    await createProgram({ env, streams, update }).parseAsync(["--json", ...args], { from: "user" })
    return commandResult(streams.stdout.join(""))
  }
  const unchanged = () => expect(readFileSync(file)).toEqual(saved)
  return { env, run, unchanged, spawn }
}

const previewOf = (command: string) => ({
  dry_run: true,
  command,
  effects: expect.objectContaining({ local: "write" }),
  action_invoked: false,
})

describe("a global --dry-run on drive's early-return paths", () => {
  it("config set previews and leaves the config file as it was, for a profile and for the defaults", async () => {
    const t = setup()
    expect(await t.run("default", "--dry-run", "config", "set", "max_text_chars", "2000")).toEqual(
      previewOf("config set"),
    )
    expect(
      await t.run("default", "--dry-run", "config", "set", "permissions.files", '"readonly"', "--defaults"),
    ).toEqual(previewOf("config set"))
    t.unchanged()
  })

  it("config unset previews and leaves the config file as it was, with a profile, the defaults or none", async () => {
    const t = setup()
    expect(await t.run("default", "--dry-run", "config", "unset", "max_text_chars")).toEqual(previewOf("config unset"))
    expect(await t.run("default", "--dry-run", "config", "unset", "permissions.files", "--defaults")).toEqual(
      previewOf("config unset"),
    )
    expect(await t.run("--dry-run", "config", "unset", "defaults")).toEqual(previewOf("config unset"))
    t.unchanged()
  })

  it("config set and unset still refuse under DRIVE_READ_ONLY before previewing", async () => {
    const t = setup()
    t.env.DRIVE_READ_ONLY = "1"
    await expect(t.run("default", "--dry-run", "config", "set", "max_text_chars", "2000")).rejects.toMatchObject({
      code: "permission_error",
    })
    await expect(t.run("--dry-run", "config", "unset", "defaults")).rejects.toMatchObject({ code: "permission_error" })
    t.unchanged()
  })

  it("skill install previews and writes no SKILL.md into HOME", async () => {
    const t = setup()
    expect(await t.run("--dry-run", "skill", "install", "--for", "all")).toEqual(previewOf("skill install"))
    expect(existsSync(t.env.HOME as string)).toBe(false)
  })

  it("upgrade previews and runs no installer", async () => {
    const t = setup()
    expect(await t.run("--dry-run", "upgrade")).toEqual(previewOf("upgrade"))
    expect(t.spawn).not.toHaveBeenCalled()
  })

  it("models download and images models download preview and download nothing", async () => {
    const t = setup()
    const fetch = vi.spyOn(globalThis, "fetch")
    try {
      expect(await t.run("--dry-run", "models", "download", "e5-small")).toEqual(previewOf("models download"))
      expect(await t.run("--dry-run", "images", "models", "download", "clip-b32")).toEqual(
        previewOf("images models download"),
      )
      expect(fetch).not.toHaveBeenCalled()
    } finally {
      fetch.mockRestore()
    }
    const cache = paths(t.env).cache
    expect(existsSync(cache) ? readdirSync(cache) : []).toEqual([])
  })

  it("config set run for an agent previews and leaves the config file as it was", async () => {
    const t = setup()
    let answer: unknown
    let failure: unknown
    const code = await runProgram(["default", "--dry-run", "config", "set", "max_text_chars", "2000", "--json"], {
      env: t.env,
      tty: false,
      agent: { result: (value: unknown) => (answer = value), failure: (object: unknown) => (failure = object) },
    } as Parameters<typeof runProgram>[1])
    expect(failure).toBeUndefined()
    expect(code).toBe(0)
    expect(answer).toMatchObject({ item: { dry_run: true, action_invoked: false } })
    t.unchanged()
  })
})
