### Changed — may break callers

- **The document commands' answers use the shared entity names.** `folders`, `sync`, `status`, `documents
  list|show|export|context`, `search`, `catalog`, `tags`, `relationships`, `notes`, `memories`, `facts`, `identities`
  and `mirrors` now come from cli-core's shared documents commands, the same in every documents CLI. Their commands,
  options, fields and error reasons are unchanged (except `catalog.tree-limit`, below); the entity names `commands
  --json` declares change: `drive_document` → `document` (view `imported`), `document` view `drive_catalog` →
  `catalog`, `drive_document_tag` → `document_tag`, `drive_document_relationship` → `document_relationship`,
  `drive_document_identity` → `document_identity`, `drive_selected_folder` → `selected_folder`, `drive_mirror` →
  `mirror`. A caller that matched on the old names matches on the new ones.
- **`catalog tree` has no total cap.** It reads each folder's children page by page, so the `catalog.tree-limit`
  reason (over 10 000 nodes) is gone. The catalog, mirror and `export.exists` reasons are now cli-core's, and their
  messages name no provider.
