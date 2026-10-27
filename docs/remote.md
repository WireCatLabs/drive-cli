# ChatGPT, Codex or Claude in the browser

Use this page when you want an AI app that runs in the browser or on your phone, for example
ChatGPT, Codex web or Claude, to search and read your Google Drive documents. Such an app cannot
start `drive` on your computer, so you give it an internet address instead. At the end, the app is
connected to `drive` through a private HTTPS address, it can do only what your profile permits, and
you know how to stop it or take its access back.

Terms used on this page:

- **MCP** (Model Context Protocol) is the standard way an AI app calls outside tools. `drive personal mcp serve`
  is the MCP server that comes with `drive`; [use a local MCP client](recipes.md#use-a-local-mcp-client)
  covers apps on your own computer.
- **Remote connection** means the app connects from its own servers, over the internet, to the
  address you give it. `drive personal mcp serve --http` serves the same tools over HTTP on `127.0.0.1` for this.
- **HTTPS tunnel** is a program that gives a port on your computer a public HTTPS address.
  This page uses [Tailscale Funnel](https://tailscale.com/docs/features/tailscale-funnel); Cloudflare
  Tunnel also works. You do not need to buy a domain for Funnel.
- **Public URL** is that address, for example `https://laptop.tail1234.ts.net`. You pass it to
  `drive` as `--public-url`, and the app gets it with `/mcp` at the end.
- **Access code** is a one-time code that `drive` prints in your terminal. The app's login page asks
  for it, so only a person who sees that terminal can connect an app.

```text
ChatGPT / Claude ──internet──▶ Tailscale Funnel ──▶ drive personal mcp serve --http (login) ──▶ Google Drive
```

If your Tailscale connection already works, keep it; you do not need a second tunnel. The local
stdin/stdout connection keeps working as before.

## Before you start

- **Whoever logs in reads your documents.** The login needs the access code from your terminal.
  Never put a tunnel in front of `drive personal mcp serve` without `--http`: that mode has no login at all.
- **Profile permissions decide what the app may change.** `deny` and `readonly` block writes;
  `ask` and `allow` let a requested MCP write go through without a form on the server. The app's own
  approval is separate and depends on its settings. Google sign-in and file roles stay independent:
  a write also needs the write grant: reconnect with `--grant write`
  ([recipes](recipes.md), [configuration](configuration.md), [security](security.md)).
- **The computer that runs `drive` must stay on.** To use it from a phone, run all of this on a small
  server that is always on, and connect your Google account there.
- **Check that your app or workspace allows custom MCP connections.** Availability and administrator
  controls depend on the app. Follow the current [OpenAI connection guide](https://developers.openai.com/api/docs/guides/custom-mcp-server)
  or [Claude connector guide](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp).

The setup steps for each operating system have not all been tried on that system. If a step does
not work, [open an issue](https://github.com/WireCatLabs/drive-cli/issues).

## Start the tunnel and server

Install `drive` and connect your Google account first ([installation guide](installation.md)). Use the
same operating system user and profile for setup and for the MCP server.

Install [Tailscale](https://tailscale.com/download), sign in, and enable
[Funnel](https://tailscale.com/docs/features/tailscale-funnel): MagicDNS, HTTPS certificates and
Funnel permission must be enabled in your tailnet (your Tailscale network). The first Funnel
command can print an approval link.

Keep two terminal windows open. The first runs the tunnel. Copy the HTTPS origin it prints into the
second window. The origin is the address without `/mcp` or any other path. Keep an explicit public
port such as `:8443` in it.

The server listens on `127.0.0.1:8765` (`--port` changes it) and prints a one-time access code. It
never needs administrator rights; only the tunnel may need them.

On Linux, first window:

```sh
sudo tailscale funnel 8765
```

On macOS, when `tailscale` is not on PATH
([Tailscale CLI guide](https://tailscale.com/docs/reference/tailscale-cli?tab=macos)):

```sh
TAILSCALE_BE_CLI=1 /Applications/Tailscale.app/Contents/MacOS/Tailscale funnel 8765
```

On Windows, in PowerShell run as Administrator:

```powershell
& "$env:ProgramFiles\Tailscale\tailscale.exe" funnel 8765
```

Second window, as your normal user, without `sudo` (on Windows, `drive.cmd`):

```sh
drive personal mcp serve --http --port 8765 --public-url https://<device>.<network>.ts.net
```

To run `drive` beside `tg` or `max`, give each server its own local port and public HTTPS port: for
example, a second Funnel with `--https=8443 8766` and `drive personal mcp serve --http --port 8766
--public-url https://<device>.<network>.ts.net:8443`. Funnel supports public ports `443`, `8443` and
`10000` ([Funnel command reference](https://tailscale.com/docs/reference/tailscale-cli/funnel)).

### Alternative: Cloudflare Tunnel

A [named Cloudflare tunnel](https://developers.cloudflare.com/tunnel/get-started/) with a public
hostname such as `mcp.example.com` and local service `http://127.0.0.1:8765` works the same way:

```sh
drive personal mcp serve --http --port 8765 --public-url https://mcp.example.com
```

A temporary Quick Tunnel (`cloudflared tunnel --url …`) does not work:
[Quick Tunnels do not support SSE](https://developers.cloudflare.com/tunnel/get-started/quick-tunnels/),
the way the HTTP MCP server streams answers.

To keep the server running after its window closes, start it in the background instead. It answers once it listens,
with the connector address and the login code:

```sh
drive personal mcp server start --port 8765 --public-url https://<device>.<network>.ts.net
drive personal mcp server status   # running, port, connector address, the current login code, apps logged in
drive personal mcp server stop     # stops only a server that `mcp server start` started
```

One server can serve several profiles: `drive mcp serve --http --profiles work,personal`, or `--profiles all` for
every profile on this computer. Each tool call then names its profile. A list has its own login, apart from each
profile's and from `--profiles all`; `mcp server start|stop|status` and `mcp revoke` take the same `--profiles`.
With neither a profile nor `--profiles`, drive refuses and lists the profiles.

The code is kept beside the profile's token file (`mcp-http.lock`, mode 600) and renews every ten minutes; a server
started this way does not write it to its log. WireCat Desktop shows the same status under Tools → Google Drive →
MCP server.

## Connect the app

The address for the app is your tunnel origin with `/mcp` at the end, for example
`https://<device>.<network>.ts.net/mcp`. Add it as a remote MCP connector:

- **ChatGPT or Codex web:** open **Plugins**, choose **+ Add custom MCP server**, and create a
  plugin with the `/mcp` address and OAuth, as the
  [OpenAI connection guide](https://developers.openai.com/api/docs/guides/custom-mcp-server) describes. Choose
  dynamic client registration (DCR) when offered, then install the plugin before using it in a conversation.
- **Claude:** add a custom connector with this address, as described in
  [Claude custom connectors](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp).

The app opens the `drive` login page. Check the line that says where the login goes: it must be the
app you are connecting, such as `chatgpt.com` or `claude.ai`. Then type the access code from your
terminal. The code expires after ten minutes; a new code is printed after each login. Five wrong
codes lock the login page until the server restarts. The app stays logged in as long as it uses
the connection at least once every 30 days.

The server offers the same three tools as over stdio: `drive_tools_search`, `drive_read` and
`drive_write`. Retrieved document text is data, never instructions.

## Permissions for this server process

The server cannot see whether the app asked you before a call. Repeat `--permission key=level` to
tighten permissions only for this server process, for example `--permission files=readonly` or
`--permission sheets=deny`. An override only tightens: one that would loosen the profile's level is
refused. To allow more, change the profile's permissions ([configuration guide](configuration.md)).
`--read-only` refuses every change for this run.

## Stop or revoke access

Press Ctrl-C in both windows to stop the server and the tunnel. App logins survive a restart.

If you started Funnel with `--bg`, Ctrl-C does not stop that background route: check
`tailscale funnel status` and turn off only its port, for example `tailscale funnel --https=443 off`.

To log out every app for a profile, or for the server of several profiles:

```sh
drive personal mcp revoke --json
drive mcp revoke --profiles all --json
```

Those apps must log in again with a new code. This does not sign `drive` out of Google.

## If it does not work

- **The app says it cannot connect:** open
  `https://<device>.<network>.ts.net/.well-known/oauth-protected-resource/mcp` in a browser. It
  must show a short JSON. If it does not, Funnel is not running, is not enabled in your Tailscale
  network, or points at another port.
- **The login page says "Too many wrong codes":** restart `drive personal mcp serve --http`. If you did not
  type them, someone found your address: think about a new device name in Tailscale.
- **"port 8765 is in use":** another server holds it; pass another `--port` and point the tunnel at it.
- **Reading works, writing fails:** check the profile's permissions, any `--permission` overrides and
  the Google write grant. `deny` and `readonly` block writes whatever the app approves.
