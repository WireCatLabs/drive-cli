### Changed — may break callers

- **`drive <profile> session` is cli-core's shared sign-in command** (`oauthSessionCommand`), the same as every
  WireCat CLI that signs in in the browser. Nobody signs in again: the first read copies a sign-in kept by an older
  drive, under the bare profile name, to `oauth:google:<profile>`, and `session end` removes both. A run with moved
  folders only reads the owner's sign-in. `--grant`, `--client-file`, `--client-id` and `--credential-storage` work
  as before. What changes for a caller of the JSON:
  - `session list` answers a list, `{"items":[{"profile","signed_in","state"}],"limit","has_more"}`, in place of
    `{"item":{"scope":"all-configured-profiles","items":[…]}}`. A row loses `selected_folders` and `storage`, and
    the list takes no `profile:` or `storage:` terms. WireCat Desktop reads this shape, so it shows drive's profiles
    again.
  - `session status` answers `profile`, `state` (`saved` or `missing`), `scopes`, `expires_at` and `verified`, and
    loses `signed_in`, `account` and `storage`. `session status --check` asks Google whose the sign-in is and adds
    `account`.
  - `session end` answers `profile`, `ended` and `removed`, with `why` when a run with moved folders keeps the
    owner's sign-in, in place of `signed_out`, `kept` and `cached_data`. Imported documents stay, as before.
  - `session start` answers `profile`, `signed_in`, `account` and `scopes`, and loses `storage`. It takes
    `--answer-stdin`.
  - The JavaScript API no longer exports `login` and `LoginOptions`. Sign in with `drive <profile> session start`.

### Fixed

- **`drive commands --json` marks the commands cli-core builds** (`doctor`, `mcp`, `complete` and the rest) with
  `origin: "cli-core"`, as cli-core's own `commands` does. drive builds its own `commands` and left the mark out.
