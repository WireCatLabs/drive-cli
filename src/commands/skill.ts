import { createRenderer } from "@wirecat/cli-base"
import { annotate, customizeSharedCommand } from "@wirecat/cli-base/commands"
import { skillCommand } from "@wirecat/cli-base/skill"
import {
  grantsAuthority,
  itemOf,
  LOCAL_WRITE,
  NO_EFFECTS,
  skillCommand as sharedSkillCommand,
} from "@wirecat/cli-core/cli"
import type { Command } from "commander"
import { SHELL_OVERRIDES } from "../contract-overrides.js"
import { VERSION } from "../version.js"
import type { CommandContext } from "./context.js"

const installSkillCommandDefinition = (program: Command, { env, streams, output }: CommandContext) => {
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

export const installSkillCommand = (...args: Parameters<typeof installSkillCommandDefinition>) => {
  customizeSharedCommand(
    sharedSkillCommand(
      { command: "drive", appName: "drive-cli", envPrefix: "DRIVE", description: "Google Drive", version: VERSION },
      new URL("../../skills/drive-cli/SKILL.md", import.meta.url),
    ),
    "Drive binds agent installation to its own output renderer and provider skill locations.",
    () => {
      installSkillCommandDefinition(...args)
      const command = args[0].commands.find((command) => command.name() === "skill")
      if (!command) throw new Error("skill builder did not install its command")
      return command
    },
    SHELL_OVERRIDES.skill,
  )
}
