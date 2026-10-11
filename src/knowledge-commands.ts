import { CliError } from "@wirecat/cli-core"
import type { Memory } from "@wirecat/cli-messaging/store"
import { type Command, Option } from "commander"
import type { Complete } from "./extraction.js"
import { extractMemories } from "./extraction.js"
import type { DocumentKnowledge } from "./knowledge.js"
import type { DocumentContent } from "./model.js"

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
  program.commands
    .find((command) => command.name() === "documents")
    ?.command("context")
    .argument("<document>")
    .description("Source document, tags, links, notes, memories and observed editors")
    .action(async (doc: string) => output(await run(doc, (k, p, ref) => k.context(p, ref))))
  const tags = program.command("tags").description("Local tags on shared documents; preserved through resync")
  for (const action of ["list", "add", "remove"] as const) {
    const command = tags.command(action).argument("<document>")
    if (action !== "list") command.argument("<tags...>")
    command.action(async (doc: string, values: string[] = []) =>
      output({ tags: await run(doc, (k, p, ref) => k.tags(p, ref, action, action === "list" ? [] : values)) }),
    )
  }
  const links = program
    .command("links")
    .description("Connect documents to shared people, projects, notes and other references")
  links
    .command("list")
    .argument("<document>")
    .action(async (doc: string) => output({ items: await run(doc, (k, p, ref) => k.links(p, ref)) }))
  links
    .command("add")
    .argument("<document>")
    .argument("<target-reference>")
    .addOption(
      new Option("--kind <kind>")
        .choices(["links-to", "about", "evidence", "created-from", "related-to", "assigned-to"])
        .default("related-to"),
    )
    .option("--role <role>")
    .option("--evidence <text>")
    .action(async (doc: string, to: string, args) =>
      output(await run(doc, (k, p, ref) => k.addLink(p, ref, { to, ...args }))),
    )
  links
    .command("remove")
    .argument("<document>")
    .argument("<link-id>")
    .action(async (doc: string, id: string) => output(await run(doc, (k, p, ref) => k.removeLink(p, ref, id))))
  const notes = program.command("notes").alias("memos").description("Local shared memos about a source document")
  notes
    .command("add")
    .argument("<document>")
    .argument("<text>")
    .option("--title <title>")
    .action(async (doc: string, text: string, args) =>
      output(await run(doc, (k, p, ref) => k.addNote(p, ref, text, args.title))),
    )
  notes
    .command("list")
    .argument("<document>")
    .option("--search <text>")
    .option("--limit <n>", "maximum notes", positive, 50)
    .option("--offset <n>", "notes to skip", offset, 0)
    .action(async (doc: string, args) => output(await run(doc, (k, p, ref) => k.notes(p, ref, args))))
  notes
    .command("show")
    .argument("<document>")
    .argument("<note-reference>")
    .action(async (doc: string, noteRef: string) => output(await run(doc, (k, p, ref) => k.note(p, ref, noteRef))))
  notes
    .command("edit")
    .argument("<document>")
    .argument("<note-reference>")
    .argument("<text>")
    .requiredOption("--revision <n>", "revision from notes show; refuses stale edits", positive)
    .action(async (doc: string, noteRef: string, text: string, args) =>
      output(await run(doc, (k, p, ref) => k.editNote(p, ref, noteRef, text, args.revision))),
    )
  notes
    .command("remove")
    .argument("<document>")
    .argument("<note-reference>")
    .action(async (doc: string, noteRef: string) =>
      output(await run(doc, (k, p, ref) => k.removeNote(p, ref, noteRef))),
    )
  const memories = program
    .command("memories")
    .description("Evidence-backed shared memories; AI output remains proposed")
  memories
    .command("add")
    .argument("<document>")
    .argument("<text>")
    .addOption(new Option("--scope <scope>").choices(["personal", "work"]).makeOptionMandatory())
    .addOption(new Option("--kind <kind>").choices(["summary", "digest", "fact", "preference"]).default("fact"))
    .option("--supersedes <memory-reference>", "replace an earlier memory about this same source")
    .action(async (doc: string, body: string, args) =>
      output(await run(doc, (k, p, ref) => k.addMemory(p, ref, { body, ...args, status: "proposed" }))),
    )
  memories
    .command("list")
    .argument("<document>")
    .addOption(new Option("--scope <scope>").choices(["personal", "work"]))
    .addOption(new Option("--kind <kind>").choices(["summary", "digest", "fact", "preference"]))
    .option("--limit <n>", "maximum memories", positive, 50)
    .action(async (doc: string, args) => output({ items: await run(doc, (k, p, ref) => k.memories(p, ref, args)) }))
  for (const action of ["show", "confirm", "stale"] as const)
    memories
      .command(action)
      .argument("<document>")
      .argument("<memory-reference>")
      .action(async (doc: string, memoryRef: string) =>
        output(await run(doc, (k, p, ref) => k.memory(p, ref, memoryRef, action))),
      )
  memories
    .command("search")
    .argument("<document>")
    .argument("<query>")
    .addOption(new Option("--scope <scope>").choices(["personal", "work"]).makeOptionMandatory())
    .action(async (doc: string, query: string, args) =>
      output(await run(doc, (k, p, ref) => k.searchMemories(p, ref, query, args.scope))),
    )
  memories
    .command("extract")
    .argument("<document>")
    .description("Explicitly send selected text to the configured shared model; preview proposals or save them")
    .addOption(new Option("--scope <scope>").choices(["personal", "work"]).makeOptionMandatory())
    .option("--tab <id>", "extract only this cached Google Docs tab")
    .option("--save", "save proposed memories with quotes and source snapshot hash")
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
            for (const item of result.items)
              items.push(
                await k.addMemory(p, ref, {
                  kind: item.kind,
                  body: `${item.body}\n\nSource quote: ${item.quote}\nSnapshot: ${source.hash}`,
                  scope: args.scope,
                  status: "proposed",
                  author: { bot: "drive-memory", model: result.model },
                }),
              )
            return items
          })
        : []
      output({ ...result, provenance, saved })
    })
  const people = program.command("people").description("Google-observed identities and explicit links to shared people")
  people
    .command("list")
    .argument("<document>")
    .action(async (doc: string) => output(await run(doc, (k, p, ref) => k.people(p, ref))))
  people
    .command("link")
    .argument("<document>")
    .argument("<google-id>")
    .argument("<person-reference>")
    .action(async (doc: string, googleId: string, personRef: string) =>
      output(await run(doc, (k, p, ref) => k.linkPerson(p, ref, googleId, personRef))),
    )
}
