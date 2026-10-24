import { existsSync, readFileSync, unlinkSync, writeFileSync } from "node:fs"
import { join, resolve } from "node:path"
import { captureStreams } from "@wirecat/cli-base"
import { openStore } from "@wirecat/cli-core/store"
import { afterEach, describe, expect, it, vi } from "vitest"
import { createProgram } from "./program.js"
import * as stateFiles from "./state.js"
import { readState, saveSnapshot, saveState, statePath } from "./state.js"
import { indexOver, openIndex } from "./store.js"
import { checkStoreImport, transferBindings } from "./store-import.js"
import { content, file, fixture } from "./testing.js"

const principal = "synthetic-principal"
afterEach(() => vi.restoreAllMocks())
const legacy = async () => {
  const f = fixture()
  const source = join(f.directory, "previous.db")
  const store = await openStore({ path: source, env: f.env, command: "drive" })
  const metadata = {
    ...file("SyntheticDoc_ABc"),
    owners: [{ id: "synthetic-editor", name: "Synthetic editor" }],
    lastModifiedBy: { id: "synthetic-editor", name: "Synthetic editor" },
  }
  const document = content(metadata, "Synthetic budget evidence")
  const index = indexOver(store, f.env)
  const reference = await index.save(principal, document, "synthetic-content-hash")
  await index.knowledge?.tags(principal, reference, "add", ["retained-tag"])
  await index.knowledge?.addNote(principal, reference, "Retain this owner memo")
  await store.close()
  saveSnapshot(f.env, "default", document)
  saveState(f.env, "default", {
    version: 1,
    principal,
    store: source,
    scope: "synthetic-scope",
    cursor: "retained-cursor",
    linkedThrough: "2026-01-01T00:00:00Z",
    folders: {},
    documents: {
      [document.metadata.id]: {
        metadata: document.metadata,
        hash: "synthetic-content-hash",
        reference,
        tabs: 0,
        picture: "saved",
      },
    },
    skipped: [],
  })
  return { ...f, source, document, reference }
}
const run = async (env: NodeJS.ProcessEnv, args: string[]) => {
  const streams = captureStreams()
  await createProgram({
    env,
    streams,
    source: async () => {
      throw new Error("synthetic check refuses Google")
    },
  }).parseAsync(["default", ...args, "--offline", "--json"], { from: "user" })
  return JSON.parse(streams.stdout.join(""))
}

describe("explicit profile store import", () => {
  it("previews without changing files, then copies annotations and rewrites the checkpoint with new references", async () => {
    const f = await legacy()
    const target = await openStore({ path: f.env.MESSAGING_STORE, env: f.env, command: "drive" })
    const unrelated = await target.notes.addFolder({ name: "other-provider:synthetic" })
    const { note: collision } = await target.notes.saveFileNote({
      folderId: unrelated.id,
      path: "other.md",
      text: "Keep unrelated data",
      title: "Other",
    })
    await target.close()
    const original = readFileSync(f.source),
      checkpoint = readFileSync(statePath(f.env, "default"))
    expect((await run(f.env, ["status"])).item.store).toEqual({
      selected: resolve(f.env.MESSAGING_STORE as string),
      checkpoint: f.source,
    })
    const preview = await run(f.env, ["store", "check", f.source])
    expect(preview).toMatchObject({
      item: { ready: true, counts: { documents: 1, tags: 1, notes: 1, people: 1, identities: 1 } },
      meta: { complete: true },
    })
    expect(preview.item.source_documents[0].external_id).toBe("SyntheticDoc_ABc.md")
    expect(readFileSync(statePath(f.env, "default"))).toEqual(checkpoint)
    expect(readFileSync(f.source).equals(original)).toBe(true)
    const applied = await run(f.env, ["store", "import", f.source, "--fingerprint", preview.item.fingerprint])
    expect(applied.item).toMatchObject({ checkpoint_updated: true, source_retained: true, profile: "default" })
    expect(applied.item.documents).toEqual([{ external_id: "SyntheticDoc_ABc.md", reference: expect.any(String) }])
    const state = readState(f.env, "default", principal)
    expect(state.store).toBe(resolve(f.env.MESSAGING_STORE as string))
    expect(state.documents.SyntheticDoc_ABc?.reference).not.toBe(collision.ref)
    expect(state.documents.SyntheticDoc_ABc?.picture).toBeUndefined()
    expect(state.cursor).toBe("retained-cursor")
    expect(state.linkedThrough).toBeUndefined()
    expect((await run(f.env, ["tags", "list", "SyntheticDoc_ABc"])).items).toEqual([{ tag: "retained-tag" }])
    expect((await run(f.env, ["documents", "show", "SyntheticDoc_ABc"])).item.text).toBe("Synthetic budget evidence")
    const context = await run(f.env, ["documents", "context", "SyntheticDoc_ABc"])
    expect(context.item.notes.items[0].text).toBe("Retain this owner memo")
    expect(context.item.people.items[0].person).not.toBeNull()
    expect(readFileSync(f.source).equals(original)).toBe(true)
    const store = await openStore({ path: f.env.MESSAGING_STORE, env: f.env, command: "drive" })
    try {
      expect(await store.notes.note(collision.ref)).toMatchObject({ text: "Keep unrelated data" })
    } finally {
      await store.close()
    }
  })

  it("resumes after a committed copy when checkpoint publication fails, without doubling the notes", async () => {
    const f = await legacy()
    const before = readFileSync(statePath(f.env, "default"))
    const preview = await run(f.env, ["store", "check", f.source])
    const publication = vi.spyOn(stateFiles, "saveState").mockImplementationOnce(() => {
      throw new Error("synthetic checkpoint interruption")
    })
    await expect(run(f.env, ["store", "import", f.source, "--fingerprint", preview.item.fingerprint])).rejects.toThrow(
      "synthetic checkpoint interruption",
    )
    expect(readFileSync(statePath(f.env, "default"))).toEqual(before)
    publication.mockRestore()
    const again = await run(f.env, ["store", "check", f.source])
    expect(again.item.already_transferred).toBe(true)
    await run(f.env, ["store", "import", f.source, "--fingerprint", again.item.fingerprint])
    expect((await run(f.env, ["notes", "list", "SyntheticDoc_ABc"])).items).toHaveLength(1)
  })

  it("retains the normal refusal guard and rejects changed fingerprints, cached hashes and missing snapshots", async () => {
    const f = await legacy()
    await expect(openIndex(f.env, "default")).rejects.toMatchObject({
      details: { reason: "store.annotations-present" },
    })
    const preview = await run(f.env, ["store", "check", f.source])
    await expect(run(f.env, ["store", "import", f.source, "--fingerprint", "0".repeat(64)])).rejects.toMatchObject({
      code: "validation_error",
    })
    const state = readState(f.env, "default", principal)
    const document = state.documents.SyntheticDoc_ABc
    if (!document) throw new Error("synthetic document missing")
    document.hash = "different-cached-hash"
    saveState(f.env, "default", state)
    await expect(run(f.env, ["store", "check", f.source])).rejects.toThrow("source content does not match")
    document.hash = "synthetic-content-hash"
    saveState(f.env, "default", state)
    unlinkSync(join(f.env.DRIVE_STATE_DIR as string, "profiles/default/documents/SyntheticDoc_ABc.json"))
    await expect(checkStoreImport(f.env, "default", f.source, {})).rejects.toMatchObject({
      details: { reason: "state.snapshot-missing" },
    })
    expect(preview.item.ready).toBe(true)
  })

  it("refuses local writes under readonly policy and requires an explicit profile", async () => {
    const f = await legacy()
    const preview = await run(f.env, ["store", "check", f.source])
    await expect(
      run(f.env, ["store", "import", f.source, "--fingerprint", preview.item.fingerprint, "--read-only"]),
    ).rejects.toMatchObject({ code: "permission_error" })
    await expect(
      createProgram({ env: f.env, streams: captureStreams() }).parseAsync(["store", "check", f.source, "--json"], {
        from: "user",
      }),
    ).rejects.toMatchObject({ details: { reason: "profile.required" } })
    expect(existsSync(f.env.MESSAGING_STORE as string)).toBe(false)
  })

  it("checks the optional reference decision file without printing its values", () => {
    const f = fixture()
    const input = join(f.directory, "bindings.json")
    writeFileSync(input, JSON.stringify({ "project:1": "project:7" }))
    expect(transferBindings(input)).toEqual({ "project:1": "project:7" })
    writeFileSync(input, '{"synthetic-private-value":7}')
    expect(() => transferBindings(input)).toThrow("bindings must map source references")
    writeFileSync(input, "invalid synthetic-private-value")
    expect(() => transferBindings(input)).toThrow("readable JSON object")
    writeFileSync(input, "x".repeat(256 * 1024 + 1))
    expect(() => transferBindings(input)).toThrow("256 KiB")
    expect(transferBindings()).toEqual({})
  })

  it("uses the same explicit reference decisions in CLI preview and import", async () => {
    const f = await legacy()
    const source = await openStore({ path: f.source, env: f.env })
    const project = await source.knowledge.addProject({ name: "Synthetic source project" })
    await source.notes.addLink({ from: project.ref, to: f.reference, kind: "links-to", origin: "owner" })
    await source.close()
    const target = await openStore({ path: f.env.MESSAGING_STORE, env: f.env })
    await target.knowledge.addProject({ name: "Unrelated project" })
    const selected = await target.knowledge.addProject({ name: "Selected project" })
    await target.close()
    const decisions = join(f.directory, "decisions.json")
    writeFileSync(decisions, JSON.stringify({ [project.ref]: selected.ref }))
    expect((await run(f.env, ["store", "check", f.source])).item.ready).toBe(false)
    const preview = await run(f.env, ["store", "check", f.source, decisions])
    expect(preview.item.ready).toBe(true)
    await run(f.env, ["store", "import", f.source, decisions, "--fingerprint", preview.item.fingerprint])
    const context = await run(f.env, ["documents", "context", "SyntheticDoc_ABc"])
    const current = await openStore({ path: f.env.MESSAGING_STORE, env: f.env })
    try {
      expect(await current.notes.links({ to: context.item.document.ref })).toEqual(
        expect.arrayContaining([expect.objectContaining({ from: selected.ref })]),
      )
    } finally {
      await current.close()
    }
  })
})
