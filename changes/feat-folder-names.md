### Added

- **`drive <profile> folders list` names each chosen folder**, as the shared folders row of the documents CLIs
  allows. The name comes from `folders add` and is refreshed by each sync, so a rename shows after the next sync.
  A folder chosen with an older drive shows only its id until then. No `path` is given: Google Drive keeps none,
  and building one would cost a request per parent folder, often ending at a parent shared with you that you
  cannot see ([usage](../docs/usage.md)).
