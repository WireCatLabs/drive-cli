### Changed — may break callers

- **Built on cli-core 0.648.0** (was 0.647.0). A profile name that is not on this computer is now `not_found`
  (exit 6), with `profile.unknown` and the profiles there, as in every WireCat CLI; it was `validation_error`.
  `store reset` is no longer offered to an agent over MCP. What changed is in
  [cli-core's changelog](https://github.com/WireCatLabs/cli-core/blob/main/CHANGELOG.md).
- **`meta.run_id` names the run that `drive runs show` finds** (`20261112T121302Z-documents-list-7dfb77`), as in
  every other WireCat CLI. It was a random UUID that matched no saved run.
- **`drive complete` is the shared WireCat completion command.** The same shells (zsh, bash, fish, PowerShell) and
  the same Tab answers; its help text is the shared one, and it now reads the configured profile names.

### Security

- **drive reaches only the Google hosts it declares.** Every request of the Google SDK, the sign-in and the token
  refresh goes through cli-base's `hostFetch`, which refuses any other host before anything is sent and checks each
  redirect. The package now ships `contracts/wirecat.json`, so WireCat Desktop shows these hosts before install.

### Fixed

- **The docs say where tokens go when the keyring fails.** drive saves them in `credentials.json` (mode 600) in the
  configuration folder and warns once; the configuration and security pages said there was no such fallback.
