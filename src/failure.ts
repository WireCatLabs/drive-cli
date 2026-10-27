import {
  CliError,
  errorObjectOf,
  errorRecordOf,
  exitCodeOfError,
  mcpErrorResult,
  renderError,
  type Streams,
} from "@wirecat/cli-base"
import { metaOf } from "@wirecat/cli-base/commands"
import { defineSteps, type Effects } from "@wirecat/cli-base/standards"
import { failureContext } from "@wirecat/cli-core"
import { type Command, CommanderError } from "commander"
import { REASONS } from "./reasons.js"
import { interactiveOf, optionsOf } from "./terminal.js"
import { VERSION } from "./version.js"

export { interactiveOf, REASONS }

// A Google sign-in opens a browser on the computer running drive; an agent over MCP cannot do it for the owner.
const STEPS = defineSteps([
  {
    id: "owner.sign-in",
    kind: "user_action",
    why: "the owner runs drive <profile> session start or signs in from WireCat Desktop; an agent cannot do it over MCP",
  },
])

// Commander words the cause itself: unknown command with a suggestion, missing argument, missing option.
const parseMessage = (error: CommanderError, fallback: string) =>
  error.code === "commander.help"
    ? "no command given after the profile name; list them with drive --help"
    : error.message
        .replace(/^error: /, "")
        .replace(/\s*\n\s*/g, " ")
        .trim() || fallback

const recognisable = (error: unknown, invalidArguments: string): unknown =>
  error instanceof CommanderError ? new CliError("validation_error", parseMessage(error, invalidArguments)) : error

const contextOf = (effects: Effects | undefined) => ({
  ...failureContext({ reasons: REASONS }),
  steps: STEPS,
  ...(effects ? { effects } : {}),
})

export const errorObject = (
  error: unknown,
  invalidArguments = "invalid command arguments; use drive --help",
  effects?: Effects,
) => errorObjectOf(recognisable(error, invalidArguments), contextOf(effects))

export const mcpFailure = (error: unknown, effects?: Effects) =>
  mcpErrorResult(errorObject(error, "invalid tool arguments", effects))

const commandOf = (program: Command | undefined, args: readonly string[]) => {
  const path: string[] = []
  if (!program) return { name: "drive", effects: undefined }
  let at: Command = program
  for (const arg of args) {
    const child: Command | undefined = at.commands.find((command) => command.name() === arg)
    if (!child) continue
    path.push(child.name())
    at = child
  }
  return { name: path.join(" ") || "drive", effects: path.length ? metaOf(at).effects : undefined }
}

export interface ReportOptions {
  /** The arguments after the program name. */
  args: readonly string[]
  /** To name the failed command in the `--debug` record. */
  program?: Command
  streams: Streams
  tty: boolean
}

/** One error object on stderr, `✗ message` at a terminal; returns the exit code. */
export const reportFailure = (error: unknown, { args, program, streams, tty }: ReportOptions): number => {
  const failure = recognisable(error, "invalid command arguments; use drive --help")
  const flags = optionsOf(args)
  const command = commandOf(program, flags)
  const object = errorObjectOf(failure, contextOf(command.effects))
  const record = flags.includes("--debug")
    ? errorRecordOf(failure, object, { command: command.name, service: "drive", version: VERSION })
    : undefined
  const interactive = interactiveOf(args, tty)
  streams.diagnostic(renderError(object, { cli: "drive", interactive, ...(record ? { record } : {}) }))
  return exitCodeOfError(object)
}
