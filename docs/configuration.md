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
| macOS | `~/Library/Preferences/drive-cli/config.json` | `~/Library/Application Support/drive-cli/` |
| Windows | `%APPDATA%\drive-cli\Config\config.json` | `%LOCALAPPDATA%\drive-cli\Data\` |

These are the operating-system defaults; the environment overrides below can move them. The
configuration contains selected folder IDs, account identity and settings, not OAuth tokens.
Tokens use the system keyring unless file credential storage was explicitly selected at sign-in.
The local database defaults to `drive.db` in the data directory; profile snapshots and checkpoints
are under `profiles/PROFILE_NAME/`. Read [local storage](usage.md#disk-use-index-without-an-export-directory)
before moving or deleting them.

Existing files using camelCase setting names are migrated to snake_case on their first successful
read. The file keeps its permissions and is not rewritten again if nothing changes. Profile names,
permission paths and model-purpose names are preserved. Conflicting old/new values are refused.

## Saved settings

| Key | What it controls | Scope |
| --- | --- | --- |
| `read_only` | Refuses local and remote mutations, including sync and adding notes | A profile or `defaults` |
| `permissions` | Per-command access levels: `deny`, `readonly`, `ask` or `allow` | A profile or `defaults` |
| `max_text_chars` | Most characters of text one file may have to be imported; default and maximum `2000000`, the most the document readers return | A profile or `defaults` |
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
separate keys. `read_only true` is broader: it also blocks local changes, so do not enable it when
you want to import or tag documents. Inspect the [command reference](commands.md) and
[data permissions](security.md) before choosing broader rules.

`config set` changes the selected profile unless you add `--defaults`. For example:

```sh
drive personal config set read_only true --defaults
drive work config set read_only false
drive personal config show --json
```

`drive personal config set picture_search true` turns picture search on for `personal` only.
Prepare the shared local `clip-b32` model first (about 160 MB), then use queries in English.
An agent with terminal access can use the installed SDK's verified model installer:

```text prompt
Prepare WireCat's local CLIP image model for Drive profile personal using the installed shared SDK.
Use its verified model installer and the same WIRECAT_STATE_DIR as Drive. Download only model files;
do not connect to Google or change my source files. Then enable picture_search for personal.
```

The public SDK exports `modelsCommand` through `@wirecat/cli-core/cli`; an agent can inspect that
API for model setup. Drive's command tree currently exposes the setting and search, while model
installation uses the shared SDK or a WireCat tool that already supports image-model setup.
In the earlier example, the first line changes the shared default; the second overrides it for `work`.
`drive personal config set max_text_chars 500000` makes sync skip longer files with that reason; a
file skipped for its length is read again on the next sync after the limit is raised. The final command
prints the configuration with both sections, not a merged list of effective values.
A missing profile is an error: `DRIVE_PROFILE` and a legacy saved default do not select one.

## Environment variables

These values apply to the process that runs Drive; they are not saved by `config set`.

| Variable | Purpose |
| --- | --- |
| `DRIVE_CONFIG_DIR` | Move `config.json` and the associated credential namespace |
| `DRIVE_STATE_DIR` | Move snapshots, checkpoints and the default database directory |
| `DRIVE_CACHE_DIR` | Move the tool cache; this does not move document snapshots |
| `DRIVE_STORE` | Select an explicit database file instead of the default `drive.db` |
| `WIRECAT_STATE_DIR` | Move the WireCat folder that holds the shared local search models (default `~/.local/share/WireCat/`) |
| `DRIVE_GOOGLE_CLIENT_ID`, `DRIVE_GOOGLE_CLIENT_SECRET` | Use your own Desktop OAuth application instead of WireCat's included app; set the ID before supplying its secret |
| `DRIVE_MODELS_MEMORIES_PROVIDER`, `DRIVE_MODELS_MEMORIES_MODEL`, `DRIVE_MODELS_MEMORIES_BASE_URL` | Override optional AI extraction choices for this process |
| `DRIVE_OPENAI_API_KEY`, `DRIVE_ANTHROPIC_API_KEY` | Supply the selected provider's credential; the corresponding unprefixed API-key variable is also accepted |

Use the same directory overrides during sign-in and later commands: changing paths can also
change which keyring entry the CLI sees. Model preparation and embedding must use the same
`WIRECAT_STATE_DIR` when it is overridden.

## Options for one command

| Option | Effect for this invocation |
| --- | --- |
| `--profile NAME` or the first word `NAME` | Explicitly select the Google account profile |
| `--offline` | Refuse Google requests, sync and AI extraction; answer cached operations |
| `--read-only` | Refuse both local and remote mutations |
| `--permission KEY=LEVEL` | Override a command permission temporarily |
| `--dry-run` | Validate and preview a supported operation without acting |
| `--json`, `--jsonl` | Select structured output; MCP answers show control characters visibly |
| `--timeout DURATION`, `--max-output-bytes N` | Bound the command deadline and buffered output |

These flags are not file settings. Command-specific options such as `search --limit` and
`sync --limit` are described with their commands. Permission overrides take priority over profile
permissions, then shared defaults. A saved `read_only true` remains a restriction even when a
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

## Share a store deliberately

To use the same stored people, projects and evidence as other tools, set `DRIVE_STORE` to the
chosen compatible database. Separate stores do not share references. Back up an existing store
and check the tools use compatible shared-library versions before opening it with another CLI.
Sharing storage does not share sign-ins or Google permissions. Continue with
[linking documents to people and projects](recipes.md#link-a-document-to-a-person-or-project).
