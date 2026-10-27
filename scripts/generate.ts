import { execFileSync } from "node:child_process"
import { resolve } from "node:path"
import {
  adaptDiscovery,
  coverageGenerator,
  definitionsGenerator,
  generate,
  manifestGenerator,
  readDiscovery,
  typesGenerator,
  valibotGenerator,
  writeArtifacts,
} from "@wirecat/cli-base/codegen"

const root = resolve(import.meta.dirname, "..")
const { model, metadata } = adaptDiscovery(readDiscovery(`${root}/spec/google`), {
  sourceRevision: "spec/google/provenance.json",
})
const read = (reason: string) => ({ effect: "read" as const, reason })
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
  {
    banner: ["Source: spec/google/*.json, verified by provenance.json", "Run: pnpm generate"],
    overrides: {
      "driveactivity.activity.query": read("a POST that only searches the activity history"),
      "drive.files.download": read("a POST that starts a download; it changes no file"),
      "sheets.spreadsheets.getByDataFilter": read("a POST that only reads cells matching the filters"),
      "sheets.spreadsheets.values.batchGetByDataFilter": read("a POST that only reads values matching the filters"),
      "sheets.spreadsheets.developerMetadata.search": read("a POST that only searches developer metadata"),
      "drive.files.emptyTrash": { effect: "destructive", reason: "permanently deletes every trashed file" },
    },
  },
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
