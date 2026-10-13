# Testing

Synthetic tests cover identity, folder scope, duplicate names, SDK pagination, all tabs, durable
jobs, unavailable content, locking, OAuth state/PKCE, listener cleanup and shared-store retrieval.
SDK responses are scripted at the request seam. These tests do not certify live Google exports.
Extended workflows cover real temporary-store tags, notes, relationships, editor association, memory
scope/staleness, guarded note edits, AI quote validation, extraction races, all common remote
command mappings, generated schema validation and explicit write/delete/scope boundaries.
Alignment tests cover local/remote policy denial, generated flags, operation aliases, atomic
output, agent controls, profile/config syntax, dry-run/offline and shared write journaling.
Executable contracts verify missing generated arguments produce JSON errors, MCP schemas remain
stable and a store seeded with the real 0.226.0 shared package retains data under 0.231.0.
OAuth callbacks use invented codes and a memory keyring over local loopback HTTP.

Fixtures override DRIVE_CONFIG_DIR, DRIVE_STATE_DIR, DRIVE_CACHE_DIR, DRIVE_STORE, MESSAGING_STORE
and CLI_COMMON_CACHE_DIR. No owner's config, credential, database or model cache is used. Fixture
directories stay available until cleanup is requested.

The installed-package smoke test packs and installs the npm tarball, then invokes its bin with
network/browser/keyring guards and invalid isolated config. Help, version and registry must work;
operations must emit sanitized errors. Bun smoke repeats the same acceptance boundaries.

The initial unit coverage gate is 80% lines, 78% statements, 75% functions and 65% branches.
The inherited Zoom thresholds describe its mature implementation, so this package establishes
its own measured baseline. Test helpers and the separately tested process entry point are excluded.

```sh
pnpm typecheck
pnpm test
pnpm test:coverage
pnpm build
pnpm smoke
pnpm docs:check
```

Live user OAuth and Doc conversion need a registered Desktop client and user grant. They are
manual, not CI. The earlier real service-account folder experiment could not create Docs because
Google returned storageQuotaExceeded. The incomplete native Docs check is not reported as passed.
