# Data and permissions

Choose what Drive and your agent may read or change before connecting sensitive sources.
This guide explains Google grants, local storage and command permissions so you can choose
an appropriate scope, see where data goes and disconnect without confusing sign-out with deletion.

The [shared WireCat security guide](https://wirecat.dev/en/docs/security) explains protections and
reporting that apply to every tool. This page covers Drive grants and document storage.

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
access. Account access and refresh tokens remain private and are never bundled. A custom
`--client-file` takes priority over environment application settings, which take priority over
WireCat's included identity. See [Google's native-app OAuth explanation](https://developers.google.com/identity/protocols/oauth2/native-app).

| Data | Location and protection |
| --- | --- |
| Google sign-in tokens | Operating-system keyring; private-file storage only when explicitly selected |
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
Remove the application from [Google Account connections](https://myaccount.google.com/connections)
to revoke its Google access. Removing an import root and syncing reconciles managed source
records and snapshots; separate notes, memories, exports and backups can remain.

To remove all local data, first identify the configured directories and database. Do not delete
a store shared with other tools unless you intend to delete their data as well. Uninstalling the
npm package does not erase these files. Continue with [settings](configuration.md) or
[recovering a connection](troubleshooting.md).
