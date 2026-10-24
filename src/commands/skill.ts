import { createRenderer } from "@wirecat/cli-base"
import { annotate } from "@wirecat/cli-base/commands"
import { skillCommand } from "@wirecat/cli-base/skill"
import { grantsAuthority, itemOf, LOCAL_WRITE, NO_EFFECTS } from "@wirecat/cli-core/cli"
import type { Command } from "commander"
import { VERSION } from "../version.js"
import type { CommandContext } from "./context.js"

export const installSkillCommand = (program: Command, { env, streams, output }: CommandContext) => {
  const skill = skillCommand(
    { command: "drive", appName: "drive-cli", version: VERSION },
    new URL("../../skills/drive-cli/SKILL.md", import.meta.url),
    () => ({
      renderer: {
        ...createRenderer({ format: "pretty", color: false, streams, quiet: program.opts().quiet === true }),
        result: (value) => output(itemOf(value as Record<string, unknown>)),
      },
      streams,
      env,
    }),
  )
  for (const child of skill.commands) {
    const install = child.name() === "install"
    if (install) grantsAuthority(child)
    // The text skill show prints ships inside the package.
    annotate(child, {
      effects: install ? LOCAL_WRITE : NO_EFFECTS,
      examples: [install ? "drive skill install --for all" : "drive skill show"],
    }).summary(install ? "put SKILL.md where Claude Code, Codex and Gemini CLI look" : "print drive's SKILL.md")
  }
  program.addCommand(annotate(skill, { effects: NO_EFFECTS }))
}
