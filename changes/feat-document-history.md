### Added

- **Earlier versions of every synced document, and a change log** (cli-core 0.722.0, was 0.707.0, and cli-base
  0.128.0, was 0.124.0). Sync keeps a document's text, title and front matter before each change and before it
  leaves the copy. `documents history <document>` lists the versions and `--revision <n>` shows one.
  `changes --since 1d` lists what was added, changed, deleted, no longer visible or came back. Both read the local
  copy, so agents get them over MCP too ([recipes](../docs/recipes.md#see-earlier-versions-and-what-changed)).
- **`keep_versions_for_days`, 365 by default**, for a profile or `defaults`. A sync that finishes its pass drops older
  versions and change log rows ([configuration](../docs/configuration.md#saved-settings)).

### Changed — may break callers

- **`documents history` reads the local versions now, and Google's own history moved.** Google's revisions are
  `revisions list <file>`, as before. Who did what is `activities list <file>`, which was `documents history --activity`.
  The permission key of that Google read is `activities.list`, which was `documents.history`. A config that set
  `permissions.documents.history` for the Google read sets `permissions.activities.list` instead.

### Fixed

- **A file Google stops showing keeps its text.** A removal in Google's change feed, a 404 or lost access marks the
  document no longer visible: it leaves lists and search, keeps its text, and comes back as it was. Only a file in the
  trash counts as deleted. Before, sync blanked the text in both cases.
