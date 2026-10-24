# Development

Tracked zoom-cli checkout e640f32 supplied the complete template. Zoom modules, app files and
fixtures were pruned. Shared tooling, license, exports, lifecycle, release separation and package
acceptance boundaries remain. Community presets are recorded under config/wirecat and checked
offline by standards:check.

Users install the compiled package from npm; this source workflow is for contributors.
Use Node 22.16+ on the 22.x line or Node 24+, Git and pnpm 11.20.0:

```sh
git clone https://github.com/WireCatLabs/drive-cli.git
cd drive-cli
pnpm install --frozen-lockfile
pnpm build
bin/drive --help
```

Use `bin/drive personal ...` while developing. To update a checkout, pull the branch and repeat
installation/build. A global source link (`npm install -g .`) depends on retaining the checkout.

Tests inject ports; production opens the released shared store implementation. No memory fallback is allowed.

Keep Google types below the source port. Generic store/search changes belong in cli-core,
through its reviewed release. Use cli-base's helpers instead of copying them. Use public exports,
never dependency-internal imports. The default database is shared with other WireCat tools;
use temporary storage for development and verify compatibility when changing dependency pins.

Fast checks are standards:check, lint, docs:lint and ci:quick. Full validation adds tests, coverage,
build, the contracts, generated files, the test matrix and installed-package smoke; it runs on every pull
request (`pr.yml`) and on each merge to main (`main.yml`), Linux only. A release pull request, titled
`chore: release X`, adds Windows and macOS. Commit hooks never install, build or run tests. Live account
checks and model downloads remain explicit actions.

## Checks before a pull request

Google logic stays here. SQL, chunking, embeddings and search live in the shared WireCat packages.

```sh
pnpm standards:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm smoke
pnpm docs:check
```

See [architecture](ARCHITECTURE.md), [testing](TESTING.md),
[development](DEVELOPMENT.md) and [releasing](RELEASING.md).
