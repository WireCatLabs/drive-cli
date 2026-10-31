import { fileURLToPath } from "node:url"
import { metaOf } from "@wirecat/cli-base/commands"
import { type FirstScreen, guideCommand, type HelpSection, inSection, MEMO_SCENARIOS } from "@wirecat/cli-core/cli"
import type { Command } from "commander"

const SECTIONS: Record<string, HelpSection> = {
  search: "read",
  status: "read",
  documents: "read",
  catalog: "read",
  api: "read",
  comments: "read",
  permissions: "read",
  revisions: "read",
  "shared-drives": "read",
  files: "write",
  sheets: "write",
  tags: "organise",
  relationships: "organise",
  notes: "organise",
  memories: "organise",
  facts: "organise",
  identities: "organise",
  sync: "automate",
  mcp: "automate",
  mirrors: "automate",
  session: "setup",
  folders: "setup",
  store: "setup",
  config: "setup",
  models: "setup",
  images: "setup",
  complete: "setup",
  commands: "setup",
  guide: "setup",
  skill: "setup",
  doctor: "setup",
  upgrade: "setup",
}

export const guide = () =>
  guideCommand(
    { command: "drive" },
    {
      directory: fileURLToPath(new URL("../scenarios", import.meta.url)),
      worksWith: [MEMO_SCENARIOS.personBrief, MEMO_SCENARIOS.decisionTrail],
    },
  )

export const FIRST_SCREEN: FirstScreen = {
  pitch: "chosen Google Drive folders as a local, searchable library: Docs, Sheets, PDF and docx as text, offline.",
  can: [
    { command: "folders add <url>", does: "choose folders; only these are imported" },
    { command: "sync --embed", does: "import what changed and index it by meaning" },
    { command: 'search "budget decision"', does: "every imported document, by words and meaning" },
    { command: "documents context <doc>", does: "a document with its tags, notes and editors" },
    { command: "documents history <doc> --activity", does: "who did what (needs --grant activity)" },
    { command: "memories extract <doc>", does: "memories with exact quotes, proposed by a model" },
    { command: "documents export <doc>", does: "Markdown in a new file (--output); never overwrites" },
    { command: "--read-only …", does: "this run refuses every change" },
  ],
  start: "drive personal session start",
}

export const placeInSections = (program: Command) => {
  for (const command of program.commands) {
    const section = SECTIONS[command.name()]
    if (section) inSection(command, section)
    if (["files", "sheets", "comments"].includes(command.name()))
      for (const child of command.commands)
        inSection(child, metaOf(child).effects?.remote === "write" ? "write" : "read")
  }
}
