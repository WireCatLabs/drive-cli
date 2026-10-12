# drive-cli — working rules

Read architecture and testing before changes. Google-specific sign-in, read-only sources and
ingestion coordination live here. Reuse cli-base for credentials, paths, output, errors and
command discovery; reuse cli-messaging's public store/services for indexing, search and embeddings.
No SQL, replacement embedding engine or gog subprocess belongs here.

Public code, fixtures and docs contain synthetic data only. Plans and journals live in cli-private.
Tests inject a memory keyring, local source fixtures and temporary database/config/model-cache
paths. Never run tests against the owner's account or store. No memory production fallback.

Default storage is isolated; sharing an existing messenger store requires explicit configuration.
Pin shared packages exactly and keep reviewed community presets aligned with MAX.
Credentials use the keyring unless the user explicitly chooses private-file storage. Never log
SDK error objects, headers, OAuth responses or document bodies. Data belongs in requested output.
No implicit model download or credential-file fallback.

Browser login uses PKCE and state checks; its listener closes on success, failure, cancellation
and timeout. Help, version and command discovery never load config, keyring or database. Remote
document operations default to reads. Remote writes require an explicitly requested OAuth write
grant; generic mutating methods also require --allow-write, and permanent deletion requires
--allow-delete. Account setup and local ingestion are explicit. No live remote writes in tests.

Shared notes, tags, relationships, identity links and memories stay in cli-messaging's public
store APIs. AI extraction uses its public model gateway and settings schema, validates exact
source quotes and saves agent-authored proposed memories. Source changes/removals stale those
memories. Never automatically merge people by display name or claim complete Google edit history.

Google API contracts come from committed Discovery snapshots through cli-base generators. Do not
hand-edit src/generated or generated command references. Refresh specs explicitly, review the
provenance and diff, then run generation and freshness checks. Friendly commands, raw dispatch
and MCP must use the same validation and permission guards; MCP runs the CLI executor.

Use a branch and isolated checkout. Commit hooks check staged Biome and secrets. Fast CI checks
presets, lint, Markdown and bounded typechecking. Full validation adds tests, coverage, build,
installed-package acceptance and Bun smoke. Publishing requires owner authorization. Visible
changes get an Unreleased changelog entry. Keep cleanup separate from development work.
