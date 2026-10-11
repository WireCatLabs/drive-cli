# Google Drive

Bring project documents into your agent's working context. WireCat Drive is a command-line tool
that imports folders you choose from Google Drive, keeps a searchable local copy and lets you
attach tags, notes and source-backed memories to documents.

- Find decisions across Google Docs, including their tabs, with links back to the originals.
- Keep local labels and notes through document renames and updates.
- Connect documents to known people, projects and other stored sources.
- Let a terminal agent or a local MCP client use the same search and organization tools.

Supported content is Google Docs and uploaded Markdown/plain text. PDF, Office files, Sheets,
Slides and shortcuts are not imported. Folder selection includes descendants; it does not grant
Google access to just those folders. Sync reads Google; your tags and notes stay local.
Installation is from source and requires a Desktop OAuth client JSON supplied by the app owner
or created in Google Cloud. Every account command names a profile, such as `drive personal sync`.

Start with [installation and Google connection](installation.md), then
[import your first folder](usage.md). For worked requests, see [recipes](recipes.md).
