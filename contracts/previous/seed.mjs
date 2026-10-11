import { createHash } from "node:crypto"
import { mkdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { resolvePaths } from "@wirecat/cli-core"
import { ensureSqlite } from "@wirecat/cli-messaging/sqlite-runtime"
import { openStore } from "@wirecat/cli-messaging/store"

if (!process.env.WIRECAT_CONTRACT_DENIED || !process.env.XDG_STATE_HOME || !process.env.XDG_CONFIG_HOME)
  throw new Error("requires the isolated contract runner")
await ensureSqlite()
const locations = resolvePaths({ appName: "drive-cli", prefix: "DRIVE", env: process.env })
const directory = locations.state
mkdirSync(directory, { recursive: true, mode: 0o700 })
const store = await openStore({ path: join(directory, "drive.db"), command: "drive" })
try {
  const folder = await store.notes.addFolder({ name: "google-drive:synthetic-principal" })
  const text = "budget fixture upgrade evidence"
  const hash = createHash("sha256").update(text).digest("hex")
  const metadata = {
    id: "synthetic-doc",
    name: "Synthetic",
    mime: "application/vnd.google-apps.document",
    parents: [],
    url: "https://docs.google.com/document/d/synthetic-doc/edit",
    trashed: false,
    canDownload: true,
  }
  const { note } = await store.notes.saveFileNote({
    folderId: folder.id,
    path: "synthetic-doc.md",
    title: "Synthetic",
    text,
    contentHash: hash,
    frontMatter: { source: "google-drive", sourceUrl: metadata.url, fileId: metadata.id, owners: [], tabs: [] },
  })
  await store.knowledge.addTags(null, { type: "document", id: note.id }, ["budget"])
  await store.notes.addNote({ text: "Synthetic owner memo", about: [note.ref] })
  await store.memories.add({
    body: "Synthetic budget fact",
    kind: "fact",
    subject: note.ref,
    evidence: [note.ref],
    author: "owner",
    scope: "work",
  })
  const profile = join(directory, "profiles/default")
  mkdirSync(join(profile, "documents"), { recursive: true, mode: 0o700 })
  writeFileSync(
    join(profile, "state.json"),
    JSON.stringify({
      version: 1,
      principal: "synthetic-principal",
      scope: "",
      folders: {},
      documents: { "synthetic-doc": { metadata, hash, reference: note.ref, tabs: 0 } },
      skipped: [],
    }),
  )
  writeFileSync(
    join(profile, "documents/synthetic-doc.json"),
    JSON.stringify({ metadata, text, markdown: text, tabs: [] }),
  )
  const configDir = locations.config
  mkdirSync(configDir, { recursive: true, mode: 0o700 })
  writeFileSync(
    join(configDir, "config.json"),
    JSON.stringify({ profiles: { default: { principal: "synthetic-principal", roots: [], storage: "keyring" } } }),
  )
  process.stdout.write(`${JSON.stringify({ seeded: true, document: note.ref })}\n`)
} finally {
  await store.close()
}
