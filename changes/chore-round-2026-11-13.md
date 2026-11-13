### Changed — may break callers

- **Built on cli-core 0.651.0** (was 0.650.0) and cli-base 0.99.0. A stale meeting project fingerprint is now
  `conflict` (reason `meeting-project.stale`), not `configuration_error`. A mistyped profile in `DRIVE_PROFILE` lists
  the profiles here, and `session start` keeps the provider's refusal for a new profile. `doctor reports create`
  gives a pre-filled issue link. The first screen lists `pbx`, the Asterisk tool. What changed is in
  [cli-core's changelog](https://github.com/WireCatLabs/cli-core/blob/main/CHANGELOG.md).

### Security

- **`contracts/wirecat.json` lists the hosts the shared packages reach**: `registry.npmjs.org` (the update check),
  Hugging Face (`huggingface.co`, `*.huggingface.co`, `*.hf.co`) and GitHub (`github.com`,
  `*.githubusercontent.com`) for the local models. WireCat Desktop shows them before install.
