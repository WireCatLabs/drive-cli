import { readFileSync } from "node:fs"
import { join } from "node:path"
import { captureStreams } from "@wirecat/cli-base"
import { flatten, parseCommandsDocument } from "@wirecat/cli-base/commands"
import { describe, expect, it, vi } from "vitest"
import { createProgram } from "./program.js"
import { describeDriveProgram } from "./registry.js"
import { readState, saveState } from "./state.js"
import { commandResult, content, file, fixture } from "./testing.js"

describe("standalone command workflow", () => {
  it("prints the version without a trailing blank line", async () => {
    const streams = captureStreams()
    await createProgram({ env: fixture().env, streams })
      .parseAsync(["--version"], { from: "user" })
      .catch(() => undefined)
    expect(streams.stdout).toEqual([expect.stringMatching(/^\d+\.\d+\.\d+$/)])
  })

  it("keeps only the fields --json names, and refuses one the answer does not have", async () => {
    const streams = captureStreams()
    await createProgram({ env: fixture().env, streams }).parseAsync(["api", "list", "--json=name"], { from: "user" })
    const { items } = JSON.parse(streams.stdout.join(""))
    expect(Object.keys(items[0])).toEqual(["name"])
    await expect(
      createProgram({ env: fixture().env, streams: captureStreams() }).parseAsync(
        ["default", "catalog", "list", "--json=no_such_field", "--offline"],
        { from: "user" },
      ),
    ).rejects.toThrow(/no field no_such_field here/)
  })

  it("streams a list as item lines and an end line under --jsonl", async () => {
    const streams = captureStreams()
    await createProgram({ env: fixture().env, streams }).parseAsync(["api", "list", "--jsonl"], { from: "user" })
    const lines = streams.stdout.map((line) => JSON.parse(line))
    expect(lines[0]).toMatchObject({ type: "item", data: { name: expect.any(String) } })
    expect(lines.at(-1)).toMatchObject({ type: "end", complete: true, page: { mode: "page", has_more: false } })
  })
  it("lists and exports imported snapshots without overwriting existing files", async () => {
    const f = fixture()
    const options = { env: f.env, source: async () => f.source }
    await createProgram({ ...options, streams: captureStreams() }).parseAsync(["default", "sync"], { from: "user" })
    const listed = captureStreams()
    await createProgram({ ...options, streams: listed }).parseAsync(["default", "documents", "list", "--json"], {
      from: "user",
    })
    expect(JSON.parse(listed.stdout.join("")).items).toHaveLength(2)
    const target = join(f.directory, "export.md")
    await createProgram({ ...options, streams: captureStreams() }).parseAsync(
      ["default", "documents", "export", "doc-a", "--output", target],
      { from: "user" },
    )
    expect(readFileSync(target, "utf8")).toContain("budget decision")
    await expect(
      createProgram({ ...options, streams: captureStreams() }).parseAsync(
        ["default", "documents", "export", "doc-a", "--output", target],
        { from: "user" },
      ),
    ).rejects.toMatchObject({ code: "validation_error", details: { reason: "export.exists" } })
  })
  it("dates a local copy and warns only when it is older than a day", async () => {
    const f = fixture()
    const options = { env: f.env, source: async () => f.source }
    await createProgram({ ...options, streams: captureStreams() }).parseAsync(["default", "sync"], { from: "user" })
    const show = async () => {
      const streams = captureStreams()
      await createProgram({ ...options, streams }).parseAsync(["default", "documents", "show", "doc-a", "--json"], {
        from: "user",
      })
      return JSON.parse(streams.stdout.join(""))
    }
    const fresh = await show()
    expect(fresh.item).toMatchObject({ synced_at: expect.any(String), age_days: 0 })
    expect(fresh.meta.complete).toBe(true)
    expect(fresh.missing).toBeUndefined()
    expect(fresh.next).toBeUndefined()

    const state = readState(f.env, "default", "synthetic-principal")
    saveState(f.env, "default", { ...state, lastSync: new Date(Date.now() - 2 * 86_400_000).toISOString() })
    const stale = await show()
    expect(stale.item.age_days).toBe(2)
    expect(stale.meta.complete).toBe(false)
    expect(stale.missing).toEqual([expect.objectContaining({ field: "synced_at", step: "sync.run" })])
    expect(stale.next).toEqual([expect.objectContaining({ step: "sync.run", command: "sync" })])

    const target = join(f.directory, "stale.md")
    const exported = captureStreams()
    await createProgram({ ...options, streams: exported }).parseAsync(
      ["default", "documents", "export", "doc-a", "--output", target, "--json"],
      { from: "user" },
    )
    expect(JSON.parse(exported.stdout.join(""))).toMatchObject({ item: { age_days: 2 }, meta: { complete: false } })
    const listed = captureStreams()
    await createProgram({ ...options, streams: listed }).parseAsync(["default", "documents", "list", "--json"], {
      from: "user",
    })
    expect(JSON.parse(listed.stdout.join(""))).toMatchObject({
      items: [{ age_days: 2 }, { age_days: 2 }],
      meta: { complete: false },
      missing: [{ field: "synced_at" }],
    })
  })
  it("asks Google once whether a stored document changed, and says what to run when it did", async () => {
    const f = fixture()
    const stored = "2026-10-01T10:00:00.000Z"
    f.source.content = async (id) => content({ ...file(id), modifiedAt: stored })
    const sourceOptions = { env: f.env, source: async () => f.source }
    await createProgram({ ...sourceOptions, streams: captureStreams() }).parseAsync(["default", "sync"], {
      from: "user",
    })
    const check = async (modifiedTime: string, ...flags: string[]) => {
      const call = vi.fn(async () => ({ modifiedTime }))
      const streams = captureStreams()
      await createProgram({ env: f.env, api: { call }, streams }).parseAsync(
        ["default", ...flags, "documents", "check", "doc-a", "--json"],
        { from: "user" },
      )
      return { call, body: JSON.parse(streams.stdout.join("")) }
    }
    const same = await check(stored)
    expect(same.call).toHaveBeenCalledExactlyOnceWith(
      "drive.files.get",
      { fileId: "doc-a", fields: "modifiedTime", supportsAllDrives: true },
      undefined,
    )
    expect(same.body.item).toEqual({
      id: "doc-a",
      changed: false,
      remote_modified_at: stored,
      local_modified_at: stored,
    })
    expect(same.body.meta.complete).toBe(true)
    expect(same.body.missing).toBeUndefined()

    const edited = await check("2026-10-02T09:30:00.000Z")
    expect(edited.body.item).toMatchObject({ changed: true, local_modified_at: stored })
    expect(edited.body.meta.complete).toBe(false)
    expect(edited.body.missing).toEqual([expect.objectContaining({ field: "modified_at", step: "sync.run" })])
    expect(edited.body.next).toEqual([expect.objectContaining({ step: "sync.run", command: "sync" })])

    const sameInstant = await check("2026-10-01T12:00:00+02:00")
    expect(sameInstant.body.item.changed).toBe(false)
  })
  it("refuses documents check offline and for a document that is not imported", async () => {
    const f = fixture()
    const call = vi.fn(async () => ({ modifiedTime: "2026-10-01T10:00:00.000Z" }))
    const run = (...words: string[]) =>
      createProgram({ env: f.env, api: { call }, streams: captureStreams() }).parseAsync(["default", ...words], {
        from: "user",
      })
    await expect(run("documents", "check", "never-imported")).rejects.toMatchObject({
      code: "not_found",
      details: { reason: "document.not-imported" },
    })
    await expect(run("--offline", "documents", "check", "doc-a")).rejects.toMatchObject({
      details: { reason: "offline.refused" },
    })
    expect(call).not.toHaveBeenCalled()
  })
  it("canonicalizes root aliases when selecting folders", async () => {
    const f = fixture([])
    const streams = captureStreams()
    await createProgram({ env: f.env, streams, source: async () => f.source }).parseAsync(
      ["default", "folders", "add", "root", "--json"],
      { from: "user" },
    )
    expect(commandResult(streams.stdout.join("")).added).toBe(true)
    await createProgram({ env: f.env, streams: captureStreams() }).parseAsync(
      ["default", "folders", "remove", "root"],
      {
        from: "user",
      },
    )
    const listed = captureStreams()
    await createProgram({ env: f.env, streams: listed }).parseAsync(["default", "folders", "list", "--json"], {
      from: "user",
    })
    expect(commandResult(listed.stdout.join("")).items).toEqual([])
  })
  it("exposes shared registry metadata without remote access", async () => {
    const f = fixture()
    const streams = captureStreams()
    await createProgram({ env: f.env, streams }).parseAsync(["default", "commands", "sync", "--json"], { from: "user" })
    expect(JSON.parse(streams.stdout.join("")).commands[0]).toMatchObject({
      name: "sync",
      effects: { remote: "read", local: "write" },
    })
    const root = captureStreams()
    await createProgram({ env: f.env, streams: root }).parseAsync(["default", "commands", "--json"], { from: "user" })
    const contract = JSON.parse(root.stdout.join(""))
    expect(contract.cli).toBe("drive")
    expect(contract.contract).toBe(4)
    expect(contract.commands.find((c: { name: string }) => c.name === "sync").usage).toContain("drive <profile> sync")
    expect(contract.commands.find((c: { name: string }) => c.name === "commands").usage).not.toContain("<profile>")
    expect(contract.global_options.some((option: { flags: string }) => option.flags.includes("--profile"))).toBe(false)
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
  it("says nothing is imported when a search comes back empty before the first sync", async () => {
    const f = fixture()
    const search = async () => {
      const streams = captureStreams()
      await createProgram({ env: f.env, streams, index: async () => f.index }).parseAsync(
        ["default", "search", "budget", "--json"],
        { from: "user" },
      )
      return commandResult(streams.stdout.join(""))
    }
    expect((await search()).not_imported).toBe("profile default has imported no documents yet — drive default sync")
    await createProgram({
      env: f.env,
      streams: captureStreams(),
      source: async () => f.source,
      index: async () => f.index,
    }).parseAsync(["default", "sync", "--json"], { from: "user" })
    expect((await search()).not_imported).toBeUndefined()
  })
  it("omits skipped file names and provider metadata from status", async () => {
    const f = fixture()
    saveState(f.env, "default", {
      version: 1,
      principal: "synthetic-principal",
      scope: "",
      folders: {},
      documents: {},
      skipped: [
        {
          id: "skipped-doc",
          reason: "unsupported",
          file: { ...file("skipped-doc"), name: "SECRET-NAME", providerMetadata: { name: "SECRET-NAME" } },
        },
      ],
    })
    const streams = captureStreams()
    await createProgram({ env: f.env, streams }).parseAsync(["default", "status", "--json"], { from: "user" })
    expect(streams.stdout.join("")).not.toContain("SECRET-NAME")
    expect(commandResult(streams.stdout.join("")).skipped).toEqual([{ id: "skipped-doc", reason: "unsupported" }])
    expect(readState(f.env, "default", "synthetic-principal").skipped[0]?.file?.name).toBe("SECRET-NAME")
  })
  it("shows local status without calling Google or opening an index", async () => {
    const f = fixture()
    const streams = captureStreams()
    await createProgram({ env: f.env, streams }).parseAsync(["default", "status", "--json"], { from: "user" })
    expect(commandResult(streams.stdout.join("")).remote_checked).toBe(false)
  })
})
