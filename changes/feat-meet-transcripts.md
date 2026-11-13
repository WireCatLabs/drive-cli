### Added

- **Google Meet transcripts and Gemini notes, wherever they sit.** `drive <profile> transcripts list` lists the
  Google Docs named like a Meet transcript or Gemini notes in your Drive and among the files shared with you (most
  live in the organizer's Drive), and imports nothing. The profile setting `transcripts` decides what sync does:
  `include` imports them like a chosen folder and keeps them up to date, `exclude` leaves them out even inside a
  chosen folder, and `skip` or unset leaves them alone. `transcript_words` replaces the words that find them.

### Changed — may break callers

- **Built on cli-core 0.652.0** (was 0.651.0). Sync takes a saved query beside the chosen folders, and a Meet
  transcript that Drive also imported is one search hit. No store change. What changed is in
  [cli-core's changelog](https://github.com/WireCatLabs/cli-core/blob/main/CHANGELOG.md).
