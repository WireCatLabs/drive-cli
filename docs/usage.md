# Import and organize

Keep the Google folders you choose on your computer, so your agent searches and reads them without going back to
Google for every question. You choose what to copy, check what was saved, keep it current, and export a document
when another tool needs it as a file.

A sync downloads the text of the chosen folders and updates the search index. The saved copy of each document, its
snapshot, is what search and offline reads use; an export is an extra file you ask for, and search does not need
it. Examples use the profile `personal`, the short name you gave the Google account.

**On this page:**

1. [Choose the right operation](#choose-the-right-operation)
2. [Which document types are searchable?](#which-document-types-are-searchable)
3. [Scans and pictures](#scans-and-pictures)
4. [Meet transcripts and Gemini notes](#meet-transcripts-and-gemini-notes)
5. [Import a folder and check coverage](#import-a-folder-and-check-coverage)
6. [Read content and metadata offline](#read-content-and-metadata-offline)
7. [Browse and organize the local catalog](#browse-and-organize-the-local-catalog)
8. [Keep the index current](#keep-the-index-current)
9. [Disk use: index without an export directory](#disk-use-index-without-an-export-directory)
10. [Add tags and notes](#add-tags-and-notes)
11. [Download or convert a file from Google](#download-or-convert-a-file-from-google)
12. [Edit a file stored in Google Drive](#edit-a-file-stored-in-google-drive)
13. [Export or stop importing](#export-or-stop-importing)
14. [Use structured output](#use-structured-output)

## Choose the right operation

| What you want | Command | Where the data comes from | What is saved |
| --- | --- | --- | --- |
| Browse a folder before importing | `drive personal files list --parent FOLDER_ID` | Google, immediately | No document import |
| Read a native Google Doc now | `drive personal documents get DOC_ID` | Google, immediately | No local import; prints Docs JSON |
| Add one document outside the chosen folders to search | `drive documents add DOC_URL --profiles work,personal` | Google, through the first named profile that opens it | Its text, as a source added by hand; never synced again |
| Keep a folder searchable | `drive personal folders add FOLDER_ID`, then `drive personal sync` | Google folder and descendants | Index, snapshots and sync checkpoint |
| Read an imported source | `drive personal documents show DOC_ID` | Local snapshot | Nothing new |
| Save a Markdown file for another tool | `drive personal documents export DOC_ID --output ./decision.md` | Local snapshot | The file you requested |

`documents add` takes a Google Doc, Sheet, PDF or any other file sync reads. It tries the profiles in the order
you name them (`all` is every profile, sorted), at most five (`drive personal config set max_add_profiles 8
--defaults` changes that), and answers with the one that opened the document and what refused the others. Only a
refusal of access (not found, denied, signed out) moves on to the next profile; a spent quota or a network failure
stops, naming the profile it stopped at. Nothing picks a profile for you: with no profile word and no `--profiles`
it lists the profiles to choose from, and a profile word with `--profiles` is refused. It runs at a terminal only,
not over MCP.

It keeps Google's own address for the file, not the link's sharing parameters. A file a sync already imported,
by any profile, is answered as `duplicate_of`, and nothing is stored twice. Adding the same file again after it
changed keeps a second copy beside the first: the first is not replaced yet.

Redirecting command output to a file also saves that output. Browsing or reading live content
alone does not add it to local search. Search needs an import; an export is optional.

## Which document types are searchable?

| Type in Google Drive | Sync behavior | Search/export result |
| --- | --- | --- |
| Native Google Doc | Fetches Docs content and Google's Markdown export | Search includes text from all tabs; export uses Google's Markdown |
| Uploaded Markdown or TXT | Downloads text into the managed local cache | Text can be searched and exported |
| Google folder | Stores metadata and parents in the database; traverses descendants | Browse with `catalog tree`, search metadata, attach local tags and notes |
| Native Google Sheet | Exports the workbook as `.xlsx` and reads every sheet | Each sheet is a heading; each row reads as `Row 2: Column: value`, with the first row as column names when it is a text header |
| Uploaded PDF, Word (`.docx`, `.doc`), Excel (`.xlsx`), PowerPoint (`.pptx`), OpenDocument (`.odt`, `.ods`, `.odp`), RTF, HTML, EPUB, CSV or TSV | Downloads and reads the text | Document and slide text, every Excel sheet, CSV rows. A file skipped as an unsupported type before is read on the next sync |
| Scanned PDF without a text layer, JPEG, PNG or WebP picture | Read by OCR, as `read_scans` says: on this computer by default. A file over 20 pages, or a picture over 25 MB, is saved by name with the reason | Text can be searched and exported. With `read_scans` set to `off`, found by its name only. See [scans and pictures](#scans-and-pictures) |
| Images, with `picture_search` on | Saved by name, then downloaded (up to 25 MB, only where Google allows downloads) and given a picture vector; the file is not kept | Found by what it shows, in `pictures`; see [picture search](search.md#search-images-by-what-they-show) |
| Native Google Slides, `.ppt`, `.xlsm`, other images (TIFF, HEIC, with `picture_search` off), audio, video, JSON or code | Saved by name with the reason | No extraction or transcription. Found by its name |
| Drive shortcut | Skipped | Target is not followed through the shortcut |
| Download restricted by Google | Saved by name with the reason | Metadata access does not guarantee content access; found by its name |

`drive personal config set picture_search true` turns picture search on for one profile (see
[configuration](configuration.md)). The next `drive personal sync` then downloads each image once, and the sync
output counts them in `pictures`. `pictures_too_large` counts images over 25 MB, which stay name-only.
`pictures_skipped` says the picture model is not downloaded; the rest of the sync still finishes, and the
images are picked up by a later sync once the model is there.

## Scans and pictures

A sync reads the text of a scanned PDF (one with no text layer) and of a JPEG, PNG or WebP picture by OCR. The
profile's `read_scans` setting chooses who reads it:

| `read_scans` | Who reads the text | What it needs |
| --- | --- | --- |
| `local` (default) | The `tesseract` program on this computer, in Russian and English. Nothing leaves the computer and nothing is downloaded | `tesseract` installed, for example `sudo apt install tesseract-ocr tesseract-ocr-rus` on Debian or Ubuntu, `brew install tesseract tesseract-lang` on macOS |
| `anthropic` or `openai` | The model chosen with `wcat models ai set`, at that provider's own address. Each page is sent to the provider as a picture, and the provider charges for every page | `memo models ai set` with that provider, and pictures allowed (`--allow-remote`) |
| `off` | No one | Scans and pictures are saved by name only |

`drive personal config set read_scans '"anthropic"'` switches one profile. One file is read up to 20 pages, and one
sync reads at most 100 pages. The pages over that wait for the next sync. A scan an older drive kept by name is
read on the next sync. When `tesseract` is missing, the sync still finishes, and each scan's reason says how to
install it. With `picture_search` on, a picture gets both its text and its picture vector. `local` turns a page
lying on its side before it reads it, with `tesseract`'s orientation data (`sudo apt install tesseract-ocr-osd`
where it is not installed with `tesseract`). Without that data such a page reads as garbled text, and the sync's
`warnings` say `document.scan-unturned`.

## Meet transcripts and Gemini notes

Google Meet saves a meeting's transcript and Gemini's notes as Google Docs in the organizer's Drive and shares them
with the guests, so most of them are in no folder of yours. `drive personal transcripts list` lists the Google Docs
whose name holds `Transcript`, `Notes by Gemini` or one of their Russian and Spanish forms, in your Drive and among
the files shared with you, and imports nothing. `owned_by_me` is `false` for one in someone else's Drive.

The profile's `transcripts` setting decides what sync does with them; nothing is imported until you set it:

| `transcripts` | What sync does |
| --- | --- |
| `include` | Imports every match wherever it sits, keeps it up to date, and drops one that is no longer shared or renamed |
| `skip` or unset | Leaves them alone: only what the chosen folders hold |
| `exclude` | Leaves matches out even inside a chosen folder |

`drive personal config set transcripts '"include"'` turns it on. Drive keeps no mark that a document came from
Meet, so the name decides; `transcript_words` replaces the words (`drive personal config set transcript_words
'["Transcript","Notes by Gemini"]'`). If your transcripts have other names, set
`transcript_words`. A transcript a meeting tool also stored is shown once in WireCat's search, as the
meeting.

Markdown/TXT recognition uses the text MIME type or `.md`, `.markdown` or `.txt` suffix.
Google exports at most 10 MB of a native file, so a larger Sheet is skipped with that reason.
Files over 10 GB are skipped before download (`MESSAGING_ATTACHMENT_MAX_MIB` sets another limit, in MiB), and so is text of 2 000 000 characters or more
(lower it with the [`max_text_chars` setting](configuration.md#saved-settings)). Files skipped by an older version only for their type
are read on the next sync.
A different filename does not convert a binary document into text. Native Docs search includes
body text, tables and footnotes; headers, footers, comments, images and suggested edits are
excluded. Search text and Google's Markdown export are separate representations, so inspect the
export when layout or tab coverage matters. Check the sync report for each skipped source.

A file `drive` cannot read is still saved by its name, type, size, owners and link, with no text. `drive personal sync` counts
these as `names_only` and lists each reason under `skipped`. `search` finds them by the words in their name, and
the hit carries `not_read` with the reason, so open its `url` instead of quoting text that is not there.
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

`folders list` shows selected roots by id and name, without asking Google. The name is the one `folders add` saw,
and each sync refreshes it, so a renamed folder shows its new name after the next sync. A folder chosen before
drive kept names shows only its id until that sync. The list gives no `path`: Google Drive stores no path for a
folder, and building one costs a request per parent folder, often ending at a shared parent you cannot see.
`catalog tree` shows their cached hierarchy, and
`catalog list "parent:FOLDER_ID"` lists a folder's direct children without Google. Documents remain grouped
by account in the content index; moving them in Google does not change their local reference.
Duplicate names are safe: use IDs, rather than titles, to select a source.

The same imported documents can supply [project evidence through `wcat`](recipes.md#gather-project-context-with-wcat).
Sync the selected folders first; browsing a file through a connected app alone does not retain it in `wcat`.
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
Tags, notes and relationships are the same ones every WireCat tool reads from the store. A folder's tags do not
pass to the files inside it, and do not change Google labels or permissions. A renamed or moved file keeps its
reference. A source outside the chosen folders leaves the catalog but keeps its tags and notes. When a source's text
is removed from the index, its document tags go with it.

Each account's catalog is isolated, with bounded metadata and tree output. A scope of any size
reaches it over several syncs.

## Keep the index current

```sh
drive personal sync --json
drive personal status --json
```

Sync polls Google's change feed. Repeat it after edits or before a time-sensitive answer; there
is no background watcher. `--limit` bounds the documents read for that invocation, not the eventual
size of the folder. `--rescan` reconciles the selected folders from a fresh change token when you
need a full check. One sync reads at most 10,000 entries under the chosen folders and saves where it
stopped; the next sync goes on from there. A sync also stops in time, after 15 minutes in a terminal
and 45 seconds over MCP unless `--timeout` sets another, and says to sync again. One folder may hold
at most 10,000 entries, and one sync reads at most 10,000 changes since the last sync. When Google lists more changes than that,
`--rescan` reads the folders instead; when one folder holds more, choose smaller ones. Unchanged text reuses its content identity and existing embeddings.
Renames keep document IDs; files moved outside selected roots or removed remotely leave local
search after reconciliation. Changed or removed sources mark their active memories stale.

## Disk use: index without an export directory

Normal sync already avoids creating a folder of user-facing downloads. It stores:

- searchable source text, chunks and optional vectors in the local database;
- a JSON snapshot with source/tab metadata and a Markdown snapshot for each imported document;
- folder ancestry, change checkpoints and pending jobs in profile state.

Sync keeps these snapshots: local reads, Markdown export and memories need them. Do not delete them by hand;
search still finds the text, but reads and exports break. To save space, export only the documents another tool
needs.

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
drive personal files download FILE_ID --output ./download.bin
drive personal files export DOC_ID --format pdf --output ./document.pdf
drive personal files export DOC_ID --format docx --output ./document.docx
drive personal files export SHEET_ID --format xlsx --output ./workbook.xlsx
drive personal files export SHEET_ID --format csv --output ./sheet.csv
```

`download` saves an uploaded file's bytes. `export` asks Google to convert a native document;
choose a format that Google supports for its type (PDF or DOCX for Docs, XLSX or CSV for Sheets).
CSV exports only the first sheet. Google limits native exports to 10 MB; an uploaded file is saved whatever its size.
Neither command imports the file into search or changes it in Google. Google Vids require
the long-running API download flow and these commands do not support them.

An existing output, including a symlink, is refused before downloading. Pass `--replace` to replace
it. Results contain the file ID and byte count, without the document name or local output path.
Both commands write a local file, so `--read-only` and `DRIVE_READ_ONLY=1` refuse them; `--dry-run` previews without
fetching.
The existing `documents export --output PATH` writes an imported Markdown snapshot offline.

Without `--output`, `files download FILE_ID --json` saves nothing and answers the file's text with the `sha256` of
its bytes, for an edit (below). A text longer than 200,000 characters is cut there with `truncated: true` and no
`sha256`. A PDF, `.docx` or `.xlsx` answers its extracted text, also without a `sha256`: written back, that text would
replace the document.
Since it writes nothing here, a read-only run (`--read-only`, `DRIVE_READ_ONLY=1`) reads the text too, and an
agent over MCP runs it with `drive_read`. `--output` is the owner's alone: no MCP tool offers it.

## Edit a file stored in Google Drive

These commands change a file that is stored in Drive as a file: Markdown, text or CSV, and uploaded Word (`.docx`)
and Excel (`.xlsx`) files. They need a sign-in with `--grant write`.

| Command | What it changes |
| --- | --- |
| `files update FILE_ID --text <text>` (or the text on stdin) | the whole text of a plain-text file |
| `files sheets update FILE_ID <range> --values <json>` | cells of an `.xlsx`, from `files sheets show`; the rest of the workbook stays as it is |
| `files documents update FILE_ID --payload <json>` | paragraphs of a `.docx`, by the indexes `files documents show` gives |
| `files restore FILE_ID <version>` | puts back a version `files history` lists |

An edit replaces a file only at the content it was read at. Read the file's `sha256` first and pass it as
`--expected-fingerprint`: `files download FILE_ID --json` gives it for a text file, and `files sheets show` and
`files documents show` give it for a workbook or a Word file. Before the upload, drive downloads the file, keeps
its content on this computer in the profile's state folder, and checks that it still has that `sha256`. Just before
the upload it checks the file once more: by Google's own `sha256` of the file, or, when Google has none or another
one, by downloading the bytes again. If the file changed, the answer is a `conflict` that names the command to read
it again, and nothing is uploaded.

Google Drive has no conditional upload: its API gives a file no version tag that an upload could be made to depend
on. So a change that lands in the moment between that last check and the upload is not caught. Its content is not
lost: the content drive replaced is kept on this computer, and Drive keeps its own earlier revisions of a stored file
(`revisions list FILE_ID`). The file keeps its id, name and folder.

`files update` writes over a file that is there; it does not create one. Google Drive names a file by its id, so a
new file goes up with `files upload`. It refuses a PDF, `.docx` or `.xlsx`, whose text is extracted on a read.
`sheets update` writes a text as text, even one that starts with `=`, and refuses to overwrite a formula unless
`--replace`. `documents update` refuses a paragraph with a tracked change, a field, an image, a comment, a link or a
footnote, and says why. Every write over a file also checks the `files.delete` permission: a profile that sets it to
`ask` asks first, and `deny` refuses the edit ([configuration](configuration.md)).

These commands do not change a Google Doc or Sheet, which has no stored file. They refuse one and name the command
that does: `documents update` for a Doc, the [`sheets` commands](recipes.md#read-and-change-spreadsheet-cells) for a
Sheet.

`files history FILE_ID` lists what this profile's edits replaced, newest last. Each `version` is the `sha256` of the
replaced content, and `available` says whether it is still kept. `files restore FILE_ID` with no version still takes
a file out of the trash. See [edit a file with your agent](recipes.md#edit-a-file-stored-in-drive-with-your-agent).

## Export or stop importing

```sh
drive personal documents export DOC_ID --output ./decision.md
drive personal folders remove FOLDER_ID
drive personal sync --json
```

Export refuses to overwrite an existing file. Removing a selected root reconciles managed source
snapshots and indexed source records on the next sync. Sources covered by another root remain.
Your Google files and your own exports stay. The database file does not get smaller by itself, and notes you
created separately stay.

Check that the document list and search now match your selected scope. Continue with
[searching documents](search.md) or [complete task recipes](recipes.md).

## Use structured output

JSON and JSONL let another tool read results without parsing terminal text. You can keep only
its required fields while retaining pagination and completeness information.

Machine-readable command answers use an envelope: `item` for a single or rich result, or `items`
with `page` for a list; `meta` identifies the invocation, its duration and `complete` status. Drive-owned keys
are snake_case. Provider metadata and user dictionaries keep their original keys. Search passages
are under `item.hits`, and sync/status counters are under `item`. Help and shell completion remain
text; `commands --json` uses the shared discovery document with contract `4`. Command `effects`
describe remote and local reads/writes; `api_operation` identifies a generated Google method.
Local lists use `page.mode: "page"` and return `next_page` when more results remain; Google lists
(`files list`, `comments list`, `permissions list`, `revisions list`, `shared-drives`, `activities list`)
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
