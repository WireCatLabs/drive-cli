# Install and connect

Install Drive where your agent runs, sign in to the Google account you choose and check the
connection before importing documents. **Drive is currently installed from source**; there is
no published npm package or bundled Google application identity.

## Install the tool

You need Git, Node.js 22.16+ on the 22.x line or Node.js 24+, and pnpm. Ask your terminal agent:

```text prompt
Help me install WireCat Drive from https://github.com/WireCatLabs/drive-cli.
Follow its installation guide, check Git, Node.js and pnpm, and build the tool.
Check drive --help. Ask me which Google account and folder I want to connect.
I will enter consent in my browser; do not ask me to paste tokens into chat.
```

Or open a terminal and run:

```sh
git clone https://github.com/WireCatLabs/drive-cli.git
cd drive-cli
pnpm install --frozen-lockfile
pnpm build
npm install -g .
drive --help
```

Keep the checkout: the global command uses this local installation. To update it, run `git pull`
there, then repeat install and build. On Windows, use `npm.cmd` if PowerShell blocks `npm.ps1`.

## Prepare Google sign-in

The current source installation needs a **Desktop OAuth client JSON**. This identifies the
application to Google; your own access is granted separately in the browser.

1. Create or select a project in [Google Cloud Console](https://console.cloud.google.com/).
2. Enable **Google Drive API** and **Google Docs API**.
3. Open **Google Auth platform**. Configure Branding and Audience. For an External application
   in Testing, add your Google account as a test user.
4. In Data Access, add `https://www.googleapis.com/auth/drive.readonly`.
5. In Clients, create a **Desktop app** client and download its JSON. Keep it outside repositories.

Google's [credential guide](https://developers.google.com/workspace/guides/create-credentials)
and [consent guide](https://developers.google.com/workspace/guides/configure-oauth-consent)
explain the console steps. Give your agent the local file path, not its contents.

## Connect your account

Replace the path with the downloaded file:

```sh
drive session start --client-file /path/to/desktop-client.json
drive session list --json
```

Choose your account and approve access in the browser. The result returns to the tool on the
same computer. The default stores tokens in the operating-system keyring. If a keyring is
unavailable, explicitly add `--credential-storage file` to use a private local credential file.

Use `drive --profile work session start --client-file /path/to/desktop-client.json` for another
account. Keep the profile flag on subsequent commands for that account. External Testing grants
usually expire after seven days, so reconnect when Google requires it.

Verify the account by adding a folder you recognize and checking the imported sources in
[daily use](usage.md). Signing in alone does not import your whole Drive.
