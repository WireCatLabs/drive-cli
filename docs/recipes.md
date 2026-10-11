# Useful requests

Use these requests once your chosen folders are imported. Each produces something you can check:
source links, saved local context or a preview before a remote change.

## Prepare for a project meeting

```text prompt
Use drive CLI to find the latest budget and launch decisions in my imported documents.
Prepare a short meeting brief with open questions and source links.
Check sync status and tell me about skipped sources. Do not change Google files.
```

Your agent searches the available copy and reads matching documents. Open the links to check
the decisions; a brief cannot account for unsupported or unimported files.

## Link a document to a person or project

```text prompt
Use drive CLI to show the people observed on this document and its existing links.
Link it to the stored project and person I select, then show the saved context.
Do not merge people merely because their names match.
```

Manual links use a reference returned by the same store, not an invented ID:

```sh
drive people list DOC_ID --json
drive links add DOC_ID project:PROJECT_ID --kind related-to
drive links add DOC_ID person:PERSON_ID --kind about
drive documents context DOC_ID --json
```

Drive can link existing records; it does not create projects or tasks. To combine messenger and
document records, configure an explicit shared store first. Separate databases do not share IDs.
See [configuration](configuration.md) and [organize sources](https://wirecat.dev/en/docs/organize).

## Remember a source-backed decision

```text prompt
Use drive CLI to propose a few reusable facts from this imported document.
Show exact supporting quotes. Let me review them before saving or confirming anything.
```

With a configured AI provider:

```sh
drive memories extract DOC_ID --scope work
drive memories extract DOC_ID --scope work --save
```

The first command previews; `--save` stores proposed memories, not confirmed facts. Extraction
sends selected cached text to the configured provider. Word/embedding search does not require this
external text-generation step. See [settings](configuration.md) before enabling it.

## Use a local MCP client

For an agent without terminal access, configure a stdio MCP server with executable `drive` and
arguments `--read-only mcp`. The tool and connected account must be on the computer running it.

```sh
drive --read-only mcp --tools --json
drive --read-only mcp
```

This exposes permitted read tools from the same command tree. It is not a hosted HTTP endpoint
for browser connectors. Use [the command reference](commands.md) for exact operations.
