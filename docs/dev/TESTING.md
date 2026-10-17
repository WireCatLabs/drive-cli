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
stable and a store seeded with the real 0.226.0 shared package retains data under the current
exact shared-package pin. Installed-Drive release comparisons are separate checks in cli-testing.
OAuth callbacks use invented codes and a memory keyring over local loopback HTTP.

The Google SDK boundary suite uses the pinned Google service clients, OAuth client and Gaxios
pipeline with a synthetic bearer and in-memory fetch responses. It checks transport override
refusal, URL encoding, sanitized failures, mutation retry suppression and declared response-size
refusal. A socket guard blocks network access. Synthetic refresh-token cases check the separate
401 replay path and preserve refusal to replay uncertain writes. The transport suite runs pinned
node-fetch against confined loopback listeners to check chunked-response limits and same-host
and changed-host redirects. No live Google or production TLS/proxy behavior is certified.

The Sheets roundtrip suite drives the normal command tree through the pinned SDK and auth
transporter with a stateful, in-memory provider fixture and refused network sockets. Separate
read requests check changed cells, unchanged neighbors, null/empty handling and append ranges.
An apply-then-503 case checks that an uncertain append is not repeated. This fixture does not
certify Google's formula calculation, table detection, formatting preservation or live behavior.

Fixtures override DRIVE_CONFIG_DIR, DRIVE_STATE_DIR, DRIVE_CACHE_DIR, MESSAGING_STORE
and WIRECAT_STATE_DIR. No owner's config, credential, database or model cache is used. Fixture
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
