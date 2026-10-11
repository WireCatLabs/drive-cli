# Find a document

Find a decision in imported documents without reopening every file. Search uses the local copy;
sync first when you need recent changes, and check the source link before acting on an answer.

```text prompt
Use drive CLI to find the budget decision in my imported project documents.
Show the matching passage and original Google link. Tell me which selected sources were skipped.
```

For manual use:

```sh
drive search 'budget decision' --exact --json
drive documents show DOC_ID --json
drive tags list DOC_ID --json
```

Replace `DOC_ID` with a result's Google ID. `--exact` uses word search. Document detail includes
tab IDs, titles and text. Tables and footnotes are included; headers, footers, comments, images
and suggested edits are not part of the indexed text. Local tags are shown in context; do not
assume message-search syntax or a `--tag` filter is supported by `drive search`.

## Search by meaning

Drive uses the shared local search model cache. If you also use Telegram or MAX, prepare the
model with that tool, then ask Drive to embed the imported text:

```sh
tg models text download e5-small
drive sync --embed
drive search 'what did we agree to spend?' --json
```

The model download uses the network; embedding runs locally. Drive does not download a missing
model automatically. Word search works without it. Empty results mean no match in the imported
coverage, not that Google Drive has no such document. Check [sync troubleshooting](troubleshooting.md).
