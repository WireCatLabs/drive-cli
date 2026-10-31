import type { KeyringStore, Renderer, RenderFormat, Streams } from "@wirecat/cli-base"
import type { BaseEnvironment, Body } from "@wirecat/cli-core/cli"
import type { UpdateEnvironment } from "@wirecat/cli-core/update"
import { InvalidArgumentError } from "commander"
import type { Download } from "../download.js"
import type { Complete } from "../extraction.js"
import type { GoogleApi } from "../google-api.js"
import type { DocumentIndex, GoogleSource } from "../model.js"
import type { PolicyFlags } from "../policy.js"
import type { UploadRequest } from "../upload.js"

/** What a run hands drive beyond cli-core's environment: the owner's answer and every test's fakes. */
export interface DriveEnvironment extends BaseEnvironment {
  openBrowser?: (url: string) => Promise<void>
  source?: (profile: string) => Promise<GoogleSource>
  index?: () => Promise<DocumentIndex>
  api?: GoogleApi
  complete?: Complete
  ask?: (key: string) => Promise<boolean>
  readBody?: (path: string | number) => string
  download?: Download
  uploadRequest?: UploadRequest
  update?: UpdateEnvironment
}

/** What a command reads from the run, looked up when it runs. */
export interface RunOptions {
  /** Whether an agent runs this command over MCP. */
  readonly mcp: boolean
  readonly keyring: KeyringStore | undefined
  readonly openBrowser: ((url: string) => Promise<void>) | undefined
  readonly update: UpdateEnvironment | undefined
}

export interface CommandContext {
  env: NodeJS.ProcessEnv
  streams: Streams
  options: RunOptions
  selected(): string
  signal(): AbortSignal | undefined
  output(body: Body): void
  print(render: (renderer: Renderer, format: RenderFormat, streams: Streams) => void): void
  source(): Promise<GoogleSource>
  withIndex<T>(fn: (index: DocumentIndex) => Promise<T>): Promise<T>
  policyFlags(): PolicyFlags & { offline?: boolean }
  /** The profile typed as the first word, if any; `selected()` also reads DRIVE_PROFILE and the lock. */
  profileWord(): string | undefined
  /** Ctrl-C or --timeout ends this command normally: a stream that stops is a complete answer. Its signal says when. */
  endsOnStop(): AbortSignal | undefined
}

export const positive = (input: string) => {
  const n = Number(input)
  if (!Number.isSafeInteger(n) || n < 1) throw new InvalidArgumentError("use a positive integer")
  return n
}
export const offset = (input: string) => {
  const n = Number(input)
  if (!Number.isSafeInteger(n) || n < 0) throw new InvalidArgumentError("use a nonnegative integer")
  return n
}
