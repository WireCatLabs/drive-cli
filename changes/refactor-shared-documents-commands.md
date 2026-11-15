### Changed — may break callers

- **cli-core 0.666.0**, which carries the shared documents commands, and **cli-base 0.101.0**, which it is built on.
  `runs list` help no longer prints the defaults of `--limit` and `--page`.
- **The document commands come from cli-core and use the shared entity names.** `folders`, `sync`, `status`,
  `documents list|show|export|context`, `search`, `catalog`, `tags`, `relationships`, `notes`, `memories`, `facts`,
  `identities` and `mirrors` are cli-core's shared documents commands, the same in every documents CLI. Their
  commands, options and arguments are unchanged. The entity names `commands --json` declares change: `drive_document`
  → `document` (view `imported`), `document` view `drive_catalog` → `catalog`, `drive_document_tag` → `document_tag`,
  `drive_document_relationship` → `document_relationship`, `drive_document_identity` → `document_identity`,
  `drive_selected_folder` → `selected_folder`, `drive_mirror` → `mirror`. A caller that matched on the old names
  matches on the new ones.
- **`identities list` answers `remote_id` and `provider` instead of `google_id`.** The query term is `remote_id:<id>`,
  and `provider` is `google-drive`. Every documents CLI answers the same fields.
- **`catalog tree` reads only the folder it shows.** It still fails with `catalog.tree-limit` over 10 000 entries, and
  the error now says to name a smaller folder or lower `--depth`. An entry in two folders is shown in full once and
  marked `repeated: true` at its other place, where it used to be shown in full each time.
- **The catalog, mirror, `export.exists` and `listing.too-large` reasons are cli-core's**, and their messages name no
  provider.
- **`commands info --json` loses the `notes` and `search` override entries**: those commands are cli-core's shared
  ones now, not drive's customized messenger commands.
