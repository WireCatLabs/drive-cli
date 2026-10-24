# Roadmap

This page lists what is planned for `drive` and is not in it yet. Read it before you build a workaround for a
missing feature: it may already be on the way. The order is approximate and can change. To suggest something, open
an [issue on GitHub](https://github.com/WireCatLabs/drive-cli/issues).

## What works today

`drive` imports the Google Drive folders you choose and keeps their text on your computer: Google Docs and Sheets,
PDF, docx, xlsx, CSV and Markdown. You can search them by words and by meaning, read them offline, and add tags,
notes and memories. It also reads and edits live Google Sheets ranges, manages files, and keeps local Markdown and
CSV folders mirrored into Google Docs and Sheets, both ways, when you run `mirrors sync` or while `mirrors watch`
runs. Every command is in the
[command reference](commands.md).

## In progress

- **Google's review of WireCat's sign-in app.** Until Google finishes it, Google shows an "unverified app" screen
  and lets only 100 new users sign in with the app. See
  [what to do about the warning](installation.md#google-shows-an-unverified-app-warning).

## Next

- **A guide for mirrored folders**: how to set one up, what happens when both sides change, and what never crosses.
- **`mirrors watch` as a background service** that starts with the computer, instead of a command left running in a
  terminal.
- **Local images in mirrored Markdown**, uploaded with the document. Today only images with an `https://` link
  appear in the Doc.
- **Front matter in mirrored Markdown** kept out of the Doc's text.
- **Download and export in one command**, such as a Doc as PDF or a Sheet as CSV.

## Later

- **Replying to and resolving comments** from the command line.
- **Copying larger sets of tags, notes and memories** between stores.
- **Deleting across mirrors**, if you turn it on, with a local archive.
- **An MCP server for web and mobile agents**, in addition to the local one.

What each released version changed is in the [changelog](../CHANGELOG.md).
