# Google Drive

Ask your AI agent where a decision was written down, and get the exact passage with a link to the Google document.
Your proposals, budgets and meeting notes from the Google Drive folders you choose are kept as text on your
computer, so the agent searches them even without the internet.

The agent quotes the passage and gives the document's title and Google link. It lists the files it could not read.
When you allow it, it can also change a Doc or a Sheet.

`drive` is the command-line tool that copies those folders. It keeps them in the local store, the one database file
on your computer that every WireCat tool shares, so `wcat` finds a document together with the chat about it. You need
a Google account with access to the folders. Each connected account gets a short name, its profile, such as
`personal`, and every account command names it.

**On this page:**

1. [What you can do](#what-you-can-do)
2. [Choose the way you want to work](#choose-the-way-you-want-to-work)
3. [What the local copy contains](#what-the-local-copy-contains)
4. [Ask for your first result](#ask-for-your-first-result)
5. [Supported content and connections](#supported-content-and-connections)

## What you can do

- Find a decision across imported documents and return its passage, title and original Google link.
- Find imported documents alongside saved messages and notes through `wcat`, Telegram and MAX.
- Read cached text and file metadata, navigate folder trees and find unreadable files without opening Drive.
- Keep selected folders current through repeatable sync, including documents in subfolders.
- Add local tags, notes and source-backed memories that survive renames and ordinary updates.
- Connect documents to observed Google editors and existing people, projects or other sources.
- Inspect live file metadata, permissions, comments, revisions and optional activity history.
- Create and edit native Docs, copy or move files, and manage folders when you explicitly grant write access.
- Let a terminal agent or local MCP client use the same commands, account profiles and permissions.

## Choose the way you want to work

| Your task | What `drive` does | Start here |
| --- | --- | --- |
| Explore a folder or inspect a file | Reads Google directly; browsing alone does not add documents to search | [Browse and import](usage.md#choose-the-right-operation) |
| Give an agent a project to remember | Imports supported documents into the local database and managed snapshots | [Import a folder](usage.md#import-a-folder-and-check-coverage) |
| Find evidence while offline | Searches the imported copy and reads cached content/metadata | [Search documents](search.md) |
| Keep useful context beside sources | Adds local tags, notes, links and reviewed memories | [Task recipes](recipes.md) |
| Change a Google file | Uses the live API with a write grant and command permission | [Create and edit a Doc](recipes.md#create-a-native-doc-and-include-it-in-search) |

## What the local copy contains

Importing keeps more than a folder of downloads. Searchable source text and its chunks go into
SQLite, a local database file. Optional embeddings help find related wording by meaning.
Managed JSON and Markdown snapshots retain the source material for cached reading and export.

| Saved information | What you can do without Google |
| --- | --- |
| Text from native Doc tabs, tables and footnotes; uploaded Markdown/TXT | Search passages, read a source and prepare an evidence-backed answer |
| Google ID, title, type, original link, parents, timestamps and version when available | Identify the source and inspect the metadata from the last sync |
| Owners and last editor exposed by Google | See observed contributors and their saved identity links |
| Local tags, notes, person/project links and memories | Organize and recall context across repeated work |
| Google folders and parent relationships in the local database | Navigate a cached tree, list children, tag folders and attach notes |
| Selected roots, checkpoints and pending work | Keep sync scoped and resume interrupted imports |

The catalog retains files and folders in the selected scope, including formats whose contents
cannot be read. `catalog search` finds names, descriptions, types and observed owners/editors;
`search` finds indexed content and local labels. A result's `content` says whether it has only
metadata, indexed text or an unreadable-content reason. Folder tags and notes stay local.

Sync requests every file-metadata field Google makes available and retains that response in
the database. Older cached sources keep their previously saved subset until refreshed. This
remains a copy from the last sync: separate permission lists, comments, revision history and
activity events are live reads and are not automatically cached.
See [offline folder browsing](usage.md#browse-and-organize-the-local-catalog).

## Ask for your first result

After [installing and connecting](installation.md), give your agent a small project folder:

```text prompt
Use drive CLI with profile personal. Import the Google folder I choose and its subfolders.
Find the budget decision, show its exact passage and original Google link, and list skipped files.
Keep the local index; do not create extra exports or change Google files.
```

The result should identify its sources and report unfinished or skipped work. Search then works
from the local copy; run sync when you want newer edits. For manual use:

```sh
drive personal folders add FOLDER_ID
drive personal sync --json
drive personal --offline search 'budget' --exact --json
```

Replace `FOLDER_ID` and the profile name. `drive personal folders browse` lists your folders one level at a time, if you
would rather pick one there than copy its URL. Continue sync while pending work remains.

## Supported content and connections

Local indexing supports native Google Docs and Sheets, and uploaded Markdown/plain text, PDF with a
text layer, Word `.docx`, Excel `.xlsx`, CSV and TSV. Sheets are imported for reading and search; live [Sheets commands](recipes.md#read-and-change-spreadsheet-cells)
read ranges, update values/formulas, append rows and clear selected cells.
They also [organize tabs and format bounded ranges](recipes.md#organize-tabs-and-format-selected-cells). Scanned PDFs and
JPEG, PNG and WebP pictures are read by [OCR](usage.md#scans-and-pictures), on your computer by default. Slides, audio
and shortcuts have no indexed text. Images are also searchable by what they show when you enable
[picture search](search.md#search-images-by-what-they-show). Native Docs indexing includes body text,
tables and footnotes across tabs; images, headers, footers, comments and suggested edits are not
indexed. Live API access to a file's metadata is distinct from importing its content.

Sign-in opens Google's consent screen. Users authorize their own accounts; the application owner
configures the shared Google app. A custom Desktop OAuth client remains an alternative.
Read access is the default; remote changes need an additional write grant. Folder selection
limits ingestion, while Google's read permission covers the account's Drive.

Start with [installation and Google connection](installation.md), then follow
[import and offline reading](usage.md) or a [complete task recipe](recipes.md).
