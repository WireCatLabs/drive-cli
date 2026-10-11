# drive-cli — working rules

Read architecture and testing before changes. Google-specific sign-in, read-only sources and
ingestion coordination live here. Reuse cli-core for credentials, paths, output, errors and
command discovery; reuse cli-messaging's public store/services for indexing, search and embeddings.
No SQL, replacement embedding engine or gog subprocess belongs here.

Public code, fixtures and docs contain synthetic data only. Plans and journals live in cli-private.
Tests inject a memory keyring, local source fixtures and temporary database/config/model-cache
paths. Never run tests against the owner's account or store. No memory production fallback.

Default storage is isolated until shared dependency pins align. Pin shared packages exactly.
Credentials use the keyring unless the user explicitly chooses private-file storage. Never log
SDK error objects, headers, OAuth responses or document bodies. Data belongs in requested output.
No implicit model download or credential-file fallback.

Browser login uses PKCE and state checks; its listener closes on success, failure, cancellation
and timeout. Help, version and command discovery never load config, keyring or database. Remote
document operations are reads. Account setup and local ingestion are explicit.

Use a branch and isolated checkout. Commit hooks check staged Biome and secrets. Fast CI checks
presets, lint, Markdown and bounded typechecking. Full validation adds tests, coverage, build,
installed-package acceptance and Bun smoke. Publishing requires owner authorization. Visible
changes get an Unreleased changelog entry. Keep cleanup separate from development work.
