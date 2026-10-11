# Browser sign-in and live validation

Register one Google Cloud application for all CLI users. The CLI opens Google consent in each
user's browser and receives the result on a temporary local callback port. Every user grants
their own access; each installation stores its own refresh token. Users do not need their own
Cloud project or client JSON once our registered client identity is included in the release.
An API key or service-account key does not supply this user sign-in flow.

## Create the application credentials

1. Select a project in [Google Cloud Console](https://console.cloud.google.com/).
2. Enable **Google Drive API** and **Google Docs API** in APIs & Services > Library.
3. Configure Google Auth platform > Branding with the application name and support details.
4. For a personal Google account, choose External in Audience and add your account as a test
   user while the application is in Testing. Workspace-only applications can use Internal when
   the organization permits it.
5. In Data Access, configure the scope `https://www.googleapis.com/auth/drive.readonly`.
6. In Clients, select Create Client, choose **Desktop app**, and download its JSON.
7. Keep that file outside the repository. Give the agent only its local path.

Suggested initial settings:

| Console field | Value |
| --- | --- |
| Project name | WireCat Drive |
| App name | WireCat Drive |
| User support email | A monitored support address that the console permits you to select. |
| Developer contact email | A monitored owner/team address. |
| Audience | External, so users outside our Workspace organization can connect. |
| Initial publishing status | Testing, with your own account added as a test user. |
| Scope | `https://www.googleapis.com/auth/drive.readonly` |
| Client application type | Desktop app |
| Client name | WireCat Drive CLI |

See Google's [credential setup guide](https://developers.google.com/workspace/guides/create-credentials)
[consent configuration guide](https://developers.google.com/workspace/guides/configure-oauth-consent)
and [Desktop OAuth guide](https://developers.google.com/identity/protocols/oauth2/native-app).
The Desktop flow supports a loopback callback with a dynamic port; a hosted callback service is
not needed for this CLI. An eventual hosted connector needs its own Web application OAuth setup.

The grant permits account-wide reading. Folder selection controls what the CLI ingests locally;
Google does not restrict this grant to those folders. Public distribution and verification are
separate from this development setup. External Testing grants normally expire after seven days;
see Google's [testing limits](https://developers.google.com/identity/protocols/oauth2#expiration).

## Make the same application available to users

After the isolated validation passes, prepare the shared application for public use:

1. Publish an application homepage and privacy policy on a domain we control. The homepage
   should explain folder sync, local Markdown and search, and link to the policy. Disclose what
   Google data is read, where documents and tokens are stored, how embeddings are used, any
   sharing, and how users remove cached data and revoke access. Describe the delivered behavior:
   `session end` currently removes local credentials while retaining cached documents.
2. In Branding, enter those URLs and add the domain to Authorized domains. Verify ownership
   through Google Search Console using an account with Owner or Editor access to the project.
3. Include the registered Desktop client identity in our release configuration. Google's Desktop
   client identity is distributed with the application; it is not a server-side credential. User
   access/refresh tokens remain private. The current development build still needs `--client-file`
   or environment settings until we add the registered identity. Send its file path after creation.
4. Record a demonstration showing browser consent, folder selection, sync and search. Explain
   why recursive folder sync and discovering newly added documents require this scope. Google's
   narrower `drive.file` permission grants individual file access; it is not a drop-in substitute
   for the current folder connector.
5. Follow Branding's verification/publishing flow, then submit the data-access review in
   Verification Center. Set Audience to In production for the public launch. Production status
   alone does not mean Google has approved the restricted scope.
6. Confirm the approved application works with an account outside the test-user list before
   announcing general availability. Monitor API quotas and the configured contact addresses.

`drive.readonly` is a restricted scope. Public use requires the corresponding Google review.
Google lists backup/sync among the permitted Drive application categories; our application must
still demonstrate its actual use. See the [Drive scope requirements](https://developers.google.com/workspace/drive/api/guides/api-specific-auth).

Our present CLI stores documents and embeddings locally. If a later hosted connector processes
restricted data through our servers, Google requires an additional security assessment. Disclose
the actual deployment and data flow; Google determines the review requirements. See
[restricted-scope verification](https://developers.google.com/identity/protocols/oauth2/production-readiness/restricted-scope-verification)
and [brand verification](https://developers.google.com/identity/protocols/oauth2/production-readiness/brand-verification).

For a hosted connector, create a separate **Web application** client within the same application
project and configure its exact HTTPS callback URL. Keep that client's secret on the server.
The Desktop client above is for a CLI running on the user's computer, where the browser can
reach its loopback listener. A CLI on a remote server needs an appropriate callback arrangement.

The intended released user flow is:

```sh
drive session start
drive folders add https://drive.google.com/drive/folders/FOLDER_ID
drive sync
drive search 'project decision'
```

Only the application owner performs Google Cloud setup. Each user chooses their own Google
account, grants consent and selects folders.

## Use a separate validation environment

Run the following in the drive-cli checkout. These variables apply to the current shell. A fresh
directory keeps this run's configuration, checkpoints and database separate from existing data.

```sh
drive_validation_dir=$(mktemp -d /tmp/drive-cli-validation.XXXXXX)
chmod 700 "$drive_validation_dir"
export DRIVE_CONFIG_DIR="$drive_validation_dir/config"
export DRIVE_STATE_DIR="$drive_validation_dir/state"
export DRIVE_CACHE_DIR="$drive_validation_dir/cache"
export DRIVE_STORE="$drive_validation_dir/drive.db"
pnpm build
bin/drive --profile validation session start --client-file /path/to/desktop-client.json
```

Complete consent in the browser. The default credential backend is the OS keyring. If the
environment cannot use it, explicitly opt into private-file storage with
`--credential-storage file` on `session start`. The CLI does not make that choice automatically.
Retain the same shell and directory for follow-up commands. Retain the directory until cleanup
is requested; it contains the documents selected for this run.

## Validate a small selected folder

Choose a disposable folder containing synthetic documents. Include a Google Doc with two tabs,
a nested tab, a heading, a table and a footnote; give each tab a distinct searchable phrase.
Include a nested folder and two documents with the same title. Prepare and edit these fixtures
in Google Drive itself: the CLI's remote operations are read-only.

```sh
bin/drive --profile validation folders add https://drive.google.com/drive/folders/FOLDER_ID
bin/drive --profile validation sync --json
bin/drive --profile validation status --json
bin/drive --profile validation documents list --json
bin/drive --profile validation documents show DOC_ID --json
bin/drive --profile validation documents export DOC_ID --out "$drive_validation_dir/export.md"
bin/drive --profile validation search 'unique tab phrase' --exact --json
```

The commands above run without downloading an embedding model. Inspect the native Markdown
separately from the tab text: Google's export formatting and the CLI's all-tab search extraction
have different acceptance criteria.

| Check | Expected result |
| --- | --- |
| Initial import | Selected folder and its nested documents appear; duplicate titles keep distinct IDs. |
| Tab coverage | Every tab phrase appears in document text and exact search. |
| Markdown | Headings, lists and tables remain useful; record any formatting or tab omissions. |
| Repeat sync | No duplicate search documents or changed source identities. |
| Edit and rename in Drive, then sync | Updated content and title keep the same document ID. |
| Move out of the folder, then sync | Document leaves local search and snapshots. |
| Move back into the folder, then sync | Document returns to the selected scope. |
| Interrupt a sync, then run it again | Pending work resumes without losing the change checkpoint. |
| Remove the selected folder locally, then sync | Its documents leave the local cache; remote files remain. |

Record counts, document IDs and pass/fail outcomes in cli-private. Keep document bodies and
credential values out of logs, public fixtures and Git commits. Automated tests continue to use
synthetic sources and temporary stores; this manual check supplies the live Google evidence.

## Validate embeddings after exact search

Use an already prepared shared text-model cache, then run `sync --embed` and search for a
paraphrase of a document phrase without `--exact`. Follow the model setup instructions in the
[README](../../README.md#search-and-export). A missing model is a setup result, not a successful
semantic search check. Sharing an existing messenger database remains deferred until shared
package versions align.
