# Data and permissions

Decide what your agent may read or change in your Google account before you connect folders with sensitive
documents. You see what each Google permission allows, what is kept on your computer, what leaves it, and how to
disconnect.

`drive` asks Google for read access only, unless you grant writes. Your documents are kept as text in the local
store on your computer, and nothing goes to a WireCat server. The [shared WireCat security
guide](https://wirecat.dev/en/docs/security) covers the protections that every tool shares.

**On this page:**

1. [Google access and command permissions](#google-access-and-command-permissions)
2. [What is stored locally](#what-is-stored-locally)
3. [What goes to other services](#what-goes-to-other-services)
4. [Disconnect or remove your local copy](#disconnect-or-remove-your-local-copy)

## Google access and command permissions

The default Google grant is account-wide `drive.readonly`. Selected folders limit ingestion;
they are not a Google-enforced permission boundary. Google file roles and organization policy
still apply. Remote editing needs the additional `--grant write` at sign-in and permission for the
command. Activity history and installed-app metadata use separate optional grants.

```sh
drive personal --read-only files get FILE_ID --json
drive personal --offline documents show DOC_ID --json
```

`--read-only` blocks local and remote mutations, including sync, tags and notes. `--offline`
blocks operations that need Google or the configured extraction provider. For an agent that may
index and organize locally but must not edit Google, use the specific permission settings in
[configuration](configuration.md#change-and-check-a-value). A CLI guard does not control actions
an agent takes outside this tool.

## What is stored locally

The bundled Desktop OAuth client ID and accompanying client secret identify WireCat's public
application. They do not grant access to an account. Google treats installed applications as
public clients that cannot keep this identity confidential; each user must grant their own
access. Account access and refresh tokens remain private and are never bundled. `session start`
picks the application in this order: `--client-file` or `--client-id`, then `DRIVE_GOOGLE_CLIENT_ID`, then the
profile's or the defaults' `google_client_id` setting, then WireCat's included identity. `drive doctor` reports
which one a profile without its own setting would use, as `oauth_client.source`: `flag`, `env`, `config` or
`constants`. A `--client-file` that other users of the computer can read is refused
(`chmod 600` it first). See [Google's native-app OAuth explanation](https://developers.google.com/identity/protocols/oauth2/native-app).

| Data | Location and protection |
| --- | --- |
| Google sign-in tokens | Operating-system keyring; `credentials.json` (mode 600) in the configuration directory when the keyring fails or `--credential-storage file` was chosen |
| Profiles and selected roots | `config.json` in the configuration directory |
| Source text, chunks, vectors and local context | The shared WireCat database, selected by `MESSAGING_STORE` |
| Source snapshots and folder ancestry | Profile documents and sync state in the data directory |
| Extra Markdown exports | The path you request; export refuses to overwrite an existing file |

Local copies contain document text and personal metadata. Private file permissions limit access;
they do not encrypt the database or protect an unlocked computer from its owner’s processes.
Use device and backup encryption when the material requires it. See
[storage locations](configuration.md#where-the-files-live).

## What goes to other services

Sync and live commands send requests directly to Google from this computer. Local keyword search
and local embeddings do not send document text to an AI provider. Explicit memory extraction
sends selected cached text to the provider you configured; it previews proposals before saving.
A terminal or MCP agent may send tool results to its own provider separately.

Local tags, notes and memories do not edit a Google document or notify its editors. Imported
owner and last-editor identities are observations, not a complete audit of every contributor.
See the [Privacy Policy](https://wirecat.dev/en/privacy) for Google-data handling and Limited Use.

## Disconnect or remove your local copy

```sh
drive personal session end
```

This removes the profile's local sign-in credentials and retains settings and cached documents.
A run with moved folders (`DRIVE_CONFIG_DIR` and the other `DRIVE_*_DIR` variables, or a different `HOME` or XDG
folder) uses your own sign-in but never removes it: there `session end` answers `ended: false` with a `why`
that says so, and removes only a sign-in made in that run.
To remove one account and keep the others, run `drive personal account remove --keep-data` (its documents stay
searchable) or `--delete-data`. It signs the profile out first. Add `--dry-run` to see what it would remove.
Remove the application from [Google Account connections](https://myaccount.google.com/connections)
to revoke its Google access. A folder you remove leaves search after the next sync; your own notes, memories,
exports and backups can remain.

To remove all local data, first identify the configured directories and database. Do not delete
a store shared with other tools unless you intend to delete their data as well. Uninstalling the
npm package does not erase these files. Continue with [settings](configuration.md) or
[recovering a connection](troubleshooting.md).
