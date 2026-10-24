import { mkdirSync, writeFileSync } from "node:fs"
import { dirname } from "node:path"
import { CliError } from "@wirecat/cli-base"
import { annotate } from "@wirecat/cli-base/commands"
import { itemOf, LOCAL_READ, LOCAL_WRITE, listOf, listQuery, typedQuery, withQuery } from "@wirecat/cli-core/cli"
import { IMPORTED_DOCUMENT_QUERY } from "@wirecat/cli-core/store"
import type { Command } from "commander"
import { activeProfile, fileId } from "../config.js"
import { metadataJson } from "../model.js"
import { examples } from "../registry.js"
import { readSnapshot, readState } from "../state.js"
import { type CommandContext, positive } from "./context.js"

export const importedDocument =
  ({ env, selected }: Pick<CommandContext, "env" | "selected">) =>
  (input: string) => {
    const id = fileId(input)
    const profile = activeProfile(env, selected())
    const state = readState(env, selected(), profile.principal)
    if (!state.documents[id])
      throw new CliError("not_found", "this source is not imported in the selected profile", {
        reason: "document.not-imported",
      })
    const doc = state.documents[id]
    return { id, ref: doc.reference, hash: doc.hash, snapshot: readSnapshot(env, selected(), id) }
  }

export const installDocumentCommands = (program: Command, context: CommandContext) => {
  const { env, selected, output, withIndex } = context
  const imported = importedDocument(context)
  const documents = annotate(program.command("documents"), { effects: LOCAL_READ }).description(
    "read imported documents and Google Docs",
  )
  const documentArgument = "document id or Google Docs URL"
  annotate(
    withQuery(
      examples(
        annotate(documents.command("list"), { effects: LOCAL_READ }).description(
          "list imported documents with their Google URLs",
        ),
        [
          "drive personal documents list",
          "drive personal documents list tag:budget",
          "drive personal documents list person:PERSON_UID --limit 10",
        ],
      ),
      IMPORTED_DOCUMENT_QUERY,
    ),
    { output: { entity: "drive_document" } },
  )
    .option("--limit <n>", "how many documents to return", positive, 50)
    .option("--page <n>", "which page to return", positive, 1)
    .action(async (words: string[], { limit, page }: { limit: number; page: number }) => {
      const profile = activeProfile(env, selected())
      const query = typedQuery(words)
      const ast = listQuery(query, IMPORTED_DOCUMENT_QUERY, "documents list")
      const found = await withIndex(async (index) => {
        if (!index.knowledge) throw new CliError("configuration_error", "index has no shared knowledge adapter")
        return index.knowledge.documents(profile.principal, ast, { limit, offset: (page - 1) * limit })
      })
      const state = readState(env, selected(), profile.principal)
      output(
        listOf("documents list", {
          items: found.items.map((note) => {
            const id = (note.path ?? "").replace(/\.md$/, "")
            const doc = state.documents[id]
            return doc
              ? { ...metadataJson(doc.metadata), reference: doc.reference, tabs: doc.tabs }
              : { id, name: note.title, reference: note.ref, tabs: 0 }
          }),
          limit,
          has_more: found.hasMore,
          page,
          args: { query: query || undefined },
        }),
      )
    })
  examples(
    annotate(documents.command("show"), { effects: LOCAL_READ })
      .argument("<document>", documentArgument)
      .description("show an imported document's text, tabs and metadata"),
    ["drive personal documents show DOC_ID"],
  ).action((input: string) => {
    const { snapshot } = imported(input)
    output(
      itemOf({
        metadata: metadataJson(snapshot.metadata),
        text: snapshot.text,
        tabs: snapshot.tabs,
        ...(snapshot.notRead ? { not_read: snapshot.notRead } : {}),
      }),
    )
  })
  examples(
    annotate(documents.command("export"), { effects: LOCAL_WRITE })
      .argument("<document>", documentArgument)
      .description("write an imported document to a new Markdown file"),
    ["drive personal documents export DOC_ID --output notes.md"],
  )
    .requiredOption("--output <file>", "path of the Markdown file to write; an existing file is refused")
    .action((input: string, args: { output: string }) => {
      const { id, snapshot } = imported(input)
      if (context.options.mcp) mkdirSync(dirname(args.output), { recursive: true, mode: 0o700 })
      try {
        writeFileSync(args.output, snapshot.markdown, { flag: "wx", mode: 0o600 })
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "EEXIST")
          throw new CliError("validation_error", "the output file already exists; choose another --output", {
            reason: "export.exists",
            param: "--output",
          })
        throw error
      }
      output(itemOf({ id, path: args.output, format: "markdown" }))
    })
}
