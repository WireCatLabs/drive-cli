import { CliError } from "@wirecat/cli-base"
import { annotate } from "@wirecat/cli-base/commands"
import { parseLucene, validateQuery } from "@wirecat/cli-base/query"
import { CATALOG_QUERY } from "@wirecat/cli-core/store"
import type { Command } from "commander"
import { catalogFiles, catalogOutput, catalogTree, type SourceCatalog } from "./catalog.js"
import { activeProfile, fileId } from "./config.js"
import type { DocumentIndex } from "./model.js"
import { lockProfile } from "./profile-lock.js"
import { examples } from "./registry.js"
import { readState } from "./state.js"

interface Helpers {
  env: NodeJS.ProcessEnv
  selected(): string
  output(value: unknown): void
  positive(input: string): number
  offset(input: string): number
  withIndex<T>(fn: (index: DocumentIndex) => Promise<T>): Promise<T>
}
export const installCatalogCommands = (program: Command, helpers: Helpers) => {
  const { env, selected, output, positive, offset, withIndex } = helpers
  const catalog = program.command("catalog").description("browse stored Drive files and folders offline")
  const run = async <T>(
    fn: (index: DocumentIndex & { catalog: SourceCatalog }, principal: string) => Promise<T>,
    write = false,
  ) => {
    const profile = activeProfile(env, selected())
    const lock = write ? await lockProfile(env, selected()) : undefined
    try {
      return await withIndex(async (index) => {
        if (!index.catalog)
          throw new CliError("configuration_error", "index has no shared catalog adapter", {
            reason: "catalog.unavailable",
          })
        lock?.assertHeld()
        const value = await fn({ ...index, catalog: index.catalog }, profile.principal)
        lock?.assertHeld()
        return value
      })
    } finally {
      await lock?.release()
    }
  }
  const entry = async (index: DocumentIndex, principal: string, id: string) => {
    const found = await index.catalog?.get(principal, fileId(id))
    if (!found)
      throw new CliError("not_found", "file or folder is not in the active local catalog; run catalog import or sync", {
        reason: "catalog.not-found",
      })
    return found
  }
  const local = (command: Command, mutates = false) => {
    annotate(command, { effects: { remote: "none", local: mutates ? "write" : "read" } })
    return command
  }
  examples(
    local(catalog.command("import").description("put cached file and folder metadata into the shared database"), true),
    ["drive personal catalog import --offline"],
  ).action(async () =>
    output(
      await run(async (index, principal) => {
        const state = readState(env, selected(), principal)
        return index.catalog.import(principal, catalogFiles(state, activeProfile(env, selected()).roots))
      }, true),
    ),
  )
  examples(local(catalog.command("show").description("show stored metadata and the stable file or folder reference")), [
    "drive personal catalog show FILE_ID --offline",
  ])
    .argument("<file>", "Google file or folder id, or its Drive URL")
    .action(async (id: string) =>
      output(await run(async (index, principal) => catalogOutput(await entry(index, principal, id)))),
    )
  const list = async (words: string[], args: { limit: number; page: number }, search: boolean) => {
    const ast = words.length
      ? validateQuery(parseLucene(words.join(" "), { defaultField: search ? "text" : "none" }), CATALOG_QUERY)
      : undefined
    output(
      await run(async (index, principal) => {
        const result = await index.catalog.list(principal, {
          ast,
          limit: args.limit,
          offset: (args.page - 1) * args.limit,
        })
        return { items: result.items.map(catalogOutput), has_more: result.hasMore }
      }),
    )
  }
  for (const action of ["list", "search"] as const) {
    const command = examples(
      local(
        catalog
          .command(action)
          .description(
            action === "list"
              ? "list cached files and folders using metadata queries"
              : "search cached names, descriptions, types and observed people",
          ),
      ),
      [
        action === "list"
          ? 'drive personal catalog list "parent:FOLDER_ID AND kind:file" --offline'
          : 'drive personal catalog search "budget AND person:Rin*" --offline',
      ],
    )
      .argument(
        action === "list" ? "[query...]" : "<query...>",
        "metadata query: kind, mime, name, parent, person, tag; AND, OR, NOT",
      )
      .option("--limit <n>", "how many entries to return (at most 1000)", positive, 50)
      .option("--page <n>", "which page to return", positive, 1)
      .action(async (words: string[], args: { limit: number; page: number }) => list(words, args, action === "search"))
    annotate(command, { query: CATALOG_QUERY, output: { entity: "document" } })
  }
  examples(
    local(catalog.command("tree").description("show the cached hierarchy below a folder or all selected roots")),
    ["drive personal catalog tree --offline", "drive personal catalog tree FOLDER_ID --depth 3 --offline"],
  )
    .argument("[folder]", "Google folder id or URL; defaults to the explicitly selected profile's roots")
    .option("--depth <n>", "maximum descendant depth, from 0 to 50", offset, 5)
    .action(async (id: string | undefined, args: { depth: number }) =>
      output(
        await run(async (index, principal) => {
          const items = []
          for (let skip = 0; skip < 10000; skip += 1000) {
            const page = await index.catalog.list(principal, { limit: 1000, offset: skip })
            items.push(...page.items)
            if (!page.hasMore) break
          }
          const roots = id ? [fileId(id)] : activeProfile(env, selected()).roots
          return {
            items: catalogTree(
              items,
              roots.map((root) => `${root}.md`),
              args.depth,
            ),
          }
        }),
      ),
    )
  const tags = catalog.command("tags").description("add owner tags to cached files or folders")
  for (const action of ["list", "add", "remove"] as const) {
    const command = examples(
      local(tags.command(action).description(`${action} local tags on a cached file or folder`), action !== "list"),
      [`drive personal catalog tags ${action} FOLDER_ID${action === "list" ? "" : " project"} --offline`],
    ).argument("<file>", "Google file or folder id, or its Drive URL")
    if (action !== "list") command.argument("<tags...>", "local tag names")
    command.action(async (id: string, values?: string[]) =>
      output(
        await run(async (index, principal) => {
          const found = await entry(index, principal, id)
          if (!index.knowledge) throw new CliError("configuration_error", "index has no shared knowledge adapter")
          return index.knowledge.tags(principal, found.ref, action, action === "list" ? undefined : values)
        }, action !== "list"),
      ),
    )
  }
}
