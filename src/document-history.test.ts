import { captureStreams } from "@wirecat/cli-base"
import { describe, expect, it, vi } from "vitest"
import { readConfig, writeConfig } from "./config.js"
import type { DocumentIndex } from "./model.js"
import { readState, saveState } from "./state.js"
import { openIndex } from "./store.js"
import { sync } from "./sync.js"
import { content, file, fixture, testProgram } from "./testing.js"

const syncOnce = async (f: ReturnType<typeof fixture>) => {
  const index = await openIndex(f.env, "default")
  try {
    return await sync(f.source, index, f.env, "default", 200)
  } finally {
    await index.close()
  }
}

const drive = async (f: ReturnType<typeof fixture>, ...args: string[]) => {
  const streams = captureStreams()
  await testProgram({ env: f.env, index: () => openIndex(f.env, "default"), streams }).parseAsync(
    ["default", ...args, "--json"],
    { from: "user" },
  )
  return JSON.parse(streams.stdout.join(""))
}

describe("document history over a real store", () => {
  it("keeps the text Google stops showing, deletes only what is in the trash, and lists both", async () => {
    const f = fixture()
    await syncOnce(f)
    vi.mocked(f.source.changes).mockResolvedValueOnce({
      items: [{ id: "doc-a", removed: false, file: { ...file("doc-a"), version: "2" } }],
      cursor: "after-edit",
    })
    vi.mocked(f.source.content).mockResolvedValueOnce(content({ ...file("doc-a"), version: "2" }, "budget approved"))
    await syncOnce(f)
    vi.mocked(f.source.changes).mockResolvedValueOnce({
      items: [
        { id: "doc-a", removed: true },
        { id: "doc-b", removed: false, file: { ...file("doc-b"), trashed: true } },
      ],
      cursor: "after-remove",
    })
    expect((await syncOnce(f)).removed).toBe(2)

    const changes = await drive(f, "changes", "--since", "1h")
    const events = (changes.items as { path: string; event: string }[]).map((row) => `${row.path} ${row.event}`)
    expect(events).toEqual(expect.arrayContaining(["doc-a.md changed", "doc-a.md unavailable", "doc-b.md deleted"]))
    expect(events).not.toContain("doc-a.md deleted")
    const deleted = await drive(
      f,
      "changes",
      ...["--since", "1h", "--until", new Date(Date.now() + 60_000).toISOString(), "--event", "deleted"],
      ...["--limit", "1", "--page", "1"],
    )
    expect(deleted.items.map((row: { path: string; event: string }) => `${row.path} ${row.event}`)).toEqual([
      "doc-b.md deleted",
    ])

    const history = await drive(f, "documents", "history", "doc-a")
    expect(history.item.versions.length).toBeGreaterThanOrEqual(2)
    const first = await drive(f, "documents", "history", "doc-a", "--revision", "1")
    expect(JSON.stringify(first.item)).toContain("budget decision")
  })

  it("passes keep_versions_for_days from the profile to the sync", async () => {
    const f = fixture()
    const config = readConfig(f.env)
    const profile = config.profiles.default
    if (!profile) throw new Error("fixture profile missing")
    profile.keep_versions_for_days = 30
    writeConfig(f.env, config)
    const index = await openIndex(f.env, "default")
    const prune = vi.spyOn(index as Required<DocumentIndex>, "prune")
    try {
      await sync(f.source, index, f.env, "default", 200)
    } finally {
      await index.close()
    }
    const [, before = ""] = prune.mock.calls[0] ?? []
    const days = (Date.now() - Date.parse(before)) / 86_400_000
    expect(Math.round(days)).toBe(30)
  })

  it("takes keep_versions_for_days through config set, and refuses zero", async () => {
    const f = fixture()
    await drive(f, "config", "set", "keep_versions_for_days", "30")
    expect(readConfig(f.env).profiles.default?.keep_versions_for_days).toBe(30)
    await expect(drive(f, "config", "set", "keep_versions_for_days", "0")).rejects.toMatchObject({
      code: "configuration_error",
    })
    expect(readConfig(f.env).profiles.default?.keep_versions_for_days).toBe(30)
  })

  it("offers documents history and changes to agents as local reads", async () => {
    type Listed = { path: string[]; mcp?: boolean; effects: unknown; commands?: Listed[] }
    const flat = (commands: Listed[]): Listed[] => commands.flatMap((one) => [one, ...flat(one.commands ?? [])])
    const listed = flat((await drive(fixture(), "commands")).commands)
    for (const path of ["documents history", "changes"]) {
      const found = listed.find((one) => one.path.join(" ") === path)
      expect(found?.effects, path).toEqual({ remote: "none", local: "read" })
      expect(found?.mcp, path).not.toBe(false)
    }
  })

  it("keeps a pending removal's reason across a saved plan", () => {
    const f = fixture()
    const state = readState(f.env, "default", "synthetic-principal")
    saveState(f.env, "default", {
      ...state,
      pending: {
        cursor: "c",
        scope: state.scope,
        folders: {},
        jobs: [{ id: "doc-a", kind: "remove", reason: "deleted" }],
        skipped: [],
      },
    })
    expect(readState(f.env, "default", "synthetic-principal").pending?.jobs[0]?.reason).toBe("deleted")
  })
})
