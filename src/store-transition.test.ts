import { readFileSync, unlinkSync } from "node:fs"
import { join, resolve } from "node:path"
import { captureStreams } from "@wirecat/cli-base"
import { openStore } from "@wirecat/cli-core/store"
import { describe, expect, it, vi } from "vitest"
import { activeProfile } from "./config.js"
import { errorObject } from "./failure.js"
import { lockProfile } from "./profile-lock.js"
import { createProgram } from "./program.js"
import { readState, saveSnapshot, saveState, statePath } from "./state.js"
import { indexOver, openIndex } from "./store.js"
import { prepareStore } from "./store-transition.js"
import { sync } from "./sync.js"
import { content, file, fixture } from "./testing.js"

const principal = "synthetic-principal"
const legacy = async () => {
  const f = fixture()
  const path = join(f.env.DRIVE_STATE_DIR as string, "drive.db")
  const store = await openStore({ path, env: f.env, command: "drive" })
  const index = indexOver(store, f.env)
  const doc = content(file("synthetic-document"))
  const ref = await index.save(principal, doc, "hash")
  saveSnapshot(f.env, "default", doc)
  saveState(f.env, "default", {
    version: 1,
    principal,
    scope: "old-scope",
    cursor: "old-cursor",
    folders: {},
    documents: { [doc.metadata.id]: { metadata: doc.metadata, hash: "hash", reference: ref, tabs: 0 } },
    skipped: [],
  })
  return { ...f, path, store, index, doc, ref }
}

describe("shared database transition", () => {
  it("rebuilds offline with new references, registers the profile and leaves the old database intact", async () => {
    const f = await legacy()
    await f.store.close()
    const target = await openStore({ path: f.env.MESSAGING_STORE, env: f.env, command: "drive" })
    const folder = await target.notes.addFolder({ name: "synthetic-other-provider" })
    const unrelated = (
      await target.notes.saveFileNote({ folderId: folder.id, path: "other.md", title: "Other", text: "owner evidence" })
    ).note
    await target.close()
    const streams = captureStreams()
    await createProgram({ env: f.env, streams }).parseAsync(["default", "documents", "list", "--json"], {
      from: "user",
    })
    expect(JSON.parse(streams.stdout.join("")).items[0].reference).not.toBe(unrelated.ref)
    const index = await openIndex(f.env, "default")
    const state = readState(f.env, "default", principal)
    expect(state.store).toBe(resolve(f.env.MESSAGING_STORE as string))
    expect(state.documents[f.doc.metadata.id]?.reference).not.toBe(unrelated.ref)
    expect(state.cursor).toBe("old-cursor")
    await index.close()
    const again = await openIndex(f.env, "default")
    expect(readState(f.env, "default", principal).documents).toEqual(state.documents)
    await again.close()
    const old = await openStore({ path: f.path, env: f.env, command: "drive" })
    expect((await old.notes.note(f.ref)).text).toBe(f.doc.text)
    await old.close()
    const shared = await openStore({ path: f.env.MESSAGING_STORE, env: f.env, command: "drive" })
    expect((await shared.accounts.profiles()).drive?.default).toEqual({ provider: "google-drive", account: principal })
    expect((await shared.notes.note(unrelated.ref)).text).toBe("owner evidence")
    await shared.close()
  })
  it("refuses to strand owner annotations and keeps its checkpoint unchanged", async () => {
    const f = await legacy()
    await f.index.knowledge?.tags(principal, f.ref, "add", ["keep"])
    await f.index.knowledge?.addNote(principal, f.ref, "owner memo")
    await f.store.close()
    const before = readFileSync(statePath(f.env, "default"), "utf8")
    const failure = await openIndex(f.env, "default").catch((error: unknown) => error)
    expect(failure).toMatchObject({ details: { reason: "store.annotations-present" } })
    expect(JSON.stringify(errorObject(failure))).toContain("tags: 1")
    expect(readFileSync(statePath(f.env, "default"), "utf8")).toBe(before)
    f.env.MESSAGING_STORE = f.path
    const retained = await openIndex(f.env, "default")
    expect(await retained.knowledge?.tags(principal, f.ref, "list")).toEqual(["keep"])
    await retained.close()
  })
  it("retries an interrupted rebuild idempotently without publishing partial references", async () => {
    const f = await legacy()
    await f.store.close()
    const store = await openStore({ path: f.env.MESSAGING_STORE, env: f.env, command: "drive" })
    const index = indexOver(store, f.env)
    const before = readFileSync(statePath(f.env, "default"), "utf8")
    const save = index.save
    index.save = async (...args) => {
      await save(...args)
      throw new Error("synthetic interruption")
    }
    await expect(prepareStore(index, f.env, "default")).rejects.toThrow("synthetic interruption")
    expect(readFileSync(statePath(f.env, "default"), "utf8")).toBe(before)
    index.save = save
    await prepareStore(index, f.env, "default")
    expect((await index.knowledge?.documents(principal, undefined, { limit: 10, offset: 0 }))?.items).toHaveLength(1)
    await store.close()
  })
  it("allows cached readers while sync holds an already prepared profile lock", async () => {
    const f = fixture()
    const first = await openIndex(f.env, "default")
    await first.close()
    const lock = await lockProfile(f.env, "default")
    try {
      const reader = await openIndex(f.env, "default")
      expect(await reader.search(principal, "budget", { limit: 5, offset: 0, exact: true })).toMatchObject({ hits: [] })
      await reader.close()
    } finally {
      await lock.release()
    }
  })
  it("requires explicit rescan when a snapshot is missing and clears stale cursors for that rebuild", async () => {
    const f = await legacy()
    await f.store.close()
    unlinkSync(join(f.env.DRIVE_STATE_DIR as string, "profiles/default/documents/synthetic-document.json"))
    await expect(openIndex(f.env, "default")).rejects.toMatchObject({ details: { reason: "state.snapshot-missing" } })
    const index = await openIndex(f.env, "default", true)
    const state = readState(f.env, "default", principal)
    expect(state.documents).toEqual({})
    expect(state.cursor).toBeUndefined()
    expect(state.store).toBe(resolve(f.env.MESSAGING_STORE as string))
    await index.close()
  })
  it("rejects the retired override instead of silently ignoring it", async () => {
    const f = fixture()
    await expect(openIndex({ ...f.env, DRIVE_STORE: "/synthetic/old.db" })).rejects.toThrow("MESSAGING_STORE")
  })
})

const owner = { provider: "synthetic", account: "500" }
const message = (id: string, text: string) => ({
  id,
  chatId: "7",
  senderId: "10",
  senderName: "Synthetic reader",
  timestamp: "2026-01-01T00:00:00Z",
  editedAt: null,
  text,
  outgoing: false,
  attachments: [],
  replyTo: null,
  forwardedFrom: null,
  reactions: null,
})

describe("Drive sync links stored messages", () => {
  it("links old messages on import and later messages to unchanged documents, without duplicates", async () => {
    const f = fixture()
    vi.mocked(f.source.children).mockResolvedValue([file("synthetic-document-a")])
    const store = await openStore({ path: f.env.MESSAGING_STORE, env: f.env, command: "drive" })
    const index = indexOver(store, f.env)
    await store.chats.saveChats(owner, [
      { id: "7", title: "Synthetic chat", kind: "group", unreadCount: 0, lastMessageAt: null, participantsCount: null },
    ])
    await store.messages.saveMessages(owner, "7", [message("1", file("synthetic-document-a").url)], { via: "history" })
    await sync(f.source, index, f.env, "default", 100)
    const scoped = await store.forAccount(owner)
    expect((await scoped.messages.documentLinkMessages("7"))[0]?.documents).toMatchObject([
      { fileId: "synthetic-document-a", title: "Same name" },
    ])
    await store.messages.saveMessages(owner, "7", [message("2", file("synthetic-document-a").url)], { via: "history" })
    await sync(f.source, index, f.env, "default", 100)
    expect(f.source.content).toHaveBeenCalledTimes(1)
    const rows = await scoped.messages.documentLinkMessages("7")
    expect(rows).toHaveLength(2)
    expect(rows.every((row) => row.documents.length === 1)).toBe(true)
    await sync(f.source, index, f.env, "default", 100)
    expect((await scoped.messages.documentLinkMessages("7")).every((row) => row.documents.length === 1)).toBe(true)
    await store.close()
  })
  it("retries the historical pass after a link failure without advancing its watermark", async () => {
    const f = fixture()
    f.index.linkMessages = vi.fn().mockRejectedValueOnce(new Error("synthetic link failure")).mockResolvedValue(0)
    await expect(sync(f.source, f.index, f.env, "default", 100)).rejects.toThrow("synthetic link failure")
    expect(readState(f.env, "default", activeProfile(f.env, "default").principal).linkedThrough).toBeUndefined()
    expect(readState(f.env, "default", principal).linksPending).toBe(true)
    await sync(f.source, f.index, f.env, "default", 100)
    expect(f.index.linkMessages).toHaveBeenNthCalledWith(
      2,
      expect.arrayContaining([{ fileId: "doc-a", reference: "document:doc-a" }]),
    )
    expect(readState(f.env, "default", principal).linksPending).toBeUndefined()
    expect(readState(f.env, "default", principal).linkedThrough).toBeDefined()
  })

  it("repairs pre-upgrade link checkpoints once, then resumes incremental linking", async () => {
    const f = fixture()
    f.index.linkMessages = vi.fn().mockResolvedValue(0)
    await sync(f.source, f.index, f.env, "default", 100)
    const previous = readState(f.env, "default", principal)
    delete previous.linksVersion
    previous.linkedThrough = "2026-01-01T00:00:00.000Z"
    saveState(f.env, "default", previous)
    vi.mocked(f.index.linkMessages).mockClear()
    await sync(f.source, f.index, f.env, "default", 100)
    expect(f.index.linkMessages).toHaveBeenNthCalledWith(
      1,
      expect.arrayContaining([{ fileId: "doc-a", reference: "document:doc-a" }]),
    )
    const current = readState(f.env, "default", principal)
    expect(current.linksVersion).toBe(1)
    vi.mocked(f.index.linkMessages).mockClear()
    await sync(f.source, f.index, f.env, "default", 100)
    expect(f.index.linkMessages).toHaveBeenNthCalledWith(1, [])
    expect(f.index.linkMessages).toHaveBeenNthCalledWith(2, expect.any(Array), current.linkedThrough)
  })

  it("does not advance the link version or checkpoint if the incremental pass fails", async () => {
    const f = fixture()
    f.index.linkMessages = vi.fn().mockResolvedValue(0)
    await sync(f.source, f.index, f.env, "default", 100)
    const previous = readState(f.env, "default", principal)
    delete previous.linksVersion
    saveState(f.env, "default", previous)
    vi.mocked(f.index.linkMessages)
      .mockReset()
      .mockResolvedValueOnce(0)
      .mockRejectedValueOnce(new Error("synthetic link failure"))
    await expect(sync(f.source, f.index, f.env, "default", 100)).rejects.toThrow("synthetic link failure")
    const failed = readState(f.env, "default", principal)
    expect(failed.linksVersion).toBeUndefined()
    expect(failed.linkedThrough).toBe(previous.linkedThrough)
    expect(failed.linksPending).toBe(true)
    vi.mocked(f.index.linkMessages).mockReset().mockResolvedValue(0)
    await sync(f.source, f.index, f.env, "default", 100)
    expect(f.index.linkMessages).toHaveBeenNthCalledWith(
      1,
      expect.arrayContaining([{ fileId: "doc-a", reference: "document:doc-a" }]),
    )
    expect(readState(f.env, "default", principal).linksVersion).toBe(1)
  })
})
