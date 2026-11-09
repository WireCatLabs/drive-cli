import { execFileSync } from "node:child_process"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import { changelogProblems, docsProblems, JOURNAL_IDS, structureProblems } from "@wirecat/cli-base/release"
import { CHANGELOG } from "./docs-rules.ts"

const root = fileURLToPath(new URL("..", import.meta.url))
const files = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard", "*.md"], {
  cwd: root,
  encoding: "utf8",
})
  .split("\n")
  .filter((file) => file && file !== "CHANGELOG.md")
  .map((file) => join(root, file))

// Releases through 0.17.1 retain their original ISO dates; released text is frozen.
const changelog = readFileSync(join(root, "CHANGELOG.md"), "utf8").split(/^## 0\.17\.1 /m)[0] ?? ""
const problems = [
  ...changelogProblems(changelog, { release: false, ...CHANGELOG }),
  ...docsProblems(root, { files, ids: JOURNAL_IDS, userPage: (name) => name === "README.md" }),
  ...structureProblems(root),
]
for (const problem of problems) console.error(problem)
if (problems.length > 0) process.exit(1)
console.log("docs: ok")
