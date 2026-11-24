### Fixed

- **drive marks other people's text in its own Google reads for a scheduled agent.** In a run locked read-only
  with a mark (`DRIVE_READ_ONLY=1`, `DRIVE_UNTRUSTED_MARK`), `files list|get`, `documents get`, `comments`,
  `permissions` and `revisions list|get`, `activities list`, `shared-drives`, `sheets info|show`, `transcripts list`,
  `folders browse`, `api call` and every `api <operation>` answer names, titles, descriptions, text, comments, cells and people's names between the run's markers, as
  cli-core's shared `documents`, `search` and `catalog` reads already do. Outside such a run no answer changes.
- **A `sync --rescan` removes a document Google put in the trash as deleted.** The walk of the chosen folders now
  lists trashed files and folders too, so a full walk removes such a document and its text with the reason
  `deleted`, where it used to keep it as `unavailable`. A file the walk does not find still stays `unavailable` with
  its text kept, and so does a transcript kept by `transcripts: include`. A walk stopped midway remembers the files
  it found in the trash, so the sync that resumes it removes them as deleted too.
