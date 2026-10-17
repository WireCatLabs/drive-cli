# Recipes

Give your agent a complete task: import a project, prepare a brief, keep follow-ups, or reuse a
source-backed decision. Each recipe connects a request to the commands and checks that produce
the result. Examples use profile `personal`; replace it with your connected account's profile.

Choose whether the task may refresh Google data, change only local context, or change a Google
file. [Import and storage](usage.md) explains what the saved copy contains.

## Choose a recipe

| Task | Uses Google | Changes local data | Changes Google files |
| --- | --- | --- | --- |
| Import or refresh a project | Yes | Index and snapshots | No |
| Prepare a brief from the saved copy | No | No | No |
| Browse and organize the cached folder tree | No | Tags/notes, when requested | No |
| Add follow-up tags, notes or links | No | Yes | No |
| Propose memories with an AI provider | Sends cached text to the configured provider | Only with `--yes` or confirmation | No |
| Inspect comments or history | Yes | No automatic import | No |
| Create or edit a Doc | Yes | Imported on the next sync | Yes |
| Read or edit spreadsheet cells | Yes | Imported on the next sync | Only when explicitly changing cells |
| Organize spreadsheet tabs and formatting | Yes | Imported on the next sync | Yes |

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

Read the saved passages and source metadata to check the decisions. Open their Google links when
you need the current online version. A brief cannot account for unsupported or
unimported sources. Live `documents get` can inspect an accessible native Doc without importing
it; it prints Docs JSON and does not make that document searchable.

## Prepare a brief entirely offline

```text prompt
Use drive CLI with profile personal and --offline. Find budget and launch decisions in the saved
project documents. Prepare a brief with exact passages, source titles and links, and the last sync
information. Do not contact Google or an AI extraction provider through the CLI.
```

```sh
drive personal --offline status --json
drive personal --offline search 'budget OR launch' --exact --json
drive personal --offline documents show DOC_ID --json
drive personal --offline documents context DOC_ID --json
```

The result uses the last saved copy. It must not present that timestamp as a fresh Google check.
`--offline` controls the CLI; a cloud agent may still send the returned evidence to its own
provider. Use the agent's own settings when the whole workflow must stay on your computer.

## Save full available metadata for offline use

```text prompt
Use drive CLI with profile personal. Fetch all metadata Google exposes for the file I select,
save the JSON locally, and explain its fields. Read that saved file for later questions instead
of contacting Google again. Do not download its binary contents or change Google files.
```

```sh
drive personal files get FILE_ID --json > ./file-metadata.json
drive personal files list --parent FOLDER_ID --json > ./folder-metadata.json
```

These commands request all available file metadata fields from Google. The first saves one
file's response; the second saves a page of immediate children, including metadata for formats
that content indexing does not support. Continue any returned page token if you need the whole
listing. Google roles and policy determine which fields it exposes.

Your agent can read the saved JSON without Google. It is a separate, user-managed snapshot;
it is not automatically imported into the database or made searchable by `drive search`.
Sync also stores the available file-metadata response in the searchable local catalog; use
`catalog show FILE_ID --offline` without creating an extra JSON file. Older cached entries
retain only the subset originally saved until a rescan. Permission listings, comments and history remain separate API operations. Refresh or remove
these extra JSON files when you no longer need their saved version.

## Browse and tag folders without Google

```text prompt
Use drive CLI with profile personal and only local data. Show the imported folder tree,
find the PDFs last edited by Rin, and show their source links and content availability.
Tag the folder I choose follow-up and save my memo beside it. Do not download or export files.
```

```sh
drive personal catalog import --offline
drive personal catalog tree --depth 3 --offline --json
drive personal catalog list 'mime:"application/pdf" AND person:Rin*' --offline --json
drive personal catalog tags add FOLDER_ID follow-up --offline
drive personal notes add FOLDER_ID 'Check the final version with Rin' --offline
drive personal catalog list 'tag:follow-up' --offline --json
drive personal documents context FOLDER_ID --offline --json
```

Use `catalog import` to copy an existing cache into the database; regular sync populates it
for new imports. Replace `FOLDER_ID` with the ID shown in the tree. Confirm the folder's context
contains your tag and memo. Folder tags apply to that folder, rather than every descendant.
Metadata-only files remain findable even before their content batch finishes. To read a passage,
check that its content was indexed and use `documents show`; metadata alone is not evidence of
what a file says. See [catalog navigation and filters](usage.md#browse-and-organize-the-local-catalog).

## Keep a follow-up list beside your sources

```sh
drive personal tags add DOC_ID follow-up budget
drive personal notes add DOC_ID 'Confirm whether tax is included' --title 'Budget review'
drive personal documents list tag:follow-up --json
drive personal search 'budget AND tag:follow-up' --exact --json
drive personal notes list DOC_ID --json
```

Both the document list and search take `tag:` inside the query. Read the note
list to confirm the saved memo. These operations change local context, not Google's document.

## Link a document to a person or project

```text prompt
Use drive CLI with profile personal to show observed editors and existing document links.
Link the document to the stored project and person I select, then show its saved context.
Do not merge people merely because their names match.
```

```sh
drive personal identities list DOC_ID --json
drive personal relationships add DOC_ID project:PROJECT_ID --kind related-to
drive personal relationships add DOC_ID person:PERSON_ID --kind about
drive personal documents context DOC_ID --json
```

Use references returned by the same store. Drive links existing records; it does not create
projects or tasks. Observed owners/last editors are not a complete contributor history. To link
messenger records, use the same `MESSAGING_STORE` override in every tool if you change the default. Separate databases do not
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
drive personal memories extract DOC_ID --scope work --yes
drive personal memories list DOC_ID scope:work --json
drive personal facts list DOC_ID status:proposed --json
drive personal memories confirm DOC_ID memory:MEMORY_ID
drive personal facts confirm DOC_ID fact:FACT_ID
```

Extraction previews by default. `--yes` generates a fresh batch and saves all its valid proposals;
it does not save the previous preview. Review the saved proposals before confirming them. Replace `MEMORY_ID` with a returned
reference only after reviewing it. Source changes/removal mark active memories stale.
Extraction sends selected cached text to your provider; local embedding search is a separate
operation. You can write a memory yourself with `memories add DOC_ID 'Your fact' --scope work`.

## Update a decision

Keep the earlier decision and its source when an agreement changes. These commands update
local facts for the imported document; they do not edit Google Drive.

```sh
drive personal facts list DOC_ID kind:decision --json
drive personal facts add DOC_ID 'Move the launch to November' --type decision --scope work --supersedes fact:OLD_ID --occurred-time 2026-10-16T10:00:00Z
drive personal facts show DOC_ID fact:OLD_ID --json
```

Use the earlier decision's returned reference for `fact:OLD_ID`. Your replacement is accepted
immediately and the earlier decision becomes `superseded`; both remain visible. The optional
`--occurred-time` records when the decision happened, rather than when you saved it.
An agent-authored replacement stays proposed until you confirm it; the earlier decision keeps
holding until then. Review the source before confirming.

If a decision no longer holds and there is no replacement:

```sh
drive personal facts reverse DOC_ID fact:DECISION_ID
drive personal facts list DOC_ID status:reversed --json
```

Reversal applies to accepted decisions. Other fact kinds cannot be reversed. These operations
require the fact to belong to the selected document and account, work offline and respect
`--read-only`. Use `--dry-run` to preview the operation without changing local facts.

## Inspect revisions or optional activity history

```sh
drive personal documents history DOC_ID --json
drive personal comments list DOC_ID --json
```

These are live Google reads. Revisions/comments use Drive API. For actor/activity events, enable
Drive Activity API and reconnect with its additional permission:

```sh
drive personal session start --client-file /path/to/desktop-client.json --grant activity
drive personal documents history DOC_ID --activity --json
```

Pass `page.next_cursor` to the same command's `--cursor` option to continue. Google's
visible revisions/events can be incomplete; they are not a character-by-character edit history.
Comments are inspectable here but are not included in document search.

## Give another tool one Markdown file

```sh
drive personal documents export DOC_ID --output ./decision.md
```

Open the resulting file or pass its path to a tool running on the same computer. Export reads
cached Markdown, so sync first for fresh content. This does not upload a file to a remote agent.
Remove your extra export when finished if you do not need that copy; the managed cache remains.

## Create a native Doc and include it in search

Use this only when you want to change Google Drive. Reconnect with `--grant write`, then create a
native Doc and move it into a selected folder:

```sh
drive personal session start --client-file /path/to/desktop-client.json --grant write
drive personal documents create --title 'Project review'
drive personal documents update NEW_DOC_ID --body '{"requests":[{"insertText":{"endOfSegmentLocation":{},"text":"Review notes\n"}}]}'
drive personal files get NEW_DOC_ID --json
drive personal files move NEW_DOC_ID --parent FOLDER_ID --old-parent OLD_PARENT_ID
drive personal sync --json
```

Replace `NEW_DOC_ID` with the create response's `document_id`. Docs creates it in My Drive's root.
Read its `parents` from `files get` and replace `OLD_PARENT_ID` with that parent ID; `--old-parent` removes
the old parent while adding the selected one. Google files have one parent; see the
[official folder-move guide](https://developers.google.com/workspace/drive/api/guides/folder#move-files-between-folders).
Confirm the selected folder contains
it and that local search finds the new text. Existing-document edits should use the Docs
`writeControl` revision check exposed by [the update schema](commands.md#drive-documents-update).
To upload an existing local PDF, Office document or media file instead, use
`drive personal files upload ./report.pdf --parent FOLDER_ID`. The same write grant is required.
The command returns the uploaded file ID; an interrupted upload resumes when you repeat it.
Run sync to index supported files inside selected folders. Uploading preserves the file format;
it does not convert local Markdown into a formatted Google Doc.

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

## Find a document and the conversation where it was shared

After importing a folder, use Memo, Telegram or MAX to find its documents alongside stored
messages and notes. Ask your agent:

```text prompt
Use Drive CLI to sync my personal profile's selected folders. Find the budget document in the
shared WireCat search, show its Google link, then find the stored conversations that shared it.
```

Drive sync links imported documents to Google file URLs in messages already stored by the
messenger tools. Later syncs also link newly stored messages when the document has not changed.
No messenger history is fetched and nothing is marked read. Links hidden behind formatted text
without a visible Google URL are not detected.

For exact commands, replace `CHAT_ID` with a chat selected in your Telegram profile:

```sh
drive personal sync
tg personal search all budget --exact
tg personal chats documents list CHAT_ID
```

Drive's own search includes the document's reference, Google URL and last Google edit time. The
chat list shows the imported document title when its link has been connected. Empty results can
mean that the relevant documents or messages have not been imported.

## Read and change spreadsheet cells

Use live Sheets commands when you need current cells or formulas. Importing a spreadsheet makes
its saved text searchable; a live range read does not import it, and a live write reaches the
local search index only after the next sync. Live commands require the Google Sheets API in the OAuth application project. For a user-owned
application, [enable Google Sheets API](https://console.cloud.google.com/apis/library/sheets.googleapis.com)
in that project; WireCat maintains the shared application configuration.

```text prompt
Use drive CLI with profile personal. Inspect the tabs in the spreadsheet I select, then read
Budget!A1:C4. Show me the current values and formulas before suggesting a change. If I ask you to
apply it, change only the agreed cells, show the returned range, and refresh the saved search copy.
```

Start with the read-only connection:

```sh
drive personal sheets info SHEET_ID --json
drive personal sheets show SHEET_ID 'Budget!A1:C4' --json
drive personal sheets show SHEET_ID 'Budget!C1:C4' --render formula --json
```

Replace `SHEET_ID` with the spreadsheet ID or its Google Sheets URL. A1 notation names a tab and
cells: `Budget!A1:C4` selects columns A–C and rows 1–4. For a tab with spaces, pass
`"'Quarter 1'!A1:C4"`. `--render unformatted` returns raw values; the default returns Google's
formatted display values. Blank trailing rows and cells can be absent from the answer.

To change cells, reconnect with an explicit write grant:

```sh
drive personal session start --grant write
drive personal sheets update SHEET_ID 'Budget!A2:B2' --values '[["Travel",250]]' --json
drive personal sheets update SHEET_ID 'Budget!C2' --input user-entered --values '[["=B2*1.2"]]' --json
drive personal sheets add SHEET_ID 'Budget!A1:C20' --values '[["Supplies",40,48]]' --json
drive personal sheets clear SHEET_ID 'Budget!A3:C3' --json
```

Updates interpret strings literally by default, including strings starting with `=`. Choose
`--input user-entered` for formulas and Google's spreadsheet-locale number/date parsing. Send
large identifiers as quoted strings. Values must be JSON rows of strings, finite numbers,
booleans or `null`, with at most 10,000 supplied cells. `null` skips a cell; `""` clears its value.
Update rows must fit the selected rectangle; omitted cells stay unchanged.

Friendly write commands require a tab and finite cell rectangle. Append uses that rectangle to
find Google's existing table, then inserts rows **after the detected table**; the appended rows
can be outside the search rectangle. Check `updates.updated_range` and returned values rather
than assuming the range is the insertion location. Clear removes values and formulas while
retaining formatting. Updates/appends return changed values; use a subsequent read for an
independent check. Other collaborators can edit the sheet between commands.

`--dry-run` previews the method and range without contacting Google; `--read-only` refuses writes
and `--offline` refuses live Sheets actions. A write with `outcome_unknown` must be checked in
Google before repeating it, especially an append that could insert duplicate rows. The CLI does
not automatically retry these writes. Use `sync` to refresh an imported spreadsheet's local copy.

For bounded tab creation, insertion and formatting, follow
[Organize tabs and format selected cells](#organize-tabs-and-format-selected-cells) below.
For additional operations or multiple ranges in one request, use the generated Sheets API commands
in the [command reference](commands.md). Generated requests use Google's JSON schemas and the same
permission, offline and read-only guards. They do not have the friendly commands' finite-range
or 10,000-cell checks. Raw `api call` writes also require `--allow-writes`. Generated repeated `--ranges` values are
comma-separated; use a JSON array in raw `api call --params` when a tab name itself contains a comma.
Some POST-based lookup methods require the broader Drive grant even though their effect is a read;
inspect the method contract and Google authorization requirements before reconnecting.

## Organize tabs and format selected cells

Use tab IDs from `sheets info` to change a specific tab inside an existing spreadsheet. These
commands use the same explicit write connection as cell updates. They change Google data;
refresh the imported copy with `sync` when local search needs the updated source.

```text prompt
Use drive CLI with profile personal. Inspect the tabs in my selected spreadsheet. Create a
Quarter 2 tab, rename the tab I identify, and make only its A1:C1 header bold. Show the returned
tab IDs and changed range. Preserve existing cell values and other formatting.
```

```sh
drive personal sheets info SHEET_ID --json
drive personal sheets create SHEET_ID 'Quarter 2' --json
drive personal sheets rename SHEET_ID 101 'Quarter 1' --json
drive personal sheets insert SHEET_ID 101 rows 1 3 --json
drive personal sheets insert SHEET_ID 101 columns 0 1 --json
drive personal sheets format SHEET_ID 101 A1:C1 --body '{"textFormat":{"bold":true}}' --json
drive personal sheets format SHEET_ID 101 B2:B10 --body '{"numberFormat":{"type":"NUMBER","pattern":"0.00"}}' --json
```

`create` adds an empty tab to the existing spreadsheet, rather than creating a new spreadsheet
file. Replace `101` with the numeric tab ID Google returned. The ID remains stable after rename;
rename changes only the title. Tab names must contain 1–100 characters; Google also checks name
validity and uniqueness.

Insert takes `rows` or `columns`, a **zero-based index to insert before**, and a count of 1–1,000.
Index `0` means the first row/column; row index `1` inserts before the second row. Later entries
shift. Google validates the current grid bounds and spreadsheet limits; use the generated API
for appending grid dimensions at the end. The command requests formatting inheritance from the
dimension after the insertion position.

Format uses an explicit tab ID and a finite range **without a tab prefix**, such as `A1:C4`.
At most 10,000 cells can be selected. Its JSON body supports text bold/italic/underline/
strikethrough, font family/size, foreground/background colors, horizontal/vertical alignment,
wrap strategy and number format. Field names follow Google's `CellFormat` JSON. Unknown fields,
empty objects, cell values and formulas are refused.

Only the formatting properties you provide are included in the request's field mask. Setting
`textFormat.bold` preserves italic text, number formatting and cell values; use `false` to remove
bold. Both color channels (`red`, `green`, `blue`, `alpha`) and theme-color styles are supported.
For other formatting fields or multiple operations in one request, use the generated
`api sheets-spreadsheets-batch-update` command. A generic batch has broader effects and none of
the friendly formatter's 10,000-cell/allowed-field limits.

All paths retain profile policy, OAuth write, offline/read-only, dry-run and uncertain-write
handling. A profile denial such as `sheets.rename` also applies to an equivalent raw/generated
batch request. Inspect current cells before repeating an uncertain structure change; otherwise
you could create duplicate tabs or insert more rows. Separate commands can observe collaborator
changes between requests.
