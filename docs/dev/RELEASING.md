# Releasing

Release the compiled `@wirecat/drive-cli` package so users can run `npm install -g
@wirecat/drive-cli`. Builds belong to maintainers. Publishing requires owner authorization;
the package is already available on npm. This guide covers validation, publication and the
reviewed documentation update that follows a release.

## Validate the release

The release workflow follows MAX's package path. Full validation uses the shared WireCat CI
workflow: generation freshness, CLI/MCP contracts, prior-store upgrade contracts, secret-leak
checks, coverage, Node installed-package acceptance and Bun smoke. Shared security checks run
separately. Validation packs once; the next job verifies the SHA-256 digest before handing that
same tarball to publication. No dependencies are installed in the publishing job.

A nonpublishing rehearsal works without npm login, a trusted publisher or the `npm` environment:

```sh
gh workflow run release.yml --repo WireCatLabs/drive-cli --ref BRANCH --field dry_run=true
gh run list --repo WireCatLabs/drive-cli --workflow release.yml --limit 5
gh run watch RUN_ID --repo WireCatLabs/drive-cli --exit-status
```

The `package` artifact contains `wirecat-drive-cli-VERSION.tgz`, using package.json's version. Download
it to a temporary directory, inspect its contents and install it into an isolated npm prefix.
The dry-run job has no OIDC permission, never enters the publishing environment and never tags.
Never publish credentials, local snapshots or private plans.

## Publishing setup

Google OAuth application setup is independent of npm publication. The CLI includes WireCat's
Desktop app identity and accepts a custom `--client-file`. Packaging tests do not certify live
Google conversion fidelity.

Before publication, date the top version section in CHANGELOG.md and ensure it matches
package.json through review. Create a GitHub environment named `npm` in
[repository Settings → Environments](https://github.com/WireCatLabs/drive-cli/settings/environments).
Use the organization's npm publishing account with access to the `@wirecat` scope. If creating
a new package, follow npm's
[official scoped-public-package publication instructions](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages/)
for the initial publication. Publish the reviewed, validated tarball with `--access public`;
do not upload tokens or npm configuration to this repository.

When configuring or restoring publication, check the package's **GitHub Actions** trusted
publisher against these values:

| Field | Value |
| --- | --- |
| Organization or user | `WireCatLabs` |
| Repository | `drive-cli` |
| Workflow filename | `release.yml` |
| Environment | `npm` |
| Allowed action | Direct `npm publish` |

See npm's [official trusted publishing guide](https://docs.npmjs.com/trusted-publishers/).
The initial publication of a new package needs separate publisher setup. Drive's subsequent
releases use the workflow below.

## Publish a release

Date the top version section, update package.json and complete review. From clean, up-to-date
main, `bin/release` takes the same machine-wide lock as the other WireCat CLIs and dispatches
the workflow. If another release holds the lock, wait for it to finish. Publication uses npm's short-lived GitHub
OIDC identity. It waits for the registry's exact version document before creating the tag and
GitHub release; a failed publication never creates either.

After release, verify a clean `npm install -g @wirecat/drive-cli` and `drive --version`, then
update the portal's reviewed release pin and EN/RU/ES guides. PR checks and monthly
nonpublishing validation keep their shared WireCat policies.

## Wait for another release

The machine-wide lock permits one package release at a time. By default `bin/release` refuses
when another release holds it. To join the queue for up to 30 minutes, use
`WIRECAT_RELEASE_WAIT_SECONDS=1800 bin/release`. It still acquires the same lock and performs
the normal source, publication and tag checks. Do not dispatch the workflow manually.
