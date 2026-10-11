# Releasing

Release the compiled `@wirecat/drive-cli` package so users can run `npm install -g
@wirecat/drive-cli`. Builds belong to maintainers. Publishing requires owner authorization;
the package has not had its first npm publication yet.

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

The `package` artifact contains `wirecat-drive-cli-0.1.0.tgz` for the current candidate. Download
it to a temporary directory, inspect its contents and install it into an isolated npm prefix.
The dry-run job has no OIDC permission, never enters the publishing environment and never tags.
Never publish credentials, local snapshots or private plans.

## First publication: owner setup

Google OAuth application setup is independent of npm publication. A published CLI can use the
existing `--client-file` browser sign-in path. The shared Google app and authenticated conversion
fixtures remain separate rollout tasks; packaging tests do not certify live Google fidelity.

Before publication, date the top version section in CHANGELOG.md and ensure it matches
package.json through review. Create a GitHub environment named `npm` in
[repository Settings → Environments](https://github.com/WireCatLabs/drive-cli/settings/environments).
Use the organization's npm publishing account with access to the `@wirecat` scope. Follow npm's
[official scoped-public-package publication instructions](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages/)
for the initial publication. Publish the reviewed, validated tarball with `--access public`;
do not upload tokens or npm configuration to this repository.

After the package exists, open its npm package settings and add a **GitHub Actions** trusted
publisher with these values:

| Field | Value |
| --- | --- |
| Organization or user | `WireCatLabs` |
| Repository | `drive-cli` |
| Workflow filename | `release.yml` |
| Environment | `npm` |
| Allowed action | Direct `npm publish` |

See npm's [official trusted publishing guide](https://docs.npmjs.com/trusted-publishers/).
For the initial owner publication, verify the registry's exact version document, then create
its tag and GitHub release from the approved changelog. Later releases use the workflow below.

## Later releases

Date the top version section, update package.json and complete review. From clean, up-to-date
main, `bin/release` dispatches the manual workflow. Publication uses npm's short-lived GitHub
OIDC identity. It waits for the registry's exact version document before creating the tag and
GitHub release; a failed publication never creates either.

After release, verify a clean `npm install -g @wirecat/drive-cli` and `drive --version`, then
update the portal's reviewed release pin and EN/RU/ES guides. Remove the first-publication notice
from installation and README only after npm serves the package. PR checks and monthly
nonpublishing validation keep their shared WireCat policies.
