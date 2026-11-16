### Fixed

- **A sync no longer fails because the chosen folders hold more than 10,000 entries.** It reads 10,000, saves where it
  stopped, answers `complete: false` and the next sync goes on from there (cli-core 0.673.0, was 0.666.0). One folder
  that alone holds more than 10,000 entries still stops the sync and says to choose smaller ones. The built-in
  `transcript_words` now come from cli-core, the same list its meetings use; the words are unchanged.
