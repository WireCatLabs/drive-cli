import { CliError } from "@wirecat/cli-base"
import { annotate } from "@wirecat/cli-base/commands"
import { answerEntity, FETCH, itemOf, LOCAL_READ, LOCAL_WRITE } from "@wirecat/cli-core/cli"
import type { Command } from "commander"
import { BROWSE_HELP, browseFolders, browseRow, type Call, SHARED_WITH_ME } from "../browse.js"
import { activeProfile, fileId, readConfig, selectedFolders, writeConfig } from "../config.js"
import { bindQuery, FOLDERS_QUERY, folderRow, termsOf } from "../list-queries.js"
import { FOLDER } from "../model.js"
import { allOf } from "../output.js"
import { examples, GOOGLE_READ } from "../registry.js"
import type { CommandContext } from "./context.js"

export const installFolderCommands = (program: Command, context: CommandContext, call: Call) => {
  const { env, selected, output, source } = context
  const folders = annotate(program.command("folders"), { effects: LOCAL_READ }).description(
    "choose the Google Drive folders that sync imports",
  )
  const folderArgument = "folder id or Google Drive URL"
  examples(
    annotate(folders.command("add"), { effects: FETCH })
      .argument("<folder>", folderArgument)
      .description("import a folder and everything under it on the next sync"),
    ["drive personal folders add FOLDER_ID"],
  ).action(async (input: string) => {
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
    output(itemOf({ id: metadata.id, name: metadata.name, added: true }))
  })
  bindQuery(
    examples(
      annotate(folders.command("list"), { effects: LOCAL_READ }).description("list the folder ids sync imports"),
      ["drive personal folders list"],
    ),
    FOLDERS_QUERY,
    folderRow,
  ).action((words: string[]) => {
    const filter = termsOf(words, FOLDERS_QUERY, "folders list")
    output(allOf(selectedFolders(env, selected(), filter)))
  })
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
  examples(
    annotate(folders.command("remove"), { effects: LOCAL_WRITE })
      .argument("<folder>", folderArgument)
      .description("stop importing a folder; the next sync drops its documents"),
    ["drive personal folders remove FOLDER_ID"],
  ).action((input: string) => {
    const id = fileId(input)
    const config = readConfig(env)
    const name = selected()
    const profile = activeProfile(env, name)
    profile.roots = profile.roots.filter((root) => root !== id)
    config.profiles[name] = profile
    writeConfig(env, config)
    output(itemOf({ id, removed: true }))
  })
}
