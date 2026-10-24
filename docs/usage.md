# Import and organize

Turn selected Google folders into a local copy your agent can search and read without returning
to Drive for every question. This guide shows how to choose the scope, check what was saved,
keep it current and export a document when another tool needs it. Examples use profile
`personal`; replace it with your connected profile's name.

**Sync** downloads supported source content and updates its local index. A **snapshot** is the
saved source content and metadata from that sync. An **export** is an additional file you request;
it is not required for search.

## Choose the right operation

| What you want | Command | Where the data comes from | What is saved |
| --- | --- | --- | --- |
| Browse a folder before importing | `drive personal files list --parent FOLDER_ID` | Google, immediately | No document import |
| Read a native Google Doc now | `drive personal documents get DOC_ID` | Google, immediately | No local import; prints Docs JSON |
| Keep a folder searchable | `drive personal folders add FOLDER_ID`, then `drive personal sync` | Google folder and descendants | Index, snapshots and sync checkpoint |
| Read an imported source | `drive personal documents show DOC_ID` | Local snapshot | Nothing new |
| Save a Markdown file for another tool | `drive personal documents export DOC_ID --output ./decision.md` | Local snapshot | The file you requested |

Redirecting command output to a file also saves that output. Browsing or reading live content
alone does not add it to local search. Search needs an import; an export is optional.

## Which document types are searchable?

| Type in Google Drive | Sync behavior | Search/export result |
| --- | --- | --- |
| Native Google Doc | Fetches Docs content and Google's Markdown export | Search includes text from all tabs; export uses Google's Markdown |
| Uploaded Markdown or TXT | Downloads text into the managed local cache | Text can be searched and exported |
| Google folder | Stores metadata and parents in the database; traverses descendants | Browse with `catalog tree`, search metadata, attach local tags and notes |
| Native Google Sheet | Exports the workbook as `.xlsx` and reads every sheet | Each sheet is a heading; each row reads as `Row 2: Column: value`, with the first row as column names when it is a text header |
| Uploaded PDF, Word (`.docx`), Excel (`.xlsx`), CSV or TSV | Downloads and reads the text | PDF and `.docx` text, every Excel sheet, CSV rows |
| Scanned PDF without a text layer | Saved by name with the reason | No OCR; found by its name |
| Images, with `picture_search` on | Saved by name, then downloaded (up to 25 MB, only where Google allows downloads) and given a picture vector; the file is not kept | Found by what it shows, in `pictures`; see [picture search](search.md#search-images-by-what-they-show) |
| Native Google Slides, presentations, `.xlsm`, images (with `picture_search` off), audio, video, JSON or code | Saved by name with the reason | No extraction, OCR or transcription; found by its name |
| Drive shortcut | Skipped | Target is not followed through the shortcut |
| Download restricted by Google | Saved by name with the reason | Metadata access does not guarantee content access; found by its name |

`drive personal config set picture_search true` turns picture search on for one profile (see
[configuration](configuration.md)). The next `drive personal sync` then downloads each image once, and the sync
output counts them in `pictures`. `pictures_too_large` counts images over 25 MB, which stay name-only.
`pictures_skipped` says the picture model is not downloaded; the rest of the sync still finishes, and the
images are picked up by a later sync once the model is there.

Markdown/TXT recognition uses the text MIME type or `.md`, `.markdown` or `.txt` suffix.
Google exports at most 10 MB of a native file, so a larger Sheet is skipped with that reason.
Files over 50 MB are skipped before download, and so is text of 2 000 000 characters or more
(lower it with the [`max_text_chars` setting](configuration.md#saved-settings)). Files skipped by an older version only for their type
are read on the next sync.
A different filename does not convert a binary document into text. Native Docs search includes
body text, tables and footnotes; headers, footers, comments, images and suggested edits are
excluded. Search text and Google's Markdown export are separate representations, so inspect the
export when layout or tab coverage matters. Check the sync report for each skipped source.

A file Drive cannot read is still saved by its name, type, size, owners and link, with no text. `drive personal sync` counts
these as `names_only` and lists each reason under `skipped`. `search` finds them by the words in their name, and
the hit carries `not_read` with the reason, so open `source_url` instead of quoting text that is not there.
Meaning search ignores them. They leave the index like any other file: trashed, moved out of the folders or deleted.
When a later version reads the type, or the text limit allows the file, the next sync replaces the entry with its text.

<a id="import-a-folder"></a>

## Import a folder and check coverage

```text prompt
Use drive CLI with profile personal. Import the Google folder I select and its subfolders.
Show how many documents were imported, what was skipped and whether work remains.
Do not create extra export files or change anything in Google Drive.
```

For manual use, replace `FOLDER_ID` with your folder ID or full Google folder URL:

```sh
drive personal files list --parent FOLDER_ID --json
drive personal folders add https://drive.google.com/drive/folders/FOLDER_ID
drive personal sync --limit 200 --json
drive personal status --json
drive personal documents list --json
```

A successful import lists documents with stable Google IDs and original links. A nonzero pending
count means the batch is unfinished: run `drive personal sync` again. This resumes saved work.
An interrupted first folder walk also resumes from its saved checkpoint. Use `sync --rescan`
to restart discovery. Completed file work is checkpointed in batches; an abruptly killed sync
may repeat the last batch when resumed.
The initial scan is recursive; `files list --parent` lists immediate children only. If Google
has more, the answer's `page.next_cursor` holds the token; pass it to `files list --cursor TOKEN` for the next page.

`folders list` shows selected roots. `catalog tree` shows their cached hierarchy, and
`catalog list "parent:FOLDER_ID"` lists a folder's direct children without Google. Documents remain grouped
by account in the content index; moving them in Google does not change their local reference.
Duplicate names are safe: use IDs, rather than titles, to select a source.

The same imported documents can supply [project evidence through Memo](recipes.md#gather-project-context-with-memo).
Sync the selected folders first; browsing a file through a connected app alone does not retain it in Memo.
Use the same shared database in both tools and choose the imported Drive profile explicitly.

## Read content and metadata offline

After import, these commands use the local copy and do not contact Google:

```sh
drive personal --offline documents list --json
drive personal --offline documents show DOC_ID --json
drive personal --offline documents context DOC_ID --json
drive personal --offline identities list DOC_ID --json
drive personal --offline search 'budget' --exact --json
```

`documents list` returns cached titles, IDs, original links, MIME types, parent IDs, owners and
last editor, plus timestamps and source versions when Google supplied them. `documents show`
adds indexed text and tab IDs/titles. `documents context` adds your local labels, notes, links
and memories. Read the saved content directly; opening its Google link is optional.

Offline means the last saved version, not a fresh check of Google. `status` reports the last
sync and pending/skipped work. Full permission lists, comments, revisions, activity events and
arbitrary API responses are not automatically cached. Live `files get` and `documents get`
are different from cached `documents show`; `--offline` refuses them.

Sync requests all available file-metadata fields and saves the provider response under a catalog
entry's `provider_metadata`. Google only exposes fields your account may read. Old cache entries retain
their normalized subset; `sync --rescan` refreshes metadata from Google.

## Browse and organize the local catalog

A **catalog** is the saved list of files and Google folders, their metadata and parent relationships.
It lets you locate sources even when their content was not downloaded or cannot be read. Sync
fills it automatically after discovery, before processing the bounded content batch.

For an existing import, backfill it from your cache without Google or extra downloads:

```sh
drive personal catalog import --offline
drive personal catalog tree --offline
drive personal catalog list 'parent:FOLDER_ID' --offline --json
drive personal catalog show FILE_ID --offline --json
drive personal catalog search 'budget AND kind:file' --offline --json
drive personal catalog list 'person:Rin* AND mime:"application/pdf"' --offline --json
```

`catalog import` copies metadata already saved in the sync checkpoint; it does not discover new
Google files or advance the sync cursor. It includes pending sources and excludes pending
removals. If `entries` is zero and you have not synced the folder, run the first import above.
For fresher or more complete metadata, use `sync --rescan` with network access.

`tree` starts at selected roots, or accepts a folder ID. `--depth 3` bounds its descendants;
`truncated: true` means a branch has more children. Tree nodes are compact; use `show` for
metadata. Lists accept `--limit` and `--page` and report `has_more`. List filters use the shared query
language: `kind:folder`, `parent:FOLDER_ID`, `tag:follow-up` or `mime:"application/pdf"`.
Combine them with `AND`, `OR` and `NOT`. `person:Rin*` matches an observed owner's or last
editor's name, email or Google ID by prefix; quote a full name for an exact value. Metadata
search also accepts bare words matching names, descriptions or types. This is separate from
indexed text/meaning search and from
`documents list person:PERSON_UID`, which lists the documents linked to a stored person.

Catalog entries return a stable `document:<id>` reference. That reference also represents a
Google folder; it does not mean the folder has document text. Inspect `kind` and `content`:
`metadata` means no indexed body, `indexed` means text was saved, and `unreadable` means an
attempt saved the name and its failure reason. These states do not promise complete extraction.

You can tag a folder, save a memo beside it or link it to an existing project:

```sh
drive personal catalog tags add FOLDER_ID project follow-up --offline
drive personal catalog list 'tag:follow-up' --offline --json
drive personal notes add FOLDER_ID 'Ask Rin which files are final' --offline
drive personal relationships add FOLDER_ID project:PROJECT_ID --kind related-to --offline
drive personal documents context FOLDER_ID --offline --json
```

Use Google IDs or URLs in these commands and project references from the same local store.
Tags, notes and relationships reuse the shared knowledge records. Folder tags do not propagate
to children, and do not change Google labels or permissions. Renames and moves retain the
reference. Sources outside the selected scope leave the active catalog; metadata reconciliation
preserves their identity and annotations. Ordinary content-removal jobs still remove source
text and its document tags using the existing index rules.

Each account's catalog is isolated. A completed scope holds at most 10,000 entries, with bounded
metadata and tree output; choose narrower roots if a scan exceeds the bound.

## Keep the index current

```sh
drive personal sync --json
drive personal status --json
```

Sync polls Google's change feed. Repeat it after edits or before a time-sensitive answer; there
is no background watcher. `--limit` bounds the documents read for that invocation, not the eventual
size of the folder. `--rescan` reconciles the selected folders from a fresh change token when you
need a full check. One sync reads at most 10,000 entries under the chosen folders and at most
10,000 changes since the last sync. When Google lists more changes than that, `--rescan` reads the
folders instead; when the folders themselves hold more, choose smaller ones. Unchanged text reuses its content identity and existing embeddings.
Renames keep document IDs; files moved outside selected roots or removed remotely leave local
search after reconciliation. Changed or removed sources mark their active memories stale.

## Disk use: index without an export directory

Normal sync already avoids creating a folder of user-facing downloads. It stores:

- searchable source text, chunks and optional vectors in the local database;
- a JSON snapshot with source/tab metadata and a Markdown snapshot for each imported document;
- folder ancestry, change checkpoints and pending jobs in profile state.

The managed snapshots support cached reads, Markdown export and memory evidence. Sync currently
retains them: there is no download→index→discard mode or automatic snapshot pruning. Deleting
managed snapshot files by hand breaks those workflows even if indexed text remains searchable.
To avoid extra copies, search/read the cache and export only documents another tool needs.

The database is shared with other WireCat tools. `DRIVE_STATE_DIR` controls snapshots
and checkpoints; `MESSAGING_STORE` selects the database. `DRIVE_CACHE_DIR` does not relocate source
snapshots. See [storage settings](configuration.md). Local text and vectors still take disk space
when you avoid exports; indexing cannot retain search content with zero local storage. When changing
stores, [preview and copy the existing context](recipes.md#keep-notes-when-changing-databases) instead
of dropping the old file. Copies retain structured document relationships and annotations; literal
references written inside free text remain unchanged.

<a id="add-local-context"></a>

## Add tags and notes

Replace `DOC_ID` with an imported source's Google ID:

```sh
drive personal tags add DOC_ID budget follow-up
drive personal notes add DOC_ID 'Ask Rin to confirm the revised totals'
drive personal search 'budget AND tag:follow-up' --exact --json
drive personal documents context DOC_ID --json
```

Tags, notes and links are local context; they do not edit the Google source. Ordinary renames
and resyncs preserve them. `documents context` brings together notes, labels, links, memories
and observed editors. For reviewed facts or person/project links, use [recipes](recipes.md).

## Download or convert a file from Google

These commands read Google directly; the file does not need to be imported:

```sh
drive personal files download FILE_ID --out ./download.bin
drive personal files export DOC_ID --format pdf --out ./document.pdf
drive personal files export DOC_ID --format docx --out ./document.docx
drive personal files export SHEET_ID --format xlsx --out ./workbook.xlsx
drive personal files export SHEET_ID --format csv --out ./sheet.csv
```

`download` saves an uploaded file's bytes. `export` asks Google to convert a native document;
choose a format that Google supports for its type (PDF or DOCX for Docs, XLSX or CSV for Sheets).
CSV exports only the first sheet. Google limits native exports to 10 MB; Drive bounds every download
at 50 MB. Neither command imports the file into search or changes it in Google. Google Vids require
the long-running API download flow and are not supported by these friendly commands.

An existing output, including a symlink, is refused before downloading. Pass `--overwrite` to replace
it. Results contain the file ID and byte count, without the document name or local output path.
Both commands write a local file, so `--read-only` refuses them; `--dry-run` previews without fetching.
The existing `documents export --output PATH` writes an imported Markdown snapshot offline.

## Export or stop importing

```sh
drive personal documents export DOC_ID --output ./decision.md
drive personal folders remove FOLDER_ID
drive personal sync --json
```

Export refuses to overwrite an existing file. Removing a selected root reconciles managed source
snapshots and indexed source records on the next sync. Sources covered by another root remain.
Google originals and independently exported files are untouched. This is source reconciliation,
not a promise that SQLite shrinks or every separately created note is erased.

Check that the document list and search now match your selected scope. Continue with
[searching documents](search.md) or [complete task recipes](recipes.md).

## Use structured output

JSON and JSONL let another tool read results without parsing terminal text. You can keep only
its required fields while retaining pagination and completeness information.

Machine-readable command answers use an envelope: `item` for a single or rich result, or `items`
with `page` for a list; `meta` identifies the invocation, its duration and `complete` status. Drive-owned keys
are snake_case. Provider metadata and user dictionaries keep their original keys. Search passages
are under `item.hits`, and sync/status counters are under `item`. Help and shell completion remain
text; `commands --json` uses the shared discovery document with contract `3`. Command `effects`
describe remote and local reads/writes; `api_operation` identifies a generated Google method.
Local lists use `page.mode: "page"` and return `next_page` when more results remain; Google lists
(`files list`, `comments list`, `permissions list`, `revisions list`, `shared-drives`, `documents history`)
use `page.mode: "cursor"` and return `next_cursor`. Search and note lists use `--page`, not `--offset`. JSONL emits `{"type":"item","data":…}` records followed by
one `{"type":"end",…}` record with `complete` and page metadata. Errors include `error.retry.safe`, and the process exit code names the kind (`2` bad input, `4` not signed in,
`5` not allowed, `6` not found, `9` timeout; the full table is under [exit codes](commands.md#exit-codes));
an uncertain remote write must be inspected before repeating it. MCP displays control characters
visibly.

For a few catalog fields, use `--json=id,name` instead of `--json`.
Dotted paths select nested objects and arrays: use `--json=hits.ref,hits.excerpt` for search
passages under `item.hits`. Paths are relative to the answer payload. Envelope, page, coverage,
next steps, missing data and execution metadata stay available. Field selection reduces printed
output, not the work scanned.
The same selection works with `--jsonl`. Unknown top-level fields are refused with the
available field names. A write without declared result fields requires ordinary `--json`;
field selection is refused before that write runs.

At an interactive terminal, commands with declared result fields ask you to name those fields
when you request JSON. Omit `--json` for ordinary reading, or select fields explicitly. Agents
and pipes can use bare `--json` for the full result.

See the [command reference](commands.md) for each operation's arguments and output options.
