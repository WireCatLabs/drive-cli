# Roadmap

Check here before you build a workaround for something `drive` does not do yet: it may already be planned. The
order is approximate and can change. To suggest something, open an
[issue on GitHub](https://github.com/WireCatLabs/drive-cli/issues).

## What works today

- **A local copy of the folders you choose.** Google Docs and Sheets, PDF, Word, Excel, CSV and Markdown files are kept
  as text on your computer, and scans are read by OCR.
- **Search and notes.** Search by words or by meaning, read documents offline, and add tags, notes and memories.
- **Changes in Google.** Read and edit Google Sheets ranges, manage files, download stored files, export documents as
  PDF, DOCX, XLSX or CSV, and reply to, resolve and reopen comments.
- **Mirrors.** Local Markdown and CSV folders stay mirrored into Google Docs and Sheets, both ways, when you run
  `mirrors sync` or while `mirrors watch` runs. See the [mirroring guide](mirrors.md).
- **Agents in a browser or on a phone.** The [remote MCP server](remote.md) connects them through your HTTPS tunnel,
  with an access-code login and profile permissions.

Every command is in the [command reference](commands.md).

## Next

- **`mirrors watch` as a background service** that starts with the computer, instead of a command left running in a
  terminal.

## Later

- **Copying larger sets of tags, notes and memories** between stores.
- **Deleting across mirrors**, if you turn it on, with a local archive.

What each released version changed is in the [changelog](../CHANGELOG.md).
