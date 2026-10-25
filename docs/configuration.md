# Settings

Control where Drive keeps its local copy, which actions a profile may perform and which AI
provider optional memory extraction uses. Use this guide when you want a saved choice for future
runs or a different setup for one account. You will learn where the file lives, how to change a
value and how saved settings differ from environment variables and command options.

A **setting** is a saved value in `config.json`. A **profile** is the named configuration for one
Google account. An **environment variable** comes from the terminal or agent process; a **flag**
changes one command invocation. These are different ways to control the tool.

## Where the files live

| System | Configuration file | Local data and snapshots |
| --- | --- | --- |
| Linux | `~/.config/drive-cli/config.json` | `~/.local/share/drive-cli/` |
| macOS | `~/.config/drive-cli/config.json` | `~/Library/Application Support/drive-cli/` |
| Windows | `%APPDATA%\drive-cli\Config\config.json` | `%LOCALAPPDATA%\drive-cli\Data\` |

These are the operating-system defaults; the environment overrides below can move them. The
configuration contains selected folder IDs, account identity and settings, not OAuth tokens.
Tokens use the system keyring unless file credential storage was explicitly selected at sign-in.
The local database defaults to `~/.local/share/WireCat/wirecat.db` on Linux; profile snapshots and checkpoints
are under `profiles/PROFILE_NAME/`. Read [local storage](usage.md#disk-use-index-without-an-export-directory)
before moving or deleting them.

Existing files using camelCase setting names are migrated to snake_case on their first successful
read. The file keeps its permissions and is not rewritten again if nothing changes. Profile names,
permission paths and model-purpose names are preserved. Conflicting old/new values are refused.

The old `read_only` and `readOnly` settings are refused. Remove them from the configuration file;
use per-command `permissions` for saved limits, or `--read-only` / `DRIVE_READ_ONLY=1` for a run.

## Saved settings

| Key | What it controls | Scope |
| --- | --- | --- |
| `permissions` | Per-command access levels: `deny`, `readonly`, `ask` or `allow` | A profile or `defaults` |
| `max_text_chars` | Most characters of text one file may have to be imported; default and maximum `2000000`, the most the document readers return | A profile or `defaults` |
| `record` | `true` keeps every run in `drive runs list`; default `false`, which keeps only failed runs. `false` set here keeps none | `defaults` only |
| `keep_runs_for_days` | How many days a kept run stays; default `30` | `defaults` only |
| `picture_search` | `true` finds Drive images by what they show: sync downloads each image (up to 25 MB) and search returns `pictures`; default `false` | A profile only |
| `models.memories.provider` | AI provider for explicitly requested memory extraction | A profile or `defaults` |
| `models.memories.model` | The provider's model identifier | A profile or `defaults` |
| `models.memories.base_url` | Optional endpoint for the configured provider | A profile or `defaults` |

The commands manage account details separately: `session start` records identity and credential
storage, and `folders add`/`folders remove` change selected roots. Do not put access tokens or
provider API keys in the settings file.

## Change and check a value

```text prompt
Use drive CLI with profile personal. Show the saved settings and explain which actions they allow.
Set remote file operations to read-only, keeping local indexing and notes available.
Show the saved change; do not change Google files.
```

For manual use:

```sh
drive personal config show --json
drive personal config set permissions.files '"readonly"'
drive personal config set permissions.documents '"readonly"'
drive personal config show --json
```

These permissions restrict the live file/Doc command families. Local sync and local notes use
separate keys. `--read-only` is broader: it also blocks local changes, so do not use it when
you want to import or tag documents. Inspect the [command reference](commands.md) and
[data permissions](security.md) before choosing broader rules.

`config set` changes the selected profile unless you add `--defaults`. For example:

```sh
drive personal config set permissions.files '"readonly"' --defaults
drive work config set permissions.files '"deny"'
drive personal config show --json
```

The first line changes the shared default; the second overrides it for `work`.
The final command prints both configuration sections, not a merged list of effective values.

`drive personal config set picture_search true` turns picture search on for `personal` only.
Download the shared local `clip-b32` model first (about 160 MB), then use queries in English. The download needs no
profile or sign-in:

```sh
drive images models download clip-b32
```

`drive personal config set max_text_chars 500000` makes sync skip longer files with that reason; a
file skipped for its length is read again on the next sync after the limit is raised.
The profile is the first word, or `DRIVE_PROFILE`. Nothing else picks one: a missing profile is an error that lists
the profiles here, and a legacy saved default is named in that error, not used.

## Environment variables

These values apply to the process that runs Drive; they are not saved by `config set`.

| Variable | Purpose |
| --- | --- |
| `DRIVE_TIMEOUT` | Whole-command deadline, like `--timeout` (`500ms`, `30s`, `2m`); the default is 30 seconds |
| `DRIVE_READ_ONLY` | Set to anything but `0` or empty: every command refuses changes, local or on Google, with exit 5, as `--read-only` does |
| `DRIVE_PROFILE` | Name the profile when the command line does not start with one |
| `DRIVE_PROFILE_LOCK` | Pin the process to one profile: a first word or `DRIVE_PROFILE` naming any other profile is refused with exit 5; with no profile named, the locked one is used |
| `DRIVE_CONFIG_DIR` | Move `config.json` and the associated credential namespace |
| `DRIVE_STATE_DIR` | Move snapshots and checkpoints |
| `DRIVE_CACHE_DIR` | Move the tool cache; this does not move document snapshots |
| `MESSAGING_STORE` | Select the shared database file instead of the default WireCat database |
| `WIRECAT_STATE_DIR` | Move the WireCat folder that holds the shared database and local search models (default `~/.local/share/WireCat/`) |
| `DRIVE_GOOGLE_CLIENT_ID`, `DRIVE_GOOGLE_CLIENT_SECRET` | Use your own Desktop OAuth application instead of WireCat's included app; set the ID before supplying its secret |
| `DRIVE_MODELS_MEMORIES_PROVIDER`, `DRIVE_MODELS_MEMORIES_MODEL`, `DRIVE_MODELS_MEMORIES_BASE_URL` | Override optional AI extraction choices for this process |
| `DRIVE_OPENAI_API_KEY`, `DRIVE_ANTHROPIC_API_KEY` | Supply the selected provider's credential; the corresponding unprefixed API-key variable is also accepted |

Use the same directory overrides during sign-in and later commands: changing paths can also
change which keyring entry the CLI sees. Model preparation and embedding must use the same
`WIRECAT_STATE_DIR` when it is overridden.

## Options for one command

| Option | Effect for this invocation |
| --- | --- |
| the first word `NAME` | Select the Google account profile; there is no `--profile` option |
| `--offline` | Refuse Google requests, sync and AI extraction; answer cached operations |
| `--read-only` | Refuse both local and remote mutations |
| `--permission KEY=LEVEL` | Tighten a command permission for this run; a level looser than the profile's or a built-in default is refused |
| `--dry-run` | Validate and preview a supported operation without acting |
| `--json`, `--jsonl` | Select structured output; `--json=id,name` keeps only those fields; MCP answers show control characters visibly |
| `--timeout DURATION`, `--max-output-bytes N` | Bound the command deadline and buffered output |
| `--record`, `--no-record` | Keep this run in `drive runs list`, or keep nothing even when it fails |

These flags are not file settings. Command-specific options such as `search --limit` and
`sync --limit` are described with their commands. Permission overrides take priority over profile
permissions, then shared defaults. A process-wide `DRIVE_READ_ONLY=1` remains a restriction even when a
permission says `allow`. AI environment overrides take priority over profile/default model choices.

## Optional AI extraction

Configure extraction once, then preview the result before saving memories:

```sh
drive personal config set models.memories.provider '"openai"'
drive personal config set models.memories.model '"YOUR_MODEL_ID"'
drive personal config show --json
```

Replace `YOUR_MODEL_ID` with the provider's identifier. Supply its key through the environment;
do not paste it into an agent conversation. Extraction sends selected cached text to that
provider. Local keyword search and local embeddings are separate and do not need an AI API key.
See [memory extraction](recipes.md#remember-a-source-backed-decision) for review and saving.

<a id="share-a-store-deliberately"></a>

## Shared documents and messages

Drive uses the WireCat database that Memo, Telegram and MAX use. Imported documents can appear
in their local searches, with the Google URL and last Google edit time. A successful sync records
the selected Drive profile alongside its imported collection. Drive search reads that selected
Google account; combined searches in other tools can cover multiple stored sources.
Snapshots and checkpoints remain under `DRIVE_STATE_DIR`; `MESSAGING_STORE` selects the database.
Sharing storage does not share sign-ins or Google permissions.

When moving from an older separate database, Drive rebuilds document references from local
snapshots and retains the original file. An interrupted rebuild can be retried. If snapshots are
missing, run `drive personal sync --rescan` to fetch the selected sources again.

Drive stops if the previous database contains annotations that would be left behind. To continue
using them, set `MESSAGING_STORE` to the previous database path; do not delete it. Transfer of owner
annotations between databases is not automatic.

Continue with [linking documents to people and projects](recipes.md#link-a-document-to-a-person-or-project).
