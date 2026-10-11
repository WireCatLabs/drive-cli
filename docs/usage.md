# Import and organize

Use this guide to turn a selected Google folder into searchable local documents and understand
what stays on disk. You must connect an account first. Every account command names its profile;
these examples use `personal`. Replace it with the profile you chose at [sign-in](installation.md).

## Choose the right operation

| What you want | Command | Where the data comes from | What is saved |
| --- | --- | --- | --- |
| Browse a folder before importing | `drive personal files list --parent FOLDER_ID` | Google, immediately | No document import |
| Read a native Google Doc now | `drive personal documents get DOC_ID` | Google, immediately | No local import; prints Docs JSON |
| Keep a folder searchable | `drive personal folders add FOLDER_ID`, then `drive personal sync` | Google folder and descendants | Index, snapshots and sync checkpoint |
| Read an imported source | `drive personal documents show DOC_ID` | Local snapshot | Nothing new |
| Save a Markdown file for another tool | `drive personal documents export DOC_ID --out ./decision.md` | Local snapshot | The file you requested |

Redirecting command output to a file also saves that output. Browsing or reading live content
alone does not add it to local search. Search needs an import; an export is optional.

## Which document types are searchable?

| Type in Google Drive | Sync behavior | Search/export result |
| --- | --- | --- |
| Native Google Doc | Fetches Docs content and Google's Markdown export | Search includes text from all tabs; export uses Google's Markdown |
| Uploaded Markdown or TXT | Downloads text into the managed local cache | Text can be searched and exported |
| Google folder | Traverses descendants and remembers IDs/parents in sync state | Folder itself is not a searchable document |
| PDF, Word, Excel, presentations, images or audio | Skipped | No automatic extraction, OCR or transcription |
| Native Google Sheets or Slides | Skipped | No spreadsheet/slide indexing |
| Drive shortcut | Skipped | Target is not followed through the shortcut |
| Download restricted by Google | Skipped | Metadata access does not guarantee content access |

Markdown/TXT recognition uses the text MIME type or `.md`, `.markdown` or `.txt` suffix.
A different filename does not convert a binary document into text. Native Docs search includes
body text, tables and footnotes; headers, footers, comments, images and suggested edits are
excluded. Search text and Google's Markdown export are separate representations, so inspect the
export when layout or tab coverage matters. Check the sync report for each skipped source.

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
drive personal sync --max 200 --json
drive personal status --json
drive personal documents list --json
```

A successful import lists documents with stable Google IDs and original links. A nonzero pending
count means the batch is unfinished: run `drive personal sync` again. This resumes saved work.
The initial scan is recursive; `files list --parent` lists immediate children only. If Google
returns a `nextPageToken`, pass it to `files list --page-token TOKEN` for the next page.

`folders list` shows selected roots. Folder IDs and parents are saved in profile sync state;
there is no navigable folder tree in the shared database yet. Documents are grouped by account.
Duplicate names are safe: use IDs, rather than titles, to select a document.

## Keep the index current

```sh
drive personal sync --json
drive personal status --json
```

Sync polls Google's change feed. Repeat it after edits or before a time-sensitive answer; there
is no background watcher. `--max` bounds source operations for that invocation, not the eventual
size of the folder. `--rescan` reconciles the selected folders from a fresh change token when you
need a full check. Unchanged text reuses its content identity and existing embeddings.
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

The database defaults to Drive's isolated state directory. `DRIVE_STATE_DIR` controls snapshots
and checkpoints; `DRIVE_STORE` selects the database. `DRIVE_CACHE_DIR` does not relocate source
snapshots. See [storage settings](configuration.md). Local text and vectors still take disk space
when you avoid exports; indexing cannot retain search content with zero local storage.

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

## Export or stop importing

```sh
drive personal documents export DOC_ID --out ./decision.md
drive personal folders remove FOLDER_ID
drive personal sync --json
```

Export refuses to overwrite an existing file. Removing a selected root reconciles managed source
snapshots and indexed source records on the next sync. Sources covered by another root remain.
Google originals and independently exported files are untouched. This is source reconciliation,
not a promise that SQLite shrinks or every separately created note is erased.

Check that the document list and search now match your selected scope. Continue with
[searching documents](search.md) or [complete task recipes](recipes.md).
