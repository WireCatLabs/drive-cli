### Changed — may break callers

- **drive runs on cli-core 1.0 and cli-base 1.0** (cli-core 1.0.0, was 0.750.0; cli-base 1.0.0, was 0.132.0).
  cli-core 1.0 moves the message store to version 74 the first time it opens it: an id is never handed out twice,
  and a JSON column holds valid JSON. After that, only tools on cli-core 1.0 open the store. Watch for: upgrade every
  installed WireCat CLI to its 1.0 release first, and stop `serve`, `mcp` and every sync while the store migrates;
  the migration writes a rollback copy first and refuses to run without one. See
  [cli-core's changelog](https://github.com/WireCatLabs/cli-core/blob/main/CHANGELOG.md).

### Fixed

- **Over MCP, a Drive file or folder is passed as the agent wrote it.** The file id or URL of `drive files get`,
  `copy`, `move`, `trash`, `download` and `export`, of `drive comments`, `permissions`, `revisions` and
  `activities`, the folder of `drive catalog tree`, and the command path of `drive commands` were made absolute
  against the client's folder, as if they named a file on this computer.

### Security

- **An MCP call cannot name a credential folder, a WireCat tool's folder or the message store.** Every option and
  argument that takes a local file or folder (`drive files upload <path>`, `drive files download --output`,
  `--body-file` and the rest) is checked by its real path before the call runs, so neither a link nor `..` gets
  past. A refused call answers `permission_error` (`access.denied`) with the option in `param`. A run in a terminal
  is unchanged.
