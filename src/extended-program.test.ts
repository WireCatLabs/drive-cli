import { captureStreams } from "@wirecat/cli-base"
import { afterEach, describe, expect, it, vi } from "vitest"
import { readConfig } from "./config.js"
import { createProgram } from "./program.js"
import { commandResult, content, file, fixture } from "./testing.js"

describe("document knowledge commands", () => {
  it("runs notes, tags, links, memories and extraction through the released shared store", async () => {
    const f = fixture()
    f.source.content = async (id) => ({
      ...content({ ...file(id), owners: [{ id: "google-owner", name: "Sample" }] }),
      tabs: [{ id: "tab-one", title: "Budget", text: "budget decision" }],
    })
    const complete = vi.fn(async () => ({
      text: JSON.stringify({
        items: [
          { kind: "fact", body: "Budget fact", quote: "budget decision" },
          { kind: "summary", body: "Budget summary", quote: "budget decision" },
        ],
      }),
      tokens: 20,
      provider: "openai",
      model: "fixture-model",
    }))
    const call = async (...args: string[]) => {
      const streams = captureStreams()
      await createProgram({ env: f.env, streams, source: async () => f.source, complete }).parseAsync(
        ["default", ...args, "--json"],
        { from: "user" },
      )
      return commandResult(streams.stdout.join(""))
    }
    await call("sync")
    expect((await call("tags", "add", "doc-a", "budget")).tags).toEqual(["budget"])
    expect((await call("tags", "list", "doc-a")).tags).toEqual(["budget"])
    expect((await call("documents", "list", "tag:Budget")).items).toHaveLength(1)
    expect((await call("documents", "list", "tag:missing")).items).toHaveLength(0)
    await call("tags", "remove", "doc-a", "budget")
    const note = await call("notes", "add", "doc-a", "Review memo", "--title", "Review")
    expect((await call("notes", "list", "doc-a", "text:memo")).items).toHaveLength(1)
    await expect(call("notes", "list", "doc-a", "--search", "memo")).rejects.toThrow(/unknown option/)
    expect((await call("notes", "show", "doc-a", note.ref)).text).toBe("Review memo")
    const edited = await call("notes", "edit", "doc-a", note.ref, "Reviewed memo", "--revision", String(note.revision))
    expect(edited.text).toBe("Reviewed memo")
    const link = await call(
      "relationships",
      "add",
      "doc-a",
      note.ref,
      "--kind",
      "related-to",
      "--role",
      "review",
      "--reason",
      "cited",
    )
    expect(
      (await call("relationships", "list", "doc-a")).items.some((item: { id: string }) => item.id === link.id),
    ).toBe(true)
    expect(link.evidence).toBe("cited")
    await call("relationships", "remove", "doc-a", link.id)
    const memory = await call("memories", "add", "doc-a", "Budget decision", "--scope", "work", "--kind", "summary")
    expect((await call("memories", "list", "doc-a", "scope:work")).items).toHaveLength(1)
    expect((await call("memories", "show", "doc-a", memory.ref)).status).toBe("proposed")
    expect((await call("memories", "confirm", "doc-a", memory.ref)).status).toBe("confirmed")
    expect((await call("memories", "search", "doc-a", "budget", "scope:work")).items).toHaveLength(1)
    expect((await call("memories", "stale", "doc-a", memory.ref)).status).toBe("stale")
    const preview = await call("memories", "extract", "doc-a", "--scope", "work", "--tab", "tab-one")
    expect(preview.saved).toEqual([])
    const saved = await call("memories", "extract", "doc-a", "--scope", "work", "--yes")
    expect(saved.saved[0]).toMatchObject({ kind: "fact", model: "fixture-model", status: "proposed" })
    expect(saved.saved[0].text).toContain("Source quote: budget decision")
    expect(saved.saved[1]).toMatchObject({ kind: "summary", model: "fixture-model", status: "proposed" })
    const context = await call("documents", "context", "doc-a")
    expect([context.memories.length, context.facts.length]).toEqual([2, 1])
    const decision = await call("facts", "add", "doc-a", "Budget approved", "--type", "decision", "--scope", "work")
    expect(decision).toMatchObject({ kind: "decision", status: "accepted" })
    expect((await call("facts", "list", "doc-a", "status:proposed")).items).toHaveLength(1)
    expect((await call("facts", "confirm", "doc-a", saved.saved[0].ref)).status).toBe("accepted")
    expect((await call("facts", "show", "doc-a", decision.ref)).text).toBe("Budget approved")
    const replacement = await call(
      "facts",
      "add",
      "doc-a",
      "Budget deferred",
      "--type",
      "decision",
      "--supersedes",
      decision.ref,
      "--occurred-time",
      "2026-05-01T12:00:00Z",
    )
    expect(replacement).toMatchObject({
      supersedes: decision.ref,
      status: "accepted",
      occurred_at: "2026-05-01T12:00:00.000Z",
    })
    expect((await call("facts", "show", "doc-a", decision.ref)).status).toBe("superseded")
    expect((await call("--dry-run", "facts", "reverse", "doc-a", replacement.ref)).effects).toEqual({
      remote: "none",
      local: "write",
    })
    await expect(call("--read-only", "facts", "reverse", "doc-a", replacement.ref)).rejects.toThrow()
    expect((await call("facts", "show", "doc-a", replacement.ref)).status).toBe("accepted")
    expect((await call("--offline", "facts", "reverse", "doc-a", replacement.ref)).status).toBe("reversed")
    const people = await call("identities", "list", "doc-a")
    expect(people.items[0].google_id).toBe("google-owner")
    expect((await call("documents", "list", `person:"${people.items[0].person.ref}"`)).items).toHaveLength(2)
    expect((await call("documents", "list", `person:${people.items[0].person.uid}`)).items).toHaveLength(2)
    expect((await call("documents", "list", "person:missing")).items).toHaveLength(0)
    expect((await call("identities", "link", "doc-a", "google-owner", people.items[0].person.ref)).uid).toBe(
      people.items[0].person.uid,
    )
    await call("notes", "remove", "doc-a", note.ref)
    await expect(call("memories", "extract", "doc-a", "--scope", "work", "--tab", "missing")).rejects.toThrow("tab")
    await call("models", "set", "--provider", "openai", "--model", "fixture-model")
    expect(readConfig(f.env).defaults?.models?.memories?.model).toBe("fixture-model")
    await expect(
      call("models", "set", "--provider", "openai", "--base-url", "https://user:pass@example.invalid"),
    ).rejects.toThrow("defaults.models.memories.base_url has the wrong type")
  }, 30_000)
  it("lists documents through the store's query, so a page of one still finds the newest tagged document", async () => {
    const f = fixture()
    const call = async (...args: string[]) => {
      const streams = captureStreams()
      await createProgram({ env: f.env, streams, source: async () => f.source }).parseAsync(
        ["default", ...args, ...(args.some((arg) => arg.startsWith("--json")) ? [] : ["--json"])],
        { from: "user" },
      )
      return JSON.parse(streams.stdout.join(""))
    }
    await call("sync")
    await call("tags", "add", "doc-b", "budget")
    const first = await call("documents", "list", "--limit", "1")
    expect(first.items.map((doc: { id: string }) => doc.id)).toEqual(["doc-a"])
    expect(first.page.has_more).toBe(true)
    const tagged = await call("documents", "list", "tag:budget", "--limit", "1")
    expect(tagged.items).toEqual([
      expect.objectContaining({ id: "doc-b", url: expect.any(String), reference: expect.stringMatching(/^document:/) }),
    ])
    expect(tagged.page.has_more).toBe(false)
    const projected = await call("documents", "list", "tag:budget", "--json=id,reference,tabs")
    expect(projected.items).toEqual([{ id: "doc-b", reference: expect.stringMatching(/^document:/), tabs: 0 }])
    await expect(call("documents", "list", "--json=subject")).rejects.toMatchObject({
      details: { reason: "output.unknown-field" },
    })
    await expect(call("documents", "list", "--tag", "budget")).rejects.toThrow(/unknown option '--tag'/)
    await expect(call("documents", "list", "kind:file")).rejects.toThrow(/kind/)
  })
  it("pages and limits the local lists, and takes the global options", async () => {
    const f = fixture()
    const call = async (...args: string[]) => {
      const streams = captureStreams()
      await createProgram({ env: f.env, streams, source: async () => f.source }).parseAsync(
        ["default", ...args, "--json"],
        { from: "user" },
      )
      return commandResult(streams.stdout.join(""))
    }
    await call("sync", "--limit", "10", "--rescan")
    await call("notes", "add", "doc-a", "budget memo")
    await call("notes", "add", "doc-a", "budget plan")
    const memory = await call("memories", "add", "doc-a", "Budget", "--scope", "work")
    await call("memories", "add", "doc-a", "Budget again", "--scope", "work", "--supersedes", memory.ref)
    await call("facts", "add", "doc-a", "Budget approved", "--type", "decision")
    expect((await call("documents", "list", "--limit", "1", "--page", "2")).items).toHaveLength(1)
    expect((await call("notes", "list", "doc-a", "--limit", "1", "--page", "2")).items).toHaveLength(1)
    expect((await call("memories", "list", "doc-a", "--limit", "1")).items).toHaveLength(1)
    expect((await call("facts", "list", "doc-a", "--limit", "1")).items).toHaveLength(1)
    await createProgram({ env: f.env, streams: captureStreams(), index: async () => f.index }).parseAsync(
      ["default", "search", "budget", "--limit", "1", "--page", "2", "--json"],
      { from: "user" },
    )
    expect(f.index.search).toHaveBeenCalledWith(
      "synthetic-principal",
      "budget",
      expect.objectContaining({ limit: 1, offset: 1 }),
    )
    expect((await call("catalog", "search", "budget", "--limit", "1", "--page", "1")).items).toEqual(expect.any(Array))
    await call("models", "set", "--purpose", "memories", "--provider", "openai", "--model", "fixture-model")
    await call("session", "list")
    await call("--quiet", "--debug", "--timeout", "30s", "--permission", "documents=allow", "config", "show")
  })
  it("refuses stale extraction results after the source changes while the model is running", async () => {
    const f = fixture()
    const options = { env: f.env, source: async () => f.source }
    await createProgram({ ...options, streams: captureStreams() }).parseAsync(["default", "sync"], { from: "user" })
    const complete = async () => {
      const { readState, saveState } = await import("./state.js")
      const state = readState(f.env, "default", "synthetic-principal")
      if (state.documents["doc-a"]) state.documents["doc-a"].hash = "changed-hash"
      saveState(f.env, "default", state)
      return { text: JSON.stringify({ items: [] }), tokens: 20, provider: "openai", model: "fixture-model" }
    }
    await expect(
      createProgram({ ...options, complete, streams: captureStreams() }).parseAsync(
        ["default", "--yes", "memories", "extract", "doc-a", "--scope", "work"],
        { from: "user" },
      ),
    ).rejects.toThrow("source changed")
  })
})

describe("fact times", () => {
  const zone = process.env.TZ
  afterEach(() => {
    if (zone === undefined) delete process.env.TZ
    else process.env.TZ = zone
  })

  const occurredAt = async (tz: string, time: string) => {
    process.env.TZ = tz
    const f = fixture()
    const call = async (...args: string[]) => {
      const streams = captureStreams()
      await createProgram({ env: f.env, streams, source: async () => f.source }).parseAsync(
        ["default", ...args, "--json"],
        { from: "user" },
      )
      return commandResult(streams.stdout.join(""))
    }
    await call("sync")
    const fact = await call("facts", "add", "doc-a", "Budget approved", "--occurred-time", time)
    return (await call("facts", "show", "doc-a", fact.ref)).occurred_at
  }

  it("stores the same moment whatever zone the computer is in when the time names one", async () => {
    const time = "2026-10-16T10:00:00+02:00"
    expect(await occurredAt("Asia/Vladivostok", time)).toBe("2026-10-16T08:00:00.000Z")
    expect(await occurredAt("America/Los_Angeles", time)).toBe("2026-10-16T08:00:00.000Z")
  })

  it("reads a time without a zone in the computer's zone", async () => {
    expect(await occurredAt("Asia/Vladivostok", "2026-10-16T10:00")).toBe("2026-10-16T00:00:00.000Z")
    expect(await occurredAt("America/Los_Angeles", "2026-10-16")).toBe("2026-10-16T07:00:00.000Z")
  })
})

describe("remote action commands", () => {
  const cases: [string[], string, object, object?][] = [
    [["files", "get", "doc-a"], "drive.files.get", { fileId: "doc-a" }],
    [
      ["files", "list", "--parent", "root", "--cursor", "next"],
      "drive.files.list",
      { pageToken: "next", q: "'root' in parents and (trashed = false)" },
    ],
    [
      ["files", "copy", "doc-a", "--name", "Copy", "--parent", "root"],
      "drive.files.copy",
      { fileId: "doc-a" },
      { name: "Copy", parents: ["root"] },
    ],
    [
      ["files", "move", "doc-a", "--parent", "root", "--old-parent", "old"],
      "drive.files.update",
      { addParents: "root", removeParents: "old" },
      {},
    ],
    [
      ["files", "update", "doc-a", "--body", '{"name":"Renamed"}'],
      "drive.files.update",
      { fileId: "doc-a" },
      { name: "Renamed" },
    ],
    [["files", "trash", "doc-a"], "drive.files.update", { fileId: "doc-a" }, { trashed: true }],
    [["files", "restore", "doc-a"], "drive.files.update", { fileId: "doc-a" }, { trashed: false }],
    [["files", "mkdir", "Folder", "--parent", "root"], "drive.files.create", {}, { name: "Folder", parents: ["root"] }],
    [["documents", "get", "doc-a"], "docs.documents.get", { includeTabsContent: true }],
    [["documents", "create", "--title", "Document"], "docs.documents.create", {}, { title: "Document" }],
    [
      ["documents", "update", "doc-a", "--body", '{"requests":[]}'],
      "docs.documents.batchUpdate",
      { documentId: "doc-a" },
      { requests: [] },
    ],
    [
      ["documents", "history", "doc-a", "--cursor", "next"],
      "drive.revisions.list",
      { fileId: "doc-a", pageToken: "next" },
    ],
    [
      ["documents", "history", "doc-a", "--activity", "--cursor", "next"],
      "driveactivity.activity.query",
      {},
      { itemName: "items/doc-a", pageToken: "next" },
    ],
    [["comments", "list", "doc-a"], "drive.comments.list", { fileId: "doc-a" }],
    [["comments", "get", "doc-a", "comment-one"], "drive.comments.get", { commentId: "comment-one" }],
    [["permissions", "list", "doc-a"], "drive.permissions.list", { supportsAllDrives: true }],
    [["permissions", "get", "doc-a", "permission-one"], "drive.permissions.get", { permissionId: "permission-one" }],
    [["revisions", "list", "doc-a"], "drive.revisions.list", { fileId: "doc-a" }],
    [["revisions", "get", "doc-a", "revision-one"], "drive.revisions.get", { revisionId: "revision-one" }],
    [["shared-drives", "--cursor", "next"], "drive.drives.list", { pageToken: "next" }],
    [["shared-drives", "--limit", "5"], "drive.drives.list", { pageSize: 5 }],
    [
      ["comments", "list", "doc-a", "--limit", "5", "--cursor", "next"],
      "drive.comments.list",
      { pageSize: 5, pageToken: "next" },
    ],
    [
      ["permissions", "list", "doc-a", "--limit", "5", "--cursor", "next"],
      "drive.permissions.list",
      { pageSize: 5, pageToken: "next" },
    ],
    [["documents", "history", "doc-a", "--limit", "5"], "drive.revisions.list", { fileId: "doc-a", pageSize: 5 }],
    [
      ["revisions", "list", "doc-a", "--limit", "5", "--cursor", "next"],
      "drive.revisions.list",
      { pageSize: 5, pageToken: "next" },
    ],
  ]
  it.each(cases)("maps %j to a bounded official API request", async (args, method, params, body) => {
    const f = fixture()
    const call = vi.fn(async () => ({ synthetic: true }))
    const streams = captureStreams()
    await createProgram({ env: f.env, streams, api: { call } }).parseAsync(["default", ...args, "--json"], {
      from: "user",
    })
    expect(call).toHaveBeenCalledWith(
      method,
      expect.objectContaining(params),
      body ? expect.objectContaining(body) : undefined,
    )
  })
  it("requires explicit generic writes/deletions and protects transport parameters before any request", async () => {
    const f = fixture()
    const request = vi.fn(async () => ({}))
    const call = (...args: string[]) =>
      createProgram({ env: f.env, streams: captureStreams(), api: { call: request } }).parseAsync(
        ["default", ...args],
        {
          from: "user",
        },
      )
    await call("api", "list", "service:docs")
    await expect(call("api", "call", "drive.files.delete", "--params", '{"fileId":"doc-a"}')).rejects.toThrow(
      "allow-write",
    )
    await expect(call("api", "call", "drive.files.delete", "--allow-writes")).rejects.toThrow("allow-delete")
    await expect(call("api", "call", "drive.files.get", "--params", '{"auth":"override"}')).rejects.toThrow("override")
    expect(request).not.toHaveBeenCalled()
    await call(
      "api",
      "call",
      "drive.files.delete",
      "--allow-writes",
      "--allow-delete",
      "--params",
      '{"fileId":"doc-a"}',
    )
    await call(
      "api",
      "call",
      "docs.documents.batchUpdate",
      "--allow-writes",
      "--params",
      '{"documentId":"doc-a"}',
      "--body",
      '{"requests":[]}',
    )
    expect(request).toHaveBeenCalledTimes(2)
  })
  it("exposes local and remote write metadata accurately", async () => {
    const f = fixture()
    for (const [path, effects] of [
      [["tags", "add"], { remote: "none", local: "write" }],
      [["documents", "update"], { remote: "write", local: "none" }],
      [["memories", "extract"], { remote: "write", local: "write" }],
    ] as const) {
      const streams = captureStreams()
      await createProgram({ env: f.env, streams }).parseAsync(["default", "commands", ...path, "--json"], {
        from: "user",
      })
      expect(JSON.parse(streams.stdout.join("")).commands[0]).toMatchObject({ effects })
    }
  })
})
