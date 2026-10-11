import { execFileSync } from "node:child_process"
import { createHash } from "node:crypto"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import {
  coverageGenerator,
  definitionsGenerator,
  generate,
  manifestGenerator,
  typesGenerator,
  valibotGenerator,
  writeArtifacts,
} from "@wirecat/cli-core/codegen"
import { adaptDiscovery } from "./discovery-adapter.ts"

const root = resolve(import.meta.dirname, "..")
const provenance = JSON.parse(readFileSync(`${root}/spec/google/provenance.json`, "utf8")) as Record<
  string,
  { sha256: string }
>
const documents: Record<string, unknown> = {}
for (const [service, source] of Object.entries(provenance)) {
  const raw = readFileSync(`${root}/spec/google/${service}.json`)
  if (createHash("sha256").update(raw).digest("hex") !== source.sha256)
    throw new Error(`Discovery hash mismatch: ${service}`)
  documents[service] = JSON.parse(raw.toString("utf8"))
}
const { model, metadata } = adaptDiscovery(documents)
const artifacts = generate(
  model,
  [
    typesGenerator({ path: "src/generated/types.ts" }),
    valibotGenerator({ path: "src/generated/schemas.ts", typesImport: "./types.js" }),
    manifestGenerator({ path: "src/generated/manifest.ts" }),
    definitionsGenerator({ path: "src/generated/definitions.ts" }),
    coverageGenerator({
      path: "docs/dev/API_COVERAGE.md",
      title: "Google API coverage",
      command: (op) => `drive <profile> api ${op.command}`,
    }),
  ],
  { banner: ["Source: spec/google/*.json, verified by provenance.json", "Run: pnpm generate"] },
)
artifacts.push({
  path: "src/generated/metadata.ts",
  content: `export const metadata = ${JSON.stringify(metadata, null, 2)}\n`,
})
const format = (path: string, content: string) =>
  path.endsWith(".ts")
    ? execFileSync(
        process.execPath,
        [`${root}/node_modules/@biomejs/biome/bin/biome`, "check", "--write", `--stdin-file-path=${path}`],
        { cwd: root, encoding: "utf8", input: content },
      )
    : content
const stale = writeArtifacts(artifacts, { root, check: process.argv.includes("--check"), format })
if (process.argv.includes("--check") && stale.length) {
  process.stderr.write(`Generated files are stale: ${stale.join(", ")}; run pnpm generate\n`)
  process.exitCode = 1
}
process.stderr.write(`${model.operations.length} operations generated from verified offline snapshots\n`)
