# Releasing

This package is local and unpublished. First publication and a public Google OAuth application
need owner authorization. Create the repository and npm trusted publisher for release.yml and
its npm environment, then complete authenticated user fixtures. Never publish credentials,
snapshots or private plans.

The template separates build, publication and tagging. Synthetic tests, coverage, package
acceptance, Bun smoke and pinned shared security checks precede publication. Publishing uses a
tarball and OIDC, with no dependency installation in the publishing job.

Date the top version section in CHANGELOG.md and update package.json through review. From main,
bin/release dispatches the manual workflow. Its dry_run mode verifies packaging without publishing.
PR checks and monthly nonpublishing validation use shared WireCat policies.
