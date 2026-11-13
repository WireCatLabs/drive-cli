#!/usr/bin/env node
import { enableCompileCache } from "node:module"
import { errorObjectOf, exitCodeOfError, processStreams, renderError } from "@wirecat/cli-base"

// Compiling the program's module files is most of a start; later runs reuse what this one compiled.
enableCompileCache()
// A static import compiles before the cache is on.
const [{ wcatStart }, { DESKTOP, DRIVE_APP }] = await Promise.all([
  import("@wirecat/cli-base/wcat/start"),
  import("../identity.js"),
])
const wcat = await wcatStart({
  command: DRIVE_APP.command,
  version: DRIVE_APP.version,
  description: DRIVE_APP.description,
  docs: DESKTOP.docs,
})
if (wcat.code !== undefined) {
  process.exitCode = wcat.code
} else {
  const [{ startCli }, { REASONS }, { interactiveOf }] = await Promise.all([
    import("@wirecat/cli-core/cli/start"),
    import("../reasons.js"),
    import("../terminal.js"),
  ])

  await startCli({
    app: DRIVE_APP,
    interactive: interactiveOf,
    reasons: REASONS,
    run: async (entry) =>
      (await import("../program.js")).run(entry.args, {
        signal: entry.signal,
        ask: (key) => entry.ask(`Allow ${key}?`),
        openBrowser: (url, command) => entry.openBrowser(url, undefined, command),
      }),
    fail: (error, entry) => {
      const object = errorObjectOf(error)
      processStreams.diagnostic(
        renderError(object, { cli: DRIVE_APP.command, interactive: interactiveOf(entry.args, entry.tty) }),
      )
      return exitCodeOfError(object)
    },
  })
}
