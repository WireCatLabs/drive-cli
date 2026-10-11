# Development

Tracked zoom-cli checkout e640f32 supplied the complete template. Zoom modules, app files and
fixtures were pruned. Shared tooling, license, exports, lifecycle, release separation and package
acceptance boundaries remain. Community presets are recorded under config/wirecat and checked
offline by standards:check.

Use Node 22.16 or newer, or Node 24. Run pnpm install and pnpm build, then bin/drive. Tests inject
ports; production opens the released shared store implementation. No memory fallback is allowed.

Keep Google types below the source port. Generic store/search changes belong in cli-messaging,
through its reviewed release. Use cli-core's helpers instead of copying them. Use public exports,
never dependency-internal imports. Sibling dependency pins differ, so database sharing is explicit.

Fast checks are standards:check, lint, docs:lint and ci:quick. Full validation adds tests, coverage,
build and installed-package smoke. Commit hooks never install, build or run tests. Live account
checks and model downloads remain explicit actions.
