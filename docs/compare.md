# Compared with other tools

Several open tools already connect Google Drive, Docs and Sheets to a terminal or an AI agent. This
page puts `drive` next to three of them, so you can see at a glance which tool does what and pick the
one that fits your job. The marks come from each project's own documentation; a tool may do more
than its documentation says.

The tools:

- **drive** — this tool: a command line and an MCP server for your Google account, with a local
  searchable copy of the folders you choose and two-way mirroring of local files into Docs and Sheets.
- **[gog](https://github.com/openclaw/gogcli)** — a command line for the whole of Google Workspace,
  with a large set of Docs and Sheets editing commands and an MCP server.
- **[Workspace MCP](https://github.com/taylorwilsdon/google_workspace_mcp)** — an MCP server for
  twelve Google services that you can run on your computer or host for a team.
- **[rclone](https://github.com/rclone/rclone)** — a fast file copier and sync tool for Google Drive
  and many other storage services.

✅ yes · 🟡 partly · ❌ no · ➖ not in its documentation

## Features

| Feature | drive | [gog](https://github.com/openclaw/gogcli) | [Workspace MCP](https://github.com/taylorwilsdon/google_workspace_mcp) | [rclone](https://github.com/rclone/rclone) |
|---|:-:|:-:|:-:|:-:|
| Sign in without creating your own Google Cloud project | ✅¹ | ❌ | ❌ | ✅ |
| List, copy, move and trash files | ✅ | ✅ | ✅ | ✅ |
| Upload and download any file | 🟡 | ✅ | ✅ | ✅ |
| Read a Google Doc as Markdown | ✅ | ✅ | ✅ | 🟡 |
| Turn Markdown into a formatted Google Doc | ✅ | ✅ | ✅ | ➖ |
| Update a Doc without losing comments on unchanged text | ✅ | 🟡 | ➖ | ❌ |
| Rich Docs editing: tables, styles, headers, images | 🟡 | ✅ | ✅ | ❌ |
| Read and change spreadsheet cells | ✅ | ✅ | ✅ | ❌ |
| Spreadsheet formatting, charts and validation | 🟡 | ✅ | ✅ | ❌ |
| Keep a local folder mirrored into Google | ✅ | 🟡 | ❌ | ✅ |
| Keep CSV and Excel files as native Google Sheets | ✅ | 🟡 | 🟡 | 🟡 |
| Bring edits made in Google back into local files | ✅ | ❌ | ❌ | 🟡 |
| Show a conflict part by part and let you choose a side | ✅ | ❌ | ❌ | 🟡 |
| Sync in the background | ❌ | 🟡 | ❌ | ❌ |
| A local copy you can search without connecting | ✅ | ❌ | ❌ | 🟡 |
| Search by meaning, and images by what they show | ✅ | ❌ | ❌ | ❌ |
| Text from PDF, Word and Excel files | ✅ | ➖ | ✅ | ❌ |
| Notes, tags and source-backed memories on documents | ✅ | ❌ | ❌ | ❌ |
| MCP server | ✅ | ✅ | ✅ | ❌ |
| Remote MCP with its own login | ❌ | ❌ | ✅ | ❌ |
| JSON output | ✅ | ✅ | 🟡 | 🟡 |
| Several accounts | ✅ | ✅ | ✅ | ✅ |
| Limits for an agent: read-only, allowed commands | ✅ | ✅ | ✅ | 🟡 |
| Shared Drives | 🟡 | ✅ | ✅ | ✅ |
| Comments and revision history | ✅ | ✅ | 🟡 | ❌ |
| Export to PDF, Word, Excel and CSV | 🟡 | ✅ | 🟡 | ✅ |

¹ Until Google finishes reviewing WireCat's application, Google shows an "unverified app" screen at sign-in and
admits at most 100 new users to it; you can also sign in with your own Google application. See
[installation](installation.md#google-shows-an-unverified-app-warning).

## Install and licence

| | drive | [gog](https://github.com/openclaw/gogcli) | [Workspace MCP](https://github.com/taylorwilsdon/google_workspace_mcp) | [rclone](https://github.com/rclone/rclone) |
|---|---|---|---|---|
| Install | npm (Node 22.16+ on the 22.x line, or Node 24+) | Homebrew, Go, Docker, binaries | uv, Docker, Helm | one binary, most package managers |
| Written in | TypeScript | Go | Python | Go |
| Licence | Apache-2.0 | MIT | MIT | MIT |

## When another tool fits better

- **gog** — you edit Docs and Sheets in detail from the terminal: tables, headers, smart chips, charts,
  conditional formats, comment threads, and Gmail, Calendar and the rest of Workspace in the same tool.
- **Workspace MCP** — you want Google Workspace in Claude on the web or phone, or in ChatGPT, through a
  hosted server that each person signs in to, with a large community behind it.
- **rclone** — you mostly move files: backups, migrations and large folder syncs, with deletions carried
  across, between Google Drive and other storage.
- **Google Docs itself** — Docs now opens and edits Markdown files in place, with comments, and the file
  stays Markdown. If you only need colleagues to read and comment on your Markdown, Google Drive for
  desktop may be enough.

If `drive` fits, start with [installation](installation.md); to connect an agent without a terminal,
see [the MCP server](recipes.md#use-a-local-mcp-client).
