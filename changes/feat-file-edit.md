### Added

- **Edit Word, Excel and text files stored in Google Drive in place** (cli-core 0.735.0, was 0.724.0, and cli-base
  0.132.0, was 0.130.0). `files sheets show|update` reads and writes cells of an uploaded `.xlsx`, `files documents
  show|update` paragraphs of a `.docx`, and `files update FILE_ID --text` the whole text of a Markdown, text or CSV
  file. Each write needs `--expected-fingerprint`, the `sha256` the file was read at, checks the `files.delete`
  permission, and keeps the replaced content on this computer. `files history` lists those versions and `files restore FILE_ID
  <version>` puts one back. Google Drive has no conditional upload, so the file is checked just before the write; a
  change in that moment is not caught, but what the write replaced is kept. A Google Doc or Sheet is refused with
  the command that changes it ([usage](../docs/usage.md#edit-a-file-stored-in-google-drive),
  [recipe](../docs/recipes.md#edit-a-file-stored-in-drive-with-your-agent)).
- **`files download FILE_ID` without `--output` answers the file's text and its `sha256`**, to edit it with
  `files update`. A text cut at 200,000 characters, or one extracted from a PDF, `.docx` or `.xlsx`, has no `sha256`.

### Changed — may break callers

- **`files update` writes a file's text now; its metadata change moved to `api drive-files-update`.** `files update
  FILE_ID --body '{"name":"Renamed"}'` is now `api drive-files-update --file-id FILE_ID --body '{"name":"Renamed"}'`,
  with the same permission keys (`api.drive.files.update`, `files.update`). `files restore FILE_ID` with no version
  still takes a file out of the trash.
