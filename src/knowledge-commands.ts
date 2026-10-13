import { CliError } from "@wirecat/cli-base"
import { FACT_STATUSES, FACT_TYPES, MEMORY_KINDS, type Memory } from "@wirecat/cli-messaging/store"
import { type Command, Option } from "commander"
import type { Complete } from "./extraction.js"
import { extractMemories } from "./extraction.js"
import type { DocumentKnowledge } from "./knowledge.js"
import type { DocumentContent } from "./model.js"
import { examples } from "./registry.js"

export interface KnowledgeCommands {
  document(input: string): { id: string; ref: string; hash: string; snapshot: DocumentContent }
  run<T>(input: string, fn: (knowledge: DocumentKnowledge, principal: string, ref: string) => Promise<T>): Promise<T>
  output(value: unknown): void
  positive(input: string): number
  offset(input: string): number
  complete(): Complete
}
export const installKnowledgeCommands = (program: Command, helpers: KnowledgeCommands) => {
  const { run, output, positive, offset } = helpers
  const documentArgument = "document id or Google Docs URL"
  const scopes = ["personal", "work"]
  const documents = program.commands.find((command) => command.name() === "documents") as Command
  examples(
    documents
      .command("context")
      .argument("<document>", documentArgument)
      .description("show a document with its tags, relationships, notes, memories and editors"),
    ["drive personal documents context DOC_ID"],
  ).action(async (doc: string) => output(await run(doc, (k, p, ref) => k.context(p, ref))))
  const tags = program.command("tags").description("label imported documents; labels survive a sync")
  for (const action of ["list", "add", "remove"] as const) {
    const command = examples(
      tags
        .command(action)
        .description(
          action === "list" ? "list a document's tags" : action === "add" ? "tag a document" : "untag a document",
        )
        .argument("<document>", documentArgument),
      [`drive personal tags ${action} DOC_ID${action === "list" ? "" : " budget q3"}`],
    )
    if (action !== "list") command.argument("<tags...>", "one or more tags")
    command.action(async (doc: string, values: string[] = []) =>
      output({ tags: await run(doc, (k, p, ref) => k.tags(p, ref, action, action === "list" ? [] : values)) }),
    )
  }
  const relationships = program
    .command("relationships")
    .description("connect a document to people, projects, notes and other references")
  examples(relationships.command("list").description("list a document's relationships"), [
    "drive personal relationships list DOC_ID",
  ])
    .argument("<document>", documentArgument)
    .action(async (doc: string) => output({ items: await run(doc, (k, p, ref) => k.links(p, ref)) }))
  examples(relationships.command("add").description("connect a document to another reference"), [
    "drive personal relationships add DOC_ID project:PROJECT_ID --kind about",
    "drive personal relationships add DOC_ID person:PERSON_UID --kind assigned-to --role reviewer",
  ])
    .argument("<document>", documentArgument)
    .argument("<reference>", "what it connects to, such as person:<uid>, project:<id> or note:<id>")
    .addOption(
      new Option("--kind <kind>", "how the two relate")
        .choices(["links-to", "about", "evidence", "created-from", "related-to", "assigned-to"])
        .default("related-to"),
    )
    .option("--role <role>", "the part the reference plays, in a word or two")
    .option("--evidence <text>", "why the two are connected")
    .action(async (doc: string, to: string, args) =>
      output(await run(doc, (k, p, ref) => k.addLink(p, ref, { to, ...args }))),
    )
  examples(relationships.command("remove").description("remove one of a document's relationships"), [
    "drive personal relationships remove DOC_ID LINK_ID",
  ])
    .argument("<document>", documentArgument)
    .argument("<relationship-id>", "id, as relationships list prints it")
    .action(async (doc: string, id: string) => output(await run(doc, (k, p, ref) => k.removeLink(p, ref, id))))
  const notes = program.command("notes").description("write notes about an imported document")
  const noteArgument = "note:<id> reference, as notes list prints it"
  examples(notes.command("add").description("write a note about a document"), [
    `drive personal notes add DOC_ID "Check the numbers" --title Review`,
  ])
    .argument("<document>", documentArgument)
    .argument("<text>", "the note's text")
    .option("--title <title>", "a title for the note")
    .action(async (doc: string, text: string, args) =>
      output(await run(doc, (k, p, ref) => k.addNote(p, ref, text, args.title))),
    )
  examples(notes.command("list").description("list a document's notes"), [
    "drive personal notes list DOC_ID",
    "drive personal notes list DOC_ID --search review --limit 10",
  ])
    .argument("<document>", documentArgument)
    .option("--search <text>", "only notes that contain this text")
    .option("--limit <n>", "how many notes to return", positive, 50)
    .option("--offset <n>", "how many notes to skip", offset, 0)
    .action(async (doc: string, args) => output(await run(doc, (k, p, ref) => k.notes(p, ref, args))))
  examples(notes.command("show").description("show one note"), ["drive personal notes show DOC_ID note:NOTE_ID"])
    .argument("<document>", documentArgument)
    .argument("<note>", noteArgument)
    .action(async (doc: string, noteRef: string) => output(await run(doc, (k, p, ref) => k.note(p, ref, noteRef))))
  examples(notes.command("edit").description("replace a note's text"), [
    `drive personal notes edit DOC_ID note:NOTE_ID "Numbers checked" --revision 2`,
  ])
    .argument("<document>", documentArgument)
    .argument("<note>", noteArgument)
    .argument("<text>", "the note's new text")
    .requiredOption("--revision <n>", "revision from notes show; a newer note is not overwritten", positive)
    .action(async (doc: string, noteRef: string, text: string, args) =>
      output(await run(doc, (k, p, ref) => k.editNote(p, ref, noteRef, text, args.revision))),
    )
  examples(notes.command("remove").description("delete one note"), ["drive personal notes remove DOC_ID note:NOTE_ID"])
    .argument("<document>", documentArgument)
    .argument("<note>", noteArgument)
    .action(async (doc: string, noteRef: string) =>
      output(await run(doc, (k, p, ref) => k.removeNote(p, ref, noteRef))),
    )
  const memories = program
    .command("memories")
    .description("keep what was learned from a document, with evidence; an agent's stay proposed")
  const memoryArgument = "memory:<id> reference, as memories list prints it"
  const scope = (description: string) => new Option("--scope <scope>", description).choices(scopes)
  examples(memories.command("add").description("record a memory about a document"), [
    `drive personal memories add DOC_ID "The team prefers async reviews" --scope work --kind preference`,
  ])
    .argument("<document>", documentArgument)
    .argument("<text>", "what to remember")
    .addOption(scope("whose memory it is: personal or work").makeOptionMandatory())
    .addOption(new Option("--kind <kind>", "what kind of memory it is").choices(MEMORY_KINDS).default("summary"))
    .option("--supersedes <memory>", "a memory:<id> about the same document that this one replaces")
    .action(async (doc: string, body: string, args) =>
      output(await run(doc, (k, p, ref) => k.addMemory(p, ref, { body, ...args, status: "proposed" }))),
    )
  examples(memories.command("list").description("list a document's memories"), [
    "drive personal memories list DOC_ID --scope work",
  ])
    .argument("<document>", documentArgument)
    .addOption(scope("only personal or only work memories"))
    .addOption(new Option("--kind <kind>", "only memories of this kind").choices(MEMORY_KINDS))
    .option("--limit <n>", "how many memories to return", positive, 50)
    .action(async (doc: string, args) => output({ items: await run(doc, (k, p, ref) => k.memories(p, ref, args)) }))
  const memoryActions = {
    show: "show one memory",
    confirm: "confirm a proposed memory as true",
    stale: "mark a memory as out of date",
  } as const
  for (const [action, description] of Object.entries(memoryActions) as [keyof typeof memoryActions, string][])
    examples(memories.command(action).description(description), [
      `drive personal memories ${action} DOC_ID memory:MEMORY_ID`,
    ])
      .argument("<document>", documentArgument)
      .argument("<memory>", memoryArgument)
      .action(async (doc: string, memoryRef: string) =>
        output(await run(doc, (k, p, ref) => k.memory(p, ref, memoryRef, action))),
      )
  examples(memories.command("search").description("search a document's memories by words"), [
    "drive personal memories search DOC_ID reviews --scope work",
  ])
    .argument("<document>", documentArgument)
    .argument("<query>", "words to look for")
    .addOption(scope("search personal or work memories").makeOptionMandatory())
    .action(async (doc: string, query: string, args) =>
      output(await run(doc, (k, p, ref) => k.searchMemories(p, ref, query, args.scope))),
    )
  examples(
    memories
      .command("extract")
      .argument("<document>", documentArgument)
      .description("send a document's text to the model and show the memories it proposes"),
    [
      "drive personal memories extract DOC_ID --scope work",
      "drive personal memories extract DOC_ID --scope work --save",
    ],
  )
    .addOption(scope("whose memories they become: personal or work").makeOptionMandatory())
    .option("--tab <id>", "send only this tab of the document")
    .option("--save", "save the proposals, each with its quote and the document's version")
    .action(async (doc: string, args: { scope: Memory["scope"]; tab?: string; save?: boolean }) => {
      const source = helpers.document(doc)
      const text = args.tab ? source.snapshot.tabs.find((tab) => tab.id === args.tab)?.text : source.snapshot.text
      if (text === undefined) throw new CliError("not_found", "tab was not found in this imported document")
      const result = await extractMemories(text, helpers.complete())
      const current = helpers.document(doc)
      if (current.hash !== source.hash)
        throw new CliError("validation_error", "source changed during extraction; no memories were saved")
      const provenance = {
        document: source.ref,
        fileId: source.id,
        hash: source.hash,
        url: source.snapshot.metadata.url,
        tab: args.tab ?? null,
      }
      const saved = args.save
        ? await run(doc, async (k, p, ref) => {
            if (helpers.document(doc).hash !== source.hash)
              throw new CliError("validation_error", "source changed during extraction; no memories were saved")
            const items = []
            const by = { bot: "drive-memory", model: result.model }
            for (const item of result.items) {
              const body = `${item.body}\n\nSource quote: ${item.quote}\nSnapshot: ${source.hash}`
              items.push(
                item.kind === "fact"
                  ? await k.addFact(p, ref, { statement: body, type: "fact", scope: args.scope, by })
                  : await k.addMemory(p, ref, {
                      kind: item.kind,
                      body,
                      scope: args.scope,
                      status: "proposed",
                      author: by,
                    }),
              )
            }
            return items
          })
        : []
      output({ ...result, provenance, saved })
    })
  const facts = program
    .command("facts")
    .description("what happened, as a document shows it; an agent's stay proposed until confirmed")
  const factArgument = "fact:<id> reference, as facts list prints it"
  examples(facts.command("add").description("record a fact a document shows"), [
    `drive personal facts add DOC_ID "Budget approved" --type decision --scope work`,
  ])
    .argument("<document>", documentArgument)
    .argument("<statement>", "the fact, in one sentence")
    .addOption(new Option("--type <type>", "what kind of fact it is").choices(FACT_TYPES).default("fact"))
    .addOption(scope("whose fact it is: personal or work"))
    .action(
      async (doc: string, statement: string, args: { type: (typeof FACT_TYPES)[number]; scope?: Memory["scope"] }) =>
        output(await run(doc, (k, p, ref) => k.addFact(p, ref, { statement, ...args }))),
    )
  examples(facts.command("list").description("list a document's facts"), [
    "drive personal facts list DOC_ID --status proposed",
  ])
    .argument("<document>", documentArgument)
    .addOption(new Option("--type <type>", "only facts of this kind").choices(FACT_TYPES))
    .addOption(new Option("--status <status>", "only facts in this state").choices(FACT_STATUSES))
    .option("--limit <n>", "how many facts to return", positive, 50)
    .action(async (doc: string, args) => output({ items: await run(doc, (k, p, ref) => k.facts(p, ref, args)) }))
  const factActions = { show: "show one fact", confirm: "confirm a proposed fact as true" } as const
  for (const [action, description] of Object.entries(factActions) as [keyof typeof factActions, string][])
    examples(facts.command(action).description(description), [`drive personal facts ${action} DOC_ID fact:FACT_ID`])
      .argument("<document>", documentArgument)
      .argument("<fact>", factArgument)
      .action(async (doc: string, factRef: string) =>
        output(await run(doc, (k, p, ref) => k.fact(p, ref, factRef, action))),
      )
  const identities = program
    .command("identities")
    .description("the Google accounts seen on a document, and the people they belong to")
  examples(identities.command("list").description("list the owners and last editor Google shows for a document"), [
    "drive personal identities list DOC_ID",
  ])
    .argument("<document>", documentArgument)
    .action(async (doc: string) => output(await run(doc, (k, p, ref) => k.people(p, ref))))
  examples(identities.command("link").description("record that a Google account belongs to a known person"), [
    "drive personal identities link DOC_ID GOOGLE_ID person:PERSON_UID",
  ])
    .argument("<document>", documentArgument)
    .argument("<google-id>", "Google account id, as identities list prints it")
    .argument("<person>", "person:<uid> reference of someone already known")
    .action(async (doc: string, googleId: string, personRef: string) =>
      output(await run(doc, (k, p, ref) => k.linkPerson(p, ref, googleId, personRef))),
    )
}
