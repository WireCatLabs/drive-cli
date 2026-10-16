import { CliError } from "@wirecat/cli-base"
import { annotate } from "@wirecat/cli-base/commands"
import { FETCH, itemOf, LOCAL_READ, LOCAL_WRITE } from "@wirecat/cli-core/cli"
import type { Command } from "commander"
import { activeProfile, fileId, readConfig, writeConfig } from "../config.js"
import { FOLDER } from "../model.js"
import { allOf } from "../output.js"
import { examples } from "../registry.js"
import type { CommandContext } from "./context.js"

export const installFolderCommands = (program: Command, context: CommandContext) => {
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
  examples(annotate(folders.command("list"), { effects: LOCAL_READ }).description("list the folder ids sync imports"), [
    "drive personal folders list",
  ]).action(() => output(allOf(activeProfile(env, selected()).roots.map((id) => ({ id })))))
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
