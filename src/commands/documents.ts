import { CliError } from "@wirecat/cli-base"
import { annotate } from "@wirecat/cli-base/commands"
import { FETCH, itemOf } from "@wirecat/cli-core/cli"
import { addLocalDocumentCommands } from "@wirecat/cli-core/documents/cli"
import type { Command } from "commander"
import { activeProfile, fileId, textLimit } from "../config.js"
import { addDocument, profilesToAdd } from "../documents-add.js"
import { metadataJson } from "../model.js"
import { examples } from "../registry.js"
import { readSnapshot, readState } from "../state.js"
import { type CommandContext, DRIVE_WORDS } from "./context.js"

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
export const addProfilesOf = (env: NodeJS.ProcessEnv, command: Command, word: string | undefined) =>
  profilesToAdd(env, {
    option: command.opts<{ profiles?: string }>().profiles,
    word,
    chosen: env.DRIVE_PROFILE || undefined,
    lock: env.DRIVE_PROFILE_LOCK || undefined,
  })

export const installDocumentCommands = (program: Command, context: CommandContext) => {
  const { env, selected, output, withIndex, source, profileWord } = context
  const imported = importedDocument(context)
  const documents = addLocalDocumentCommands(program, {
    words: DRIVE_WORDS,
    output,
    list: async (query, page) => {
      const profile = activeProfile(env, selected())
      const found = await withIndex(async (index) => {
        if (!index.knowledge) throw new CliError("configuration_error", "index has no shared knowledge adapter")
        return index.knowledge.documents(profile.principal, query, page)
      })
      const state = readState(env, selected(), profile.principal)
      return {
        items: found.items.map((note) => {
          const id = (note.path ?? "").replace(/\.md$/, "")
          const doc = state.documents[id]
          return doc
            ? { ...metadataJson(doc.metadata), reference: doc.reference, tabs: doc.tabs }
            : { id, name: note.title, reference: note.ref, tabs: 0 }
        }),
        hasMore: found.hasMore,
      }
    },
    document: (input) => {
      const { id, snapshot } = imported(input)
      return { id, metadata: metadataJson(snapshot.metadata), snapshot }
    },
    lastSync: () => readState(env, selected(), activeProfile(env, selected()).principal).lastSync,
  })
  examples(
    annotate(documents.command("add"), { mcp: false, effects: FETCH })
      .argument("<url>", "Google Drive or Docs URL, or file id")
      .description("keep a Drive document's text in memory, read by the first profile that opens it"),
    [
      "drive documents add https://docs.google.com/document/d/DOC_ID/edit --profiles work,personal",
      "drive personal documents add DOC_ID --subject person:PERSON_UID",
    ],
  )
    .option(
      "--profiles <names|all>",
      "profiles to try in this order, comma-separated, or all; at most max_add_profiles, in place of a profile word",
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
        save: (input, driveFileId) =>
          withIndex(async (index) => {
            if (!index.addSource) throw new CliError("configuration_error", "index cannot keep sources added by hand")
            return index.addSource(input, driveFileId)
          }, null),
        ...(args.title ? { title: args.title } : {}),
        ...(args.subject ? { subjects: args.subject } : {}),
        by: "owner",
      })
      output(itemOf(added))
    })
}
