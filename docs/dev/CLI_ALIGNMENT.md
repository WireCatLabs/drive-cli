# Shared CLI alignment

Drive reuses the same generation, validation and guard primitives as MAX's official Bot API.
The Google adapter remains provider-specific; it does not replace Google's SDK or recreate the
WireCat store, search engine, memory store or model gateway.

## Generate commands

The offline pipeline is:

```text
spec/google/*.json + provenance.json
  -> scripts/discovery-adapter.ts -> cli-base ApiModel
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
their declared wire types rather than newly invented semantic validators. Media transport is
listed as an omission, not counted as an implemented upload workflow. The request schemas exposed
by `api show` declare JSON Schema 2020-12. Recursive references and exact string-valued int64 data
are preserved. Validators and operation effects are generated from committed inputs.

## Profiles and policies

Both `drive work documents list` and `drive --profile work documents list` select a profile.
Permission layers use the shared nearest-layer/specific-path rules: temporary flags, profile,
then defaults. `readOnly` prevents mutation even when another level allows it. Housekeeping such
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
deletion. Neither changes deny/readonly. Legacy raw API `--allow-write` and `--allow-delete` remain
supported. Normal non-destructive writes default to allow; an OAuth write grant is still required.
Google writes use cli-core's guardedWrite/SendJournal and retain only operation metadata,
never titles, document text, tokens or request bodies. An uncertain response is outcome_unknown;
automatic write retry is disabled. No provider idempotency is invented.

`--timeout 30s` supplies a whole-command deadline; transports retain their own request bounds.
`--max-output-bytes` uses cli-base's atomic output buffer (4 MiB default, zero disables the cap).
An oversized result fails before partial stdout. `--jsonl`, `--agent-json`, `--quiet` and `--offline`
are available. Agent mode displays control/direction characters visibly. Offline refuses sync,
Google actions and AI extraction; cached-document and knowledge reads remain available.

## Completion and MCP

```sh
drive complete zsh
drive complete -- api drive-files-g
drive personal --read-only mcp --tools --json
drive personal --read-only mcp
```

Completion uses cli-base's registry and suggestion engine plus the same shell-script library as
MAX. It does not load Google credentials, open a store or fetch names over the network.
MCP stdio uses the same SDK version as MAX. Tool names and input flags come from the command tree;
tool calls construct argv and run the same CLI, so schemas, profile selection and policies cannot
drift into a second executor. Input is untrusted: positional values follow the end-of-options
delimiter and a client cannot supply policy overrides. Denied/write-disabled tools are hidden and
every call rechecks current policy. Sign-in/config changes, arbitrary export paths, body files,
stdin reads and untyped raw API dispatch are excluded from the agent surface.

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

The reviewed community preset revision and cli-core 0.231.0 match the audited MAX checkout;
cli-base remains 0.19.4. Upgrade contracts use the real previous shared-store package 0.226.0 to
seed an isolated database, then verify current search, document identity, tags, notes and memories.
There is no previous published Drive release to pretend to test. The default database remains
isolated; adopting an existing messenger store is an explicit operation, not a side effect.

Full CI includes offline generation freshness, executable help/discovery/error contracts, MCP
schema snapshots, the store upgrade and no-leak checks. Installed-package acceptance covers
Node and Bun. Fixtures use no owner sessions, data, models or network. Google browser OAuth,
real requests and real-model quality still await the application registration.

Differences that remain: this CLI has Google-specific profile/state configuration and a thin
registry-to-MCP adapter because shared messenger/bot factories require messenger capabilities.
There is no HTTP MCP/OAuth hosting, Windows installer suite, messenger parity mapping, full
media-upload workflow or automatic background watches. Those are not reported as MAX parity.

## Explicit profiles

Drive reuses the shared `commandWords`, `liftProfile`, `refuseCommandName` and `usableProfileName`
helpers used by MAX. Account actions require an explicit first-word profile or `--profile`;
legacy config/environment defaults are ignored and repeated/conflicting selectors are rejected.
Help/version and account-independent discovery remain configuration-free. MAX's inspected shared
parser still permits an implicit default; Drive intentionally enforces the owner's stricter
cross-CLI account-selection requirement. No account records are renamed or migrated.

Catalog lists use cli-base's validated query registry and the shared store's SQL compiler,
with `kind`, `mime`, `name`, `parent`, observed `person`, `tag` and metadata `text` fields.
They use `--limit`/`--page`; filter flags are not introduced. Catalog/tree/depth vocabulary is
registered in cli-base. The cli-base adoption records 56 pre-existing handwritten option-role
violations in the baseline; catalog commands add none. This baseline records inherited naming
work and does not certify complete command-standard conformance.
