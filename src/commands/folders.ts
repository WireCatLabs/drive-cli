import { CliError } from "@wirecat/cli-base"
import { annotate } from "@wirecat/cli-base/commands"
import { answerEntity } from "@wirecat/cli-core/cli"
import { addDocumentFolderCommands } from "@wirecat/cli-core/documents/cli"
import type { Command } from "commander"
import { BROWSE_HELP, browseFolders, browseRow, type Call, SHARED_WITH_ME } from "../browse.js"
import { activeProfile, fileId, readConfig, selectedFolders, writeConfig } from "../config.js"
import { FOLDER } from "../model.js"
import { examples, GOOGLE_READ } from "../registry.js"
import { type CommandContext, DRIVE_WORDS } from "./context.js"

export const installFolderCommands = (program: Command, context: CommandContext, call: Call) => {
  const { env, selected, output, source } = context
  addDocumentFolderCommands(program, {
    words: DRIVE_WORDS,
    output,
    add: async (input) => {
      const id = fileId(input)
      const config = readConfig(env)
      const name = selected()
      const profile = activeProfile(env, name)
      const metadata = await (await source()).metadata(id)
      if (metadata.mime !== FOLDER || metadata.trashed)
        throw new CliError("validation_error", "source is not an accessible Google folder")
      if (!profile.roots.includes(metadata.id)) profile.roots.push(metadata.id)
      config.profiles[name] = profile
      writeConfig(env, config)
      return { id: metadata.id, name: metadata.name }
    },
    list: (filter) => selectedFolders(env, selected(), filter),
    browse: (folders) => {
      examples(
        answerEntity(
          annotate(folders.command("browse"), { effects: GOOGLE_READ }).description(
            "list Google Drive folders one level at a time, to choose one for folders add",
          ),
          "drive_remote_folder",
          browseRow,
        ),
        [
          "drive personal folders browse",
          "drive personal folders browse --parent FOLDER_ID --json",
          `drive personal folders browse --parent ${SHARED_WITH_ME}`,
        ],
      )
        .option("--parent <id>", `folder id or URL to list inside, or ${SHARED_WITH_ME}; the top level without it`)
        .addHelpText("after", BROWSE_HELP)
        .action(async (args: { parent?: string }) => {
          const parent = args.parent === undefined || args.parent === SHARED_WITH_ME ? args.parent : fileId(args.parent)
          const roots = activeProfile(env, selected()).roots
          output(await browseFolders(call, parent, roots))
        })
    },
    remove: (input) => {
      const id = fileId(input)
      const config = readConfig(env)
      const name = selected()
      const profile = activeProfile(env, name)
      profile.roots = profile.roots.filter((root) => root !== id)
      config.profiles[name] = profile
      writeConfig(env, config)
      return id
    },
  })
}
