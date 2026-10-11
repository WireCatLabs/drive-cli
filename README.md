<img src="https://raw.githubusercontent.com/WireCatLabs/drive-cli/main/docs/images/social-preview.png" alt="Google Drive for your AI agents: Docs as local Markdown, search with sources" width="100%">

# drive-cli

`drive` imports selected Google Drive folders into local Markdown snapshots and searchable
documents. It reads Google Docs across all tabs, keeps source identity through renames and moves,
and reuses WireCat's shared keyword search and optional local embeddings. Shared tags, notes,
editor identities and evidence-backed memories stay attached to the imported documents.

Status: development implementation on GitHub; no npm release yet. It uses Google's official Node clients.
Sources supported now: native Google Docs and uploaded Markdown/TXT. Other types and shortcuts
are reported as skipped; shortcuts are not followed outside the selected scope.

## Install

The package is prepared for its first npm publication; the command below becomes available when
that release is published. Users install the compiled CLI, with Node 22.16+ on the 22.x line or
Node 24+, without building a checkout:

```sh
npm install -g @wirecat/drive-cli
drive --version
drive --help
```

See [installation and Google connection](docs/installation.md). Source builds are for
[contributors](docs/dev/DEVELOPMENT.md).

## Sign in and choose folders

For development, enable the Drive and Docs APIs in your Google Cloud project and create a
**Desktop** OAuth client. Download its client JSON, then:

```sh
drive personal session start --client-file /path/to/desktop-client.json
drive personal folders add https://drive.google.com/drive/folders/FOLDER_ID
drive personal sync --json
```

For Google Cloud setup and an isolated first run, follow the
[browser sign-in and live validation guide](docs/dev/GOOGLE_OAUTH.md).

Sign-in opens the system browser and receives Google's callback on a temporary loopback port.
`--no-browser` prints the URL. `drive.readonly` grants account-wide reading; our selected-folder
scope limits ingestion. Sync reads remote files. Optional remote management commands need a
new sign-in with `session start --write`; history events need `session start --activity`.

Credentials use the OS keyring. Without one, explicitly choose `--credential-storage file`;
the shared helper writes an owner-only private file. Tokens never enter regular config, output
or diagnostics. `DRIVE_GOOGLE_CLIENT_ID` and `DRIVE_GOOGLE_CLIENT_SECRET` can provide application
settings instead of a client file. A public application can supply its registered Desktop client
settings, but the CLI does not bundle a public OAuth application identity yet. Public distribution with
this restricted scope needs Google verification; external Testing grants usually expire in
seven days. [Google OAuth guide](https://developers.google.com/identity/protocols/oauth2/native-app),
[Drive permissions](https://developers.google.com/workspace/drive/api/guides/api-specific-auth).

Use `--profile work` for another account. Each Google account has one local profile. `session list`
lists configured profiles. `session end` removes local sign-in while retaining cached data and
configuration so re-login preserves document identities.

## Search and export

```sh
drive personal search 'budget decision' --json
drive personal search 'budget' --exact --json
drive personal documents list --json
drive personal documents show DOC_ID --json
drive personal documents export DOC_ID --out ./document.md
drive personal status --json
drive commands sync --json
```

Search results include the original Google URL. `documents show` includes each tab's text, ID
and title. Native Markdown exports are saved separately from the all-tab text used for indexing.
Export refuses to overwrite an existing destination file.

Semantic search uses an already-downloaded shared text model. Prepare the existing model cache
with `tg personal models text download e5-small` or its `max` equivalent, then use `drive personal sync --embed`.
There is no replacement model downloader or implicit download here. Missing models are reported.
`--exact` searches words without semantic retrieval.

## Keep it current

```sh
drive personal sync --max 200 --json
drive personal folders remove FOLDER_ID
drive personal sync --json
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
WireCat store and search engine. It defaults to a separate file so connecting Google does not
implicitly migrate an existing messenger database. `DRIVE_STORE` selects another compatible
database explicitly. Review shared package versions and schema compatibility before sharing.

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

## Document knowledge and remote actions

```sh
drive personal tags add DOC_ID project-budget review
drive personal documents list --tag review
drive personal notes add DOC_ID 'Check the assumptions' --title Review
drive personal people list DOC_ID
drive personal documents context DOC_ID
drive personal memories add DOC_ID 'Budget approved for Q4' --scope work --kind fact
drive personal memories extract DOC_ID --scope work
drive personal documents history DOC_ID
drive api methods --service docs
```

AI extraction explicitly sends selected cached text to the configured model. It previews proposals
unless `--save` is given; saved proposals include source quotes, snapshot hashes and model authorship.
Use the shared model setup with `models configure --provider openai --model MODEL_ID`. Provider keys
come from the corresponding API-key environment variable and never enter regular configuration.
Source content changes and scope removals mark source-backed memories stale. User notes stay local.

The generated API exposes 68 Drive, Docs and Activity methods. Convenient commands include
file listing/copying/moving, trash/restore, folder creation, Docs creation/batch updates, comments,
permissions, revisions and Shared Drives. Read grants remain the default. JSON API calls require
explicit flags for mutation and permanent deletion; Google still enforces file roles and API policy.

Read the [knowledge and API command guide](docs/dev/KNOWLEDGE_AND_API.md) for complete examples,
permissions, history limits, AI settings and supported request formats. Live Google and real model
validation remain pending; automated tests use synthetic sources and mocked provider requests.

## Shared CLI conventions

Drive now uses MAX's API generation approach: committed Google Discovery snapshots feed a
provider adapter into cli-core's shared code generators. cli-messaging builds the generated
commands and validates their input; Google's SDK remains the transport. `pnpm generate` rebuilds
types, validators, the operation manifest, coverage and [command reference](docs/commands.md).
`pnpm generate:check` checks freshness offline. Only `pnpm spec:sync` fetches a new public specification.

```sh
drive personal api drive-files-get --help
drive schema docs.documents.batchUpdate --json
drive personal --dry-run api drive-files-get --file-id synthetic-doc --json
drive complete zsh
drive personal --read-only mcp --tools --json
```

Profiles accept `drive work ...` as well as `--profile work`. Shared permission levels are deny,
readonly, ask and allow, configured under profile/default permissions. OAuth permission is a
separate gate. `--read-only` also stops local mutations; `--yes` and `--allow-dangerous` answer
confirmation but cannot override a denial. `--offline` refuses commands that may require network.
Writes use the shared journal and uncertain Google outcomes are reported without automatic retry.

MCP stdio tools derive from the same command registry and call the CLI executor with its guards.
They exclude sign-in/config changes, arbitrary file export, body-file access and raw API dispatch.
Generated typed methods remain available according to the profile's permissions. Agent-facing
output shows control characters visibly; results use a shared output buffer and optional deadline.

See the [alignment guide](docs/dev/CLI_ALIGNMENT.md) for policy examples, generation, compatibility
checks and the remaining differences from MAX. The shared package pins now match the reviewed
MAX versions; existing stores still require an explicit path and compatibility review.
