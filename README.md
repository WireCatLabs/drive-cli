<img src="https://raw.githubusercontent.com/WireCatLabs/drive-cli/main/docs/images/social-preview.png" alt="Google Drive for your AI agents: Docs as local Markdown, search with sources" width="100%">

# drive-cli

`drive` imports selected Google Drive folders into local Markdown snapshots and searchable
documents. It reads Google Docs across all tabs, keeps source identity through renames and moves,
and reuses WireCat's shared keyword search and optional local embeddings. Shared tags, notes,
editor identities and evidence-backed memories stay attached to the imported documents.

Drive uses Google's official Node clients.
Sources supported now: native Google Docs and Sheets, PDF, docx, xlsx, CSV, TSV, and uploaded Markdown/TXT.
Other types and shortcuts are reported as skipped; shortcuts are not followed outside the selected scope.

How it compares with gog, Workspace MCP and rclone, and when another tool fits better:
[compared with other tools](docs/compare.md).

## Install

Install the compiled CLI with Node 22.16+ on the 22.x line or Node 24+. A source build is not
required:

```sh
npm install -g @wirecat/drive-cli
drive --version
drive --help
```

See [installation and Google connection](docs/installation.md). Source builds are for
[contributors](docs/dev/DEVELOPMENT.md).

`drive doctor` shows the version, settings file, profiles and paths without signing in, and `drive upgrade`
installs a newer version with the package manager that installed drive.

`drive guide` lists scenarios — the commands for a common task, in order — and `drive commands --json` is the full
command tree. For an agent, `drive skill install` puts drive's instructions where Claude Code, Codex, Gemini CLI and
OpenClaw look (Hermes with `--for hermes`), `drive personal mcp serve` serves three MCP tools (search, read, write) —
`--http` serves them to ChatGPT and Claude in the browser ([remote MCP](docs/remote.md)) — and `DRIVE_READ_ONLY=1`
refuses every change, as `--read-only` does.

## Sign in and choose folders

Sign in with WireCat's included Google application. Each user approves their own account in the
browser. Google's review of the Drive permissions is not finished, so Google shows an "unverified
app" warning first and limits the application to 100 new users in total; see
[the warning and how to continue](docs/installation.md#google-shows-an-unverified-app-warning).
You can also create your own Desktop client as explained in the
[installation guide](docs/installation.md). Connect your account, then choose a folder:

```sh
drive personal session start
drive personal folders add https://drive.google.com/drive/folders/FOLDER_ID
drive personal sync --json
```

For Google Cloud setup and an isolated first run, follow the
[browser sign-in and live validation guide](docs/dev/GOOGLE_OAUTH.md).

Sign-in opens the system browser and receives Google's callback on a temporary loopback port.
`--no-browser` prints the URL. `drive.readonly` grants account-wide reading; our selected-folder
scope limits ingestion. Sync reads remote files. Optional remote management commands need a
new sign-in with `session start --grant write`; history events need `session start --grant activity`.

Credentials use the OS keyring. Without one, explicitly choose `--credential-storage file`;
the shared helper writes an owner-only private file. Tokens never enter regular config, output
or diagnostics. `DRIVE_GOOGLE_CLIENT_ID` and `DRIVE_GOOGLE_CLIENT_SECRET` can provide application
settings instead of the bundled application; `--client-file` takes priority. The included Desktop
client identity is public application metadata, separate from private user tokens. If you create
your own Desktop client and leave it in Testing, Google usually ends its sign-ins after seven days.
[Google OAuth guide](https://developers.google.com/identity/protocols/oauth2/native-app),
[Drive permissions](https://developers.google.com/workspace/drive/api/guides/api-specific-auth).

Use `drive work …` for another account. Each Google account has one local profile. `drive session list`
lists configured profiles. `session end` removes local sign-in while retaining cached data and
configuration so re-login preserves document identities.

## Search and export

```sh
drive personal search 'budget decision' --json
drive personal search 'budget' --exact --json
drive personal documents list --json
drive personal documents show DOC_ID --json
drive personal documents export DOC_ID --output ./document.md
drive personal status --json
drive commands sync --json
```

Search results include the original Google URL. `documents show`, `list` and `export` print `synced_at` and `age_days`; a copy older than a day adds `missing`, `next` and `meta.complete: false`. `documents show` includes each tab's text, ID
and title. Native Markdown exports are saved separately from the all-tab text used for indexing.
Export refuses to overwrite an existing destination file.

Semantic search uses the shared local text model (about 135 MB). Download it once; it needs no profile or sign-in,
and every WireCat CLI shares it:

```sh
drive models download e5-small
drive personal sync --embed
```

Drive never downloads a model on its own; a missing one is reported. `--exact` searches words without semantic
retrieval.

## Keep it current

```sh
drive personal sync --limit 200 --json
drive personal folders remove FOLDER_ID
drive personal sync --json
```

A batch is persisted before processing; interrupted work resumes next run. Progress is saved
every 25 files or 2 seconds, so a killed sync redoes at most that many. The first walk of the
chosen folders is saved as it goes, and an interrupted walk continues from the folders it had not
listed yet. The change cursor advances when the batch completes. Incomplete discovery preserves the prior checkpoint and
documents. A per-profile heartbeat lock prevents simultaneous syncs and recovers after crashes.

Confirmed removals and scope exits remove sources from search and delete their snapshots.
Removing the last selected folder reconciles to an empty cache on the next sync. Unsupported,
restricted and oversized sources have explicit coverage status. Transient failures remain pending;
a partial sync with errors exits nonzero. Doc IDs, rather than names, distinguish duplicates.

## Storage and coverage

The shared path helper chooses platform-appropriate config, data and cache directories under
drive-cli. Override with `DRIVE_CONFIG_DIR`, `DRIVE_STATE_DIR` and `DRIVE_CACHE_DIR`. Snapshots are
`profiles/<profile>/documents/<file-id>.md` plus private JSON metadata and raw Docs responses.

Documents use the same local WireCat database as Memo, Telegram and MAX. Imports become searchable
across those tools, alongside messages and notes. `MESSAGING_STORE` selects another database;
`WIRECAT_STATE_DIR` moves the default WireCat directory. Google sign-ins remain separate.

On first use after an upgrade, Drive rebuilds old document references from its managed snapshots,
without fetching Google. It retains the old database. If that database contains tags, notes,
memories, facts or relationships, Drive refuses to strand them: keep using that file through
`MESSAGING_STORE` until those annotations are transferred.

Search covers body text, nested tables and footnotes from all tabs. Images, headers, footers,
comments and suggested edits are excluded. Image assets are not downloaded. Search text and Google’s native Markdown export are separate representations; inspect the export
when layout or tab coverage matters.

One sync reads at most 10,000 entries under the chosen folders, and at most 10,000 changes from
Google's change feed; past either, it stops with nothing lost and says what to do. Text caps at
2,000,000 characters and snapshots at 50 MiB, with bounded pagination. Oversized input is refused rather than truncated. Google's native export
also has its own 10 MB limit. Documents changing during export remain pending for retry.

## Document knowledge and remote actions

```sh
drive personal tags add DOC_ID project-budget review
drive personal documents list tag:review
drive personal notes add DOC_ID 'Check the assumptions' --title Review
drive personal identities list DOC_ID
drive personal documents context DOC_ID
drive personal facts add DOC_ID 'Budget approved for Q4' --type decision --scope work
drive personal memories add DOC_ID 'Q4 budget, in short' --scope work --kind summary
drive personal memories extract DOC_ID --scope work
drive personal documents history DOC_ID
drive api list service:docs
```

AI extraction explicitly sends selected cached text to the configured model. It previews proposals
unless `--yes` is given; saved proposals include source quotes, snapshot hashes and model authorship.
Use the shared model setup with `models set --provider openai --model MODEL_ID`. Provider keys
come from the corresponding API-key environment variable and never enter regular configuration.
Source content changes and scope removals mark source-backed memories stale. User notes stay local.

The generated API exposes 85 methods: 64 Drive, 17 Sheets, 3 Docs and 1 Activity. Convenient commands include
file listing/copying/moving, trash/restore, folder creation, Docs creation/batch updates, comments,
permissions, revisions and Shared Drives. Read grants remain the default. JSON API calls require
explicit flags for mutation and permanent deletion; Google still enforces file roles and API policy.

Read the [knowledge and API command guide](docs/dev/KNOWLEDGE_AND_API.md) for complete examples,
permissions, history limits, AI settings and supported request formats. Contributor checks use
isolated sources and mocked provider requests; see the [testing guide](docs/dev/TESTING.md).
