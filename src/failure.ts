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
import { defineReasons, type Effects, type ErrorReason } from "@wirecat/cli-base/standards"
import { failureContext } from "@wirecat/cli-core"
import { type Command, CommanderError } from "commander"
import { VERSION } from "./version.js"

type Entry = [reason: string, code: ErrorReason["code"], message: string, details?: string[]]

const ENTRIES: Entry[] = [
  ["catalog.unavailable", "configuration_error", "the index has no shared catalog adapter"],
  ["catalog.not-found", "not_found", "the file or folder is not in the local catalog; run catalog import or sync"],
  ["catalog.depth-invalid", "validation_error", "tree depth must be between 0 and 50"],
  ["catalog.cycle", "invalid_response", "local folder ancestry contains a cycle"],
  ["catalog.tree-limit", "validation_error", "tree output exceeds 10000 nodes; choose a smaller folder"],
  ["catalog.scope-limit", "validation_error", "catalog scope exceeds 10000 entries; choose narrower roots"],
  ["api.unknown-method", "validation_error", "the Google method is not known; run drive api list"],
  ["body.unreadable", "validation_error", "the request body file could not be read"],
  ["delete.not-allowed", "permission_error", "this method permanently deletes Google data; pass --allow-delete"],
  ["document.changed", "validation_error", "the document changed while it was read; nothing was saved"],
  [
    "document.too-long",
    "validation_error",
    "the text is over {text_limit} characters; it was not imported",
    ["text_limit"],
  ],
  ["document.not-imported", "not_found", "the document is not imported in this profile; run drive sync"],
  ["export.exists", "validation_error", "the output file already exists"],
  ["export.too-large", "validation_error", "Google exports at most 10 MB of a native file"],
  ["extraction.invalid-proposals", "invalid_response", "the model's memory proposals could not be used"],
  ["extraction.text-too-long", "validation_error", "the text is too long for memory extraction"],
  ["listing.too-large", "provider_error", "the listing is over its bound; the checkpoint was kept"],
  ["oauth-client.rejected", "configuration_error", "Google rejected the OAuth client"],
  ["offline.refused", "permission_error", "this command needs Google; --offline was given"],
  ["policy.confirm", "confirmation_required", "the profile policy asks to confirm {permission}", ["permission"]],
  ["policy.denied", "permission_error", "the profile policy refuses {permission}", ["permission"]],
  ["profile.locked", "provider_unavailable", "another drive command holds this profile; retry later"],
  ["profile.not-signed-in", "authentication_error", "the profile is not signed in; run drive session start"],
  ["profile.required", "validation_error", "choose a profile: drive <profile> <command>", ["profiles"]],
  ["profile.wrong-account", "authentication_error", "the signed-in Google account does not match this profile"],
  ["sign-in.declined", "authentication_error", "the Google sign-in was declined"],
  ["sign-in.expired", "authentication_error", "the Google sign-in is no longer valid; run drive session start"],
  ["sign-in.failed", "authentication_error", "the Google sign-in did not finish; run drive session start"],
  ["sign-in.not-saved", "configuration_error", "the sign-in could not be saved in the keyring"],
  ["sign-in.scope-missing", "permission_error", "the sign-in lacks the Google permission this command needs"],
  ["source.changed", "provider_error", "the document changed during export; retry the sync"],
  ["state.invalid", "configuration_error", "the sync state cannot be used; it was not reset"],
  ["state.snapshot-missing", "not_found", "the imported copy is missing; run drive sync"],
  ["store.refused", "validation_error", "the local store refused the document text", ["store_refused_in"]],
  ["sync.partial", "provider_error", "the sync finished only in part; run it again"],
  ["write.not-allowed", "permission_error", "this method changes Google data; pass --allow-write"],
]

/** Every reason drive raises; cli-base's base reasons are known to the handler already. */
export const REASONS: ErrorReason[] = defineReasons(
  ENTRIES.map(([reason, code, message, details = []]) => ({ reason, code, message, details })),
)

const recognisable = (error: unknown, invalidArguments: string): unknown =>
  error instanceof CommanderError ? new CliError("validation_error", invalidArguments) : error

const contextOf = (effects: Effects | undefined) => ({
  ...failureContext({ reasons: REASONS }),
  ...(effects ? { effects } : {}),
})

export const errorObject = (
  error: unknown,
  invalidArguments = "invalid command arguments; use drive --help",
  effects?: Effects,
) => errorObjectOf(recognisable(error, invalidArguments), contextOf(effects))

export const mcpFailure = (error: unknown, effects?: Effects) =>
  mcpErrorResult(errorObject(error, "invalid tool arguments", effects))

const MACHINE_FLAGS = new Set(["--json", "--jsonl"])

const optionsOf = (args: readonly string[]) => {
  const end = args.indexOf("--")
  return end < 0 ? args : args.slice(0, end)
}

/** A person at a terminal who did not ask for machine output. */
export const interactiveOf = (args: readonly string[], tty: boolean) =>
  tty && !optionsOf(args).some((flag) => MACHINE_FLAGS.has(flag))

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
