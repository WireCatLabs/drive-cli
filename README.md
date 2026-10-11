# drive-cli

`drive` imports selected Google Drive folders into local Markdown snapshots and searchable
documents. It reads Google Docs across all tabs, keeps source identity through renames and moves,
and reuses WireCat's shared keyword search and optional local embeddings.

Status: initial local implementation, not published. It uses Google's official Node clients.
Sources supported now: native Google Docs and uploaded Markdown/TXT. Other types and shortcuts
are reported as skipped; shortcuts are not followed outside the selected scope.

## Run it locally

Use Node 22.16 or newer, or Node 24, and pnpm 11.20.0:

```sh
pnpm install
pnpm build
bin/drive --help
```

## Sign in and choose folders

For development, enable the Drive and Docs APIs in your Google Cloud project and create a
**Desktop** OAuth client. Download its client JSON, then:

```sh
bin/drive session start --client-file /path/to/desktop-client.json
bin/drive folders add https://drive.google.com/drive/folders/FOLDER_ID
bin/drive sync --json
```

Sign-in opens the system browser and receives Google's callback on a temporary loopback port.
`--no-browser` prints the URL. `drive.readonly` grants account-wide reading; our selected-folder
scope limits ingestion. The CLI never updates, uploads, trashes or deletes remote Drive files.

Credentials use the OS keyring. Without one, explicitly choose `--credential-storage file`;
the shared helper writes an owner-only private file. Tokens never enter regular config, output
or diagnostics. `DRIVE_GOOGLE_CLIENT_ID` and `DRIVE_GOOGLE_CLIENT_SECRET` can provide application
settings instead of a client file. A public application can supply its registered Desktop client
settings, but no public OAuth application is registered or bundled yet. Public distribution with
this restricted scope needs Google verification; external Testing grants usually expire in
seven days. [Google OAuth guide](https://developers.google.com/identity/protocols/oauth2/native-app),
[Drive permissions](https://developers.google.com/workspace/drive/api/guides/api-specific-auth).

Use `--profile work` for another account. Each Google account has one local profile. `session list`
lists configured profiles. `session end` removes local sign-in while retaining cached data and
configuration so re-login preserves document identities.

## Search and export

```sh
bin/drive search 'budget decision' --json
bin/drive search 'budget' --exact --json
bin/drive documents list --json
bin/drive documents show DOC_ID --json
bin/drive documents export DOC_ID --out ./document.md
bin/drive status --json
bin/drive commands sync --json
```

Search results include the original Google URL. `documents show` includes each tab's text, ID
and title. Native Markdown exports are saved separately from the all-tab text used for indexing.
Export refuses to overwrite an existing destination file.

Semantic search uses an already-downloaded shared text model. Prepare the existing model cache
with `tg models text download e5-small` or its `max` equivalent, then use `drive sync --embed`.
There is no replacement model downloader or implicit download here. Missing models are reported.
`--exact` searches words without semantic retrieval.

## Keep it current

```sh
bin/drive sync --max 200 --json
bin/drive folders remove FOLDER_ID
bin/drive sync --json
```

A batch is persisted before processing; interrupted work resumes next run. The change cursor
advances when the batch completes. Incomplete discovery preserves the prior checkpoint and
documents. A per-profile heartbeat lock prevents simultaneous syncs and recovers after crashes.

Confirmed removals and scope exits remove sources from search and delete their snapshots.
Removing the last selected folder reconciles to an empty cache on the next sync. Unsupported,
restricted and oversized sources have explicit coverage status. Transient failures remain pending;
a partial sync with errors exits nonzero. Doc IDs, rather than names, distinguish duplicates.

## Storage and coverage

The shared path helper chooses platform-appropriate config, data and cache directories under
drive-cli. Override with `DRIVE_CONFIG_DIR`, `DRIVE_STATE_DIR` and `DRIVE_CACHE_DIR`. Snapshots are
`profiles/<profile>/documents/<file-id>.md` plus private JSON metadata and raw Docs responses.

The database defaults to `drive.db` in this CLI's state directory. It uses the released shared
WireCat store and search engine. It defaults to a separate file because sibling dependency pins
currently differ; starting this CLI must not migrate a messenger database. `DRIVE_STORE` selects
another compatible database explicitly. Align versions before sharing an existing store.

Search covers body text, nested tables and footnotes from all tabs. Images, headers, footers,
comments and suggested edits are excluded. Image assets are not downloaded. Native Markdown
formatting/tab fidelity still needs authenticated user fixtures; synthetic tests do not prove it.

Folder scans cap at 10,000 entries. Text caps at 200,000 characters and snapshots at 50 MiB, with
bounded pagination. Oversized input is refused rather than truncated. Google's native export
also has its own 10 MB limit. Documents changing during export remain pending for retry.

## Development

The tracked zoom-cli template was copied and pruned. Shared WireCat standards, packaging,
release-job separation and installed-package checks remain. Google logic stays here; SQL,
chunking, embeddings and search implementations remain in shared packages.

```sh
pnpm standards:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm smoke
pnpm docs:check
```

See [architecture](docs/dev/ARCHITECTURE.md), [testing](docs/dev/TESTING.md),
[development](docs/dev/DEVELOPMENT.md) and [releasing](docs/dev/RELEASING.md).
