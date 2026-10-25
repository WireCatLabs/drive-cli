import { annotate } from "@wirecat/cli-base/commands"
import { itemOf, LOCAL_READ, LOCAL_WRITE, storeInfo } from "@wirecat/cli-core/cli"
import type { Command } from "commander"
import { examples } from "../registry.js"
import { checkStoreImport, importStore, transferBindings } from "../store-import.js"
import type { CommandContext } from "./context.js"

export const installStoreCommands = (program: Command, context: CommandContext) => {
  const { env, selected, output } = context
  const store = annotate(program.command("store"), { effects: LOCAL_READ }).description(
    "the shared store, and importing this profile's previous document database",
  )
  examples(
    annotate(store.command("info"), { effects: LOCAL_READ, output: { entity: "store_info" } })
      .description(
        "the shared store file: where it is, its size, its schema against the one drive speaks, which tools used it and how many rows it holds; changes nothing",
      )
      .summary("the shared store's format and size, and whether drive can read it"),
    ["drive store info --json"],
  ).action(async () => output(itemOf(await storeInfo(env))))
  examples(
    annotate(store.command("check"), { effects: LOCAL_READ })
      .description("preview documents, annotations and unresolved references without changing either database")
      .summary("preview copying document context without changing either database")
      .argument("<source>", "previous Drive database file")
      .argument("[bindings]", "optional JSON file mapping source references to destination references"),
    ["drive personal store check /path/to/previous.db --offline"],
  ).action(async (source: string, bindings?: string) =>
    output(itemOf(await checkStoreImport(env, selected(), source, transferBindings(bindings)))),
  )
  examples(
    annotate(store.command("import"), { effects: LOCAL_WRITE })
      .description(
        "copy the reviewed document annotations and bind this profile to the selected store; retain the source",
      )
      .summary("copy reviewed document context and bind this profile to the selected store")
      .argument("<source>", "previous Drive database file")
      .argument("[bindings]", "the same optional reference mapping JSON file used for store check")
      .requiredOption(
        "--fingerprint <hash>",
        "refuse if the reviewed source, destination or reference decisions changed",
      ),
    ["drive personal store import /path/to/previous.db --fingerprint HASH --offline"],
  ).action(async (source: string, bindings: string | undefined, args: { fingerprint: string }) =>
    output(itemOf(await importStore(env, selected(), source, args.fingerprint, transferBindings(bindings)))),
  )
}
