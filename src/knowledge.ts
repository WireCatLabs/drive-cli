import { CliError } from "@wirecat/cli-base"
import { normalizeTag } from "@wirecat/cli-core"
import type {
  Author,
  Fact,
  Link,
  LinkInput,
  Memory,
  MemoryInput,
  MessageStore,
  Note,
  PersonRecord,
} from "@wirecat/cli-core/store"
import type { FileMetadata, GoogleUser } from "./model.js"

export interface DocumentKnowledge {
  matches(principal: string, ref: string, filters: { tag?: string; person?: string }): Promise<boolean>
  context(principal: string, ref: string): Promise<unknown>
  tags(principal: string, ref: string, action: "list" | "add" | "remove", tags?: string[]): Promise<string[]>
  links(principal: string, ref: string): Promise<Link[]>
  addLink(principal: string, ref: string, input: Omit<LinkInput, "from" | "origin">): Promise<Link>
  removeLink(principal: string, ref: string, id: string): Promise<unknown>
  notes(
    principal: string,
    ref: string,
    options?: { search?: string; limit?: number; offset?: number },
  ): Promise<unknown>
  addNote(principal: string, ref: string, text: string, title?: string): Promise<Note>
  note(principal: string, ref: string, noteRef: string): Promise<Note>
  editNote(principal: string, ref: string, noteRef: string, text: string, revision: number): Promise<Note>
  removeNote(principal: string, ref: string, noteRef: string): Promise<unknown>
  addMemory(
    principal: string,
    ref: string,
    input: Pick<MemoryInput, "body" | "kind" | "scope" | "status" | "supersedes"> & { author?: MemoryInput["author"] },
  ): Promise<Memory>
  memories(
    principal: string,
    ref: string,
    options?: { scope?: Memory["scope"]; kind?: Memory["kind"]; limit?: number },
  ): Promise<Memory[]>
  memory(principal: string, ref: string, memoryRef: string, action?: "show" | "confirm" | "stale"): Promise<Memory>
  searchMemories(principal: string, ref: string, query: string, scope: Memory["scope"]): Promise<unknown>
  addFact(
    principal: string,
    ref: string,
    input: { statement: string; type: Fact["type"]; scope?: Memory["scope"]; by?: Author },
  ): Promise<Fact>
  facts(
    principal: string,
    ref: string,
    options?: { type?: Fact["type"]; status?: Fact["status"]; limit?: number },
  ): Promise<Fact[]>
  fact(principal: string, ref: string, factRef: string, action?: "show" | "confirm"): Promise<Fact>
  people(principal: string, ref: string): Promise<unknown>
  linkPerson(principal: string, ref: string, googleId: string, personRef: string): Promise<PersonRecord>
}
export const googleUserId = (user: GoogleUser): string | undefined =>
  user.id || (user.email ? `email:${user.email.trim().toLowerCase()}` : undefined)

export const documentKnowledge = (
  store: MessageStore,
  folder: (principal: string) => Promise<string | undefined>,
): DocumentKnowledge => {
  const document = async (principal: string, ref: string) => {
    const note = await store.notes.resolveNote(ref)
    const folderId = await folder(principal)
    if (!folderId || !note || note.source !== "file" || note.folderId !== folderId || note.deletedAt)
      throw new CliError("not_found", "document is not imported in this Google account", {
        reason: "document.not-imported",
      })
    return note
  }
  const noteFor = async (principal: string, ref: string, noteRef: string) => {
    await document(principal, ref)
    const note = await store.notes.resolveNote(noteRef)
    const linked = (await store.notes.links({ from: noteRef })).some((link) => link.to === ref && link.kind === "about")
    // A note's primary subject is included by the shared about query, not necessarily a links row.
    if (note?.source !== "internal" || note.deletedAt)
      throw new CliError("not_found", "note is not attached to this document")
    if (linked) return note
    for (let offset = 0; offset <= 10000; offset += 500) {
      const page = await store.notes.notes({ source: "internal", about: ref, limit: 500, offset })
      if (page.items.some((n) => n.ref === noteRef)) return note
      if (!page.hasMore) throw new CliError("not_found", "note is not attached to this document")
    }
    throw new CliError("provider_error", "document note lookup exceeded its bound")
  }
  const memoryFor = async (principal: string, ref: string, memoryRef: string) => {
    await document(principal, ref)
    const memory = await store.memories.get(memoryRef)
    if (memory.subject !== ref || !memory.evidence.includes(ref))
      throw new CliError("not_found", "memory is not attached to this document")
    return memory
  }
  const factFor = async (principal: string, ref: string, factRef: string) => {
    await document(principal, ref)
    const fact = await store.facts.get(factRef)
    if (fact.subject !== ref || !fact.evidence.includes(ref))
      throw new CliError("not_found", "fact is not attached to this document")
    return fact
  }
  const port: DocumentKnowledge = {
    matches: async (principal, ref, filters) => {
      const note = await document(principal, ref)
      if (
        filters.tag &&
        !(await store.knowledge.tags(null, { type: "document", id: note.id })).includes(normalizeTag(filters.tag))
      )
        return false
      if (filters.person && !(await store.notes.links({ from: ref })).some((link) => link.to === filters.person))
        return false
      return true
    },
    context: async (principal, ref) => {
      const note = await document(principal, ref)
      return {
        document: note,
        tags: await store.notes.noteTags(ref),
        links: await store.notes.links({ from: ref }),
        notes: await store.notes.notes({ source: "internal", about: ref, limit: 100 }),
        memories: await store.memories.list({ subject: ref, limit: 100 }),
        facts: await store.facts.list({ subject: ref, limit: 100 }),
        people: await port.people(principal, ref),
      }
    },
    tags: async (principal, ref, action, tags = []) => {
      const note = await document(principal, ref)
      const target = { type: "document" as const, id: note.id }
      if (action === "add") return store.knowledge.addTags(null, target, tags)
      if (action === "remove") return store.knowledge.removeTags(null, target, tags)
      return store.knowledge.tags(null, target)
    },
    links: async (principal, ref) => {
      await document(principal, ref)
      return store.notes.links({ from: ref })
    },
    addLink: async (principal, ref, input) => {
      await document(principal, ref)
      return store.notes.addLink({ ...input, from: ref, origin: "owner" })
    },
    removeLink: async (principal, ref, id) => {
      const links = await port.links(principal, ref)
      if (!links.some((link) => link.id === id && link.origin === "owner"))
        throw new CliError("not_found", "owner link is not attached to this document")
      return store.notes.removeLink(id)
    },
    notes: async (principal, ref, options) => {
      await document(principal, ref)
      return store.notes.notes({ ...options, source: "internal", about: ref })
    },
    addNote: async (principal, ref, text, title) => {
      await document(principal, ref)
      return store.notes.addNote({ text, ...(title ? { title } : {}), about: [ref] })
    },
    note: noteFor,
    editNote: async (principal, ref, noteRef, text, revision) => {
      const note = await noteFor(principal, ref, noteRef)
      return store.notes.editNote(note.id, text, revision)
    },
    removeNote: async (principal, ref, noteRef) => {
      const note = await noteFor(principal, ref, noteRef)
      return store.notes.removeNote(note.id)
    },
    addMemory: async (principal, ref, input) => {
      await document(principal, ref)
      if (input.supersedes) await memoryFor(principal, ref, input.supersedes)
      return store.memories.add({ ...input, subject: ref, evidence: [ref], author: input.author ?? "owner" })
    },
    memories: async (principal, ref, options) => {
      await document(principal, ref)
      return store.memories.list({ ...options, subject: ref })
    },
    memory: async (principal, ref, memoryRef, action = "show") => {
      const memory = await memoryFor(principal, ref, memoryRef)
      if (action === "confirm") return store.memories.confirm(memory.ref)
      if (action === "stale") return store.memories.markStale(memory.ref)
      return memory
    },
    searchMemories: async (principal, ref, query, scope) => {
      await document(principal, ref)
      const candidates = await store.memories.search(query, { scope, limit: 200 })
      return {
        items: candidates.filter((memory) => memory.subject === ref),
        candidate_limit_reached: candidates.length === 200,
      }
    },
    addFact: async (principal, ref, { statement, type, scope, by }) => {
      await document(principal, ref)
      return store.facts.add({
        type,
        statement,
        by: by ?? "owner",
        subject: ref,
        evidence: [ref],
        ...(scope === undefined ? {} : { scope }),
      })
    },
    facts: async (principal, ref, options) => {
      await document(principal, ref)
      return store.facts.list({ ...options, subject: ref })
    },
    fact: async (principal, ref, factRef, action = "show") => {
      const fact = await factFor(principal, ref, factRef)
      return action === "confirm" ? store.facts.accept(fact.ref) : fact
    },
    people: async (principal, ref) => {
      const note = await document(principal, ref)
      const metadata = note.frontMatter as { owners?: GoogleUser[]; lastModifiedBy?: GoogleUser }
      const contributors = [
        ...(metadata.owners ?? []).map((user) => ({ ...user, role: "owner" })),
        ...(metadata.lastModifiedBy ? [{ ...metadata.lastModifiedBy, role: "last-editor" }] : []),
      ]
      return {
        items: await Promise.all(
          contributors.map(async (user) => {
            const id = googleUserId(user)
            const person = id ? await store.personOf({ provider: "google-drive", id }) : undefined
            return {
              ...user,
              google_id: id ?? null,
              person: person ? { ref: `person:${person.uid}`, ...person } : null,
            }
          }),
        ),
        coverage: "owners and last editor supplied by Google; not a complete list of historical editors",
      }
    },
    linkPerson: async (principal, ref, googleId, personRef) => {
      const note = await document(principal, ref)
      const metadata = note.frontMatter as { owners?: GoogleUser[]; lastModifiedBy?: GoogleUser }
      const users = [...(metadata.owners ?? []), ...(metadata.lastModifiedBy ? [metadata.lastModifiedBy] : [])]
      if (!users.some((user) => googleUserId(user) === googleId))
        throw new CliError("not_found", "Google identity was not observed on this document")
      if (!personRef.startsWith("person:")) throw new CliError("validation_error", "target must be a person reference")
      const person = await store.personByUid(personRef.slice(7))
      if (!person?.identities[0]) throw new CliError("not_found", "target person has no known identity")
      const linked = await store.linkIdentities(
        person.identities[0],
        { provider: "google-drive", id: googleId },
        {
          method: "manual",
          by: "drive",
        },
      )
      // Identity decisions leave already-imported file links pointing at the former person.
      // Refresh observed Google roles without touching the owner's relationships or names.
      for (const sourceFolder of await store.notes.folders()) {
        if (!sourceFolder.name.startsWith("google-drive:")) continue
        for (let offset = 0; offset <= 10000; offset += 500) {
          const page = await store.notes.notes({ folderId: sourceFolder.id, source: "file", limit: 500, offset })
          for (const source of page.items) {
            const data = source.frontMatter as {
              source?: string
              fileId?: string
              owners?: GoogleUser[]
              lastModifiedBy?: GoogleUser
              sourceVersion?: string
              modifiedAt?: string
            }
            if (data?.source !== "google-drive" || !data.fileId) continue
            const contributors = [...(data.owners ?? []), ...(data.lastModifiedBy ? [data.lastModifiedBy] : [])]
            if (!contributors.some((user) => googleUserId(user) === googleId)) continue
            await saveContributors(
              store,
              sourceFolder.name.slice("google-drive:".length),
              {
                id: data.fileId,
                owners: data.owners,
                lastModifiedBy: data.lastModifiedBy,
                version: data.sourceVersion,
                modifiedAt: data.modifiedAt,
              },
              source.id,
              false,
            )
          }
          if (!page.hasMore) break
          if (offset === 10000)
            throw new CliError("provider_error", "identity linked; document relationship refresh exceeded its bound")
        }
      }
      return linked
    },
  }
  return port
}

export const saveContributors = async (
  store: MessageStore,
  principal: string,
  metadata: Pick<FileMetadata, "id" | "owners" | "lastModifiedBy" | "version" | "modifiedAt">,
  documentId: string,
  register = true,
) => {
  const users = [
    ...(metadata.owners ?? []).map((user) => ({ user, role: "owner" })),
    ...(metadata.lastModifiedBy ? [{ user: metadata.lastModifiedBy, role: "last-editor" }] : []),
  ]
  const key = { provider: "google-drive", account: principal }
  const identified = users.flatMap(({ user, role }) => {
    const id = googleUserId(user)
    return id ? [{ id, user, role }] : []
  })
  if (register && identified.length) {
    await store.saveAccount(key, { name: "Google Drive" })
    await store.savePeople(
      key,
      identified.map(({ id, user }) => ({ id, name: user.name ?? user.email ?? null })),
    )
  }
  const links: Omit<LinkInput, "from" | "origin">[] = []
  for (const { id, user, role } of identified) {
    const person = await store.personOf({ provider: "google-drive", id })
    if (person)
      links.push({
        kind: "related-to",
        to: `person:${person.uid}`,
        role,
        evidence: JSON.stringify({
          fileId: metadata.id,
          version: metadata.version,
          modifiedAt: metadata.modifiedAt,
          user,
        }),
        provenance: "google-drive:files.get",
        confirmed: false,
      })
  }
  await store.notes.replaceFileLinks(documentId, links)
}
