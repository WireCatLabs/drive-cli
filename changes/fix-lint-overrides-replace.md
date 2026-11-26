### Changed — may break callers

- **`files download` and `files export` take `--replace` instead of `--overwrite`** to write over an existing output
  file. `--replace` is the shared WireCat name for this, as in mail-cli. A script that passes `--overwrite`
  now fails with an unknown option and must pass `--replace`. The refusal without it names `--replace`.
