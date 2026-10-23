# Install and connect

Set up Drive on the computer where you or your AI agent will use it. By the end, your Google
account is connected and a small folder is saved locally so you can search its documents.
Drive is a command-line tool: you can run it in a terminal or let an agent run it for you.

Follow three steps: [install Drive](#install-the-tool), [connect Google](#connect-your-account),
then [import and search a folder](#check-your-first-result). Already installed? Start at step 2.
Already signed in? Start at step 3.

You need a Google account with access to the folder and a Windows, macOS or Linux computer.
Use the same computer for installation, browser sign-in and your agent's commands. An agent
helping with setup needs terminal access there.

<a id="install-the-tool"></a>
<a id="install-yourself-or-ask-an-agent"></a>

## 1. Install Drive

**Choose one of the two options below.** Both install the same tool; once it works, continue to
step 2. Installing the package does not sign in to Google or download files.

### Option A: ask your agent

Copy this request to your terminal agent:

```text prompt
Use drive CLI. Install @wirecat/drive-cli from npm on this computer.
Check Node.js and npm first and help me install a supported Node.js version if needed.
Check that drive --version and drive --help work, then tell me installation is complete.
```

When the agent confirms that the command works, **skip Option B and go to
[step 2](#connect-your-account)**. Your agent can run the commands in steps 2 and 3 for you;
you choose the Google account and approve access in the browser yourself.

### Option B: install by hand

Open Terminal on macOS/Linux or PowerShell on Windows. If PowerShell blocks `npm.ps1`, use
`npm.cmd` instead of `npm` in the commands below. Check that Node.js and npm are installed:

```sh
node --version
npm --version
```

You need **Node.js 22.16+ within 22.x, or Node.js 24+**. If either command is missing or Node.js
is older, [install Node.js](https://nodejs.org/en/download), reopen the terminal and check again.
Node.js runs Drive; npm downloads and installs its package.

Install the package and check it:

```sh
npm install -g @wirecat/drive-cli
drive --version
drive --help
```

The version should print and help should show the available commands. The npm package is ready
to run; no source build is required. If `drive` is not found, reopen the terminal or agent and
try again; see
[installation troubleshooting](troubleshooting.md) if it still fails.

Once those checks work, continue to [step 2](#connect-your-account).

<a id="choose-how-to-connect"></a>
<a id="connect-your-account"></a>

## 2. Connect your account

With WireCat's Google application, you do not create a Google Cloud project or download a
credentials file. Each user authorizes their own account in the browser. Before you start, read
[Google's "unverified app" warning](#google-shows-an-unverified-app-warning).

If you prefer your own Google application, follow the [optional app setup](#prepare-google-sign-in)
first. Its final command starts sign-in with your client file, then returns you to browser approval
below. If you already have that file, go straight to the setup's [last step](#sign-in-with-your-own-client).

### Start sign-in with WireCat's app

Choose a **profile**, a local name for this account. The examples use `personal`; replace it
throughout if you prefer another name, such as `work`. Every account command names a profile.

Run this command, or ask your agent to run it. Keep its terminal process open while you approve:

```sh
drive personal session start
```

<a id="google-shows-an-unverified-app-warning"></a>

### Google shows an "unverified app" warning

Google has not finished its review of the Drive permissions that WireCat's application asks for.
Until it does, Google may show an "unverified app" screen before the permission screen. The screen
is Google's, and it says that Google has not verified the application.

- To continue, use the link on Google's screen that goes on to the application, then approve
  access as below. Do this only if you trust drive with read access to your Drive.
- If you prefer not to, or if Google blocks the sign-in, stop and use
  [your own Google application](#prepare-google-sign-in) instead.
- Google limits an unverified application to 100 new users in total. When WireCat's application
  reaches that limit, new users cannot sign in with it until Google finishes the review. Your own
  application has its own, separate limits.

See [Google's page on unverified apps](https://support.google.com/cloud/answer/7454865).

### Approve access in your browser

1. In the browser that opens, choose the Google account you want to connect.
2. Review the requested permissions and approve access. The default connection requests
   read-only access to Drive; it does not grant permission to edit Google files.
3. Wait for the browser to confirm receipt of sign-in, then return to the terminal. Login is
   complete when the command reports `signed_in: true` for `personal` and returns to the prompt.
   Browser approval alone is not the final check.

### Check the saved profile

```sh
drive personal session list --json
```

Find `personal` in the returned profiles. This lists local configuration without printing tokens;
it does not contact Google or verify that an older sign-in is still valid. The import in step 3
checks access to your selected folder. Continue to [step 3](#check-your-first-result).

If the browser does not open, repeat sign-in with `--no-browser` and open the printed link on the
same computer. If the command reports no keyring, see [connection repairs](#connection-repairs)
below. Do not paste access tokens or credential contents into an agent conversation.

<a id="check-your-first-result"></a>

## 3. Import and search a folder

Choose a small Google Drive folder with a Google Doc or Markdown/TXT file whose text you know.
This makes it easy to check that import and search work before adding more files. Sign-in alone
does not import your whole Drive.

1. **Choose the folder.** Open it in Google Drive and copy its URL from the address bar. Replace
   the example URL below with yours, then run:

   ```sh
   drive personal folders add https://drive.google.com/drive/folders/FOLDER_ID
   ```

2. **Import the selected folder and its subfolders.** Run these commands in order:

   ```sh
   drive personal sync --json
   drive personal status --json
   drive personal documents list --json
   ```

   The document list should include the file you expected, and status should show `pending: 0`.
   If work remains, run sync again. The import saves source content, metadata and folder structure
   locally; it does not edit your Google files. See [file types and storage](usage.md) for what
   each format contributes.

3. **Find a known word.** Replace `budget` with a word from the imported document:

   ```sh
   drive personal search 'budget' --exact --json
   ```

   Search should return a passage and its original source link. This first search uses the text
   saved on this computer. If it returns nothing, check the document list and pending work
   before choosing a different word; see [missing search results](troubleshooting.md).

You now have a working connection and a searchable local folder. Continue with
[recipes for your agent](recipes.md) or [reading and organizing saved documents](usage.md).
The sections below are optional setup and maintenance, not more steps in this first import.

## Connection repairs

Credentials normally use your operating system's keyring, its private password store. If it is
unavailable, add `--credential-storage file` to the sign-in command to choose private-file storage.
For a second account, repeat step 2 with another profile name, such as `work`.

If Google blocks sign-in, check its displayed error and your Workspace administrator's policy.
For your own app in Testing, ensure that account is a test user. Use
[connection troubleshooting](troubleshooting.md) for the symptom; the default app does not require
you to edit a Google Cloud project.

<a id="prepare-google-sign-in"></a>

## Optional: your own Google app

Use this only if you want the CLI to sign in through an application you control. A Google app
is the registration that asks permission; it is separate from your Google account. Its Desktop
client JSON identifies the app, while your browser approval grants account access. An API key or
service-account key cannot replace this file.

Open the steps below, or go to [sign in with your own client](#sign-in-with-your-own-client)
if you already downloaded the Desktop client JSON.

<details id="custom-google-app">
<summary>Show Google Cloud setup steps</summary>

### 1. Select the project and enable APIs

Open [Google Cloud Console](https://console.cloud.google.com/). Use the project selector in the
top bar to choose your existing project, or choose **New Project**, enter a name and create it.
Keep the same project selected for all remaining screens.

You already enabled APIs? Continue to Branding. Otherwise open **☰ → APIs & Services → Library**.
Find each API, open its page and press **Enable**. Check them under **Enabled APIs & services**:

| API | What it enables | Needed when |
| --- | --- | --- |
| [Google Drive API](https://console.cloud.google.com/apis/library/drive.googleapis.com) | Folders, files, exports, comments, revisions and permissions | Always |
| [Google Docs API](https://console.cloud.google.com/apis/library/docs.googleapis.com) | Reading all Doc tabs and creating/editing native Docs | Always |
| [Google Sheets API](https://console.cloud.google.com/apis/library/sheets.googleapis.com) | Live tab/range reads and cell/formula updates | Optional live Sheets commands; not needed for XLSX-based import |
| [Google Drive Activity API](https://console.cloud.google.com/apis/library/driveactivity.googleapis.com) | Actor/activity history | Optional `--grant activity`; enable it for the shared app's full feature set |

Enabling an API makes it available to the project; it does not grant any user access. Sheets uses the same existing Drive read/write grants. Slides, People and Gmail APIs are not used
by the current connector.

### 2. Configure the consent screen: Branding

Open **☰ → Google Auth platform → Branding**, or use
[this direct Branding link](https://console.cloud.google.com/auth/branding). Branding defines
what people see when Google asks them to approve your application.

If the platform is unconfigured, choose **Get Started**. Fill the setup screens: an application
name (for example, Personal Drive), a support email, an **External** audience for accounts outside
your Workspace organization, and a contact email. Complete Google's policy step and create the
configuration. If it is already configured, edit the relevant fields under Branding instead.
Use a name and contact details for your own app. Public distribution and Google's verification
requirements are separate from this personal setup; follow the official guide when publishing
for other users. You do not need to configure WireCat's domains or branding to connect through
its existing app.

Google's [official consent-screen walkthrough](https://developers.google.com/workspace/guides/configure-oauth-consent)
explains Branding, Audience and Data Access.

### 3. Allow your account to test

Open **Google Auth platform → Audience**
([direct link](https://console.cloud.google.com/auth/audience)). For an External application in
Testing, use **Test users → Add users**, enter the Google account you will connect and save.
Testing is enough for your initial run. Publishing for general users is a separate owner task.
Testing grants usually expire after seven days; reconnect when Google requests it.

### 4. Declare the permissions

Open **Google Auth platform → Data Access**
([direct link](https://console.cloud.google.com/auth/scopes)). Choose **Add or Remove Scopes**,
select the permissions needed below, then update/save the selection. If a permission is absent
from the table, use the manual scope entry field.

| Permission | Use in the CLI |
| --- | --- |
| `https://www.googleapis.com/auth/drive.readonly` | Default folder import and document reads |
| `https://www.googleapis.com/auth/drive` | Optional remote create/edit/manage actions with `--grant write` |
| `https://www.googleapis.com/auth/drive.activity.readonly` | Optional history with `--grant activity` |
| `https://www.googleapis.com/auth/drive.apps.readonly` | Optional installed-Drive-application metadata with `--grant apps` |

For a personal read-only test, the first scope is enough. For the shared app, declare the optional
scopes it will offer too; the CLI requests them only when their flags are selected. A separate
Docs scope is unnecessary for the current operations, which accept these Drive grants. Folder
selection limits local ingestion; the granted Google read permission covers the account's Drive.
See Google's [Drive scope reference](https://developers.google.com/workspace/drive/api/guides/api-specific-auth)
and [Docs scope reference](https://developers.google.com/workspace/docs/api/auth).

### 5. Create the Desktop client and download its JSON

Open **Google Auth platform → Clients**
([direct link](https://console.cloud.google.com/auth/clients)). Choose **Create Client**, set
**Application type → Desktop app**, give it a recognizable name and choose **Create**.

Use **Download JSON** in the created client's dialog. If you closed it, return to Clients,
open the Desktop client and use its JSON download control. The downloaded file usually has a
name beginning with `client_secret_`. Save it somewhere outside the repository and note its full
path, for example `/home/YOUR_USER/Downloads/client_secret_…json`. You can rename it to
`wirecat-drive-desktop.json` to make the path easier to use.

A Desktop client uses the CLI's temporary localhost callback; do not create a Web application
client or add a web redirect URL for this flow. See Google's
[official Desktop OAuth client instructions](https://developers.google.com/workspace/guides/create-credentials#desktop-app).
The downloaded JSON contains an `installed` application section. It is not your access token.
Give your agent only its path, not its contents.

### Sign in with your own client

Replace the path with the full path to your downloaded JSON file. Choose your profile name as
in step 2, then run:

```sh
drive personal session start --client-file /absolute/path/to/desktop-client.json
```

Return to [Connect your account](#connect-your-account) at
[Approve access in your browser](#approve-access-in-your-browser), then check the saved profile
and follow step 3. You have now used your own app instead of WireCat's app.

</details>

## Other installation options

These are alternatives to the npm install in Option B, not additional steps. If you already use
pnpm, install with:

```sh
pnpm add -g @wirecat/drive-cli
```

If you already use Bun as your package manager, install with:

```sh
bun add -g @wirecat/drive-cli
```

Then check `drive --version` and `drive --help` and continue to step 2. To inspect help without a
global installation, use `npx @wirecat/drive-cli --help`; the steps above assume a global installation.

The [official repository installation guide](https://github.com/WireCatLabs/drive-cli/blob/main/docs/installation.md)
is the source for these instructions.

## Update

To update an existing installation with the package manager that installed it:

```sh
drive upgrade --check   # only says whether a newer version exists
drive upgrade
```

`drive upgrade` runs `npm`, `pnpm` or `bun` for you; from a source checkout or `npx` it says what to run instead.

## Uninstall

Sign out of each profile first, so its token leaves the keyring:

```sh
drive personal session end
npm uninstall -g @wirecat/drive-cli   # or pnpm remove -g, or bun remove -g
rm -rf ~/.config/drive-cli ~/.local/share/drive-cli   # settings, snapshots and checkpoints (Linux paths)
```

The shared database stays. Memo, Telegram and MAX use it too, and it holds the imported documents with your
tags and notes. Delete `~/.local/share/WireCat/` only if no other tool uses it. On macOS and Windows the
folders are listed in [where files live](configuration.md#where-the-files-live).
