import { mkdtempSync, readFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import { captureStreams } from "@wirecat/cli-base"
import { flatten } from "@wirecat/cli-base/commands"
import { checkGuide } from "@wirecat/cli-core/cli"
import { validateSkill } from "@wirecat/cli-core/skill-validation"
import { describe, expect, it } from "vitest"
import { createProgram } from "./program.js"
import { describeDriveProgram } from "./registry.js"
import { VERSION } from "./version.js"

const run = async (args: string[], env: NodeJS.ProcessEnv = {}) => {
  const streams = captureStreams()
  await createProgram({ env, streams })
    .parseAsync(args, { from: "user" })
    .catch((error: { exitCode?: number }) => {
      if (error.exitCode !== 0) throw error
    })
  return streams.stdout.join("")
}

describe("help without a profile or an account", () => {
  it("shows the first screen on --help and keeps the full help at --help-all", async () => {
    const screen = await run(["--help"])
    expect(screen).toContain("Google Drive")
    expect(screen).toContain("folders add <url>")
    expect(screen).not.toContain("--max-output-bytes")
    expect(await run(["--help-all"])).toContain("--max-output-bytes")
  })

  it("reads help as a command, never as a profile", async () => {
    expect(await run(["help", "options"])).toContain("--read-only")
    expect(await run(["help", "documents", "context"])).toContain("Usage: drive <profile> documents context")
  })

  it("prints --help for every leaf command", async () => {
    const leaves = flatten(describeDriveProgram(createProgram({ env: {} }))).filter((one) => !one.commands.length)
    for (const leaf of leaves) expect(await run([...leaf.path, "--help"]), leaf.path.join(" ")).toContain("Usage:")
  })

  it("lists the commands by section as text, and as data with --json", async () => {
    expect(await run(["commands"])).toMatch(/^drive commands, by section/)
    expect(JSON.parse(await run(["commands", "--json"])).cli).toBe("drive")
  })

  it("keeps every scenario step runnable", async () => {
    const packageRoot = fileURLToPath(new URL("..", import.meta.url))
    expect(await checkGuide(() => createProgram({ env: {} }), { packageRoot })).toEqual([])
  })

  it("refuses a model download under --offline before anything is fetched", async () => {
    await expect(run(["--offline", "models", "text", "download", "e5-small"])).rejects.toMatchObject({
      code: "permission_error",
      details: { reason: "offline.refused" },
    })
  })
})

describe("skill", () => {
  const skill = new URL("../skills/drive-cli/SKILL.md", import.meta.url)

  it("ships a skill whose frontmatter and every drive command it names are valid", () => {
    expect(
      validateSkill(readFileSync(skill, "utf8"), { folder: "drive-cli", program: createProgram({ env: {} }) }),
    ).toEqual([])
  })

  it("prints the skill and installs it, stamped with this version, where agents look", async () => {
    expect(await run(["skill", "show"])).toContain("name: drive-cli")
    const home = mkdtempSync(join(tmpdir(), "drive-skill-"))
    await run(["skill", "install", "--for", "claude", "--json"], { HOME: home })
    expect(readFileSync(join(home, ".claude", "skills", "drive-cli", "SKILL.md"), "utf8")).toContain(
      `version: "${VERSION}"`,
    )
  })
})
