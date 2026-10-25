#!/usr/bin/env node
import { enableCompileCache } from "node:module"
import { errorObjectOf, exitCodeOfError, processStreams, renderError } from "@wirecat/cli-base"
import type { Command } from "commander"

// Compiling the program's module files is most of a start; later runs reuse what this one compiled.
enableCompileCache()
// A static import compiles before the cache is on.
const [{ startCli }, { DRIVE_APP }, { REASONS }, { interactiveOf }] = await Promise.all([
  import("@wirecat/cli-core/cli/start"),
  import("../identity.js"),
  import("../reasons.js"),
  import("../terminal.js"),
])

let program: Command | undefined
let failure: typeof import("../failure.js") | undefined
await startCli({
  app: DRIVE_APP,
  interactive: interactiveOf,
  reasons: REASONS,
  run: async (entry) => {
    // The program and failure.js load cli-core's command tree, which a bare --version never needs.
    failure = await import("../failure.js")
    const { createProgram } = await import("../program.js")
    program = createProgram({
      signal: entry.signal,
      atStart: entry.atStart,
      ask: (key) => entry.ask(`Allow ${key}?`, program),
      openBrowser: (url) => entry.openBrowser(url),
    })
    await program.parseAsync(process.argv)
    return undefined
  },
  fail: (error, entry) => {
    if (failure)
      return failure.reportFailure(error, { args: entry.args, program, streams: processStreams, tty: entry.tty })
    // Only when failure.js itself could not load.
    const object = errorObjectOf(error)
    processStreams.diagnostic(
      renderError(object, { cli: DRIVE_APP.command, interactive: interactiveOf(entry.args, entry.tty) }),
    )
    return exitCodeOfError(object)
  },
})
