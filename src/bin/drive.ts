#!/usr/bin/env node
import { execFile } from "node:child_process"
import { CliError, catchCrashes, processStreams } from "@wirecat/cli-base"
import { type Command, CommanderError } from "commander"
import { interactiveOf, REASONS, reportFailure } from "../failure.js"
import { createProgram } from "../program.js"

const args = process.argv.slice(2)
const tty = process.stdout.isTTY === true
const release = catchCrashes({ cli: "drive", interactive: interactiveOf(args, tty), reasons: REASONS })
const controller = new AbortController()
const cancelled = () => controller.abort()
process.once("SIGINT", cancelled)
process.once("SIGTERM", cancelled)
let program: Command | undefined
try {
  program = createProgram({
    signal: controller.signal,
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
