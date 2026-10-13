# Architecture

cli-base owns credentials, paths, atomic writes, output, errors and command registry data.
cli-core owns document storage, chunking, keyword/vector search and local models. Provider
types stay in the Google modules; a source port feeds domain metadata into ingestion. No SQL
or separate embedding engine exists here.

| Module | Responsibility |
| --- | --- |
| google.ts, documents.ts | SDK reads and all-tab content extraction |
| login.ts, tokens.ts | browser OAuth, scopes and shared credential storage |
| config.ts, state.ts | selected folders, validated checkpoints and snapshots |
| sync.ts | folder graph, durable jobs, retries and source removal |
| store.ts | shared public store/services adapter and account-scoped search |
| program.ts | commands, dependency injection and shared registry |
| google-api.ts, remote-commands.ts | generated operation contracts, SDK requests and remote actions |
| api-contract.ts, generated/, schema.ts | shared generated validators, metadata and agent-visible schemas |
| policy.ts, mcp.ts | shared permission/write guards and the registry-derived agent adapter |
| knowledge.ts, knowledge-commands.ts | shared tags, notes, relationships, identity links and source-backed memories |
| extraction.ts | shared model gateway, structured proposals and exact source quote validation |
| profile-lock.ts | shared heartbeat lock for sync and document knowledge operations |
| bin/drive.ts | process, browser, cancellation and sanitized errors |

Initial scanning captures a token first; subsequent polling replays changes made during the scan.
Discovery completes before pending work is persisted. Snapshot/index operations are idempotent.
Failures leave pending work, and the cursor advances after the batch finishes. Scope changes
require a complete rescan. Folder scope exits invalidate descendants without requiring individual
document events. The heartbeat lock permits only one sync per profile.

An account has one profile and a notes folder keyed by its Google principal. File ID determines
identity independently of title or ancestry. Hashes reuse embeddings for unchanged text. A
profile without an indexed folder returns an explicit empty search: the shared service interprets
an empty folder filter as unfiltered search.

The default database belongs to this CLI. Explicit sharing requires aligned dependency versions;
an implicit open could migrate the messenger database. Keyring entries are isolated when config
paths are overridden. All tests isolate model cache, config and store.

Native Markdown and searchable all-tab text are separate artifacts. Tab IDs/titles are preserved;
body, table and footnote text is indexed. Headers, footers, images, comments and suggested edits
are excluded. Native conversion fidelity remains a live-validation item, not a claimed guarantee.

WireCat's public Desktop OAuth identity is included in the CLI. An explicit Desktop client JSON
takes priority over application environment settings, which take priority over the bundled identity.
Only installed-app client metadata is bundled; private account tokens remain in credential storage.
Read-only is the default; explicit write, activity and
apps options request the corresponding grants. Ingestion's source port remains read-only; remote
management uses a separate SDK adapter. Tokens stay in the shared secure credential helper.

Source metadata supplies owners and the last editor. Stable Google permission IDs, with an email
fallback, create identities in the shared store; name similarity never merges identities. Observed
roles carry Google provenance as file links; explicit owner links survive resync. A manual identity
link uses the shared decision API to connect an observed Google editor to another known person.

Notes are internal shared notes whose primary subject is the source document. Memories carry a
subject, evidence reference and explicit personal/work scope. Content-hash changes or removal mark
active memories stale before ingestion commits its checkpoint. Invalidation drains proposed and
confirmed batches through the public API; no new SQL or independent knowledge store exists here.

AI extraction is an explicit command, with preview as the default and optional saving of proposed
memories. Shared AI settings/schema and modelGateway own provider transport. A bounded structured
response requires exact source quotes; validation finishes before any memory writes. The current
snapshot hash is rechecked after the model call. Quotes support review, not automatic factual approval.
Saving then takes the same profile lock as sync and checks the hash again before writing, so a
source cannot change between final verification and memory creation through this CLI.

Google Discovery snapshots feed cli-base's format-neutral ApiModel and shared generators.
cli-core generatedApiCommand registers the API tree. The same validators guard friendly
and legacy raw calls. Local policy precedes credentials, provider requests and local writes;
OAuth remains an independent gate. MCP reconstructs an invocation of this CLI rather than
implementing another provider executor. Generation/docs/schema snapshots and real prior-store
upgrade contracts keep the shared seams reviewable. See [CLI alignment](CLI_ALIGNMENT.md).
