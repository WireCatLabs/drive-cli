### Changed — may break callers

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
