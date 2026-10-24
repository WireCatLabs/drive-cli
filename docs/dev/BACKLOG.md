# Backlog

Only P1 and P2, most important first. P3 and someday items are in [BACKLOG_LATER.md](BACKLOG_LATER.md). What
shipped is in [CHANGELOG.md](../../CHANGELOG.md). Long analysis lives in the private notes (cli-private), named
by path below.

## Rules

- **An id is permanent** and never reused: `DRV-n`, the next number after the highest one in either backlog file.
- **One item:** id · priority · title · where the work starts · where the details are. 1–3 lines.
- **Priority:** **P1** blocks the public launch: broken, says something untrue, install or sign-in fails, security
  · **P2** this cycle · **P3** someday (in BACKLOG_LATER.md).
- **Mark:** none — not started · 🚧 `<branch>` — taken · 🟡 — half done, the rest named · ⏸️ — deferred by the
  owner · 🚩 — waits on an owner decision.
- **Claim before code:** put `🚧 <branch>` on the line in the first push of the branch.
- **Close in the PR that ships the work:** delete the line in that PR.

## Launch blockers (P1)

- **DRV-1 · P1 · 🚩 Google's review of WireCat's shared app.** Until Google approves the restricted Drive
  permissions, every new user sees the "unverified app" screen and the app stops at 100 new users. Submit the
  data-access review, record the case, answer follow-ups; confirm Audience is In production. Owner task. Details:
  cli-private `plans/2026-10-17-google-data-access-verification.md`, [GOOGLE_OAUTH.md](GOOGLE_OAUTH.md).
- **DRV-44 · P1 · 🚧 `feat/remote-mcp-http` · Remote MCP before launch: `drive mcp --http`**, so Claude and ChatGPT on the web and phone can
  search and read the owner's Drive documents through the tunnel, as with tg and max. Owner ruling 2026-10-24 (cli-private
  journal NEED-1716, answer A). Starts at `src/mcp.ts:335` (`serveMcp`, stdio only) and `src/commands/mcp.ts`.
  tg and max already serve this: `mcp --http` logs in with a one-time access code (OAuth, token hashes per profile)
  and `--revoke` forgets every login; the user guide to copy is tg-cli `docs/remote.md`. cli-core has the pieces:
  `serveOverHttp`, `MCP_PATH` and `revokeAll` are exported from `@wirecat/cli-core/mcp` (`src/mcp/http/serve.ts`,
  `src/mcp/http/oauth.ts`; `ownerLogin` is used inside `serveOverHttp`, so the login needs no separate export). The tg
  and max wiring (`serveOverHttpUntilStopped`, the `--http`, `--port`, `--public-url`, `--revoke` flags) is in cli-core
  `src/cli/messenger/mcp-command.ts` and `src/mcp/server.ts`; it is messenger-specific and not exported, so drive
  copies the flag handling and the stop-on-Ctrl-C loop (about 60 lines) and passes its own `buildMcpServer`. **cli-core
  change: not strictly required, one small one recommended.** `publicUrlOf` and `portOf` (`src/http/public-url
 .ts`: https-only check, no path, port range) are not in any package export, so drive must copy them; exporting
  them from `@wirecat/cli-core/mcp` or `/cli` avoids a third copy. Both CLIs pin cli-core 0.406.0; cli-core main is
  0.407.0. Done when: `drive mcp --http --public-url https://<name>.ts.net` serves MCP behind the access-code login
  and prints the code; `--permission` keys and saved permissions still apply to every tool call over HTTP; `--revoke`
  works; a `docs/remote.md` page (copied from tg-cli `docs/remote.md`, drive wording) is linked from the README and
  the comparison page (cli-docs `translations/pages/drive/compare.en.md`) gains a row "MCP over HTTP" with drive ✅
  (row 16 at `:53` says only "MCP server for an agent"; `:89`
  still sends web and phone users to Claude's connector or Workspace MCP and needs the same update). Google sign-in
  and file roles stay independent of MCP permissions, as the server instructions already say.

## Next (P2)

- **DRV-8 · P2 · YAML front matter in mirrored Markdown becomes a rule and a heading in the Doc.** cli-core's
  Markdown parser lacks the front-matter extension. Work in cli-core `documents`. cli-private journal BUG-356.
- **DRV-9 · P2 · Test Google's own Markdown editing against `mirrors`** (Docs edits `.md` files natively since
  2026-10-05): what renders, comments, API access; then say in the guide when `mirrors` is not needed. cli-testing
  `performance/documents/`.
- **DRV-10 · P2 · `mirrors watch`.** Keep mirrors in sync without a manual run, on cli-core's shared server (owner:
  NEED-1620 A). First move `mirrors` and its state into cli-core (IDEA-203); Drive's change feed missed a Docs API
  edit (RISK-1601). cli-private `plans/2026-10-21-document-push-sync.md`.
- **DRV-11 · P2 · Local images in mirrored Markdown.** A local path becomes literal `![](path)` text; only
  `https://` images are inserted. `src/mirror-docs.ts`.
- **DRV-18 · P2 · 🟡 Document-only search selection through Memo.** Core has the file-only filter and Memo has
  `--source`; check the published pair end to end before writing code. cli-private `plans/2026-10-18-drive-handoff.md`.
- **DRV-29 · P2 · A shared Google sign-in package** (PKCE loopback login, keyring tokens, grants) out of
  `src/login.ts` and `src/tokens.ts`, so a future Google Meet CLI does not copy it. cli-base or a new package.
- **DRV-28 · P2 · Mark fetched document text as untrusted** in MCP and JSON output. Waiting for
  [cli-core #1883](https://github.com/WireCatLabs/cli-core/issues/1883) and a published shared output contract.
