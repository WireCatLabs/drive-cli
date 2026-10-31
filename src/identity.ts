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
