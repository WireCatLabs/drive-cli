# Find a document

Find a decision, a passage or a follow-up in your imported documents without opening every Google file. You or
your agent search by a word you remember or by the meaning of a question, and narrow the results with your own tags.

Each result is a passage with the document's title and a link to the original in Google. Search reads the copy on
your computer, so it works offline; sync first when you need the newest edits. Search by word works at once. Search
by meaning needs a small model downloaded once, and it finds a passage even when it uses other words than your
question.

**On this page:**

1. [Choose a search](#choose-a-search)
2. [Which result comes first](#which-result-comes-first)
3. [Search by meaning](#search-by-meaning)
4. [Check what was searched](#check-what-was-searched)
5. [Gather context across sources](#gather-context-across-sources)
6. [Search images by what they show](#search-images-by-what-they-show)

```text prompt
Use drive CLI with profile personal to find the budget decision in my imported project documents.
Show the matching passage and original Google link. Tell me which selected sources were skipped.
```

## Choose a search

| What you remember | How to search |
| --- | --- |
| A distinctive word | `drive personal search 'budget' --exact --json` |
| Either of two topics | `drive personal search 'budget OR launch' --exact --json` |
| A labelled follow-up | `drive personal search 'budget AND tag:follow-up' --exact --json` |
| The question, rather than its wording | Prepare [search by meaning](#search-by-meaning), then ask the question in plain words |
| The person associated with a source | Use `documents list person:PERSON_UID`, then inspect the sources |

Metadata is available in document detail and listings; it is not a universal field-search API.
Use local tags and the supported person/list filters rather than inventing Google fields in a
text query. Search does not index live comments, permissions or revision history.

Notes are searched apart from documents: `drive personal notes list DOC_ID text:review` matches part of a word, in any
letter case, in the note's title and text. A term shorter than three characters is refused.

For manual use:

```sh
drive personal search 'budget decision' --exact --json
drive personal search 'budget AND tag:follow-up' --exact --json
drive personal documents show DOC_ID --json
drive personal tags list DOC_ID --json
```

Replace `DOC_ID` with a result's Google ID, or pass the result's `ref` (`document:42`) as it is.
`--exact` uses word search. Document detail includes tab IDs, titles and text. Tables and footnotes
are included; headers, footers, comments, images and suggested edits are not part of the indexed text.
Use `tag:follow-up` to search local labels, alone or with words.
`drive personal search` has no `--tag` flag; message-only fields are not supported.

## Which result comes first

A file whose title matches your words comes first. The order is: the title equals the query, then the title
contains the query as a phrase, then the title holds all the words in any order. Such a hit lists `title` in
`found_by`, even when the file's text is long and mentions the words only once or not at all.

This applies to plain-word queries such as `budget decision`. A query that uses a field (`tag:follow-up`), `OR`,
`NOT`, a wildcard or a regular expression keeps the order of its text matches.

## Search by meaning

Download the search model once, then build the meaning index of the imported text. The download needs no profile or
sign-in, and every WireCat tool on this computer shares the model:

```sh
drive models download e5-small
drive personal sync --embed
drive personal search 'what did we agree to spend?' --json
```

Fields in the query hold for every hit, found by words or by meaning: `budget tag:follow-up` finds by meaning only
documents tagged `follow-up`, and `-tag:draft` leaves out tagged ones. Only the words are searched by meaning, so a
query of fields alone (`date>=30d`, `tag:follow-up`) lists just the matching documents, newest first. `date:` reads
the document's last edit on Google Drive, the same time a hit shows as `updated_at`.

The model download uses the network; building the index runs on your computer. `drive` never downloads a missing
model by itself. The index covers pending notes and documents across the shared database, including other profiles,
but `drive` search still reads only the selected Google account. Word search works without it. Empty results mean no match in the imported
coverage, not that Google Drive has no such document; before the first import, `not_imported` says so. Check [sync troubleshooting](troubleshooting.md).

## Check what was searched

`--limit` bounds returned hits and `--page` picks which page of them; neither expands imported
coverage. Search does not fetch files from Google. For a recent answer, run `drive personal sync`
and inspect `drive personal status --json` first. For a cached answer without network, use:

```sh
drive personal --offline search 'budget' --exact --limit 10 --page 1 --json
drive personal --offline documents show DOC_ID --json
```

Read the saved passage and source metadata before interpreting it as a decision. You can inspect
them offline; open the original link when you need to verify the current Google version. If you see `meaning_skipped`,
inspect its explanation rather than assuming search by meaning ran. Scanned PDFs and pictures are read by OCR, as
`read_scans` says, so their text is searched like any other. Slides, a scan over 20 pages, a scan with `read_scans` set
to `off` and other unsupported content have no text, so they are left out of word search and search by meaning. Their
names are indexed: a word from the file name finds them, and the hit has `not_read` set to the reason (it is `null`
for a file `drive` read). Open the `url` of such a hit; there is no passage to quote.
See [file-type coverage](usage.md#which-document-types-are-searchable) and
[task recipes](recipes.md#refresh-a-project-and-prepare-a-meeting-brief).

## Gather context across sources

To find project evidence in the imported documents alongside other selected sources, use `wcat`
against the same shared store. The [Drive and `wcat` recipe](recipes.md#gather-project-context-with-wcat)
shows folder selection, bounded sync and an explicit `drive:personal` source. Reading a Google file
through a connected app alone does not make it available to that local search. Gathered matches
retain their source dates and links; project relationships remain a separate review step.

## Search images by what they show

When the profile has `picture_search` on, `drive personal search "cat on a sofa"` also returns `pictures`: the
images whose content is nearest to the words, best first, each with `ref`, `score`, `title` and `url`.
They are a separate list, never mixed into `hits`. With the setting off, `pictures` is absent.

Write picture queries in English. The picture model reads English only, so an agent that gets a question in
another language translates it first. If the picture model is not downloaded, the output has `pictures_skipped`
and `hits` are unaffected. Follow [shared model setup](configuration.md#change-and-check-a-value)
before enabling picture search.
