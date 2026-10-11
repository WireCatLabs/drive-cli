# Architecture

cli-core owns credentials, paths, atomic writes, output, errors and command registry data.
cli-messaging owns document storage, chunking, keyword/vector search and local models. Provider
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

No public Google OAuth identity is registered yet. Development takes a Desktop client JSON or
explicit application environment settings. Only drive.readonly is requested. The source exposes
no remote document mutations. Token values stay in the shared secure credential helper.
