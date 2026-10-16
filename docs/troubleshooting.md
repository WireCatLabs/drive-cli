# Fix a connection or missing result

Recover when Drive is unavailable, Google rejects sign-in or a saved document cannot be found.
Start with the symptom below, check the relevant step and verify the result before retrying a
larger import or changing permissions. Keep the error code and profile name for a support request.

| Symptom | What to do |
| --- | --- |
| `drive` is not found | Reopen the terminal/agent; check the npm global executable directory is on PATH and repeat [installation](installation.md). |
| Google blocks sign-in | Check the displayed Google error and Workspace policy. With your own client, also check enabled APIs, consent setup and test users. |
| Sign-in expired | Run `drive personal session start` again. Add `--client-file` only for your own application. External Testing grants usually expire after seven days. |
| No keyring is available | Reconnect with the explicit `--credential-storage file` option if private-file storage fits your setup. |
| Search is empty | Run `status`, check selected roots with `folders list`, then `sync`. Try a known word with `search --exact`. |
| A file was skipped | Check its type and download permission. Docs, Sheets and uploaded Markdown/TXT, PDF, `.docx`, `.xlsx` and CSV are imported; scanned PDFs, Slides and shortcuts are not. |
| Sync stopped with errors | Repeat sync; pending work resumes. Read the report rather than treating a partial import as complete. |
| Semantic search reports a missing model | Prepare the shared model cache as described in [search](search.md#search-by-meaning), or use `--exact`. |
| A link target cannot be found | Use a reference from the selected database. Check explicit store sharing before linking to messenger people/projects. |

```sh
drive personal status --json
drive personal folders list --json
drive personal sync --json
drive personal search 'known word' --exact --json
```

Share the sanitized error code and command when asking for help. Do not include client JSON,
tokens or private document text. Once the expected source appears, return to [search](search.md).

## “Choose a profile explicitly”

Run the command as `drive personal …` or `drive --profile personal …`, replacing `personal` with
the account name you chose. The error lists configured profile names. Neither `DRIVE_PROFILE`
nor an old saved default bypasses selection. For the first connection, follow
[sign-in](installation.md#connect-your-account). For existing profiles, `drive personal session list`
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
A custom Desktop client remains an alternative. Workspace policy and Google scope verification
can still restrict which accounts or permissions are available.

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

## The store upgrade reports existing annotations

Drive keeps the previous database when it finds tags, notes, memories, facts or links that a
rebuild would leave behind. Set `MESSAGING_STORE` to that previous database file to continue
using its annotations. Use the same override in your other WireCat tools if they should search
that data too. Do not delete the previous file or reset its checkpoint to bypass this safeguard.
Automatic annotation transfer between database files is not supported.

If the upgrade instead reports a missing snapshot, run `drive personal folders sync --rescan`
to fetch the selected folder tree again. This does not bypass the annotation safeguard.
