# Roadmap

This page lists what is planned for `drive` and is not in it yet. Read it before you build a workaround for a
missing feature: it may already be on the way. The order is approximate and can change. To suggest something, open
an [issue on GitHub](https://github.com/WireCatLabs/drive-cli/issues).

## What works today

`drive` imports the Google Drive folders you choose and keeps their text on your computer: Google Docs and Sheets,
PDF, docx, xlsx, CSV and Markdown. You can search them by words and by meaning, read them offline, and add tags,
notes and memories. It also reads and edits live Google Sheets ranges, manages files, and keeps local Markdown and
CSV folders mirrored into Google Docs and Sheets, both ways, when you run `mirrors sync` or while `mirrors watch`
runs. It downloads stored files, exports Google documents as PDF, DOCX, XLSX or CSV, and replies to, resolves
and reopens comments. Its [remote MCP server](remote.md) connects browser and phone agents through your
HTTPS tunnel with an access-code login and profile permissions; the same tunnel lets `mirrors sync` put local
images into Docs. See the [mirroring guide](mirrors.md) for setup and conflict choices. Every command is in the [command reference](commands.md).

## In progress

- **Google's review of WireCat's sign-in app.** Until Google finishes it, Google shows an "unverified app" screen
  and lets only 100 new users sign in with the app. See
  [what to do about the warning](installation.md#google-shows-an-unverified-app-warning).

## Next

- **`mirrors watch` as a background service** that starts with the computer, instead of a command left running in a
  terminal.
- **Front matter in mirrored Markdown** kept out of the Doc's text.

## Later

- **Copying larger sets of tags, notes and memories** between stores.
- **Deleting across mirrors**, if you turn it on, with a local archive.

What each released version changed is in the [changelog](../CHANGELOG.md).
