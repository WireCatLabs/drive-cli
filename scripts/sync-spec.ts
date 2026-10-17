import { createHash } from "node:crypto"
import { writeFileSync } from "node:fs"
import { resolve } from "node:path"

const root = resolve(import.meta.dirname, "../spec/google")
const sources = {
  drive: "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
  docs: "https://docs.googleapis.com/$discovery/rest?version=v1",
  sheets: "https://sheets.googleapis.com/$discovery/rest?version=v4",
  driveactivity: "https://driveactivity.googleapis.com/$discovery/rest?version=v2",
}
const provenance: Record<string, unknown> = {}
for (const [service, source] of Object.entries(sources)) {
  const response = await fetch(source, { signal: AbortSignal.timeout(30000), redirect: "error" })
  if (!response.ok) throw new Error("Google Discovery fetch failed")
  const raw = await response.text()
  const doc = JSON.parse(raw)
  writeFileSync(`${root}/${service}.json`, raw)
  provenance[service] = {
    source,
    revision: doc.revision,
    version: doc.version,
    sha256: createHash("sha256").update(raw).digest("hex"),
  }
}
writeFileSync(`${root}/provenance.json`, `${JSON.stringify(provenance, null, 2)}\n`)
process.stderr.write("Public Discovery snapshots refreshed; review their diff and run pnpm generate\n")
