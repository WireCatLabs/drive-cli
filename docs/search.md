# Find a document

Find a decision in imported documents without reopening every file. Search uses the local copy;
sync first when you need recent changes, and check the source link before acting on an answer.

```text prompt
Use drive CLI with profile personal to find the budget decision in my imported project documents.
Show the matching passage and original Google link. Tell me which selected sources were skipped.
```

For manual use:

```sh
drive personal search 'budget decision' --exact --json
drive personal search 'budget AND tag:follow-up' --exact --json
drive personal documents show DOC_ID --json
drive personal tags list DOC_ID --json
```

Replace `DOC_ID` with a result's Google ID. `--exact` uses word search. Document detail includes
tab IDs, titles and text. Tables and footnotes are included; headers, footers, comments, images
and suggested edits are not part of the indexed text. Use `tag:follow-up` to search local labels,
alone or with words. `drive personal search` has no `--tag` flag; message-only fields are not supported.

## Search by meaning

Drive uses the shared local search model cache. If you also use Telegram or MAX, prepare the
model with that tool, then ask Drive to embed the imported text:

```sh
tg personal models text download e5-small
drive personal sync --embed
drive personal search 'what did we agree to spend?' --json
```

The model download uses the network; embedding runs locally. Drive does not download a missing
model automatically. Word search works without it. Empty results mean no match in the imported
coverage, not that Google Drive has no such document. Check [sync troubleshooting](troubleshooting.md).

## Check what was searched

`--limit` bounds returned hits and `--offset` skips that many results; neither expands imported
coverage. Search does not fetch files from Google. For a recent answer, run `drive personal sync`
and inspect `drive personal status --json` first. For a cached answer without network, use:

```sh
drive personal --offline search 'budget' --exact --limit 10 --offset 0 --json
drive personal --offline documents show DOC_ID --json
```

Read the passage and its source before interpreting it as a decision. If you see `meaningSkipped`,
inspect its explanation rather than assuming semantic search ran. For a folder containing PDF,
Sheets or other unsupported content, exact and semantic search both omit those files.
See [file-type coverage](usage.md#which-document-types-are-searchable) and
[task recipes](recipes.md#refresh-a-project-and-prepare-a-meeting-brief).
