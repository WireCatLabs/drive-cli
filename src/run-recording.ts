import { AsyncLocalStorage } from "node:async_hooks"
import type { RenderFormat, Streams } from "@wirecat/cli-base"
import {
  KEEP_RUNS_FOR_DAYS,
  type Recording,
  type RequestEvent,
  startRecording,
  wasSettled,
} from "@wirecat/cli-core/cli"
import type { Command } from "commander"
import { DRIVE_APP } from "./policy.js"

export interface RunSettings {
  record?: boolean
  keepRunsForDays?: number
}

export interface RunRecordingOptions {
  env: NodeJS.ProcessEnv
  streams: Streams
  /** Runs started for an MCP agent are named `mcp <command>`, so the owner's runs stay apart. */
  agent: boolean
  /** The selected profile, or undefined when the command has none. Never throws. */
  profile: () => string | undefined
  /** The owner's saved settings; a config that will not load gives the defaults. */
  settings: () => RunSettings
}

const sinks = new AsyncLocalStorage<(event: RequestEvent) => void>()

/** For the Google transport: lands in the current command's run, or nowhere. */
export const providerEvent = (event: RequestEvent): void => sinks.getStore()?.(event)

export const withProviderEvents = <T>(sink: (event: RequestEvent) => void, body: () => T): T => sinks.run(sink, body)

const pathOf = (command: Command): string[] => {
  const path: string[] = []
  for (let at: Command | null = command; at?.parent; at = at.parent) path.unshift(at.name())
  return path
}

/** `files list` from `personal files list abc --limit 5`: command words only, never an argument. */
const guessedPath = (program: Command, args: readonly string[]): string[] => {
  const words: string[] = []
  let at = program
  let skippedProfile = false
  for (const token of args) {
    if (token.startsWith("-")) continue
    const next = at.commands.find((one) => one.name() === token || one.aliases().includes(token))
    if (next) {
      words.push(token)
      at = next
    } else if (words.length === 0 && !skippedProfile) skippedProfile = true
    else break
  }
  return words
}

const isHelpExit = (error: unknown): boolean => {
  const { code, exitCode } = (error ?? {}) as { code?: unknown; exitCode?: unknown }
  return typeof code === "string" && code.startsWith("commander.") && (exitCode === 0 || code === "commander.help")
}

/**
 * Every failed command is kept as a run, and every command when `record` is on. The hook goes on before the
 * program's own checks so a refused command is named exactly; the wrapper goes on last, around the whole parse.
 */
export const runRecording = (program: Command, options: RunRecordingOptions) => {
  program
    .option("--record", "keep this run — ids and timings, never document content")
    .option("--no-record", "do not keep this run, even if it fails")
  let recording: Recording | undefined

  const start = (words: string[]): Recording | undefined => {
    if (words[0] === "runs" || words[0] === "help") return undefined
    let settings: RunSettings = {}
    try {
      settings = options.settings()
    } catch {}
    const flag = program.opts().record as boolean | undefined
    const record = flag ?? settings.record ?? false
    const format: RenderFormat = program.opts().json || program.opts().jsonl ? "json" : "pretty"
    return startRecording({
      app: DRIVE_APP,
      command: `${options.agent ? "mcp " : ""}${words.join(" ") || "drive"}`,
      profile: options.profile() ?? "",
      record,
      keepFailed: record || (flag !== false && settings.record !== false),
      trace: false,
      format,
      streams: options.streams,
      env: options.env,
      keepDays: settings.keepRunsForDays ?? KEEP_RUNS_FOR_DAYS,
    })
  }

  program.hook("preAction", (_root, action) => {
    recording = start(pathOf(action))
  })

  return {
    wrap: () => {
      const parse = program.parseAsync.bind(program)
      program.parseAsync = (argv, settings) => {
        recording = undefined
        const args = settings?.from === "user" ? (argv ?? []) : (argv ?? process.argv).slice(2)
        return withProviderEvents(
          (event) => recording?.events(event),
          async () => {
            try {
              const result = await parse(argv, settings)
              await recording?.succeed()
              return result
            } catch (error) {
              if (!isHelpExit(error) && !wasSettled(error)) {
                // A refusal before any action (a usage error, a missing profile) still gets a run.
                try {
                  await (recording ?? start(guessedPath(program, args)))?.fail(error)
                } catch {}
              }
              throw error
            }
          },
        )
      }
    },
  }
}
