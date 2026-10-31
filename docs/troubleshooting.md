# Fix a connection or missing result

Recover when Drive is unavailable, Google rejects sign-in or a saved document cannot be found.
Start with the symptom below, check the relevant step and verify the result before retrying a
larger import or changing permissions. Keep the error code and profile name for a support request.

| Symptom | What to do |
| --- | --- |
| Not sure what is set up | Run `drive doctor`: version, every problem in the settings file with the command that fixes it, a settings file or folder other users can read with the `chmod` that fixes it, the profiles here, the OAuth client and the paths. It needs no profile and reads no keyring or store. `drive session list` shows each profile's selected folders and where its sign-in is kept. |
| A command failed earlier and you need what it did | Run `drive runs list status:failed`, then `drive runs show <run-id>`: the Google calls it made, their status and timing, and its error code. No profile is needed; document names, ids and text are never kept. |
| `drive` is not found | Reopen the terminal/agent; check the npm global executable directory is on PATH and repeat [installation](installation.md). |
| Google blocks sign-in | Check the displayed Google error and Workspace policy. With your own client, also check enabled APIs, consent setup and test users. |
| `google-api.disabled` | The OAuth project's owner must enable the requested API; see [API setup](#google-api-is-disabled). Reconnecting or granting write access does not enable it. |
| Sign-in expired | Run `drive personal session start` again. Add `--client-file` only for your own application. External Testing grants usually expire after seven days. |
| "could not reach the OS keyring" | The keyring is locked or not running. Sign-in still works: drive keeps it in a private file and answers `storage: "file"`. Unlock the keyring and sign in again to move it back. |
| `sign-in.not-saved` | The private credentials file cannot be read. Move it aside and sign in again. |
| Search is empty | Run `status`, check selected roots with `folders list`, then `sync`. Try a known word with `search --exact`. |
| A file was skipped | Check its type and download permission. Docs, Sheets and uploaded Markdown/TXT, PDF, `.docx`, `.xlsx` and CSV are imported; scanned PDFs, Slides and shortcuts are not. |
| Sync stopped with errors | Repeat sync; pending work resumes. Read the report rather than treating a partial import as complete. |
| Semantic search reports a missing model | Prepare the shared model cache as described in [search](search.md#search-by-meaning), or use `--exact`. |
| Another tool says the store was written by a newer version | Run `<tool> upgrade` for that tool; see [below](#another-tool-says-the-store-was-written-by-a-newer-version). |
| A link target cannot be found | Use a reference from the selected database. Check that every tool uses the same MESSAGING_STORE override before linking to messenger people/projects. |

```sh
drive doctor --json
drive personal status --json
drive personal folders list --json
drive personal sync --json
drive personal search 'known word' --exact --json
```

Share the sanitized error code and command when asking for help. Do not include client JSON,
tokens or private document text. Once the expected source appears, return to [search](search.md).

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

## A published Google app still asks for sign-in

Publishing the application does not authorize your account or this computer. Run the
[account connection step](installation.md#connect-your-account) and approve access in Google's
browser screen. With WireCat's included client, ordinary users do not repeat Google Cloud setup.
A custom Desktop client remains an alternative. Google has not finished its review of WireCat's
application, so Google shows an "unverified app" warning and limits it to 100 new users in total;
see [the warning](installation.md#google-shows-an-unverified-app-warning). Workspace policy can
also restrict which accounts or permissions are available.

## Google API is disabled

The connection can be valid while an API is disabled in the application's Google Cloud project.
For example, importing Sheets through Drive's XLSX export can work while live `sheets` commands
fail. `google-api.disabled` identifies this application setup problem separately from file access
or missing OAuth permissions. It does not tell you that a particular spreadsheet exists.

With WireCat's included app, report the command and sanitized error to WireCat; users do not
need to create their own app to fix WireCat's project configuration. With your own app, select
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

Drive keeps your Drive documents in their own account in the shared store, and moves them there the first
time an up-to-date drive opens it. After that, an older WireCat tool that uses the same store, such as Memo,
stops with `the message store was written by a newer version` and asks you to upgrade it. Run `<tool> upgrade`,
for example `memo upgrade`. Your documents, tags, notes and `document:<id>` references are kept; nothing needs
to be imported again.

## The store upgrade reports existing annotations

Drive keeps the previous database when it finds tags, notes, memories, facts or links that a
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
