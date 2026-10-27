# Shared CLI alignment

Drive reuses the same generation, validation and guard primitives as MAX's official Bot API.
The Google adapter remains provider-specific; it does not replace Google's SDK or recreate the
WireCat store, search engine, memory store or model gateway.

## Generate commands

The offline pipeline is:

```text
spec/google/*.json + provenance.json
  -> cli-base adaptDiscovery (+ drive's effect overrides in scripts/generate.ts) -> ApiModel
  -> shared types, Valibot schemas, manifest, definitions and coverage generators
  -> cli-core generatedApiCommand
  -> cli-base command registry and generated reference
```

```sh
pnpm generate
pnpm generate:check
bin/drive personal api drive-files-get --help
bin/drive api show docs.documents.batchUpdate --json
```

Generated methods have explicit parameter flags, for example `--file-id`, and support JSON bodies
on the command line, stdin or `--body-file`. Request validation is shared with the friendly
commands and the preserved `api call` entry point. Response transport remains the official SDK.
Only `pnpm spec:sync` goes online. Review its public-spec diff and provenance before regeneration.
Generation refuses unknown schema keywords instead of silently replacing them with permissive types.

Google Discovery does not express every backend rule. Some enumerations and required fields only
appear in prose; they remain Google's responsibility. Date/time, byte and field-mask formats use
their declared wire types rather than newly invented semantic validators. Generated API methods accept JSON bodies; friendly `files download` and `files export`
handle binary downloads and native-document exports. A full media-upload workflow remains omitted. The request schemas exposed
by `api show` declare JSON Schema 2020-12. Recursive references and exact string-valued int64 data
are preserved. Validators and operation effects are generated from committed inputs.

## Profiles and policies

`drive work documents list` selects a profile; so does `DRIVE_PROFILE=work` when the command line names none.
`--profile` is refused, and `DRIVE_PROFILE_LOCK` pins the process to one profile.
Permission layers use the shared nearest-layer/specific-path rules: temporary flags, profile,
then defaults. A `--permission` flag only tightens: a looser level, or a key that names no command,
is refused. `DRIVE_READ_ONLY` prevents mutation even when another level allows it. Housekeeping such
as command discovery and owner configuration remains available so a policy can be inspected/fixed.

```sh
drive personal config set permissions.files '"readonly"' --defaults
drive personal config set permissions.api.drive.files.delete '"ask"' --defaults
drive personal config set models.memories.provider '"openai"' --defaults
drive personal --read-only documents list
drive personal --dry-run api drive-files-get --file-id synthetic-doc --json
```

The dry-run file ID above is explicitly synthetic: it validates and previews without calling
Google. Config string values are JSON, so permission and model strings need JSON quotes.

Ordinary command paths and generated API operation keys share guards. For example `files.copy`
and `api.drive.files.copy` both apply to a generated file-copy call. A denied method cannot be
reached through the convenient command. Sync has its own policy because it is a local-ingestion
workflow with several Google reads. OAuth scopes and Google file roles are additional checks.

`ask` is answered once per permission during a command, by the supplied confirmation handler or
explicit flags. `--yes` answers ordinary confirmation; `--allow-dangerous` answers permanent
deletion. Neither changes deny/readonly. Legacy raw API `--allow-writes` and `--allow-delete` remain
supported. Normal non-destructive writes default to allow; an OAuth write grant is still required.
Google writes use cli-core's guardedWrite/SendJournal and retain only operation metadata,
never titles, document text, tokens or request bodies. An uncertain response is outcome_unknown;
automatic write retry is disabled. No provider idempotency is invented.

`--timeout 30s` supplies a whole-command deadline; transports retain their own request bounds.
`--max-output-bytes` uses cli-base's atomic output buffer (4 MiB default, zero disables the cap).
An oversized result fails before partial stdout. `--jsonl`, `--quiet` and `--offline`
are available. MCP displays control/direction characters visibly. Offline refuses sync,
Google actions and AI extraction; cached-document and knowledge reads remain available.

## Completion and MCP

```sh
drive complete zsh
drive complete -- api drive-files-g
drive personal --read-only mcp serve --tools --json
drive personal --read-only mcp
```

Completion uses cli-base's registry and suggestion engine plus the same shell-script library as
MAX. It does not load Google credentials, open a store or fetch names over the network.
MCP stdio uses the protocol SDK pinned in package.json and serves cli-core's three tools, as tg and
max do: `drive_tools_search`, `drive_read` and `drive_write` (`registerCommands`). The commands they
find and their input flags come from the command tree, with snake_case MCP argument names; a call constructs argv and runs the same CLI,
so schemas, profile selection and policies cannot drift into a second executor. Input is untrusted: positional values follow the end-of-options
delimiter and a client cannot supply policy overrides. Denied/write-disabled commands and commands whose Google scope the sign-in lacks stay discoverable
with current availability and a reason; every call rechecks current policy. Sign-in changes, arbitrary export paths, body files,
stdin reads and untyped raw API dispatch are excluded from the agent surface.
`session list`, `config show`, `skill show` and `guide` are available reads. `config set` and `models set`
require the owner to allow `permissions.mcp.authority` in the profile; a tool cannot change that guard,
replace permissions wholesale or change `read_only`. The CLI rechecks authority for each invocation.
`documents export` takes a filename and writes within `<cache>/exports/<profile>/`, never an arbitrary path.

## Checks and compatibility

```sh
pnpm standards:check
pnpm generate:check
pnpm test:coverage
pnpm contracts:check
pnpm contracts:upgrade
pnpm security:no-leak
pnpm build
pnpm smoke
pnpm smoke:bun
```

Exact shared dependency pins live in package.json; reviewed community revisions live in
config/wirecat. Upgrade contracts use the real previous shared-store package 0.226.0 to seed an
isolated database, then verify current search, document identity, tags, notes and memories.
Those store fixtures are distinct from installed-Drive release acceptance. Published artifact
comparisons live in cli-testing's performance/documents/offline-catalog report. The default
database is the shared WireCat store; upgrade tests also cover offline reference rebuilding.

Discovery contract 4 uses `effects: {remote, local}` and `api_operation` instead of `mutates`,
`local` and `operation_id`. Effects also inform error retry safety. Standard output envelopes
include `meta.complete`; local lists page by `next_page`, Google lists by `next_cursor`. JSONL emits item records and
one end record. Search and note lists use `--page`; the old `--offset` flag
are refused. MCP inputs are checked in Drive's handler and failures are recorded through the
shared audit API without argument values. Configuration uses the shared snake_case migration
loader; original provider dictionaries and profile/model-purpose identifiers retain their keys.

Full CI includes offline generation freshness, executable help/discovery/error contracts, MCP
schema snapshots, the store upgrade and no-leak checks. Installed-package acceptance covers
Node and Bun. Fixtures use no owner sessions, data, models or network. Google browser OAuth,
real requests and real-model quality require separate live validation; application availability
does not establish content fidelity.

Differences that remain: this CLI has Google-specific profile/state configuration and its own
command catalogue for MCP, because the shared messenger/bot factories require messenger capabilities;
only the three-tool surface is shared.
HTTP MCP uses the same guarded server behind an owner-managed HTTPS tunnel and one-time-code OAuth.
See [remote connections](../remote.md). Messenger parity mapping and a full media-upload workflow remain omitted.
`mirrors watch` runs in the foreground; starting it automatically as a background service remains
planned. Published-package CI includes Windows acceptance. These differences are not MAX parity.

## Explicit profiles

Drive reuses the shared `commandWords`, `liftProfile`, `refuseCommandName` and `usableProfileName`
helpers used by MAX. Account actions require an explicit first-word profile or `DRIVE_PROFILE`;
repeated/conflicting selectors are rejected.
Help/version and account-independent discovery remain configuration-free. This enforces the
owner's cross-CLI account-selection requirement. Account records are not renamed by selection.

Catalog lists use cli-base's validated query registry and the shared store's SQL compiler,
with `kind`, `mime`, `name`, `parent`, observed `person`, `tag` and metadata `text` fields.
They use `--limit`/`--page`; filter flags are not introduced. Catalog/tree/depth vocabulary is
registered in cli-base. The original cli-base adoption recorded 56 pre-existing handwritten
option-role violations; that historical count is not the current baseline. See the dated check below.

## Native Sheets vocabulary

Sheets uses `info`, `show`, `update`, `add`, `clear`, `create` and `rename` from the shared
vocabulary. `add` appends rows; `create` adds a tab within an existing spreadsheet. Generated
operations retain Google's names. Base 0.40.3 registers `sheets`, `--values` (value), `--input`
(mode) and `--render` (output). It also includes `insert` and `format`, so all Sheets vocabulary
exceptions are removed. Existing baseline files are unchanged.

Friendly structure commands submit one `spreadsheets.batchUpdate` request. Rename masks only
`title`; format constructs finite GridRange bounds and leaf masks under `userEnteredFormat`.
Raw/generated batches check the corresponding friendly permission keys after body validation,
before preview/credentials/provider dispatch. Broad cell batches consult both format/update
keys when they can affect both. This retains the same guards across command paths.

## Shared CLI conventions

Committed Google Discovery snapshots feed a provider adapter into cli-base's shared code generators. cli-core builds the generated
commands and validates their input; Google's SDK remains the transport. `pnpm generate` rebuilds
types, validators, the operation manifest, coverage and [command reference](../commands.md).
`pnpm generate:check` checks freshness offline. Only `pnpm spec:sync` fetches a new public specification.

```sh
drive personal api drive-files-get --help
drive api show docs.documents.batchUpdate --json
drive personal --dry-run api drive-files-get --file-id synthetic-doc --json
drive complete zsh
drive personal --read-only mcp serve --tools --json
```

Profiles are the first word, `drive work ...`, or `DRIVE_PROFILE`. Shared permission levels are deny,
readonly, ask and allow, configured under profile/default permissions. OAuth permission is a
separate gate. `--read-only` also stops local mutations; `--yes` and `--allow-dangerous` answer
confirmation but cannot override a denial. `--offline` refuses commands that may require network.
Writes use the shared journal and uncertain Google outcomes are reported without automatic retry.

MCP stdio tools derive from the same command registry and call the CLI executor with its guards.
They exclude sign-in changes, arbitrary file export, body-file access and raw API dispatch.
Owner-authorized configuration/model changes require the MCP authority guard described above.
Generated typed methods remain available according to the profile's permissions. Agent-facing
output shows control characters visibly; results use a shared output buffer and optional deadline.

See the [alignment guide](CLI_ALIGNMENT.md) for policy examples, generation, compatibility
checks and the remaining differences from MAX.

## Alignment check — 24 October 2026

The 0.28.0 runtime pins cli-core 0.406.0 and cli-base 0.50.3. `models download` is the canonical
shared command; `models text download` has no alias. Discovery contract 4 is declared in
`src/registry.ts`.

On the 0.28.0 source plus subsequent documentation changes, `pnpm standards:check` passes and
`pnpm lint:commands` reports 29 violations: 19 baselined and 10 explicit overrides (budget 10),
with zero new violations. Passing these checks does not certify full standards compliance.

[Tracked alignment work](BACKLOG_LATER.md#standards-and-maintenance) remains: command entity
metadata (DRV-31), lower-layer command wording (DRV-32), standard progress reporting (DRV-33),
`bin/release --local` (DRV-34), a default whole-command deadline (DRV-35), and testing upgrades
from an actual previous Drive release (DRV-36). The existing timeout hook only creates a deadline
when `--timeout` is supplied; `bin/release` currently accepts no arguments. Further coverage,
consent, security hygiene and module-size work is recorded as DRV-37 through DRV-40.

This is a focused check of current declarations, release/deadline code and existing tracked work,
not a new full audit of every shared standard. The earlier audit's counts must not be presented as
current results. Stronger shared per-field untrusted-text marking is also pending in
[cli-core issue 1883](https://github.com/WireCatLabs/cli-core/issues/1883); current MCP instructions
already identify retrieved content as untrusted and make control characters visible.
