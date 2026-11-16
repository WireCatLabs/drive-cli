### Fixed

- **The usage guide no longer says a catalog holds at most 10,000 entries** and asks for narrower folders. A scope of
  any size reaches it over several syncs, and the guide and README now say a sync also stops after 15 minutes in a
  terminal or 45 seconds over MCP and the next one goes on (cli-core 0.676.0, was 0.673.0; cli-base 0.104.0, was
  0.102.1).
- **A listing past 10,000 entries names the listing that is too large**: one folder (choose smaller folders) or the
  transcript search (set more specific `transcript_words`). It said the chosen folders together held too many, the
  ceiling a sync no longer has. The change-feed error no longer says `sync --rescan` works only while the folders hold
  at most 10,000 entries.
