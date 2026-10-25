# Document knowledge and Google API commands

Google ingestion and local knowledge use the same released WireCat document schema. Source
documents have `document:...` references; notes use `note:...`; memories use `memory:...`.
People use the shared `person:...` identity. Commands below accept a Google document ID or URL
as their source argument and resolve its shared reference in the selected profile.

## Tags, relationships and notes

```sh
drive personal tags add DOC_ID budget review
drive personal tags list DOC_ID
drive personal documents list tag:review
drive personal tags remove DOC_ID review
drive personal notes add DOC_ID 'Check the assumptions' --title Review
drive personal notes list DOC_ID text:assumptions
drive personal notes show DOC_ID note:NOTE_ID
drive personal notes edit DOC_ID note:NOTE_ID 'Assumptions reviewed' --revision 1
drive personal relationships add DOC_ID project:PROJECT_ID --kind about
drive personal relationships list DOC_ID
drive personal relationships remove DOC_ID LINK_ID
drive personal documents context DOC_ID
```

Use the actual references returned by your store. Note edits require their latest revision to
protect against stale edits. Local tags, notes and owner relationships survive document renames and
resync. Removing a source from ingestion retains owner-created notes; its source-backed memories
become stale. These commands do not write Google comments or Google Drive labels.

Each command verifies the source belongs to the selected Google account. Note, memory and fact
operations also check that the item is attached to that document. Explicit links can connect
the document to other known shared entities. The database is shared with Memo and messenger tools by default. A custom `MESSAGING_STORE`
path must be the same in every tool that should share references.

## Editors and history

```sh
drive personal identities list DOC_ID
drive personal identities link DOC_ID GOOGLE_ID person:PERSON_UID
drive personal documents list person:PERSON_UID
drive personal documents history DOC_ID --limit 100
drive personal session start --client-file /path/to/client.json --grant activity
drive personal documents history DOC_ID --activity
```

Sync saves the owners and last modifying user that Google exposes. Their permission IDs identify
Google identities; an available email is the fallback. Matching names does not merge people.
Use `identities link` to explicitly connect an observed Google identity to a person already known
through another provider. The `GOOGLE_ID` comes from `identities list`.
Identity decisions are shared across the store. Linking refreshes Google-derived document
relationships across imported Google folders; it preserves owner-added links and names.

The standard history command returns a page of revision metadata, including Google's modifying
user when available. Revision access can require an editor/owner role even with a read-only
OAuth grant. Google's revision list can omit older revisions. Activity events use a separate
scope and API; enable **Drive Activity API** in the application project. These events do not give
a complete character-level diff or necessarily reveal every actor's name. See Google's
[revision guide](https://developers.google.com/workspace/drive/api/guides/manage-revisions) and
[Activity query reference](https://developers.google.com/workspace/drive/activity/v2/reference/rest/v2/activity/query).
Pass the answer's `page.next_cursor` as `--cursor` to read another page.

## Memories, facts and AI extraction

```sh
drive personal facts add DOC_ID 'Budget approved for Q4' --type decision --scope work
drive personal facts list DOC_ID status:proposed
drive personal facts confirm DOC_ID fact:FACT_ID
drive personal memories add DOC_ID 'Q4 budget, in short' --scope work --kind summary
drive personal memories list DOC_ID scope:work
drive personal memories show DOC_ID memory:MEMORY_ID
drive personal memories confirm DOC_ID memory:MEMORY_ID
drive personal memories add DOC_ID 'Corrected budget summary' --scope work --supersedes memory:MEMORY_ID
drive personal memories search DOC_ID budget scope:work
drive personal memories stale DOC_ID memory:MEMORY_ID
drive personal models set --provider openai --model YOUR_MODEL
drive personal memories extract DOC_ID --scope work
drive personal memories extract DOC_ID --scope work --tab TAB_ID --yes
```

`facts list` and `memories list` narrow by the terms after the document — `kind:`, `status:` and, for
memories, `scope:` — and the store applies them. Facts and memories answer with the shared `fact` and `memory`
fields: `kind`, `text`, `status`, `scope`.

Scopes are explicitly `personal` or `work`; memory kinds are summary, digest or preference. What happened —
a fact, statement, question, decision or promise — is a fact: `facts add` records yours as accepted, and
`memories extract --yes` saves the facts it finds as proposed, next to the memories. Old memories of kind
fact became facts when the shared store upgraded (cli-core 0.247.0).
`--supersedes` replaces an earlier memory about this document; the earlier one becomes superseded.
For decisions, `facts add --supersedes fact:FACT_ID` replaces an earlier decision from the same
source on acceptance. An agent proposal does not supersede it until confirmed. `facts reverse DOC_ID fact:FACT_ID` marks an accepted decision as no longer holding without a replacement;
other fact kinds cannot be reversed. `--occurred-time` records the evidence's ISO 8601 event time.
The shared store owns persistence, state transitions, evidence references and search. Memory search
runs within this document and reports when the document's own result limit is reached.

Extraction uses cli-core's public modelGateway, AI settings schema and provider adapters.
Configure a provider/model once or use the standard `DRIVE_MODELS_MEMORIES_PROVIDER`,
`DRIVE_MODELS_MEMORIES_MODEL` and optional `DRIVE_MODELS_MEMORIES_BASE_URL` environment settings.
Shared defaults (`defaults.models.default`) apply when purpose-specific settings are absent.
Anthropic and OpenAI-compatible endpoints are supported by the shared gateway. Keys come from
`DRIVE_OPENAI_API_KEY`/`OPENAI_API_KEY` or `DRIVE_ANTHROPIC_API_KEY`/`ANTHROPIC_API_KEY`; never put
keys in ordinary model configuration. This adapter does not import another CLI's private key files.

Invoking extraction explicitly sends the chosen cached text to that configured endpoint.
Preview is the default. `--yes` stores agent-authored **proposed** memories with model identity,
supporting quotes and the snapshot hash. Every quote must occur verbatim in the source. Invalid
JSON, unsupported quotes, input above 50,000 characters or a changed source hash prevents saving.
Pick a smaller tab for large documents. A quote supports review; it does not establish that the
model interpreted the document correctly. Only an explicit confirm command approves a memory.
The next content-changing sync or source removal stales active memories derived from that source.

## Remote management and the SDK surface

The pinned official clients expose 68 callable methods: 31 read methods and 37 mutating methods.
The catalog comes from pinned Google Discovery snapshots through the shared code generator and
needs no credentials or network request. Both generated and friendly commands use its validators.
It includes Drive v3, Docs v1 and Drive Activity v2. Upload/download streaming, a full Drive Labels
API client, automatic revision downloads, background watches and other Workspace products are
not implemented as product workflows. JSON methods support normal query/path parameters and
structured request bodies; binary media upload and arbitrary transport settings are excluded.

```sh
drive api list
drive api list service:docs
drive personal files list --parent FOLDER_ID
drive personal files get FILE_ID
drive personal comments list FILE_ID
drive personal permissions list FILE_ID
drive personal revisions get FILE_ID REVISION_ID
drive shared-drives
drive personal session start --client-file /path/to/client.json --grant write
drive personal files mkdir 'Research' --parent FOLDER_ID
drive personal files upload ./backup.db.zst --parent FOLDER_ID
drive personal files copy FILE_ID --name 'Review copy' --parent FOLDER_ID
drive personal files move FILE_ID --parent NEW_FOLDER_ID --old-parent OLD_FOLDER_ID
drive personal files update FILE_ID --body '{"name":"Renamed"}'
drive personal files trash FILE_ID
drive personal files restore FILE_ID
drive personal documents create --title 'Planning'
drive personal documents get DOC_ID
drive personal documents update DOC_ID --body '{"requests":[{"insertText":{"endOfSegmentLocation":{},"text":"New paragraph\n"}}]}'
drive personal api call drive.about.get --params '{"fields":"user,storageQuota"}'
drive personal api call docs.documents.batchUpdate --allow-writes --params '{"documentId":"DOC_ID"}' --body '{"requests":[]}'
```

Creation, movement and editing require the explicit `--grant write` (`drive`). Listing and
ingestion use `drive.readonly` by default. Activity needs `--grant activity`; installed-app methods
need `session start --grant apps` (`drive.apps.readonly`). Generating file IDs needs the write grant
even though it is a read-style method. See Google's [apps scope](https://developers.google.com/workspace/drive/api/reference/rest/v3/apps/list)
and [file-ID scope](https://developers.google.com/workspace/drive/api/reference/rest/v3/files/generateIds).

Generic mutating calls require `--allow-writes`; permanent deletion and emptyTrash additionally
require `--allow-delete`. Convenient named commands already describe their action. Google file
roles, domain policy and API availability remain authoritative. The SDK forwards structured Docs
batch requests for text, formatting, tables and tabs. Use `writeControl.requiredRevisionId` from
a live Docs read when an update must reject concurrent changes. Run sync after remote mutations
to update local snapshots and search. All pagination commands return Google's continuation token as `page.next_cursor`;
one page does not claim complete coverage.

## Public application rollout

Declare only the optional scopes offered by the product in Google Auth platform > Data Access.
Optional writes broaden the app's capabilities; show and justify them in the verification demo.
The privacy policy must describe local notes/memory retention and optional text transmission to
the configured model provider. Google restricted-scope review must consider that AI data flow;
server/third-party processing can require an additional security assessment. See the
[shared application setup guide](GOOGLE_OAUTH.md) before launching these features publicly.

Current automated evidence uses temporary stores, synthetic Google responses, fake OAuth
callbacks and mocked model transport. Live Google permissions, native conversion, mutation
behavior and real model quality remain unverified until the owner registers the application.
