# drive-cli — working rules

The [WireCat CLI standards](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/README.md)
apply here and win over this file; it keeps only drive's own rules.

Read architecture and testing before changes. Google-specific sign-in, sources, native conversion and
account-bound I/O live here. Reuse cli-base for credentials, paths, output, errors and
command discovery; reuse cli-core's public store/services for indexing, search and embeddings.
Provider-neutral sync, ingestion, scoped knowledge and extraction belong in cli-core/documents.
No SQL, replacement embedding engine or gog subprocess belongs here.

Public code, fixtures and docs contain synthetic data only. Plans and journals live in cli-private.
Tests inject a memory keyring, local source fixtures and temporary database/config/model-cache
paths. Never run tests against the owner's account or store. No memory production fallback.

Default storage is the shared WireCat database; MESSAGING_STORE is its only file override.
Checkpoints bind row references to their store. Never strand legacy annotations when switching stores.
Pin shared packages exactly and keep reviewed community presets aligned with MAX.
Credentials use the keyring unless the user explicitly chooses private-file storage. Never log
SDK error objects, headers, OAuth responses or document bodies. Data belongs in requested output.
No implicit model download or credential-file fallback.

Browser login uses PKCE and state checks; its listener closes on success, failure, cancellation
and timeout. Version and unprofiled discovery never load config, keyring or database. With a named
profile, help and discovery may read permission configuration to annotate availability; neither opens
credentials or the database. Remote
document operations default to reads. Remote writes require an explicitly requested OAuth write
grant; legacy `api call` mutating methods also require --allow-writes, and permanent deletion there requires
--allow-delete. Generated `api <method>` commands use command and method permissions instead of legacy flags;
permanent deletion requires confirmation or an explicit permission. Over MCP, `ask` permits the write,
as in the shared CLI policy. Account setup and local ingestion are explicit. No live remote writes in tests.

Shared notes, tags, relationships, identity links and memories stay in cli-core's public
store APIs. AI extraction uses its public model gateway and settings schema, validates exact
source quotes and saves agent-authored proposed memories. Source changes/removals stale those
memories. Never automatically merge people by display name or claim complete Google edit history.

Google API contracts come from committed Discovery snapshots through cli-base generators. Do not
hand-edit src/generated or generated command references. Refresh specs explicitly, review the
provenance and diff, then run generation and freshness checks. Friendly commands, raw dispatch
and MCP must use the same validation and permission guards; MCP runs the CLI executor.

Use a branch and isolated checkout. Hooks, pull request CI and full validation follow the handbook's
[CI rules](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/ci.md);
here `ci:quick` is `pnpm typecheck && pnpm lint:commands`. Publishing requires owner
authorization. Visible changes get an Unreleased changelog entry. Keep cleanup separate from development work.

Security audits of this repository follow the shared
[security method](https://github.com/WireCatLabs/cli-testing/tree/main/docs/security) in cli-testing;
vulnerabilities are reported as the
[security policy](https://github.com/WireCatLabs/.github/blob/main/SECURITY.md) says.
