import { readFileSync } from "node:fs"
import { join } from "node:path"
import { captureStreams } from "@wirecat/cli-base"
import { describe, expect, it } from "vitest"
import { createProgram } from "./program.js"
import { readState } from "./state.js"
import { fixture } from "./testing.js"

describe("standalone command workflow", () => {
  it("lists and exports imported snapshots without overwriting existing files", async () => {
    const f = fixture()
    const options = { env: f.env, source: async () => f.source, index: async () => f.index }
    await createProgram({ ...options, streams: captureStreams() }).parseAsync(["default", "sync"], { from: "user" })
    const listed = captureStreams()
    await createProgram({ ...options, streams: listed }).parseAsync(["default", "documents", "list", "--json"], {
      from: "user",
    })
    expect(JSON.parse(listed.stdout.join("")).items).toHaveLength(2)
    const target = join(f.directory, "export.md")
    await createProgram({ ...options, streams: captureStreams() }).parseAsync(
      ["default", "documents", "export", "doc-a", "--out", target],
      { from: "user" },
    )
    expect(readFileSync(target, "utf8")).toContain("budget decision")
    await expect(
      createProgram({ ...options, streams: captureStreams() }).parseAsync(
        ["default", "documents", "export", "doc-a", "--out", target],
        { from: "user" },
      ),
    ).rejects.toThrow()
  })
  it("canonicalizes root aliases when selecting folders", async () => {
    const f = fixture([])
    const streams = captureStreams()
    await createProgram({ env: f.env, streams, source: async () => f.source }).parseAsync(
      ["default", "folders", "add", "root", "--json"],
      { from: "user" },
    )
    expect(JSON.parse(streams.stdout.join("")).added).toBe(true)
  })
  it("exposes shared registry metadata without remote access", async () => {
    const f = fixture()
    const streams = captureStreams()
    await createProgram({ env: f.env, streams }).parseAsync(["default", "commands", "sync", "--json"], { from: "user" })
    expect(JSON.parse(streams.stdout.join("")).items[0]).toMatchObject({ name: "sync", mutates: true, local: true })
    const root = captureStreams()
    await createProgram({ env: f.env, streams: root }).parseAsync(["default", "commands", "--json"], { from: "user" })
    const contract = JSON.parse(root.stdout.join(""))
    expect(contract.cli).toBe("drive")
    expect(contract.commands).toEqual(contract.items)
    expect(contract.commands.find((c: { name: string }) => c.name === "sync").usage).toContain("drive <profile> sync")
    expect(contract.commands.find((c: { name: string }) => c.name === "commands").usage).not.toContain("<profile>")
    expect(contract.globalOptions.some((option: { flags: string }) => option.flags.includes("--profile"))).toBe(true)
  })
  it("syncs, lists and searches using injected shared ports and closes the index", async () => {
    const f = fixture()
    const streams = captureStreams()
    await createProgram({ env: f.env, streams, source: async () => f.source, index: async () => f.index }).parseAsync(
      ["default", "sync", "--json"],
      { from: "user" },
    )
    expect(JSON.parse(streams.stdout.join("")).saved).toBe(2)
    expect(f.index.close).toHaveBeenCalledTimes(1)
    expect(Object.keys(readState(f.env, "default", "synthetic-principal").documents)).toHaveLength(2)
    const searched = captureStreams()
    await createProgram({ env: f.env, streams: searched, index: async () => f.index }).parseAsync(
      ["default", "search", "budget", "--exact", "--json"],
      { from: "user" },
    )
    expect(f.index.search).toHaveBeenCalledWith("synthetic-principal", "budget", { limit: 20, offset: 0, exact: true })
  })
  it("shows local status without calling Google or opening an index", async () => {
    const f = fixture()
    const streams = captureStreams()
    await createProgram({ env: f.env, streams }).parseAsync(["default", "status", "--json"], { from: "user" })
    expect(JSON.parse(streams.stdout.join("")).remoteChecked).toBe(false)
  })
})
