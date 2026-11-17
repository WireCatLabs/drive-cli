### Fixed

- **An agent that runs drive itself writes its relationships as suggestions.** drive took only a call over its own MCP
  server for an agent's, so an agent running `drive relationships add` in a terminal (Claude Code, Codex and others,
  by `CLAUDECODE` or `AI_AGENT`) wrote a confirmed link as the owner. drive now asks cli-core's shared check, as
  notion does: the link waits unconfirmed until the owner adds the same relationship or removes it. Memories and facts
  an agent writes follow the same check.
- **cli-core 0.687.0 and cli-base 0.109.0.** The profile's account is now recorded by cli-core's documents engine
  instead of drive's own copy, and a Drive folder no longer shows up in search (a hit with
  `not_read: "folder metadata only"` is gone). The start token and the root folder's read now count toward a sync's
  request budget.
