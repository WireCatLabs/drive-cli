# Mirror local files with Google

Use a mirror when you keep Markdown or tabular files locally and want colleagues to work on them
in Google Docs or Sheets. A sync sends local changes and brings supported Google edits back.
It reports conflicts before choosing between competing edits.

## Connect a folder

Sign in to the profile with the Google write grant, then choose a local folder and its destination:

```sh
drive personal session start --grant write
drive personal mirrors add ./notes --parent FOLDER_ID
drive personal mirrors list
drive personal mirrors status
drive personal mirrors sync
```

Replace `personal` with your connected profile. `FOLDER_ID` is a Google Drive folder ID or URL.
Adding the mirror checks the destination and saves the connection locally. The first sync creates
Google Docs for `.md` and `.markdown` files and Google Sheets for `.csv`, `.tsv` and `.xlsx` files.
Local subfolders become Google folders. Other file types are counted as unsupported.

`mirrors status` examines local files and the saved checkpoint without asking Google. It cannot tell
you whether a colleague has changed a document online. `mirrors list` shows the mirror IDs and folders.
Pass a mirror ID to `status` or `sync` to choose just that mirror; omit it for every mirror in the profile.

## Sync in both directions

Run `mirrors sync` again after editing. For Markdown, Drive compares document blocks against the
last sync: changes to different parts can be combined, and unchanged text keeps its Google comments.
For CSV or TSV, Google cell changes can return to the local file. Local XLSX changes can be sent to
Sheets, but Sheets changes cannot be written back to XLSX.

A Sheet mirror owns the range it first wrote. It updates that range and keeps neighboring cells
and unrelated tabs. The first row becomes a bold frozen header. Inspect the result when formulas,
formatting or workbook layout matter; mirroring is not a complete Google document backup.

## Local images

Google Docs copies an image only from a public web address, so a local image such as
`![chart](pics/chart.png)` stays as that text in the Doc unless you give sync your tunnel's address:

```sh
drive personal mirrors sync --public-url https://<name>.ts.net
```

Drive then serves each new local image itself, through the tunnel, at a random address that works
only while Google copies the image, and closes it right after. Nothing in your Google Drive is
shared, and Google keeps its own copy inside the Doc. The tunnel is the one you use for
[remote MCP](remote.md); it must forward to `--port` on this computer (default 8765). If
`drive mcp --http` holds that port, stop it during the sync or pass another `--port` and point the
tunnel there; sync refuses to start while the port is busy.

Only PNG, JPEG and GIF files under 50 MB inside the mirrored folder are inserted. Any other image
stays as text, with a warning. If Google cannot fetch an image, the rest of the Doc is still written,
the image stays as text with a warning, and the next sync with `--public-url` tries again. An image
already in the Doc stays there on later syncs without `--public-url`. `mirrors watch` takes the same
two options.

## Choose a side after a conflict

When both sides change the same part, sync reports the conflict and finishes with a partial result.
Review the local file and Google document before choosing:

```sh
drive personal mirrors sync MIRROR_ID --keep local
drive personal mirrors sync MIRROR_ID --keep google
drive personal mirrors sync MIRROR_ID --keep both
```

`--keep local` chooses the local conflicting content. `--keep google` chooses the Google content
where it can be written back (Markdown, CSV or TSV). For Markdown, `--keep both` retains both conflicting
versions in the document; review the combined text afterward. Sheets cannot keep both versions of the
same cells: choose local or Google. An XLSX mirror whose Sheet changed requires `--keep local`.

A Doc with pending suggestions is refused even with `--keep`: accept or reject suggestions in Google,
then retry. Changes made outside the supported Markdown blocks may need manual review.

## Deletions and stopping

Deleting a local file does not trash its Google copy. Deleting a Google file does not delete its local
source, and sync does not silently recreate it. After reviewing what was deleted, use:

```sh
drive personal mirrors sync MIRROR_ID --replace
```

`--replace` chooses the local side and recreates missing Google files. It cannot be combined with
`--keep google` or `--keep both`. Renames and moves can leave the old Google copy; inspect reported
orphans instead of expecting deletions to cross between systems.

To stop mirroring without deleting local or Google files:

```sh
drive personal mirrors remove MIRROR_ID
```

Mirroring does not import the destination into search. To search those Google files offline, separately
choose the destination with `folders add` and run `sync`, as described in [import and organize](usage.md).
For read-only agent access, see [permissions](security.md#google-access-and-command-permissions).
