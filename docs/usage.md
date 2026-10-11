# Import and organize

Choose a project folder, import its supported documents and keep local context beside the sources.
Each search result links to Google so you can check the original.

## Import a folder

Copy the folder URL from Google Drive and replace `FOLDER_ID`:

```sh
drive folders add https://drive.google.com/drive/folders/FOLDER_ID
drive sync --json
drive status --json
drive documents list --json
```

Sync includes subfolders. Check the report for skipped files and errors: a folder containing PDF
or spreadsheets is not completely searchable. Run `drive sync` again after source changes. Pending
work resumes after an interruption; there is no automatic background watcher.

`drive folders list` shows selected roots, not an interactive folder tree. Remote folder contents
can be inspected with `drive files list --parent FOLDER_ID`. Names can repeat; use returned IDs.

## Add local context

Replace `DOC_ID` with an imported document's Google ID:

```sh
drive tags add DOC_ID budget follow-up
drive notes add DOC_ID 'Ask Rin to confirm the revised totals'
drive documents context DOC_ID --json
```

Tags and notes do not edit the Google document. They stay attached through ordinary renames and
resyncs. `documents context` brings together tags, notes, links, memories and observed editors.

For a reusable fact, create a proposed memory and review it before confirmation:

```sh
drive memories add DOC_ID 'The launch budget is approved' --scope work
drive memories list DOC_ID --json
drive memories confirm DOC_ID memory:MEMORY_ID
```

Replace `MEMORY_ID` with the returned reference. Source changes or removal mark its active memories
stale. A saved memory is not evidence that the source is correct; keep its supporting document.

## Export or stop importing

```sh
drive documents export DOC_ID --out ./decision.md
drive folders remove FOLDER_ID
drive sync --json
```

Export writes cached Markdown and refuses to overwrite an existing file. Removing a selected root
reconciles the local cache on the next sync; files still included through another root remain in
scope. Google originals are not deleted. Continue with [search](search.md) or [recipes](recipes.md).
