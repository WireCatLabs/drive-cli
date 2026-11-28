# Fix a connection or missing result

Get `drive` working again when sign-in fails, a search finds nothing, or a file you expected is missing. Most fixes
take a minute: one command shows what is set up, and another shows what a failed command did.

**On this page:**

1. [What happened](#what-happened)
2. [How to fix it](#how-to-fix-it)
3. [Symptoms and fixes](#symptoms-and-fixes)
4. [“Name a profile”](#name-a-profile)
5. [Google Cloud setup is confusing](#google-cloud-setup-is-confusing)
6. [Google still asks you to sign in](#google-still-asks-you-to-sign-in)
7. [Google API is disabled](#google-api-is-disabled)
8. [Offline content differs from Google](#offline-content-differs-from-google)
9. [A remote write has an unknown outcome](#a-remote-write-has-an-unknown-outcome)
10. [Another tool says the store was written by a newer version](#another-tool-says-the-store-was-written-by-a-newer-version)
11. [The store upgrade reports existing annotations](#the-store-upgrade-reports-existing-annotations)
12. [Error codes](#error-codes)
13. [Check that it works, or ask for help](#check-that-it-works-or-ask-for-help)

## What happened

Usually one of three things: Google refused or ended the sign-in, the folder was not synced yet (or a file was kept
by name only), or another WireCat tool on this computer is older than `drive`.

## How to fix it

1. Run `drive doctor`. It lists every problem in your settings with the command that fixes it.
2. Run `drive personal status`. It shows the last sync, the imported documents and pending work.
3. If a command failed, `drive runs list status:failed` shows what it did.
4. Still stuck? Find your symptom in the next table, or [ask for help](#check-that-it-works-or-ask-for-help).

## Symptoms and fixes

| Symptom | What to do |
| --- | --- |
| Not sure what is set up | Run `drive doctor`: version, every problem in the settings file with the command that fixes it, a settings file or folder other users can read with the `chmod` that fixes it, the profiles here, the OAuth client and the paths. It needs no profile and reads no keyring or store. `drive session list` shows each profile and whether it is signed in here. |
| A command failed earlier and you need what it did | Run `drive runs list status:failed`, then `drive runs show` with the run id from that list: the Google calls it made, their status and timing, and its error code. No profile is needed; document names, ids and text are never kept. |
| `drive` is not found | Reopen the terminal or the agent. Check that the npm global executable folder is on PATH, and repeat [installation](installation.md). |
| Google blocks sign-in | Check the Google error on the screen and your Workspace policy. With your own client, also check the enabled APIs, the consent setup and the test users. |
| Sign-in expired | Run `drive personal session start` again. Add `--client-file` only for your own application. External Testing grants usually expire after seven days. |
| Search is empty | Run `status`, check the chosen folders with `folders list`, then `sync`. Try a known word with `search --exact`. |
| A file was skipped | Check its type and download permission. Scanned PDFs and pictures are read by OCR: install `tesseract`, or check that `read_scans` is not `off`. A scan over 20 pages, Slides and shortcuts are kept by name only. See [scans and pictures](usage.md#scans-and-pictures). |
| Sync stopped with errors | Repeat the sync; pending work resumes. Read the report rather than treating a partial import as complete. |
| Search by meaning reports a missing model | Download the shared model as described in [search](search.md#search-by-meaning), or use `--exact`. |
| Another tool says the store was written by a newer version | Run `upgrade` for that tool, for example `wcat upgrade`. See [the store section](#another-tool-says-the-store-was-written-by-a-newer-version). |
| A link target cannot be found | Use a reference from the selected database. Check that every tool uses the same MESSAGING_STORE override before linking to messenger people or projects. |

```sh
drive doctor --json
drive personal status --json
drive personal folders list --json
drive personal sync --json
drive personal search 'known word' --exact --json
```

## “Name a profile”

Run the command as `drive personal status`, replacing `personal` with the account name you chose, or set
`DRIVE_PROFILE=personal`. The error lists the profiles here. For the first connection, follow
[sign-in](installation.md#connect-your-account). For existing profiles, `drive session list`
shows all configured names.

## Google Cloud setup is confusing

Enabling an API does not create an OAuth client. Configure **Google Auth platform → Branding**,
add your account under **Audience → Test users**, then create **Clients → Desktop app** and
download its JSON. Follow the [console walkthrough](installation.md#prepare-google-sign-in).
Use a Desktop client JSON, not an API key or service-account key.

## Google still asks you to sign in

A Google application, WireCat's or your own, does not authorize your account or this computer by itself. Run the
[account connection step](installation.md#connect-your-account) and approve access in Google's browser screen. With
WireCat's included client you do not set up Google Cloud. Google may still show a warning about the app; see
[what to do](installation.md#google-shows-an-unverified-app-warning). Workspace policy can also restrict which
accounts or permissions are available.

## Google API is disabled

The connection can be valid while an API is disabled in the application's Google Cloud project.
For example, importing Sheets through Drive's XLSX export can work while live `sheets` commands
fail. `api.disabled` identifies this application setup problem separately from file access
or missing OAuth permissions. It does not tell you that a particular spreadsheet exists.

With WireCat's included app, report the command and sanitized error to WireCat; you do not
need to create your own app to fix WireCat's project configuration. With your own app, select
its project in Google Cloud Console, open **APIs & Services → Library**, find the API and press
**Enable**. For live Sheets operations, open the
[Google Sheets API page](https://console.cloud.google.com/apis/library/sheets.googleapis.com).
Check the project selector before enabling it. See Google's
[API setup instructions](https://developers.google.com/workspace/guides/enable-apis).

Allow the setting to propagate, then repeat a read such as `sheets info` against your selected
spreadsheet. Use the same explicit profile. Enabling the API does not grant file access or a
write permission, and this error alone is not a reason to reconnect with a broader grant.

## Offline content differs from Google

Check `drive personal --offline status --json` for the last sync and pending work. Cached reads
show that saved version. Run `drive personal sync --json` online to refresh it, then repeat the
same search. Live metadata, comments and history need Google access and are refused with
`--offline`; cached `documents show` is the operation for reading an imported source.

## A remote write has an unknown outcome

If a command reports an uncertain result after a timeout or interrupted response, inspect the
file in Google before repeating it. Creating a Doc or copying a file again can duplicate the
successful operation. The [command reference](commands.md) explains errors; include the sanitized
error code when asking for help rather than SDK responses or private content.

## Another tool says the store was written by a newer version

Your Drive documents are kept in their own account in the shared store. An up-to-date `drive` moves them there the
first time it opens the store. After that, an older WireCat tool that uses the same store, such as `wcat`,
stops with `the message store was written by a newer version` and asks you to upgrade it. Run `upgrade` for that tool,
for example `wcat upgrade`. Your documents, tags, notes and `document:<id>` references are kept; nothing needs
to be imported again.

## The store upgrade reports existing annotations

`drive` keeps the previous database when it finds tags, notes, memories, facts or links that a
rebuild would leave behind. Set `MESSAGING_STORE` to that previous database file to continue
using its annotations. Use the same override in your other WireCat tools if they should search
that data too. Do not delete the previous file or reset its checkpoint to bypass this safeguard.
To copy the context instead, run `drive personal status --json` to find `store.checkpoint`, then
follow [the database-copy recipe](recipes.md#keep-notes-when-changing-databases). `store check` previews
counts and conflicts without changing either file. `store import` requires that preview's fingerprint
and only updates the profile checkpoint after the copy commits. Keep the original file. Missing
project/task references need explicit bindings; differing content, identity decisions or tag aliases
must be resolved first. Interrupted unchanged copies can be retried without duplicate annotations.

A source schema older than version 2 needs an upgrade of a separate copy first; the original is never
migrated by the transfer. You can provide that upgraded copy explicitly if its document hashes still
match this profile's cache. Oversized graphs refuse without partial copying. Stop other writers to the
source while switching; this operation does not keep two databases synchronized.

If the upgrade instead reports a missing snapshot, run `drive personal sync --rescan`
to fetch the selected folder tree again. This does not bypass the annotation safeguard.

## Error codes

| Code or message | What to do |
| --- | --- |
| `api.disabled` | The OAuth project's owner must enable the requested API; see [API setup](#google-api-is-disabled). Signing in again or granting write access does not enable it. |
| "could not reach the OS keyring" | The keyring is locked or not running. Sign-in still works: `drive` keeps it in a private file and answers `storage: "file"`. Unlock the keyring and sign in again to move it back. |
| `oauth.not-saved` | The private credentials file cannot be read. Rename or move it, and sign in again. |

## Check that it works, or ask for help

Run the command that failed again, then `drive personal status`. When the document you expected appears, go back to
[search](search.md).

Still stuck? Share the error code and the command when you ask for help. Do not include client JSON, tokens or
private document text.
