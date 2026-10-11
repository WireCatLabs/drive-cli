# Fix a connection or missing result

Use this page when the tool is unavailable, Google rejects sign-in or a document is missing from
search. Check the failed step before changing accounts or widening permissions.

| Symptom | What to do |
| --- | --- |
| `drive` is not found | Reopen the terminal/agent; check the source checkout still exists and repeat [installation](installation.md). |
| Google blocks sign-in | Check the Desktop client, enabled APIs, consent setup and test-user account. Use the account added to the application. |
| Sign-in expired | Run `session start` again with your client file. External Testing grants usually expire after seven days. |
| No keyring is available | Reconnect with the explicit `--credential-storage file` option if private-file storage fits your setup. |
| Search is empty | Run `status`, check selected roots with `folders list`, then `sync`. Try a known word with `search --exact`. |
| A file was skipped | Check its type and download permission. Google Docs and uploaded Markdown/TXT are supported; PDF, Office, Sheets, Slides and shortcuts are not imported. |
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
