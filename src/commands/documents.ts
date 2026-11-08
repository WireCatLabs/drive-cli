import { writeFileSync } from "node:fs"
import { CliError } from "@wirecat/cli-base"
import { annotate } from "@wirecat/cli-base/commands"
import { FETCH, itemOf, LOCAL_READ, LOCAL_WRITE, listOf, listQuery, typedQuery, withQuery } from "@wirecat/cli-core/cli"
import { IMPORTED_DOCUMENT_QUERY } from "@wirecat/cli-core/store"
import type { Command } from "commander"
import { ageOf, staleCopy } from "../age.js"
import { activeProfile, fileId, textLimit } from "../config.js"
import { addDocument, profilesToAdd } from "../documents-add.js"
import { metadataJson } from "../model.js"
import { examples } from "../registry.js"
import { readSnapshot, readState } from "../state.js"
import { type CommandContext, positive } from "./context.js"

// A `search` hit's ref; checkpoints are rewritten when the store changes, so it names one document here.
const DOCUMENT_REF = /^document:[1-9]\d*$/

export const isDocumentRef = (input: string) => DOCUMENT_REF.test(input)

// A bare number is a store id with its kind lost; reading it as a Google ID would answer "not imported" for a document
// this profile has.
const refuseBareNumber = (input: string, documents: Record<string, { reference: string }>) => {
  if (!/^\d+$/.test(input)) return
  const ref = `document:${input}`
  if (Object.values(documents).some((doc) => doc.reference === ref))
    throw new CliError("validation_error", `${input} is a bare number; name the document as ${ref}`, {
      reason: "ref.bare-number",
    })
}

export const storedDocument =
  ({ env, selected }: Pick<CommandContext, "env" | "selected">) =>
  (input: string) => {
    const profile = activeProfile(env, selected())
    const documents = readState(env, selected(), profile.principal).documents
    refuseBareNumber(input, documents)
    const id = isDocumentRef(input)
      ? (Object.entries(documents).find(([, doc]) => doc.reference === input)?.[0] ?? "")
      : fileId(input)
    const doc = documents[id]
    if (!doc)
      throw new CliError("not_found", "this source is not imported in the selected profile", {
        reason: "document.not-imported",
      })
    return { id, doc }
  }

export const importedDocument = (context: Pick<CommandContext, "env" | "selected">) => {
  const stored = storedDocument(context)
  return (input: string) => {
    const { id, doc } = stored(input)
    return { id, ref: doc.reference, hash: doc.hash, snapshot: readSnapshot(context.env, context.selected(), id) }
  }
}

/** The profiles `documents add` tries, as its run named them. */
export const addProfilesOf = (env: NodeJS.ProcessEnv, command: Command, named: string | undefined) =>
  profilesToAdd(env, {
    option: command.opts<{ profiles?: string }>().profiles,
    named: named ?? (env.DRIVE_PROFILE || undefined),
    lock: env.DRIVE_PROFILE_LOCK || undefined,
  })

export const installDocumentCommands = (program: Command, context: CommandContext) => {
  const { env, selected, output, withIndex, source, profileWord } = context
  const imported = importedDocument(context)
  const documents = annotate(program.command("documents"), { effects: LOCAL_READ }).description(
    "read imported documents and Google Docs",
  )
  const documentArgument = "document id, Google Docs URL, or a search hit's document: ref"
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
    { output: { entity: "drive_document" }, partial: true },
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
      const age = ageOf(state)
      output(
        listOf("documents list", {
          ...staleCopy(state),
          items: found.items.map((note) => {
            const id = (note.path ?? "").replace(/\.md$/, "")
            const doc = state.documents[id]
            return doc
              ? { ...metadataJson(doc.metadata), reference: doc.reference, tabs: doc.tabs, ...age }
              : { id, name: note.title, reference: note.ref, tabs: 0, ...age }
          }),
          limit,
          has_more: found.hasMore,
          page,
          args: { query: query || undefined },
        }),
      )
    })
  examples(
    annotate(documents.command("show"), { effects: LOCAL_READ, partial: true })
      .argument("<document>", documentArgument)
      .description("show an imported document's text, tabs and metadata"),
    ["drive personal documents show DOC_ID", "drive personal documents show document:42 --offline"],
  ).action((input: string) => {
    const { snapshot } = imported(input)
    const state = readState(env, selected(), activeProfile(env, selected()).principal)
    output(
      itemOf(
        {
          metadata: metadataJson(snapshot.metadata),
          ...ageOf(state),
          text: snapshot.text,
          tabs: snapshot.tabs,
          ...(snapshot.notRead ? { not_read: snapshot.notRead } : {}),
        },
        staleCopy(state),
      ),
    )
  })
  examples(
    annotate(documents.command("export"), { effects: LOCAL_WRITE, partial: true })
      .argument("<document>", documentArgument)
      .description("write an imported document to a new Markdown file"),
    ["drive personal documents export DOC_ID --output notes.md"],
  )
    .requiredOption("--output <file>", "path of the Markdown file to write; an existing file is refused")
    .action((input: string, args: { output: string }) => {
      const { id, snapshot } = imported(input)
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
      const state = readState(env, selected(), activeProfile(env, selected()).principal)
      output(itemOf({ id, path: args.output, format: "markdown", ...ageOf(state) }, staleCopy(state)))
    })
  examples(
    annotate(documents.command("add"), { mcp: false, effects: FETCH })
      .argument("<url>", "Google Docs URL or document id")
      .description("keep a Google Doc's text in memory, read by the first named profile to open it"),
    [
      "drive documents add https://docs.google.com/document/d/DOC_ID/edit --profiles work,personal",
      "drive personal documents add DOC_ID --subject person:PERSON_UID",
    ],
  )
    .option(
      "--profiles <names|all>",
      "profiles to try in this order, comma-separated, or all; at most max_add_profiles (5), in place of a profile word",
    )
    .option("--title <title>", "title to keep it under; the document's name when omitted")
    .option(
      "--subject <ref>",
      "a person, organization, project, task or meeting it is about; repeat to add more",
      (value: string, previous: string[] = []) => [...previous, value],
    )
    .action(async (url: string, args: { title?: string; subject?: string[] }, command: Command) => {
      const profiles = addProfilesOf(env, command, profileWord())
      const added = await addDocument({
        url,
        profiles,
        source,
        maxChars: (profile) => textLimit(env, profile),
        // Opened only once a profile has read the document, so no Google call waits with the store open.
        save: (input) =>
          withIndex(async (index) => {
            if (!index.addSource) throw new CliError("configuration_error", "index cannot keep sources added by hand")
            return index.addSource(input)
          }, null),
        ...(args.title ? { title: args.title } : {}),
        ...(args.subject ? { subjects: args.subject } : {}),
        by: "owner",
      })
      output(itemOf(added))
    })
}
