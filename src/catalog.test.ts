import { captureStreams } from "@wirecat/cli-base"
import { type CatalogEntry, openStore } from "@wirecat/cli-core/store"
import { expect, it, vi } from "vitest"
import { catalogFiles, catalogTree } from "./catalog.js"
import { writeConfig } from "./config.js"
import { FOLDER, type SyncState } from "./model.js"

import { readState, saveState } from "./state.js"
import { openIndex } from "./store.js"
import { sync } from "./sync.js"
import { commandResult, content, testProgram as createProgram, file, fixture } from "./testing.js"

it("sync catalogs folders and unreadable files before downloading text, retaining references and owner tags", async () => {
  const f = fixture()
  const index = await openIndex(f.env)
  try {
    await sync(f.source, index, f.env, "default", 1)
    const page = await index.catalog?.list("synthetic-principal")
    expect(page?.items.some((e) => e.kind === "folder")).toBe(true)
    expect(page?.items.some((e) => e.externalId === "doc-b.md" && e.content === "metadata")).toBe(true)
    const folder = await index.catalog?.get("synthetic-principal", "root")
    expect(folder).toBeDefined()
    await index.knowledge?.tags("synthetic-principal", folder?.ref ?? "", "add", ["work"])
    await sync(f.source, index, f.env, "default", 10)
    expect((await index.catalog?.get("synthetic-principal", "doc-b"))?.content).toBe("indexed")
    expect((await index.catalog?.get("synthetic-principal", "root"))?.ref).toBe(folder?.ref)
    expect(await index.knowledge?.tags("synthetic-principal", folder?.ref ?? "", "list")).toContain("work")
    expect(await index.catalog?.get("other-principal", "root")).toBeUndefined()
  } finally {
    await index.close()
  }
})
it("keeps indexed content when importing only metadata, scopes identical ids and follows moves offline", async () => {
  const f = fixture()
  const index = await openIndex(f.env)
  try {
    const ref = await index.save("synthetic-principal", content(file("doc-a")), "hash")
    const root = file("root", [], FOLDER)
    const moved = {
      ...file("doc-a"),
      name: "Budget proposal",
      parents: ["nested"],
      providerMetadata: { starred: true },
      lastModifiedBy: { id: "rin", name: "Rin Example" },
    }
    await index.catalog?.import("synthetic-principal", [
      root,
      file("nested", ["root"], FOLDER),
      moved,
      file("photo", ["root"], "image/png"),
    ])
    expect((await index.catalog?.get("synthetic-principal", "doc-a"))?.ref).toBe(ref)
    expect((await index.catalog?.get("synthetic-principal", "doc-a"))?.metadata).toEqual({ starred: true })
    expect((await index.catalog?.list("synthetic-principal", { parent: "nested", person: "rin" }))?.items).toHaveLength(
      1,
    )
    const found = (await index.search("synthetic-principal", "decision", { limit: 10, offset: 0, exact: true })) as {
      hits: { ref: string }[]
    }
    expect(found.hits.map((hit) => hit.ref)).toContain(ref)
    await index.catalog?.import("other-principal", [root, file("doc-a")])
    expect((await index.catalog?.get("other-principal", "doc-a"))?.ref).not.toBe(ref)
    expect((await index.catalog?.import("synthetic-principal", [root]))?.retired).toBe(3)
    expect(await index.catalog?.get("synthetic-principal", "doc-a")).toBeUndefined()
  } finally {
    await index.close()
  }
})
it("runs import, tree, search, folder tags and folder notes entirely offline with an explicit profile", async () => {
  const f = fixture()
  saveState(f.env, "default", {
    version: 1,
    principal: "synthetic-principal",
    scope: "",
    folders: { root: file("root", [], FOLDER), nested: file("nested", ["root"], FOLDER) },
    documents: {},
    skipped: [
      {
        id: "photo",
        reason: "unsupported type",
        file: { ...file("photo", ["nested"], "image/png"), name: "Budget scan" },
      },
    ],
  })
  const remote = vi.fn(async () => {
    throw new Error("remote must not open")
  })
  const invoke = async (...args: string[]) => {
    const streams = captureStreams()
    await createProgram({ env: f.env, streams, source: remote }).parseAsync(["default", "--offline", ...args], {
      from: "user",
    })
    return commandResult(streams.stdout.join(""))
  }
  expect(await invoke("catalog", "import")).toEqual({ entries: 3, retired: 0 })
  const tree = await invoke("catalog", "tree", "--depth", "1")
  expect(tree.items[0].item.id).toBe("root")
  expect(tree.items[0].children[0]).toMatchObject({ item: { id: "nested" }, children: [], truncated: true })
  expect(
    (await invoke("catalog", "search", 'budget AND mime:"image/png"')).items.map((e: { id: string }) => e.id),
  ).toEqual(["photo"])
  expect((await invoke("catalog", "tags", "add", "nested", "work")).items).toContain("work")
  expect((await invoke("catalog", "list", "tag:work")).items[0].id).toBe("nested")
  await invoke("notes", "add", "nested", "Owner's folder memo")
  expect((await invoke("notes", "list", "nested")).items).toHaveLength(1)
  expect((await invoke("catalog", "tags", "remove", "nested", "work")).items).toEqual(["work"])
  expect((await invoke("catalog", "tags", "list", "nested")).items).toEqual([])
  expect((await invoke("catalog", "show", "photo")).content).toBe("metadata")
  await expect(invoke("catalog", "show", "absent")).rejects.toThrow("not in the active")
  await expect(invoke("catalog", "import", "--read-only")).rejects.toThrow()
  await expect(
    createProgram({ env: f.env, streams: captureStreams(), source: remote }).parseAsync(["catalog", "list"], {
      from: "user",
    }),
  ).rejects.toThrow("profile")
  expect(
    (await invoke("catalog", "list", "parent:nested AND kind:file")).items.map((e: { id: string }) => e.id),
  ).toEqual(["photo"])
  expect((await invoke("catalog", "list", "kind:folder", "--page", "2", "--limit", "1")).items).toHaveLength(1)
  await expect(invoke("catalog", "list", "budget")).rejects.toThrow()
  await expect(invoke("catalog", "search", "unknown:budget")).rejects.toThrow()
  expect(remote).not.toHaveBeenCalled()
})
it("previews catalog writes before opening the database and publishes local mutation metadata", async () => {
  const f = fixture()
  const open = vi.fn(async () => f.index)
  const streams = captureStreams()
  await createProgram({ env: f.env, index: open, streams }).parseAsync(["default", "catalog", "import", "--dry-run"], {
    from: "user",
  })
  expect(commandResult(streams.stdout.join(""))).toMatchObject({
    dry_run: true,
    effects: { remote: "none", local: "write" },
  })
  expect(open).not.toHaveBeenCalled()
})
it("uses the pending hierarchy and excludes scheduled removals when backfilling a checkpoint", () => {
  const root = file("root", [], FOLDER)
  const doc = file("doc-a", ["old"])
  const state: SyncState = {
    version: 1,
    principal: "synthetic",
    scope: "",
    folders: { root },
    documents: { "doc-a": { metadata: doc, reference: "document:1", tabs: 0, hash: "hash" } },
    skipped: [],
    pending: {
      scope: "",
      cursor: "next",
      folders: { root },
      jobs: [
        { id: "doc-a", kind: "remove" },
        { id: "photo", kind: "save", file: file("photo", ["root"], "image/png") },
      ],
      skipped: [],
    },
  }
  expect(catalogFiles(state, ["root"]).map((e) => e.id)).toEqual(["root", "photo"])
  expect(catalogFiles(state, [])).toEqual([])
})
it("bounds local trees and refuses cycles while keeping duplicate names distinct", () => {
  const entry = (id: string, parents: string[]): CatalogEntry => ({
    externalId: `${id}.md`,
    name: "Same",
    kind: "folder",
    parents: parents.map((p) => `${p}.md`),
    ref: `document:${id}`,
    active: true,
    observedAt: "2026-10-13T00:00:00Z",
    content: "metadata",
  })
  expect(
    catalogTree([entry("root", []), entry("a", ["root"]), entry("b", ["root"])], ["root.md"], 2)[0]?.children.map(
      (e) => e.item.id,
    ),
  ).toEqual(["a", "b"])
  expect(() => catalogTree([entry("root", ["a"]), entry("a", ["root"])], ["root.md"], 5)).toThrow("cycle")
  expect(() => catalogTree([], ["absent.md"], 5)).toThrow("not in")
  expect(() => catalogTree([], [], 51)).toThrow("depth")
})
it("retains checkpoint and pending work if catalog persistence fails", async () => {
  const f = fixture()
  f.index.catalog = {
    import: vi.fn(async () => {
      throw new Error("synthetic store error")
    }),
    get: vi.fn(),
    list: vi.fn(),
  }
  await expect(sync(f.source, f.index, f.env, "default", 10)).rejects.toThrow("store error")
  const state = readState(f.env, "default", "synthetic-principal")
  expect(state.cursor).toBeUndefined()
  expect(state.pending?.jobs.length).toBeGreaterThan(0)
  expect(f.index.save).not.toHaveBeenCalled()
})
it("clears active catalog scope when the owner removes all selected roots", async () => {
  const f = fixture()
  const index = await openIndex(f.env)
  try {
    await sync(f.source, index, f.env, "default", 10)
    const source = await index.catalog?.get("synthetic-principal", "doc-a")
    const memory = await index.knowledge?.addMemory("synthetic-principal", source?.ref ?? "", {
      kind: "summary",
      body: "Synthetic source summary",
      scope: "work",
    })
    writeConfig(f.env, { profiles: { default: { principal: "synthetic-principal", roots: [], storage: "keyring" } } })
    await sync(undefined, index, f.env, "default", 10)
    expect((await index.catalog?.list("synthetic-principal"))?.items).toEqual([])
    const store = await openStore({ path: f.env.MESSAGING_STORE, env: f.env })
    try {
      expect((await store.memories.get(memory?.ref ?? "")).status).toBe("stale")
    } finally {
      await store.close()
    }
  } finally {
    await index.close()
  }
})

it("labels metadata-only search hits so an agent cannot mistake a name match for downloaded text", async () => {
  const f = fixture()
  const index = await openIndex(f.env)
  try {
    await index.catalog?.import("synthetic-principal", [
      { ...file("root", [], FOLDER), name: "Budget folder" },
      { ...file("pending"), name: "Budget pending" },
    ])
    const result = (await index.search("synthetic-principal", "budget", { limit: 10, offset: 0, exact: true })) as {
      hits: { content: string; not_read: string }[]
    }
    expect(result.hits).toHaveLength(2)
    expect(result.hits.every((hit) => hit.content === "metadata")).toBe(true)
    expect(result.hits.map((hit) => hit.not_read).sort()).toEqual([
      "content is not indexed yet",
      "folder metadata only",
    ])
  } finally {
    await index.close()
  }
})
