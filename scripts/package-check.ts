import { fileURLToPath } from "node:url"
import { packageVersion, packContents, releaseCheck } from "@wirecat/cli-base/release"

const root = fileURLToPath(new URL("..", import.meta.url))
const PACKED = ["dist/", "scenarios/", "skills/", "package.json", "README.md", "LICENSE"]
const PACKED_SAID = "dist/, scenarios/, skills/, package.json, README.md and LICENSE"

const failed = releaseCheck([{ name: "package contents", run: packContents(root, PACKED, PACKED_SAID) }], {
  version: packageVersion(root),
  log: console.log,
})
process.exit(failed === 0 ? 0 : 1)
