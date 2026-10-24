#!/usr/bin/env node
import { execFile } from "node:child_process"
import { enableCompileCache } from "node:module"
import { CliError, catchCrashes, processStreams } from "@wirecat/cli-base"
import { type Command, CommanderError } from "commander"

// Compiling the program's module files is most of a start; later runs reuse what this one compiled.
enableCompileCache()
// A static import compiles before the cache is on; cli-core and the program are most of those files.
const { interactiveOf, REASONS, reportFailure } = await import("../failure.js")
const { createProgram } = await import("../program.js")
const { readOnlyLockOf, setupAtStart } = await import("@wirecat/cli-core/cli")
const { DRIVE_APP } = await import("../policy.js")

const args = process.argv.slice(2)
const tty = process.stdout.isTTY === true
const release = catchCrashes({ cli: "drive", interactive: interactiveOf(args, tty), reasons: REASONS })
const controller = new AbortController()
const cancelled = () => controller.abort()
process.once("SIGINT", cancelled)
process.once("SIGTERM", cancelled)
// A reader that stops early (`| head`) closes the pipe: that ends the command quietly, not with a stack.
const pipeClosed = (error: NodeJS.ErrnoException) => {
  controller.abort()
  process.exitCode = error.code === "EPIPE" ? 0 : 3
}
process.stdout.on("error", pipeClosed)
let program: Command | undefined
try {
  program = createProgram({
    signal: controller.signal,
    atStart: ({ path, headless }) =>
      setupAtStart({
        command: "drive",
        env: process.env,
        path,
        headless: headless || Boolean(process.env.CI) || !tty,
        readOnlyLock: readOnlyLockOf(DRIVE_APP, process.env),
      }),
    openBrowser: (url) =>
      new Promise<void>((resolve, reject) => {
        const command =
          process.platform === "darwin" ? "open" : process.platform === "win32" ? "rundll32.exe" : "xdg-open"
        const browserArgs = process.platform === "win32" ? ["url.dll,FileProtocolHandler", url] : [url]
        execFile(command, browserArgs, { timeout: 10000, windowsHide: true }, (error) =>
          error ? reject(new CliError("configuration_error", "open the printed Google sign-in URL")) : resolve(),
        )
      }),
  })
  await program.parseAsync(process.argv)
} catch (error) {
  if (error instanceof CommanderError && error.exitCode === 0) process.exitCode = 0
  else process.exitCode = reportFailure(error, { args, program, streams: processStreams, tty })
} finally {
  process.removeListener("SIGINT", cancelled)
  process.removeListener("SIGTERM", cancelled)
  release()
}
