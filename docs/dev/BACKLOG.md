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

- **DRV-8 · P2 · YAML front matter in mirrored Markdown becomes a rule and a heading in the Doc.** cli-core's
  Markdown parser lacks the front-matter extension. Work in cli-core `documents`. cli-private journal BUG-356.
- **DRV-10 · P2 · `mirrors watch`.** Keep mirrors in sync without a manual run, on cli-core's shared server (owner:
  NEED-1620 A). First move `mirrors` and its state into cli-core (IDEA-203); Drive's change feed missed a Docs API
  edit (RISK-1601). cli-private `plans/2026-10-21-document-push-sync.md`.
- **DRV-28 · P2 · Mark fetched document text as untrusted** in MCP and JSON output. Waiting for
  [cli-core #1883](https://github.com/WireCatLabs/cli-core/issues/1883) and a published shared output contract.
