/**
 * Links, anchors and the user-page rules in every tracked document, and the docs folder against its sidebar
 * (`docs/meta.json`). Not the changelog's shape: drive's released sections use ISO dates and a "Changed" heading,
 * which the shared shape refuses, and a released section is never edited.
 *
 *   pnpm docs:check
 */
import { execFileSync } from "node:child_process"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import { docsProblems, JOURNAL_IDS, structureProblems } from "@wirecat/cli-base/release"

const root = fileURLToPath(new URL("..", import.meta.url))
const files = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard", "*.md"], {
  cwd: root,
  encoding: "utf8",
})
  .split("\n")
  .filter((file) => file && file !== "CHANGELOG.md")
  .map((file) => join(root, file))

const problems = [
  ...docsProblems(root, { files, ids: JOURNAL_IDS, userPage: (name) => name === "README.md" }),
  ...structureProblems(root),
]
for (const problem of problems) console.error(problem)
if (problems.length > 0) process.exit(1)
console.log("docs: ok")
