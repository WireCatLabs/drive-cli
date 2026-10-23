import { join } from "node:path"
import { createRenderer } from "@wirecat/cli-base"
import { upgradeCommand } from "@wirecat/cli-core/cli"
import { appUpdate } from "@wirecat/cli-core/update"
import type { Command } from "commander"
import { paths } from "../config.js"
import { DRIVE_APP, refuseUnderReadOnly } from "../policy.js"
import type { CommandContext } from "./context.js"

const PACKAGE = "@wirecat/drive-cli"

const update = appUpdate({
  packageName: PACKAGE,
  command: "drive",
  version: DRIVE_APP.version,
  entry: import.meta.url,
  statePath: (env) => join(paths(env).state, "update-check.json"),
  enabled: () => false,
  offVariables: ["DRIVE_NO_UPDATE_CHECK"],
})

export const installUpgradeCommand = (program: Command, { env, streams, options }: CommandContext) => {
  const environment = options.update ?? {}
  program.addCommand(
    upgradeCommand(DRIVE_APP, PACKAGE, (command) => {
      if (!command.opts().check) refuseUnderReadOnly(env, "install a newer drive")
      const globals = program.opts()
      const format = globals.jsonl ? "jsonl" : globals.json || !process.stdout.isTTY ? "json" : "pretty"
      return {
        renderer: createRenderer({ format, color: false, streams, quiet: globals.quiet === true }),
        format,
        streams,
        installer: () => update.installer(environment),
        latest: () => update.latest(environment),
        install: (argv) => update.runUpdate(argv, environment),
      }
    }),
  )
}
