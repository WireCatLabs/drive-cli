import type { ManifestIdentity } from "@wirecat/cli-base/wcat/manifest"
import type { AppIdentity } from "@wirecat/cli-core/cli/start"
import { REASONS } from "./reasons.js"
import { VERSION } from "./version.js"

export const PACKAGE = "@wirecat/drive-cli"

/** Apart from the policy, so the bin can start without loading cli-core's command tree. */
export const DRIVE_APP: AppIdentity = {
  command: "drive",
  appName: "drive-cli",
  envPrefix: "DRIVE",
  description: "Google Drive",
  version: VERSION,
  messenger: false,
  errors: { reasons: REASONS },
}

// What `wcat` and WireCat Desktop show before the tool is installed; src/wcat.ts adds the permission keys. `hosts` is
// also the list hostFetch holds every request to: a Google host missing here fails before anything is sent.
export const DESKTOP: ManifestIdentity & { hosts: readonly string[] } = {
  ...DRIVE_APP,
  docs: "https://github.com/WireCatLabs/drive-cli#readme",
  tagline: "Your Google Drive files and Docs, searchable offline",
  syncs: "Drive files and Google Docs",
  signIn: {
    gives: "Lets your agent find and read your Google Drive files. It cannot change them.",
    asks: "Your browser opens Google: choose the account and allow read-only access to Drive.",
  },
  hosts: [
    "accounts.google.com",
    "oauth2.googleapis.com",
    "www.googleapis.com",
    "docs.googleapis.com",
    "sheets.googleapis.com",
    "driveactivity.googleapis.com",
    // Google's download guide follows redirects (`curl -L`) for file content; their target is not documented.
    "*.googleusercontent.com",
  ],
}
