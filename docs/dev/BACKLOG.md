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

## Next (P2)

- **DRV-6 · P2 · 🚧 fix/command-alignment-1024 · `drive commands` puts reads under "Write" and mirrors under "Other".** `sheets info`, `sheets
  show`, `files list`, `files get` are reads; `mirrors` has no section. `SECTIONS` in `src/first-screen.ts`
  sets one section per group; read leaves need their own.
- **DRV-7 · P2 · 🚧 fix/command-alignment-1024 · 🚩 Raw-write flags vs CLAUDE.md.** CLAUDE.md says generic mutating methods need `--allow-writes`
  and deletion `--allow-delete`; generated `api <method>` commands use permission levels instead, and over MCP `ask`
  counts as allow. Align the code or the rule. `src/program.ts` preAction; cli-private journal SEC-78.
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
- **DRV-12 · P2 · 🚧 fix/command-alignment-1024 · Write answers carry `operation_id`** (WC-OUT-10). Friendly and generated writes print Google's
  response; the id stays in the journal. `src/commands/remote.ts`, `src/program.ts`.
- **DRV-13 · P2 · MCP surface from the command tree** (WC-CMD-18/21, WC-MCP-3): `mcp: false`, `lifetime` and
  `cooperative` declared on commands instead of a name list; snake_case tool arguments. `src/mcp.ts`.
- **DRV-14 · P2 · 🚧 fix/command-alignment-1024 · Refuse the old `read_only` setting; let `ask` ask at a terminal** (WC-PERM-1, WC-PERM-9).
  `src/config.ts:13`, `src/bin/drive.ts`.
- **DRV-18 · P2 · 🟡 Document-only search selection through Memo.** Core has the file-only filter and Memo has
  `--source`; check the published pair end to end before writing code. cli-private `plans/2026-10-18-drive-handoff.md`.
- **DRV-29 · P2 · A shared Google sign-in package** (PKCE loopback login, keyring tokens, grants) out of
  `src/login.ts` and `src/tokens.ts`, so a future Google Meet CLI does not copy it. cli-base or a new package.
- **DRV-22 · P2 · 🚧 fix/command-alignment-1024 · Comment writes:** reply, resolve, reopen, optionally poll. The API methods exist
  (`api drive-comments-*`, `drive-replies-*`).
- **DRV-28 · P2 · Mark fetched document text as untrusted** in MCP and JSON output. cli-core output.
- **DRV-43 · P2 · MCP offers the left-out commands that are safe to offer:** `session list`, `config show`,
  `skill show`, `guide`, `documents export` into a fixed folder, and `config set`/`models set` behind a
  permission (owner, 2026-10-23: every MCP exposes every command). Per-command verdicts: cli-private
  `research/comparisons/drive.md`.
- **DRV-44 · P2 · Public compare page:** add Claude's built-in Drive connector; mark rclone's sign-in as partial,
  since rclone is retiring its shared Google app in 2026.
- **DRV-45 · P2 · The MCP recipe uses plain `drive personal mcp`,** not `--read-only` (`docs/recipes.md`).
