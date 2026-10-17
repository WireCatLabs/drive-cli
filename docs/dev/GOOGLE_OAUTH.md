# Browser sign-in and live validation

The released CLI includes WireCat's registered Desktop client identity. Users run
`drive <profile> session start`, choose their own Google account in the browser and grant access;
each installation stores its own refresh token. They do not need a Cloud project or client JSON.
An API key or service-account key does not supply this user sign-in flow.

This maintainer guide covers our application configuration, optional user-owned clients and
controlled live validation. Ordinary users should follow [Connect your account](../installation.md#connect-your-account).

For a click-by-click console walkthrough, use [installation](../installation.md#prepare-google-sign-in).

## Create the application credentials

1. Select a project in [Google Cloud Console](https://console.cloud.google.com/).
2. Enable **Google Drive API**, **Google Docs API**, **Google Sheets API** and **Google Drive Activity API** in APIs & Services > Library.
3. Configure Google Auth platform > Branding with the application name and support details.
4. For a personal Google account, choose External in Audience and add your account as a test
   user while the application is in Testing. Workspace-only applications can use Internal when
   the organization permits it.
5. In Data Access, configure the scope `https://www.googleapis.com/auth/drive.readonly`.
   Optional write actions use `https://www.googleapis.com/auth/drive`; activity history uses
   `https://www.googleapis.com/auth/drive.activity.readonly` and requires enabling Drive Activity API.
   Installed-app API methods use `https://www.googleapis.com/auth/drive.apps.readonly`.
   Declare scopes for every feature the shared app offers, including optional grants. Sheets commands
   reuse Drive read/write grants; enabling Sheets API does not require a new OAuth scope.
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
   access/refresh tokens remain private. The released CLI already includes WireCat's Desktop
   identity; `--client-file` or explicit environment settings override it for a user-owned app.
   Distributing the identity does not establish Google approval or outside-test-user access.
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

The CLI stores documents and embeddings locally. Optional AI memory extraction sends selected
text to the configured model endpoint. Include that flow in the privacy policy and verification
submission. Server or third-party processing of restricted data requires a security assessment;
disclose the actual deployment and data flow so Google can determine the review requirements. See
[restricted-scope verification](https://developers.google.com/identity/protocols/oauth2/production-readiness/restricted-scope-verification)
and [brand verification](https://developers.google.com/identity/protocols/oauth2/production-readiness/brand-verification).

For a hosted connector, create a separate **Web application** client within the same application
project and configure its exact HTTPS callback URL. Keep that client's secret on the server.
The Desktop client above is for a CLI running on the user's computer, where the browser can
reach its loopback listener. A CLI on a remote server needs an appropriate callback arrangement.

The intended released user flow is:

```sh
drive personal session start
drive personal folders add https://drive.google.com/drive/folders/FOLDER_ID
drive personal sync
drive personal search 'project decision'
```

Only the application owner performs Google Cloud setup. Each user chooses their own Google
account, grants consent and selects folders.

## Use a separate validation environment

Use the [controlled Google acceptance guide](https://github.com/WireCatLabs/cli-testing/blob/main/performance/documents/offline-catalog/live-checklist.md)
in cli-testing. It owns fixture preparation, exact installed-package checks, private manifests,
workspace setup and the mutation matrix, so those instructions do not drift between repositories.
The checker needs no source build and does not choose a Google account or start login automatically.

The owner selects a dedicated test account and explicit profile. Keep HOME, config, state,
database, cache and model paths separate from the owner's existing data. Do not reuse a personal
profile. Synthetic guard and installed-package checks run without credentials; real Google checks
require owner-started sign-in. Local fixture state and reports remain available until cleanup is requested.

<a id="validate-a-small-selected-folder"></a>

The checker covers the selected root, folder ancestry, cached text/tabs, exact search, Markdown
markers, retired sources and stable references. Optional local annotations check tag/note retention;
explicit refresh checks sync idempotency. It never changes Google files. Make synthetic fixture
edits, moves and trash actions in Google's UI, then record the new expected manifest and compare
with a prior private report. Interrupted sync, identity links and memory staleness remain separate
manual cases in that guide.

Check shared-app sign-in and an optional user-owned Desktop client in separate new workspaces.
Record outside-test-user consent, token refresh/revocation and app verification independently;
a passing fixture or an existing owner's login establishes none of those outcomes. Never log
credential values, Google error objects or document bodies. Keep source IDs, markers and per-file
results private, publishing only versions, totals and behavior outcomes.

## Validate embeddings after exact search

Use an already prepared shared text-model cache, then run `sync --embed` and search for a
paraphrase of a document phrase without `--exact`. Follow the model setup instructions in the
[README](../../README.md#search-and-export). A missing model is a setup result, not a successful
semantic search check. The default database is shared with other WireCat tools; live acceptance must still use its own
isolated `MESSAGING_STORE` so it cannot change the owner’s existing data.
