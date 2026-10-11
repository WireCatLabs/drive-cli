# Install and connect

Install the Drive command-line tool, connect a Google account and import a small folder to check
search. A **profile** is a name you choose for that account, such as `personal` or `work`; every
account command must name it. Google opens a browser for your consent, so you never paste access
tokens into the terminal or an agent conversation.

## Install the tool

The current distribution is a source checkout. You need Git, pnpm and Node.js 22.16+ on the
22.x line or Node.js 24+. Open a terminal on the computer where your agent runs:

```sh
git clone https://github.com/WireCatLabs/drive-cli.git
cd drive-cli
pnpm install --frozen-lockfile
pnpm build
npm install -g .
drive --help
```

The last command should display Drive's commands. Keep the checkout because the global command
uses it. To update, run `git pull` there and repeat installation/build. On Windows, use `npm.cmd`
if PowerShell blocks `npm.ps1`. If an agent handles installation, ask:

```text prompt
Help me install drive CLI from https://github.com/WireCatLabs/drive-cli using its installation
instructions. Check Git, Node.js and pnpm. Ask me for the profile name and Google folder.
I will approve sign-in in my browser. Do not request tokens or credential contents in chat.
```

See the [official Drive repository installation instructions](https://github.com/WireCatLabs/drive-cli/blob/main/docs/installation.md)
for source installation and updates.

## Choose how to connect

Using **WireCat's shared Google application** means users approve their own accounts in the
browser; only the application owner sets up Google Cloud. That is the intended default connection
path. The current source distribution does not bundle that client identity yet, so today you
need a Desktop client JSON supplied by the app owner or one you create yourself below.

If the owner supplied a Desktop client JSON, skip Google Cloud setup and go to
[connect your account](#connect-your-account). The JSON identifies the application; it is not a
file granting access to your account. Your browser consent creates that access separately.

## Prepare Google sign-in

This section is for the application owner or someone choosing their own OAuth client. Ordinary
users of a configured shared application do not repeat it. A Google API key or service-account
key cannot replace the Desktop OAuth client used by this sign-in flow.

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
| [Google Drive Activity API](https://console.cloud.google.com/apis/library/driveactivity.googleapis.com) | Actor/activity history | Optional `--activity`; enable it for the shared app's full feature set |

Enabling an API makes it available to the project; it does not grant any user access. Sheets,
Slides, People and Gmail APIs are not used by the current connector.

### 2. Configure the consent screen: Branding

Open **☰ → Google Auth platform → Branding**, or use
[this direct Branding link](https://console.cloud.google.com/auth/branding). Branding defines
what people see when Google asks them to approve your application.

If the platform is unconfigured, choose **Get Started**. Fill the setup screens: an application
name (for example, WireCat Drive), a support email, an **External** audience for accounts outside
your Workspace organization, and a contact email. Complete Google's policy step and create the
configuration. If it is already configured, edit the relevant fields under Branding instead.
For public launch, the shared app owner also prepares the homepage, privacy policy and authorized
domain details. Those launch details belong to the owner, not each connecting user.

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
| `https://www.googleapis.com/auth/drive` | Optional remote create/edit/manage actions with `--write` |
| `https://www.googleapis.com/auth/drive.activity.readonly` | Optional history with `--activity` |
| `https://www.googleapis.com/auth/drive.apps.readonly` | Optional installed-Drive-application metadata with `--apps` |

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

## Connect your account

Choose your profile name and replace the client-file path:

```sh
drive personal session start --client-file /absolute/path/to/wirecat-drive-desktop.json
drive personal session list --json
```

In the opened browser, choose the account you intended and review Google's requested permissions.
After approval, the callback page says the sign-in was received; the terminal reports profile
`personal` as signed in. The session list shows all configured profiles without printing tokens.
If Google says access is blocked because you are not a test user, add that exact account in
Audience and retry. A Workspace administrator can also restrict access to the application.

Tokens use the operating-system keyring. If your environment cannot use it, explicitly add
`--credential-storage file` for private-file storage. `--no-browser` prints a sign-in link you
can open yourself on the same computer. Use `drive work session start ...` to connect another
account. Neither an environment default nor a saved default selects an account automatically.

## Check your first result

Pick a small folder containing a Google Doc or Markdown/TXT file. Copy the folder URL from your
browser and replace `FOLDER_ID`:

```sh
drive personal folders add https://drive.google.com/drive/folders/FOLDER_ID
drive personal sync --json
drive personal status --json
drive personal documents list --json
drive personal search 'a word from your document' --exact --json
```

Check that the document list contains the sources you expected, the pending count is zero and
search returns a passage with its original link. Repeat sync if work remains. Signing in alone
does not import your whole Drive. Continue with [file types and local storage](usage.md) or
[task recipes](recipes.md).
