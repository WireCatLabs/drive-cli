import { resolve } from "node:path"
import { syncDiscovery } from "@wirecat/cli-base/codegen"

await syncDiscovery(
  {
    drive: "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
    docs: "https://docs.googleapis.com/$discovery/rest?version=v1",
    driveactivity: "https://driveactivity.googleapis.com/$discovery/rest?version=v2",
    sheets: "https://sheets.googleapis.com/$discovery/rest?version=v4",
  },
  { dir: resolve(import.meta.dirname, "../spec/google") },
)
process.stderr.write("Public Discovery snapshots refreshed; review their diff and run pnpm generate\n")
