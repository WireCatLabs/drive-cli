import { openStore } from "@wirecat/cli-core/store"
import { describe, expect, it } from "vitest"
import { openIndex } from "./store.js"
import { content, file, fixture } from "./testing.js"

const setup = async () => {
  const f = fixture()
  const index = await openIndex(f.env)
  if (!index.knowledge) throw new Error("missing shared knowledge")
  const principal = "synthetic-principal"
  const metadata = {
    ...file("doc-a"),
    owners: [{ id: "owner-user", name: "Owner Sample" }],
    lastModifiedBy: { email: "Editor@EXAMPLE.invalid", name: "Editor Sample" },
  }
  const ref = await index.save(principal, content(metadata), "hash-one")
  return { ...f, index, k: index.knowledge, ref, principal, metadata }
}
describe("shared document knowledge", () => {
  it("preserves owner tags, notes and links on reimport and marks memories stale only on content changes", async () => {
    const f = await setup()
    try {
      expect(await f.k.tags(f.principal, f.ref, "add", ["budget", "review"])).toEqual(["budget", "review"])
      const note = await f.k.addNote(f.principal, f.ref, "Check the budget", "Review")
      const link = await f.k.addLink(f.principal, f.ref, { to: note.ref, kind: "related-to" })
      const memory = await f.k.addMemory(f.principal, f.ref, {
        body: "Budget decision",
        scope: "work",
        kind: "summary",
      })
      expect(memory).toMatchObject({ subject: f.ref, evidence: [f.ref], status: "proposed", scope: "work" })
      await f.k.memory(f.principal, f.ref, memory.ref, "confirm")
      await f.index.save(f.principal, content({ ...f.metadata, name: "Renamed" }), "hash-one")
      expect((await f.k.memory(f.principal, f.ref, memory.ref)).status).toBe("confirmed")
      expect(await f.k.tags(f.principal, f.ref, "list")).toEqual(["budget", "review"])
      expect((await f.k.links(f.principal, f.ref)).some((item) => item.id === link.id)).toBe(true)
      expect((await f.k.note(f.principal, f.ref, note.ref)).title).toBe("Review")
      await f.index.save(f.principal, content(f.metadata, "Revised decision"), "hash-two")
      expect((await f.k.memory(f.principal, f.ref, memory.ref)).status).toBe("stale")
      await f.k.tags(f.principal, f.ref, "remove", ["review"])
      await f.k.removeLink(f.principal, f.ref, link.id)
      expect(await f.k.tags(f.principal, f.ref, "list")).toEqual(["budget"])
      await expect(f.k.removeLink(f.principal, f.ref, link.id)).rejects.toThrow("attached")
    } finally {
      await f.index.close()
    }
  })
  it("scopes documents, notes and memories to their source and guards stale note edits", async () => {
    const f = await setup()
    try {
      const other = await f.index.save(f.principal, content(file("doc-b")), "hash")
      const note = await f.k.addNote(f.principal, f.ref, "Memo about budget")
      const edited = await f.k.editNote(f.principal, f.ref, note.ref, "Updated memo", note.revision)
      expect(edited.revision).toBeGreaterThan(note.revision)
      await expect(f.k.editNote(f.principal, f.ref, note.ref, "Stale edit", note.revision)).rejects.toThrow()
      await expect(f.k.note(f.principal, other, note.ref)).rejects.toThrow("attached")
      await expect(f.k.tags("other-account", f.ref, "list")).rejects.toThrow("account")
      const memory = await f.k.addMemory(f.principal, f.ref, {
        body: "Updated budget",
        kind: "summary",
        scope: "personal",
      })
      await expect(f.k.memory(f.principal, other, memory.ref)).rejects.toThrow("attached")
      await expect(
        f.k.addMemory(f.principal, other, {
          body: "Wrong source",
          kind: "summary",
          scope: "personal",
          supersedes: memory.ref,
        }),
      ).rejects.toThrow("attached")
      expect(await f.k.memories(f.principal, f.ref, { scope: "work" })).toEqual([])
      expect(await f.k.searchMemories(f.principal, f.ref, "budget", "personal")).toMatchObject({
        items: [{ ref: memory.ref }],
      })
      await f.k.memory(f.principal, f.ref, memory.ref, "stale")
      const replacement = await f.k.addMemory(f.principal, f.ref, {
        body: "Corrected budget",
        kind: "summary",
        scope: "personal",
        supersedes: memory.ref,
      })
      expect(replacement.supersedes).toBe(memory.ref)
      expect((await f.k.memory(f.principal, f.ref, memory.ref)).status).toBe("superseded")
      await f.k.removeNote(f.principal, f.ref, note.ref)
      await expect(f.k.note(f.principal, f.ref, note.ref)).rejects.toThrow("attached")
    } finally {
      await f.index.close()
    }
  })
  it("records observed contributors and permits explicit identity linking without matching by names", async () => {
    const f = await setup()
    const store = await openStore({ path: f.env.DRIVE_STORE, env: f.env, command: "drive" })
    try {
      const key = { provider: "synthetic-messenger", account: "synthetic-account" }
      await store.saveAccount(key, { name: "Synthetic" })
      await store.savePeople(key, [{ id: "external-editor", name: "Editor Sample" }])
      const person = await store.personOf({ provider: key.provider, id: "external-editor" })
      if (!person) throw new Error("missing fixture person")
      const otherRef = await f.index.save("second-google-account", content({ ...f.metadata, id: "doc-b" }), "hash")
      const observed = (await f.k.people(f.principal, f.ref)) as {
        items: { google_id: string; person: { uid: string } }[]
      }
      const editor = observed.items.find((item) => item.google_id === "email:editor@example.invalid")
      expect(editor?.person.uid).not.toBe(person.uid)
      expect(
        (await f.k.linkPerson(f.principal, f.ref, "email:editor@example.invalid", `person:${person.uid}`)).uid,
      ).toBe(person.uid)
      expect(await f.k.matches(f.principal, f.ref, { person: `person:${person.uid}` })).toBe(true)
      expect(await f.k.matches("second-google-account", otherRef, { person: `person:${person.uid}` })).toBe(true)
      await expect(f.k.linkPerson(f.principal, f.ref, "unknown-user", `person:${person.uid}`)).rejects.toThrow(
        "observed",
      )
      await expect(f.k.linkPerson(f.principal, f.ref, "owner-user", "note:1")).rejects.toThrow("person reference")
      await expect(f.k.linkPerson(f.principal, f.ref, "owner-user", "person:unknown")).rejects.toThrow("identity")
      const context = (await f.k.context(f.principal, f.ref)) as { links: { role: string; provenance: string }[] }
      expect(context.links).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ role: "last-editor", provenance: "google-drive:files.get" }),
        ]),
      )
    } finally {
      await store.close()
      await f.index.close()
    }
  })
  it("stales source-backed memories on scope removal and refuses removed documents", async () => {
    const f = await setup()
    const store = await openStore({ path: f.env.DRIVE_STORE, env: f.env, command: "drive" })
    try {
      const memory = await f.k.addMemory(f.principal, f.ref, { body: "Source summary", kind: "summary", scope: "work" })
      await f.index.remove(f.principal, "doc-a")
      expect((await store.memories.get(memory.ref)).status).toBe("stale")
      await expect(f.k.context(f.principal, f.ref)).rejects.toThrow("account")
    } finally {
      await store.close()
      await f.index.close()
    }
  })
  it("keeps facts on their document: the owner's accepted at once, an extraction's proposed", async () => {
    const f = await setup()
    try {
      const owned = await f.k.addFact(f.principal, f.ref, { statement: "The budget was approved", type: "decision" })
      expect(owned).toMatchObject({ type: "decision", status: "accepted", subject: f.ref, evidence: [f.ref] })
      const drawn = await f.k.addFact(f.principal, f.ref, {
        statement: "Alice Example owns the budget",
        type: "fact",
        scope: "work",
        by: { bot: "drive-memory", model: "example-model" },
      })
      expect(drawn).toMatchObject({ status: "proposed", model: "example-model", scope: "work" })
      expect((await f.k.facts(f.principal, f.ref, { status: "proposed" })).map((fact) => fact.ref)).toEqual([drawn.ref])
      expect((await f.k.fact(f.principal, f.ref, drawn.ref, "confirm")).status).toBe("accepted")
      await expect(
        f.k.addMemory(f.principal, f.ref, { body: "A fact", kind: "fact" as never, scope: "work" }),
      ).rejects.toThrow("summary, digest, preference")
    } finally {
      await f.index.close()
    }
  })
})
