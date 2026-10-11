# Recipes

Use these workflows after connecting an account to import a project, find evidence and save
useful context. Every account command below uses profile `personal`; replace it with your named
profile. Agent requests should name that profile too. [Import and storage](usage.md) explains
supported file types and the local copies these recipes keep.

## First searchable folder, without extra exports

```text prompt
Use drive CLI with profile personal to index the project folder I select.
Import supported documents, report skipped files and finish any pending sync batches.
Find one passage about the budget and show its original source link. Do not export extra files.
```

```sh
drive personal folders add FOLDER_ID
drive personal sync --json
drive personal status --json
drive personal search 'budget' --exact --json
drive personal documents show DOC_ID --json
```

Replace `DOC_ID` with a matching source's Google ID from `documents list`. Continue sync while
pending work remains. Exact search needs no embedding model. Avoiding exports prevents extra
copies; the database and managed snapshots are still retained.

<a id="prepare-for-a-project-meeting"></a>

## Refresh a project and prepare a meeting brief

```text prompt
Use drive CLI with profile personal. Refresh my selected folders, then find the latest budget
and launch decisions. Prepare a short meeting brief with open questions and source links.
Tell me about skipped sources and unfinished sync work. Do not change Google files.
```

```sh
drive personal sync --json
drive personal status --json
drive personal search 'budget OR launch' --exact --json
drive personal documents context DOC_ID --json
```

Open the cited Google links to check the decisions. A brief cannot account for unsupported or
unimported sources. Live `documents get` can inspect an accessible native Doc without importing
it; it prints Docs JSON and does not make that document searchable.

## Keep a follow-up list beside your sources

```sh
drive personal tags add DOC_ID follow-up budget
drive personal notes add DOC_ID 'Confirm whether tax is included' --title 'Budget review'
drive personal documents list --tag follow-up --json
drive personal search 'budget AND tag:follow-up' --exact --json
drive personal notes list DOC_ID --json
```

The document list's `--tag` filters labels; search uses `tag:` inside the query. Read the note
list to confirm the saved memo. These operations change local context, not Google's document.

## Link a document to a person or project

```text prompt
Use drive CLI with profile personal to show observed editors and existing document links.
Link the document to the stored project and person I select, then show its saved context.
Do not merge people merely because their names match.
```

```sh
drive personal people list DOC_ID --json
drive personal links add DOC_ID project:PROJECT_ID --kind related-to
drive personal links add DOC_ID person:PERSON_ID --kind about
drive personal documents context DOC_ID --json
```

Use references returned by the same store. Drive links existing records; it does not create
projects or tasks. Observed owners/last editors are not a complete contributor history. To link
messenger records, choose a compatible shared store explicitly first. Separate databases do not
share IDs. See [configuration](configuration.md) and
[organize sources](https://wirecat.dev/en/docs/organize).

## Remember a source-backed decision

```text prompt
Use drive CLI with profile personal to propose reusable facts from this imported document.
Show exact supporting quotes. Let me review them before saving or confirming anything.
```

With an [AI provider configured](configuration.md#optional-ai-extraction):

```sh
drive personal memories extract DOC_ID --scope work
drive personal memories extract DOC_ID --scope work --save
drive personal memories list DOC_ID --scope work --json
drive personal memories confirm DOC_ID memory:MEMORY_ID
```

Extraction previews by default; `--save` creates proposals. Replace `MEMORY_ID` with a returned
reference only after reviewing it. Source changes/removal mark active memories stale.
Extraction sends selected cached text to your provider; local embedding search is a separate
operation. You can write a memory yourself with `memories add DOC_ID 'Your fact' --scope work`.

## Inspect revisions or optional activity history

```sh
drive personal documents history DOC_ID --json
drive personal comments list DOC_ID --json
```

These are live Google reads. Revisions/comments use Drive API. For actor/activity events, enable
Drive Activity API and reconnect with its additional permission:

```sh
drive personal session start --client-file /path/to/desktop-client.json --activity
drive personal documents history DOC_ID --activity --json
```

Pass returned page tokens to the same command's `--page-token` option to continue. Google's
visible revisions/events can be incomplete; they are not a character-by-character edit history.
Comments are inspectable here but are not included in document search.

## Give another tool one Markdown file

```sh
drive personal documents export DOC_ID --out ./decision.md
```

Open the resulting file or pass its path to a tool running on the same computer. Export reads
cached Markdown, so sync first for fresh content. This does not upload a file to a remote agent.
Remove your extra export when finished if you do not need that copy; the managed cache remains.

## Create a native Doc and include it in search

Use this only when you want to change Google Drive. Reconnect with `--write`, then create a
native Doc and move it into a selected folder:

```sh
drive personal session start --client-file /path/to/desktop-client.json --write
drive personal documents create --title 'Project review'
drive personal documents update NEW_DOC_ID --body '{"requests":[{"insertText":{"endOfSegmentLocation":{},"text":"Review notes\n"}}]}'
drive personal files move NEW_DOC_ID --to FOLDER_ID
drive personal sync --json
```

Replace `NEW_DOC_ID` with the create response's `documentId`. Confirm the selected folder contains
it and that local search finds the new text. Existing-document edits should use the Docs
`writeControl` revision check exposed by [the update schema](commands.md#drive-documents-update).
Creating a native Doc from text is supported; uploading arbitrary local PDF/Office/media files
or converting local Markdown into a formatted Doc is not an implemented upload workflow.

## Use a local MCP client

For an agent without terminal access, set executable `drive` and arguments
`personal --read-only mcp`. The connected account must be on the computer running this server.

```sh
drive personal --read-only mcp --tools --json
drive personal --read-only mcp
```

Inspect the first command's tools before starting the stdio server. It uses the same command tree,
profile and guards. This is not a hosted HTTP browser connector. Use
[the full command reference](commands.md) to discover other supported operations.
