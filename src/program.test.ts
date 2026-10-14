import { readFileSync } from "node:fs"
import { join } from "node:path"
import { captureStreams } from "@wirecat/cli-base"
import { flatten, parseCommandsDocument } from "@wirecat/cli-base/commands"
import { describe, expect, it } from "vitest"
import { createProgram } from "./program.js"
import { describeDriveProgram } from "./registry.js"
import { readState } from "./state.js"
import { commandResult, fixture } from "./testing.js"

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
    ).rejects.toMatchObject({ code: "validation_error", details: { reason: "export.exists" } })
  })
  it("canonicalizes root aliases when selecting folders", async () => {
    const f = fixture([])
    const streams = captureStreams()
    await createProgram({ env: f.env, streams, source: async () => f.source }).parseAsync(
      ["default", "folders", "add", "root", "--json"],
      { from: "user" },
    )
    expect(commandResult(streams.stdout.join("")).added).toBe(true)
  })
  it("exposes shared registry metadata without remote access", async () => {
    const f = fixture()
    const streams = captureStreams()
    await createProgram({ env: f.env, streams }).parseAsync(["default", "commands", "sync", "--json"], { from: "user" })
    expect(JSON.parse(streams.stdout.join("")).commands[0]).toMatchObject({ name: "sync", mutates: true, local: true })
    const root = captureStreams()
    await createProgram({ env: f.env, streams: root }).parseAsync(["default", "commands", "--json"], { from: "user" })
    const contract = JSON.parse(root.stdout.join(""))
    expect(contract.cli).toBe("drive")
    expect(contract.contract).toBe(2)
    expect(contract.commands.find((c: { name: string }) => c.name === "sync").usage).toContain("drive <profile> sync")
    expect(contract.commands.find((c: { name: string }) => c.name === "commands").usage).not.toContain("<profile>")
    expect(contract.global_options.some((option: { flags: string }) => option.flags.includes("--profile"))).toBe(true)
  })
  it("gives every handwritten command a short lower-case summary and examples that name real flags", () => {
    const program = createProgram({ env: {} })
    const global = program.options.flatMap((option) => [option.long, option.short])
    const words = (line: string) => line.match(/'[^']*'|"[^"]*"|\S+/g) ?? []
    for (const command of flatten(describeDriveProgram(program)).filter((one) => one.origin === "handwritten")) {
      const where = command.path.join(" ")
      const summary = command.summary ?? command.description
      expect(summary, where).toMatch(/^[a-z][^\n]*[^.]$/)
      expect(summary.length, where).toBeLessThanOrEqual(80)
      if (command.commands.length) continue
      const examples = (command as { examples?: string[] }).examples ?? []
      expect(examples.length, where).toBeGreaterThanOrEqual(1)
      expect(examples.length, where).toBeLessThanOrEqual(3)
      for (const example of examples) {
        const [cli, ...rest] = words(example)
        expect(cli, example).toBe("drive")
        const args = rest[0] === command.path[0] ? rest : rest.slice(1)
        expect(args.slice(0, command.path.length), example).toEqual(command.path)
        const flags = command.options.flatMap((option) => option.flags.match(/--?[a-z][a-z-]*/g) ?? [])
        for (const flag of args.filter((arg) => arg.startsWith("-") && arg !== "--"))
          expect([...flags, ...global], example).toContain(flag)
      }
    }
  })
  it("prints commands --json in the cli-base document shape, whole and scoped", async () => {
    const f = fixture()
    for (const path of [[], ["files", "copy"]]) {
      const streams = captureStreams()
      await createProgram({ env: f.env, streams }).parseAsync(["commands", ...path, "--json"], { from: "user" })
      const parsed = parseCommandsDocument(JSON.parse(streams.stdout.join("")))
      expect(parsed.problems).toBeUndefined()
      expect(parsed.document?.scope).toEqual(path.length ? path : undefined)
    }
  })
  it("syncs, lists and searches using injected shared ports and closes the index", async () => {
    const f = fixture()
    const streams = captureStreams()
    await createProgram({ env: f.env, streams, source: async () => f.source, index: async () => f.index }).parseAsync(
      ["default", "sync", "--json"],
      { from: "user" },
    )
    expect(commandResult(streams.stdout.join("")).saved).toBe(2)
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
    expect(commandResult(streams.stdout.join("")).remote_checked).toBe(false)
  })
})
