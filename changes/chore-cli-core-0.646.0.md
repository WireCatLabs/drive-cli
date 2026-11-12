### Changed — may break callers

- **Built on cli-core 0.646.0** (was 0.634.0). The store moves to version 66 on first open (a person's kind and name
  order are worked out again; additive). `doctor reports show` and `doctor reports create` write a problem report to
  send. What changed is in [cli-core's changelog](https://github.com/WireCatLabs/cli-core/blob/main/CHANGELOG.md).
