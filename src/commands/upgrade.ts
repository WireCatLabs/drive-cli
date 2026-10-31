import { join } from "node:path"
import { outputFor, upgradeCommand } from "@wirecat/cli-core/cli"
import { appUpdate } from "@wirecat/cli-core/update"
import type { Command } from "commander"
import { paths } from "../config.js"
import { PACKAGE } from "../identity.js"
import { DRIVE_APP, refuseUnderReadOnly } from "../policy.js"
import type { CommandContext } from "./context.js"

const update = appUpdate({
  packageName: PACKAGE,
  command: "drive",
  version: DRIVE_APP.version,
  entry: import.meta.url,
  statePath: (env) => join(paths(env).state, "update-check.json"),
  enabled: () => false,
  offVariables: ["DRIVE_NO_UPDATE_CHECK"],
})

export const installUpgradeCommand = (program: Command, { env, options }: CommandContext) => {
  program.addCommand(
    upgradeCommand(DRIVE_APP, PACKAGE, (command) => {
      const environment = options.update ?? {}
      if (!command.opts().check) refuseUnderReadOnly(env, "install a newer drive")
      return {
        ...outputFor(command),
        installer: () => update.installer(environment),
        latest: () => update.latest(environment),
        install: (argv) => update.runUpdate(argv, environment),
      }
    }),
  )
}
