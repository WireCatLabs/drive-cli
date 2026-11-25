### Fixed

- **A read-only run can read a stored file's text** ([#402](https://github.com/WireCatLabs/drive-cli/issues/402)).
  `drive <profile> files download FILE_ID` without `--output` writes nothing on this computer, so `DRIVE_READ_ONLY=1`
  and `--read-only` now let it answer the text, marked as untrusted in a scheduled agent's run.
  Saving the file with `--output` is still refused there. As in ydisk, `--output` and `--overwrite` are now the
  owner's alone: an agent over MCP reads the text with `drive_read` and can no longer save a download into the
  profile's export folder. `files export` always writes a file and is unchanged
  ([usage](../docs/usage.md#download-or-convert-a-file-from-google)).
