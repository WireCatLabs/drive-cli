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
import { DRIVE_APP } from "../policy.js"
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
    if (child.name() === "install")
      annotate(grantsAuthority(child), { effects: LOCAL_WRITE, examples: ["drive skill install --for all"] }).summary(
        "put SKILL.md where Claude Code, Codex and Gemini CLI look",
      )
    if (child.name() === "show") annotate(child, { examples: ["drive skill show"] }).summary("print drive's SKILL.md")
  }
  program.addCommand(annotate(skill, { effects: NO_EFFECTS }))
}

export const installSkillCommand = (...args: Parameters<typeof installSkillCommandDefinition>) => {
  customizeSharedCommand(
    sharedSkillCommand(DRIVE_APP, new URL("../../skills/drive-cli/SKILL.md", import.meta.url)),
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
