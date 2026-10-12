#!/usr/bin/env node
import { execFile } from "node:child_process"
import { CliError, exitCodeFor, isCliError } from "@wirecat/cli-base"
import { CommanderError } from "commander"
import { createProgram } from "../program.js"

const controller = new AbortController()
const cancelled = () => controller.abort()
process.once("SIGINT", cancelled)
process.once("SIGTERM", cancelled)
try {
  await createProgram({
    signal: controller.signal,
    openBrowser: (url) =>
      new Promise<void>((resolve, reject) => {
        const command =
          process.platform === "darwin" ? "open" : process.platform === "win32" ? "rundll32.exe" : "xdg-open"
        const args = process.platform === "win32" ? ["url.dll,FileProtocolHandler", url] : [url]
        execFile(command, args, { timeout: 10000, windowsHide: true }, (error) =>
          error ? reject(new CliError("configuration_error", "open the printed Google sign-in URL")) : resolve(),
        )
      }),
  }).parseAsync(process.argv)
} catch (error) {
  if (error instanceof CommanderError) {
    if (error.exitCode === 0) process.exitCode = 0
    else {
      process.stderr.write(
        `${JSON.stringify({ error: { code: "validation_error", message: "invalid command arguments; use drive --help" } })}\n`,
      )
      process.exitCode = exitCodeFor("validation_error")
    }
  } else {
    const safe = isCliError(error)
      ? error
      : new CliError("provider_error", "operation failed; credential and provider details were not logged")
    process.stderr.write(`${JSON.stringify({ error: { code: safe.code, message: safe.message, ...safe.details } })}\n`)
    process.exitCode = exitCodeFor(safe.code)
  }
} finally {
  process.removeListener("SIGINT", cancelled)
  process.removeListener("SIGTERM", cancelled)
}
