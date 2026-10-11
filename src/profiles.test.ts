import { writeFileSync } from "node:fs"
import { join } from "node:path"
import { captureStreams } from "@wirecat/cli-base"
import { describe, expect, it, vi } from "vitest"
import { readConfig, writeConfig } from "./config.js"
import { createProgram } from "./program.js"
import { fixture } from "./testing.js"

describe("explicit account selection", () => {
  it("refuses omitted profiles despite legacy defaults or environment, before providers and stores", async () => {
    const f = fixture()
    const config = readConfig(f.env)
    config.defaultProfile = "default"
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
      ["session", "list"],
      ["session", "start"],
      ["config", "show"],
      ["files", "get", "doc-a"],
      ["api", "drive-files-get", "--file-id", "doc-a"],
    ]) {
      await expect(
        createProgram({
          env: { ...f.env, DRIVE_PROFILE: "work" },
          source,
          index,
          api: { call: request },
          streams: captureStreams(),
        }).parseAsync(args, { from: "user" }),
      ).rejects.toMatchObject({ code: "validation_error", details: { profiles: ["default", "work"] } })
    }
    expect(source).not.toHaveBeenCalled()
    expect(index).not.toHaveBeenCalled()
    expect(request).not.toHaveBeenCalled()
  })
  it("uses only the named profile, supports MAX names and rejects ambiguous selectors", async () => {
    const f = fixture()
    const config = readConfig(f.env)
    config.profiles["Personal.Account_2"] = {
      ...{ principal: "synthetic-principal", roots: ["root"], storage: "keyring" as const },
      roots: ["personal-root"],
    }
    writeConfig(f.env, config)
    for (const args of [
      ["Personal.Account_2", "folders", "list"],
      ["--profile", "Personal.Account_2", "folders", "list"],
    ]) {
      const streams = captureStreams()
      await createProgram({ env: f.env, streams }).parseAsync(args, { from: "user" })
      expect(JSON.parse(streams.stdout.join(""))).toEqual({ items: [{ id: "personal-root" }] })
    }
    for (const args of [
      ["default", "--profile", "other", "status"],
      ["--profile", "default", "--profile=other", "status"],
    ])
      await expect(
        createProgram({ env: f.env, streams: captureStreams() }).parseAsync(args, { from: "user" }),
      ).rejects.toThrow("select a profile once")
    await expect(
      createProgram({ env: f.env, streams: captureStreams() }).parseAsync(["../escape", "status"], { from: "user" }),
    ).rejects.toThrow("profile name")
  })
  it("keeps discovery and help available without reading invalid account configuration", async () => {
    const f = fixture()
    writeFileSync(join(f.env.DRIVE_CONFIG_DIR as string, "config.json"), "invalid JSON")
    for (const args of [
      ["commands", "--json"],
      ["schema", "drive.files.get"],
      ["api", "methods"],
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
})
