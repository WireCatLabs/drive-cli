import { annotate } from "@wirecat/cli-base/commands"
import { defineQuery } from "@wirecat/cli-base/query"
import { type Body, itemOf, listOf, queryHelp, queryTerms, withQuery } from "@wirecat/cli-core/cli"
import { extractDocumentMemories } from "@wirecat/cli-core/documents"
import { FACT_TYPES, type Fact, MEMORY_KINDS, type Memory } from "@wirecat/cli-core/store"
import { type Command, Option } from "commander"
import type { Complete } from "./extraction.js"
import type { DocumentKnowledge } from "./knowledge.js"
import { FACT_QUERY, factItem, MEMORY_QUERY, MEMORY_SEARCH_QUERY, memoryItem, memorySearch } from "./knowledge-query.js"
import type { DocumentContent } from "./model.js"
import { allOf } from "./output.js"
import { examples } from "./registry.js"

export interface KnowledgeCommands {
  document(input: string): { id: string; ref: string; hash: string; snapshot: DocumentContent }
  run<T>(input: string, fn: (knowledge: DocumentKnowledge, principal: string, ref: string) => Promise<T>): Promise<T>
  output(body: Body): void
  positive(input: string): number
  complete(): Complete
}
export const installKnowledgeCommands = (program: Command, helpers: KnowledgeCommands) => {
  const { run, output, positive } = helpers
  const documentArgument = "Google file or folder id or URL in the local catalog"
  const scopes = ["personal", "work"]
  const documents = program.commands.find((command) => command.name() === "documents") as Command
  examples(
    documents
      .command("context")
      .argument("<document>", documentArgument)
      .description("show a document with its tags, relationships, notes, memories and editors"),
    ["drive personal documents context DOC_ID"],
  ).action(async (doc: string) => output(itemOf(await run(doc, (k, p, ref) => k.context(p, ref)))))
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
      output(itemOf({ tags: await run(doc, (k, p, ref) => k.tags(p, ref, action, action === "list" ? [] : values)) })),
    )
  }
  const relationships = program
    .command("relationships")
    .description("connect a document to people, projects, notes and other references")
  examples(relationships.command("list").description("list a document's relationships"), [
    "drive personal relationships list DOC_ID",
  ])
    .argument("<document>", documentArgument)
    .action(async (doc: string) => output(allOf(await run(doc, (k, p, ref) => k.links(p, ref)))))
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
    .option("--reason <text>", "why the two are connected")
    .action(async (doc: string, to: string, { reason, ...args }) =>
      output(
        itemOf(
          await run(doc, (k, p, ref) => k.addLink(p, ref, { to, ...args, ...(reason ? { evidence: reason } : {}) })),
        ),
      ),
    )
  examples(relationships.command("remove").description("remove one of a document's relationships"), [
    "drive personal relationships remove DOC_ID LINK_ID",
  ])
    .argument("<document>", documentArgument)
    .argument("<relationship-id>", "id, as relationships list prints it")
    .action(async (doc: string, id: string) => output(itemOf(await run(doc, (k, p, ref) => k.removeLink(p, ref, id)))))
  const notes = program.command("notes").description("write notes about an imported document")
  const noteArgument = "note:<id> reference, as notes list prints it"
  examples(notes.command("add").description("write a note about a document"), [
    `drive personal notes add DOC_ID "Check the numbers" --title Review`,
  ])
    .argument("<document>", documentArgument)
    .argument("<text>", "the note's text")
    .option("--title <title>", "a title for the note")
    .action(async (doc: string, text: string, args) =>
      output(itemOf(await run(doc, (k, p, ref) => k.addNote(p, ref, text, args.title)))),
    )
  examples(notes.command("list").description("list a document's notes"), [
    "drive personal notes list DOC_ID",
    "drive personal notes list DOC_ID review --limit 10",
  ])
    .argument("<document>", documentArgument)
    .argument("[query...]", "words a note must contain")
    .option("--limit <n>", "how many notes to return", positive, 50)
    .option("--page <n>", "which page to return", positive, 1)
    .action(async (doc: string, words: string[], { page, limit }: { limit: number; page: number }) => {
      const query = words.length ? words.join(" ") : undefined
      const found = await run(doc, (k, p, ref) =>
        k.notes(p, ref, { ...(query ? { search: query } : {}), limit, offset: (page - 1) * limit }),
      )
      output(
        listOf("notes list", {
          items: found.items,
          limit,
          has_more: found.hasMore,
          page,
          args: { document: doc, query },
        }),
      )
    })
  examples(notes.command("show").description("show one note"), ["drive personal notes show DOC_ID note:NOTE_ID"])
    .argument("<document>", documentArgument)
    .argument("<note>", noteArgument)
    .action(async (doc: string, noteRef: string) =>
      output(itemOf(await run(doc, (k, p, ref) => k.note(p, ref, noteRef)))),
    )
  examples(notes.command("edit").description("replace a note's text"), [
    `drive personal notes edit DOC_ID note:NOTE_ID "Numbers checked" --revision 2`,
  ])
    .argument("<document>", documentArgument)
    .argument("<note>", noteArgument)
    .argument("<text>", "the note's new text")
    .requiredOption("--revision <n>", "revision from notes show; a newer note is not overwritten", positive)
    .action(async (doc: string, noteRef: string, text: string, args) =>
      output(itemOf(await run(doc, (k, p, ref) => k.editNote(p, ref, noteRef, text, args.revision)))),
    )
  examples(notes.command("remove").description("delete one note"), ["drive personal notes remove DOC_ID note:NOTE_ID"])
    .argument("<document>", documentArgument)
    .argument("<note>", noteArgument)
    .action(async (doc: string, noteRef: string) =>
      output(itemOf(await run(doc, (k, p, ref) => k.removeNote(p, ref, noteRef)))),
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
    .option("--supersedes <ref>", "a memory:<id> about the same document that this one replaces")
    .action(async (doc: string, body: string, args) =>
      output(
        itemOf(memoryItem(await run(doc, (k, p, ref) => k.addMemory(p, ref, { body, ...args, status: "proposed" })))),
      ),
    )
  withQuery(
    examples(memories.command("list").description("list a document's memories"), [
      "drive personal memories list DOC_ID scope:work",
      "drive personal memories list DOC_ID kind:preference status:confirmed",
    ]).argument("<document>", documentArgument),
    MEMORY_QUERY,
  )
    .option("--limit <n>", "how many memories to return", positive, 50)
    .action(async (doc: string, words: string[], { limit }: { limit: number }) => {
      const terms = queryTerms(words, MEMORY_QUERY, "memories list")
      const filters = {
        ...(terms.has("kind") ? { kind: terms.get("kind") as Memory["kind"] } : {}),
        ...(terms.has("status") ? { status: terms.get("status") as Memory["status"] } : {}),
        ...(terms.has("scope") ? { scope: terms.get("scope") as Memory["scope"] } : {}),
      }
      output(allOf((await run(doc, (k, p, ref) => k.memories(p, ref, { ...filters, limit }))).map(memoryItem)))
    })
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
        output(itemOf(memoryItem(await run(doc, (k, p, ref) => k.memory(p, ref, memoryRef, action))))),
      )
  const search = examples(memories.command("search").description("search a document's memories by words"), [
    "drive personal memories search DOC_ID reviews scope:work",
    `drive personal memories search DOC_ID "async reviews"`,
  ])
    .argument("<document>", documentArgument)
    .argument("<query...>", "words to look for, and scope:personal or scope:work — the fields are below")
    .allowUnknownOption()
    .addHelpText("after", queryHelp(MEMORY_SEARCH_QUERY))
    .action(async (doc: string, words: string[]) => {
      const { text, scope } = memorySearch(words)
      const found = await run(doc, (k, p, ref) => k.searchMemories(p, ref, text, scope))
      output({
        ...allOf(found.items.map(memoryItem)),
        ...(found.limit_reached ? { meta: { truncated: true } } : {}),
      })
    })
  annotate(search, { query: defineQuery(MEMORY_SEARCH_QUERY), output: { entity: "memory" } })
  examples(
    memories
      .command("extract")
      .argument("<document>", documentArgument)
      .description("send a document's text to the model and show the memories it proposes"),
    [
      "drive personal memories extract DOC_ID --scope work",
      "drive personal memories extract DOC_ID --scope work --yes",
    ],
  )
    .addOption(scope("whose memories they become: personal or work").makeOptionMandatory())
    .option("--tab <id>", "send only this tab of the document")
    .option("--yes", "save the proposals, each with its quote and the document's version")
    .action(async function (this: Command, doc: string) {
      // The root --yes takes the flag wherever it is typed; this one only lists it for help and MCP.
      const args = this.optsWithGlobals<{ scope: Memory["scope"]; tab?: string; yes?: boolean }>()
      const result = await extractDocumentMemories({
        read: () => helpers.document(doc),
        complete: helpers.complete(),
        scope: args.scope,
        author: "drive-memory",
        tab: args.tab,
        save: args.yes,
        withWrite: (write) => run(doc, write),
      })
      output(
        itemOf({ ...result, saved: result.saved.map((item) => ("type" in item ? factItem(item) : memoryItem(item))) }),
      )
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
    .option("--supersedes <ref>", "a decision only: the decision this one replaces")
    .option("--occurred-time <time>", "when it happened, as the evidence shows, ISO 8601")
    .action(
      async (
        doc: string,
        statement: string,
        {
          occurredTime,
          ...args
        }: { type: (typeof FACT_TYPES)[number]; scope?: Memory["scope"]; supersedes?: string; occurredTime?: string },
      ) =>
        output(
          itemOf(
            factItem(
              await run(doc, (k, p, ref) =>
                k.addFact(p, ref, {
                  statement,
                  ...args,
                  ...(occurredTime === undefined ? {} : { occurredAt: occurredTime }),
                }),
              ),
            ),
          ),
        ),
    )
  withQuery(
    examples(facts.command("list").description("list a document's facts"), [
      "drive personal facts list DOC_ID status:proposed",
      "drive personal facts list DOC_ID kind:decision",
    ]).argument("<document>", documentArgument),
    FACT_QUERY,
  )
    .option("--limit <n>", "how many facts to return", positive, 50)
    .action(async (doc: string, words: string[], { limit }: { limit: number }) => {
      const terms = queryTerms(words, FACT_QUERY, "facts list")
      const filters = {
        ...(terms.has("kind") ? { type: terms.get("kind") as Fact["type"] } : {}),
        ...(terms.has("status") ? { status: terms.get("status") as Fact["status"] } : {}),
      }
      output(allOf((await run(doc, (k, p, ref) => k.facts(p, ref, { ...filters, limit }))).map(factItem)))
    })
  const factActions = {
    show: "show one fact",
    confirm: "confirm a proposed fact; a decision it supersedes stops holding",
    reverse: "an accepted decision no longer holds, and nothing replaced it",
  } as const
  for (const [action, description] of Object.entries(factActions) as [keyof typeof factActions, string][])
    examples(facts.command(action).description(description), [`drive personal facts ${action} DOC_ID fact:FACT_ID`])
      .argument("<document>", documentArgument)
      .argument("<fact>", factArgument)
      .action(async (doc: string, factRef: string) =>
        output(itemOf(factItem(await run(doc, (k, p, ref) => k.fact(p, ref, factRef, action))))),
      )
  const identities = program
    .command("identities")
    .description("the Google accounts seen on a document, and the people they belong to")
  examples(identities.command("list").description("list the owners and last editor Google shows for a document"), [
    "drive personal identities list DOC_ID",
  ])
    .argument("<document>", documentArgument)
    .action(async (doc: string) => output(itemOf(await run(doc, (k, p, ref) => k.people(p, ref)))))
  examples(identities.command("link").description("record that a Google account belongs to a known person"), [
    "drive personal identities link DOC_ID GOOGLE_ID person:PERSON_UID",
  ])
    .argument("<document>", documentArgument)
    .argument("<google-id>", "Google account id, as identities list prints it")
    .argument("<person>", "person:<uid> reference of someone already known")
    .action(async (doc: string, googleId: string, personRef: string) =>
      output(itemOf(await run(doc, (k, p, ref) => k.linkPerson(p, ref, googleId, personRef)))),
    )
}
