import { CliError } from "@wirecat/cli-base"
import {
  type DocumentKnowledge as SharedDocumentKnowledge,
  documentKnowledge as sharedKnowledge,
} from "@wirecat/cli-core/documents"
import type { LinkInput, MessageStore, PersonRecord } from "@wirecat/cli-core/store"
import { factItem, memoryItem } from "./knowledge-query.js"
import type { FileMetadata, GoogleUser } from "./model.js"
export interface DocumentKnowledge extends SharedDocumentKnowledge {
  context(principal: string, ref: string): Promise<unknown>
  people(principal: string, ref: string): Promise<unknown>
  linkPerson(principal: string, ref: string, googleId: string, personRef: string): Promise<PersonRecord>
}
export const googleUserId = (user: GoogleUser): string | undefined =>
  user.id || (user.email ? `email:${user.email.trim().toLowerCase()}` : undefined)

export const documentKnowledge = (
  store: MessageStore,
  folder: (principal: string) => Promise<string | undefined>,
): DocumentKnowledge => {
  const shared = sharedKnowledge(store, folder)
  const document = shared.document
  const port: DocumentKnowledge = {
    ...shared,
    context: async (principal, ref) => {
      const note = await document(principal, ref)
      return {
        document: note,
        tags: await store.notes.noteTags(ref),
        links: await store.notes.links({ from: ref }),
        notes: await store.notes.notes({ source: "internal", about: ref, limit: 100 }),
        memories: (await store.memories.list({ subject: ref, limit: 100 })).map(memoryItem),
        facts: (await store.facts.list({ subject: ref, limit: 100 })).map(factItem),
        people: await port.people(principal, ref),
      }
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
