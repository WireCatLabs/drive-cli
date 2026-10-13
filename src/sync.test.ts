import { createHash } from "node:crypto"
import { readFileSync } from "node:fs"
import { CliError } from "@wirecat/cli-base"
import lockfile from "proper-lockfile"
import { describe, expect, it, vi } from "vitest"
import { readConfig, writeConfig } from "./config.js"
import { FOLDER, SHEET } from "./model.js"
import { profileDir, readState, saveState, snapshotPath } from "./state.js"
import { sync } from "./sync.js"
import { content, file, fixture } from "./testing.js"

describe("durable source sync", () => {
  it("cleans a possibly indexed pending source when scope changes before recovery", async () => {
    const f = fixture()
    vi.mocked(f.index.save).mockImplementation(async (_principal, doc) => {
      f.stored.set(doc.metadata.id, doc)
      throw new Error("interrupted after index save")
    })
    expect((await sync(f.source, f.index, f.env, "default", 1)).pending).toBe(2)
    const config = readConfig(f.env)
    const profile = config.profiles.default
    if (!profile) throw new Error("fixture profile missing")
    profile.roots = []
    writeConfig(f.env, config)
    await sync(undefined, f.index, f.env, "default", 200)
    expect(f.stored.size).toBe(0)
  })
  it("retains explicit skipped coverage across polls without new changes", async () => {
    const f = fixture()
    vi.mocked(f.source.children).mockResolvedValue([file("unsupported", ["root"], "image/png")])
    await sync(f.source, f.index, f.env, "default", 200)
    await sync(f.source, f.index, f.env, "default", 200)
    expect(readState(f.env, "default", "synthetic-principal").skipped[0]?.id).toBe("unsupported")
  })
  it("does not block later batches on a source that is confirmed unavailable", async () => {
    const f = fixture()
    vi.mocked(f.source.content).mockRejectedValue(new CliError("not_found", "source unavailable"))
    const result = await sync(f.source, f.index, f.env, "default", 200)
    expect(result.pending).toBe(0)
    expect(result.skipped).toHaveLength(2)
    expect(readState(f.env, "default", "synthetic-principal").cursor).toBe("before-crawl")
  })
  it("evicts descendants if a selected root loses access without file events", async () => {
    const f = fixture()
    await sync(f.source, f.index, f.env, "default", 200)
    vi.mocked(f.source.metadata).mockRejectedValue(new CliError("not_found", "root unavailable"))
    expect((await sync(f.source, f.index, f.env, "default", 200)).removed).toBe(2)
    expect(f.stored.size).toBe(0)
  })
  it("reports cancellation without misclassifying it as lock contention", async () => {
    const f = fixture()
    const controller = new AbortController()
    controller.abort()
    await expect(sync(f.source, f.index, f.env, "default", 200, controller.signal)).rejects.toMatchObject({
      code: "cancelled",
    })
  })
  it("says to choose smaller folders when the chosen ones hold more entries than one sync reads", async () => {
    const f = fixture()
    vi.mocked(f.source.children).mockResolvedValue(
      Array.from({ length: 10_001 }, (_, at) => file(`doc-${at}`, ["root"], "image/png")),
    )
    await expect(sync(f.source, f.index, f.env, "default", 200)).rejects.toThrow(/folders remove/)
  })
  it("handles overlapping selected roots without mistaking them for a cycle", async () => {
    const f = fixture(["nested", "root"])
    vi.mocked(f.source.metadata).mockImplementation(async (id) => file(id, id === "nested" ? ["root"] : [], FOLDER))
    vi.mocked(f.source.children).mockImplementation(async (id) =>
      id === "root" ? [file("nested", ["root"], FOLDER)] : [file("doc-a", ["nested"])],
    )
    vi.mocked(f.source.content).mockResolvedValue(content(file("doc-a", ["nested"])))
    expect((await sync(f.source, f.index, f.env, "default", 200)).saved).toBe(1)
  })
  it("rescans from a new token when explicitly requested", async () => {
    const f = fixture()
    await sync(f.source, f.index, f.env, "default", 200)
    await sync(f.source, f.index, f.env, "default", 200, undefined, true)
    expect(f.source.startToken).toHaveBeenCalledTimes(2)
    expect(f.source.changes).not.toHaveBeenCalled()
  })
  it("keeps duplicate names distinct and captures the token before crawling", async () => {
    const f = fixture()
    const result = await sync(f.source, f.index, f.env, "default", 200)
    expect(result.saved).toBe(2)
    expect([...f.stored.keys()]).toEqual(["doc-a", "doc-b"])
    const start = vi.mocked(f.source.startToken).mock.invocationCallOrder[0] as number
    expect(start).toBeLessThan(vi.mocked(f.source.children).mock.invocationCallOrder[0] as number)
    expect(readState(f.env, "default", "synthetic-principal").cursor).toBe("before-crawl")
  })
  it("resumes a bounded batch without refetching or duplicating indexed sources", async () => {
    const f = fixture()
    const first = await sync(f.source, f.index, f.env, "default", 1)
    expect(first.pending).toBe(1)
    expect(readState(f.env, "default", "synthetic-principal").cursor).toBeUndefined()
    const second = await sync(f.source, f.index, f.env, "default", 1)
    expect(second.pending).toBe(0)
    expect(f.source.children).toHaveBeenCalledTimes(1)
    expect([...f.stored.keys()]).toHaveLength(2)
  })
  it("retains a failed export for replay while saving other successful sources", async () => {
    const f = fixture()
    vi.mocked(f.source.content).mockImplementation(async (id) => {
      if (id === "doc-a") throw new Error("fixture-secret must not escape")
      return content(file(id))
    })
    const failed = await sync(f.source, f.index, f.env, "default", 200)
    expect(failed.pending).toBe(1)
    expect(JSON.stringify(failed)).not.toContain("fixture-secret")
    vi.mocked(f.source.content).mockImplementation(async (id) => content(file(id)))
    expect((await sync(f.source, f.index, f.env, "default", 200)).pending).toBe(0)
    expect(f.source.children).toHaveBeenCalledTimes(1)
  })
  it("honours removal and removes source snapshots as well as search entries", async () => {
    const f = fixture()
    await sync(f.source, f.index, f.env, "default", 200)
    vi.mocked(f.source.changes).mockResolvedValue({ items: [{ id: "doc-a", removed: true }], cursor: "after-remove" })
    const result = await sync(f.source, f.index, f.env, "default", 200)
    expect(result.removed).toBe(1)
    expect(f.stored.has("doc-a")).toBe(false)
    expect(() => readFileSync(snapshotPath(f.env, "default", "doc-a"))).toThrow()
  })
  it("removes descendants when a folder leaves scope without document events", async () => {
    const f = fixture()
    vi.mocked(f.source.children).mockImplementation(async (id) =>
      id === "root" ? [file("nested", ["root"], FOLDER)] : [file("doc-a", ["nested"])],
    )
    vi.mocked(f.source.content).mockResolvedValue(content(file("doc-a", ["nested"])))
    await sync(f.source, f.index, f.env, "default", 200)
    vi.mocked(f.source.changes).mockResolvedValue({
      items: [{ id: "nested", removed: false, file: file("nested", ["outside"], FOLDER) }],
      cursor: "after-move",
    })
    expect((await sync(f.source, f.index, f.env, "default", 200)).removed).toBe(1)
  })
  it("discovers existing descendants of a folder entering scope", async () => {
    const f = fixture()
    vi.mocked(f.source.children).mockResolvedValue([])
    await sync(f.source, f.index, f.env, "default", 200)
    vi.mocked(f.source.changes).mockResolvedValue({
      items: [{ id: "incoming", removed: false, file: file("incoming", ["root"], FOLDER) }],
      cursor: "after-entry",
    })
    vi.mocked(f.source.children).mockResolvedValue([file("doc-new", ["incoming"])])
    vi.mocked(f.source.content).mockResolvedValue(content(file("doc-new", ["incoming"])))
    expect((await sync(f.source, f.index, f.env, "default", 200)).saved).toBe(1)
  })
  it("does not commit incomplete discovery or delete previous sources", async () => {
    const f = fixture()
    await sync(f.source, f.index, f.env, "default", 200)
    vi.mocked(f.source.changes).mockResolvedValue({
      items: [{ id: "incoming", removed: false, file: file("incoming", ["root"], FOLDER) }],
      cursor: "unsafe",
    })
    vi.mocked(f.source.children).mockRejectedValue(new CliError("provider_error", "incomplete listing"))
    await expect(sync(f.source, f.index, f.env, "default", 200)).rejects.toThrow("incomplete listing")
    expect(readState(f.env, "default", "synthetic-principal").cursor).toBe("before-crawl")
    expect(f.stored.size).toBe(2)
  })
  it("metadata-only updates retain the text hash and source reference", async () => {
    const f = fixture()
    await sync(f.source, f.index, f.env, "default", 200)
    const renamed = { ...file("doc-a"), name: "Renamed", version: "2" }
    vi.mocked(f.source.changes).mockResolvedValue({
      items: [{ id: "doc-a", removed: false, file: renamed }],
      cursor: "after-rename",
    })
    vi.mocked(f.source.content).mockResolvedValue(content(renamed))
    const result = await sync(f.source, f.index, f.env, "default", 200)
    expect(result.unchanged).toBe(1)
    const doc = readState(f.env, "default", "synthetic-principal").documents["doc-a"]
    expect(doc?.hash).toBe(createHash("sha256").update("budget decision").digest("hex"))
    expect(doc?.reference).toBe("document:doc-a")
    expect(doc?.metadata.name).toBe("Renamed")
  })
  it("removing the last selected folder clears cached sources on reconciliation", async () => {
    const f = fixture()
    await sync(f.source, f.index, f.env, "default", 200)
    const config = readConfig(f.env)
    const selected = config.profiles.default
    if (!selected) throw new Error("fixture profile missing")
    selected.roots = []
    writeConfig(f.env, config)
    expect((await sync(f.source, f.index, f.env, "default", 200)).removed).toBe(2)
  })
  it("reports unsupported content without downloading it", async () => {
    const f = fixture()
    vi.mocked(f.source.children).mockResolvedValue([file("binary", ["root"], "image/png")])
    const result = await sync(f.source, f.index, f.env, "default", 200)
    expect(result.skipped).toHaveLength(1)
    expect(f.source.content).not.toHaveBeenCalled()
  })
  it("keeps files it cannot read findable by name, replaces them when readable and drops them when trashed", async () => {
    const f = fixture()
    const image = file("image", ["root"], "image/png")
    const locked = { ...file("locked"), canDownload: false }
    const long = file("long")
    vi.mocked(f.source.children).mockResolvedValue([image, locked, long])
    vi.mocked(f.source.content).mockRejectedValue(
      new CliError("validation_error", "too long", { text_limit: 2_000_000 }),
    )
    const first = await sync(f.source, f.index, f.env, "default", 200)
    expect(first).toMatchObject({ names_only: 3, saved: 0, pending: 0 })
    expect(first.skipped.map(({ id }) => id).sort()).toEqual(["image", "locked", "long"])
    expect([...f.stored.values()].map((doc) => [doc.metadata.id, doc.text, doc.notRead])).toEqual([
      ["image", "", "unsupported type: image/png"],
      ["locked", "", "downloads restricted"],
      ["long", "", "too long"],
    ])
    expect(readState(f.env, "default", "synthetic-principal").documents.image?.notRead).toBe(
      "unsupported type: image/png",
    )
    expect(readFileSync(snapshotPath(f.env, "default", "image"), "utf8")).toContain("unsupported type")

    const readable = { ...image, mime: "text/plain", version: "2" }
    vi.mocked(f.source.changes).mockResolvedValue({
      items: [{ id: "image", removed: false, file: readable }],
      cursor: "c2",
    })
    vi.mocked(f.source.content).mockImplementation(async (id) => content(id === "image" ? readable : file(id)))
    expect(await sync(f.source, f.index, f.env, "default", 200)).toMatchObject({ saved: 1, names_only: 0 })
    expect(f.stored.get("image")?.notRead).toBeUndefined()
    expect(readState(f.env, "default", "synthetic-principal").documents.image?.notRead).toBeUndefined()

    vi.mocked(f.source.changes).mockResolvedValue({
      items: [{ id: "locked", removed: false, file: { ...locked, trashed: true } }],
      cursor: "c3",
    })
    expect((await sync(f.source, f.index, f.env, "default", 200)).removed).toBe(1)
    expect(f.stored.has("locked")).toBe(false)
    expect(() => readFileSync(snapshotPath(f.env, "default", "locked"))).toThrow()
  })
  it("reads a file skipped by an older version once its type becomes readable", async () => {
    const f = fixture()
    const sheet = file("sheet-a", ["root"], SHEET)
    vi.mocked(f.source.children).mockResolvedValue([sheet])
    vi.mocked(f.source.content).mockResolvedValue(content(sheet))
    await sync(f.source, f.index, f.env, "default", 200)
    const state = readState(f.env, "default", "synthetic-principal")
    delete state.documents["sheet-a"]
    state.skipped = [{ id: "sheet-a", reason: `unsupported type: ${SHEET}`, file: sheet }]
    saveState(f.env, "default", state)
    expect((await sync(f.source, f.index, f.env, "default", 200)).saved).toBe(1)
  })
  it("retries a file skipped for its length once the limit is raised, without a rescan", async () => {
    const f = fixture()
    const config = readConfig(f.env)
    const profile = config.profiles.default as NonNullable<typeof config.profiles.default>
    profile.maxTextChars = 1_000
    writeConfig(f.env, config)
    const sheet = file("sheet-a", ["root"], SHEET)
    vi.mocked(f.source.children).mockResolvedValue([sheet])
    vi.mocked(f.source.content).mockRejectedValue(new CliError("validation_error", "too long", { text_limit: 1_000 }))
    expect((await sync(f.source, f.index, f.env, "default", 200)).skipped).toEqual([
      { id: "sheet-a", reason: "too long" },
    ])
    expect(vi.mocked(f.source.content).mock.calls[0]?.[1]).toBe(1_000)
    await sync(f.source, f.index, f.env, "default", 200)
    expect(f.source.content).toHaveBeenCalledTimes(1)
    delete profile.maxTextChars
    config.defaults = { maxTextChars: 2_000_000 }
    writeConfig(f.env, config)
    vi.mocked(f.source.content).mockResolvedValue(content(sheet))
    expect((await sync(f.source, f.index, f.env, "default", 200)).saved).toBe(1)
  })
  it("retries a file the local store refused once drive is upgraded", async () => {
    const f = fixture()
    vi.mocked(f.source.children).mockResolvedValue([file("doc-a")])
    vi.mocked(f.index.save).mockRejectedValueOnce(
      new CliError("validation_error", "a note's text takes 0–200000 characters"),
    )
    const first = await sync(f.source, f.index, f.env, "default", 200)
    expect(first.skipped[0]?.reason).toContain("local store refused")
    await sync(f.source, f.index, f.env, "default", 200)
    expect(f.source.content).toHaveBeenCalledTimes(1)
    const state = readState(f.env, "default", "synthetic-principal")
    state.skipped = state.skipped.map((item) => ({ ...item, storeRefusedIn: "0.0.1" }))
    saveState(f.env, "default", state)
    expect((await sync(f.source, f.index, f.env, "default", 200)).saved).toBe(1)
  })
  it("retries a file that 0.2.0 skipped for passing 200 000 characters", async () => {
    const f = fixture()
    await sync(f.source, f.index, f.env, "default", 200)
    const state = readState(f.env, "default", "synthetic-principal")
    delete state.documents["doc-a"]
    state.skipped = [
      {
        id: "doc-a",
        reason: "document exceeds the ingestion bound; it was not silently truncated",
        file: file("doc-a"),
      },
    ]
    saveState(f.env, "default", state)
    expect((await sync(f.source, f.index, f.env, "default", 200)).saved).toBe(1)
  })
  it("skips a scanned PDF with its reason and keeps the batch moving", async () => {
    const f = fixture()
    vi.mocked(f.source.children).mockResolvedValue([file("scan", ["root"], "application/pdf"), file("doc-a")])
    vi.mocked(f.source.content).mockImplementation(async (id) => {
      if (id === "scan")
        throw new CliError("validation_error", "PDF has no text layer (a scan or images); OCR is not supported")
      return content(file(id))
    })
    const result = await sync(f.source, f.index, f.env, "default", 200)
    expect(vi.mocked(f.source.content).mock.calls[0]?.[1]).toBe(2_000_000)
    expect(result).toMatchObject({
      saved: 1,
      pending: 0,
      skipped: [{ id: "scan", reason: expect.stringContaining("no text layer") }],
    })
  })
  it("prevents concurrent profile sync", async () => {
    const f = fixture()
    await sync(f.source, f.index, f.env, "default", 200)
    const release = await lockfile.lock(profileDir(f.env, "default"))
    try {
      await expect(sync(f.source, f.index, f.env, "default", 200)).rejects.toThrow("another sync")
    } finally {
      await release()
    }
  })
})
