import { mkdtempSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { vi } from "vitest"
import { writeConfig } from "./config.js"
import { DOC, type DocumentContent, type DocumentIndex, type FileMetadata, FOLDER, type GoogleSource } from "./model.js"

export const file = (id: string, parents = ["root"], mime = DOC): FileMetadata => ({
  id,
  name: "Same name",
  parents,
  mime,
  version: "1",
  url: `https://docs.google.com/document/d/${id}/edit`,
  trashed: false,
  canDownload: true,
})
export const content = (metadata: FileMetadata, text = "budget decision"): DocumentContent => ({
  metadata,
  markdown: `# ${text}\n`,
  text,
  tabs: [],
})
export const fixture = (roots = ["root"]) => {
  const directory = mkdtempSync(join(tmpdir(), "drive-test-"))
  const env: NodeJS.ProcessEnv = {
    DRIVE_CONFIG_DIR: join(directory, "config"),
    DRIVE_STATE_DIR: join(directory, "state"),
    DRIVE_CACHE_DIR: join(directory, "cache"),
    DRIVE_STORE: join(directory, "store.db"),
    CLI_COMMON_CACHE_DIR: join(directory, "models"),
    MESSAGING_STORE: join(directory, "never-owner.db"),
  }
  writeConfig(env, { profiles: { default: { principal: "synthetic-principal", roots, storage: "keyring" } } })
  const stored = new Map<string, DocumentContent>()
  const index: DocumentIndex = {
    save: vi.fn(async (_principal, doc) => {
      stored.set(doc.metadata.id, doc)
      return `document:${doc.metadata.id}`
    }),
    remove: vi.fn(async (_principal, id) => {
      stored.delete(id)
    }),
    search: vi.fn(async () => ({ hits: [] })),
    embed: vi.fn(async () => ({ embedded: 0 })),
    close: vi.fn(async () => {}),
  }
  const source: GoogleSource = {
    identity: vi.fn(async () => "synthetic-principal"),
    metadata: vi.fn(async (id) => file(id, [], FOLDER)),
    children: vi.fn(async () => [file("doc-a"), file("doc-b")]),
    startToken: vi.fn(async () => "before-crawl"),
    changes: vi.fn(async () => ({ items: [], cursor: "after-changes" })),
    content: vi.fn(async (id) => content(file(id))),
  }
  return { directory, env, index, source, stored }
}
