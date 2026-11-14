### Changed — may break callers

- **A `readonly` level no longer stops `drive sync`** (cli-core 0.662.0, was 0.656.0). A command that only fetches
  from Google Drive into the local store runs at `readonly`: the profile's own key, a group key or setup's "read
  only" answer. `deny` still refuses it. Commands that write the owner's files or change Google data stay blocked by
  `readonly`. A profile that used `readonly` to stop syncing sets the key to `deny`. See the
  [cli-core changelog](https://github.com/WireCatLabs/cli-core/blob/main/CHANGELOG.md).

### Fixed

- **A shared config with a small slip is mended when it is read.** `~/.config/WireCat/config.json` with a
  byte-order mark, a comment, a trailing comma or a missing comma between two lines is fixed in place, the old file
  kept beside it as `config.json.bak-<time>`. Other damage names its line, column and the likely fix.
