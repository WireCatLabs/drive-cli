### Changed — may break callers

- **Built on cli-core 0.634.0** (was 0.614.0). The store moves to version 64 on first open (people ties, stored
  person kinds, faster deal-link triggers; additive). With it, a document owner's link is filed as Drive's report.
  What changed in between is in [cli-core's changelog](https://github.com/WireCatLabs/cli-core/blob/main/CHANGELOG.md).
- **`schedule pause <name>` and `schedule resume <name>`** take a schedule off its timer and keep it; `schedule run`
  still runs it. `--at` repeats: `--at 08:30 --at 18:00` runs twice a day.
