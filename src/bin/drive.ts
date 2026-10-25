#!/usr/bin/env node
import { enableCompileCache } from "node:module"
import { processStreams } from "@wirecat/cli-base"
import type { Command } from "commander"

// Compiling the program's module files is most of a start; later runs reuse what this one compiled.
enableCompileCache()
// A static import compiles before the cache is on; cli-core and the program are most of those files.
const { interactiveOf, REASONS, reportFailure } = await import("../failure.js")
const { createProgram } = await import("../program.js")
const { startCli } = await import("@wirecat/cli-core/cli")
const { DRIVE_APP } = await import("../policy.js")

let program: Command | undefined
await startCli({
  app: DRIVE_APP,
  interactive: interactiveOf,
  reasons: REASONS,
  run: async (entry) => {
    program = createProgram({
      signal: entry.signal,
      atStart: entry.atStart,
      ask: (key) => entry.ask(`Allow ${key}?`, program),
      openBrowser: (url) => entry.openBrowser(url),
    })
    await program.parseAsync(process.argv)
    return undefined
  },
  fail: (error, entry) => reportFailure(error, { args: entry.args, program, streams: processStreams, tty: entry.tty }),
})
