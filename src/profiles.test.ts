import { writeFileSync } from "node:fs"
import { join } from "node:path"
import { captureStreams } from "@wirecat/cli-base"
import { describe, expect, it, vi } from "vitest"
import { readConfig, writeConfig } from "./config.js"
import { createProgram } from "./program.js"
import { commandResult, fixture } from "./testing.js"

describe("explicit account selection", () => {
  it("refuses omitted profiles despite a legacy default, before providers and stores", async () => {
    const f = fixture()
    const config = readConfig(f.env)
    config.default_profile = "default"
    config.profiles.work = {
      ...{ principal: "synthetic-principal", roots: ["root"], storage: "keyring" as const },
      principal: "other-account",
    }
    writeConfig(f.env, config)
    const source = vi.fn(async () => f.source)
    const index = vi.fn(async () => f.index)
    const request = vi.fn(async () => ({}))
    for (const args of [
      ["status"],
      ["sync"],
      ["search", "budget"],
      ["session", "start"],
      ["files", "get", "doc-a"],
      ["api", "drive-files-get", "--file-id", "doc-a"],
    ]) {
      await expect(
        createProgram({
          env: f.env,
          source,
          index,
          api: { call: request },
          streams: captureStreams(),
        }).parseAsync(args, { from: "user" }),
      ).rejects.toMatchObject({
        code: "validation_error",
        message: expect.stringContaining("default_profile default in the config is not used"),
        details: { profiles: ["default", "work"] },
      })
    }
    expect(source).not.toHaveBeenCalled()
    expect(index).not.toHaveBeenCalled()
    expect(request).not.toHaveBeenCalled()
  })
  it("uses only the named profile, supports MAX names and has no --profile option", async () => {
    const f = fixture()
    const config = readConfig(f.env)
    config.profiles["Personal.Account_2"] = {
      ...{ principal: "synthetic-principal", roots: ["root"], storage: "keyring" as const },
      roots: ["personal-root"],
    }
    writeConfig(f.env, config)
    for (const [args, env] of [
      [["Personal.Account_2", "folders", "list"], f.env],
      [["folders", "list"], { ...f.env, DRIVE_PROFILE: "Personal.Account_2" }],
    ] as const) {
      const streams = captureStreams()
      await createProgram({ env, streams }).parseAsync([...args], { from: "user" })
      expect(commandResult(streams.stdout.join("")).items).toEqual([{ id: "personal-root" }])
    }
    for (const args of [
      ["--profile", "default", "status"],
      ["default", "--profile=other", "status"],
    ])
      await expect(
        createProgram({ env: f.env, streams: captureStreams() }).parseAsync(args, { from: "user" }),
      ).rejects.toThrow("there is no --profile")
    await expect(
      createProgram({ env: f.env, streams: captureStreams() }).parseAsync(["../escape", "status"], { from: "user" }),
    ).rejects.toThrow("profile name")
  })
  it("pins the process to DRIVE_PROFILE_LOCK and refuses any other profile", async () => {
    const f = fixture()
    const config = readConfig(f.env)
    config.profiles.agent = { principal: "synthetic-principal", roots: ["agent-root"], storage: "keyring" }
    writeConfig(f.env, config)
    const env = { ...f.env, DRIVE_PROFILE_LOCK: "agent" }
    const run = (args: string[], extra: NodeJS.ProcessEnv = {}) => {
      const streams = captureStreams()
      return createProgram({ env: { ...env, ...extra }, streams })
        .parseAsync(args, { from: "user" })
        .then(() => commandResult(streams.stdout.join("")))
    }
    await expect(run(["default", "folders", "list"])).rejects.toMatchObject({
      code: "permission_error",
      details: { reason: "profile.lock-refused" },
    })
    await expect(run(["folders", "list"], { DRIVE_PROFILE: "default" })).rejects.toMatchObject({
      code: "permission_error",
    })
    expect((await run(["folders", "list"])).items).toEqual([{ id: "agent-root" }])
    expect((await run(["agent", "folders", "list"])).items).toEqual([{ id: "agent-root" }])
  })
  it("lists the profiles for one that does not exist, and reads all profiles without one", async () => {
    const f = fixture()
    await expect(
      createProgram({ env: f.env, streams: captureStreams() }).parseAsync(["nosuch", "folders", "list"], {
        from: "user",
      }),
    ).rejects.toMatchObject({ code: "validation_error", details: { reason: "profile.unknown", profiles: ["default"] } })
    for (const args of [
      ["session", "list"],
      ["config", "show"],
    ]) {
      const streams = captureStreams()
      await createProgram({ env: f.env, streams }).parseAsync(args, { from: "user" })
      expect(streams.stdout.join("")).toContain("default")
    }
  })
  it("keeps discovery and help available without reading invalid account configuration", async () => {
    const f = fixture()
    writeFileSync(join(f.env.DRIVE_CONFIG_DIR as string, "config.json"), "invalid JSON")
    for (const args of [
      ["commands", "--json"],
      ["api", "show", "drive.files.get"],
      ["api", "list"],
    ])
      await createProgram({ env: f.env, streams: captureStreams() }).parseAsync(args, { from: "user" })
    const help = captureStreams()
    await expect(
      createProgram({ env: f.env, streams: help }).parseAsync(["session", "start", "--help"], {
        from: "user",
      }),
    ).rejects.toMatchObject({ exitCode: 0 })
    expect(help.stdout.join("")).toContain("drive <profile> session start")
  })
  it("refuses a sign-in grant it does not know before opening a browser", async () => {
    const f = fixture()
    const openBrowser = vi.fn(async () => {})
    await expect(
      createProgram({ env: f.env, openBrowser, streams: captureStreams() }).parseAsync(
        ["default", "session", "start", "--grant", "write,email"],
        { from: "user" },
      ),
    ).rejects.toMatchObject({ code: "validation_error" })
    expect(openBrowser).not.toHaveBeenCalled()
  })
})
