import type { KeyringStore, Renderer, RenderFormat, Streams } from "@wirecat/cli-base"
import type { Body } from "@wirecat/cli-core/cli"
import type { UpdateEnvironment } from "@wirecat/cli-core/update"
import { InvalidArgumentError } from "commander"
import type { Download } from "../download.js"
import type { Complete } from "../extraction.js"
import type { GoogleApi } from "../google-api.js"
import type { DocumentIndex, GoogleSource } from "../model.js"
import type { PolicyFlags } from "../policy.js"
import type { UploadRequest } from "../upload.js"

export interface ProgramOptions {
  mcp?: boolean
  /** The WireCat first-run questions, before a command; only the real binary passes it. */
  atStart?: (start: { path: string[]; headless: boolean }) => Promise<void>
  env?: NodeJS.ProcessEnv
  streams?: Streams
  keyring?: KeyringStore
  openBrowser?: (url: string) => Promise<void>
  source?: (profile: string) => Promise<GoogleSource>
  index?: () => Promise<DocumentIndex>
  signal?: AbortSignal
  api?: GoogleApi
  complete?: Complete
  ask?: (key: string) => Promise<boolean>
  readBody?: (path: string | number) => string
  download?: Download
  uploadRequest?: UploadRequest
  update?: UpdateEnvironment
}

export interface CommandContext {
  env: NodeJS.ProcessEnv
  streams: Streams
  options: ProgramOptions
  selected(): string
  signal(): AbortSignal | undefined
  output(body: Body): void
  print(render: (renderer: Renderer, format: RenderFormat, streams: Streams) => void): void
  source(): Promise<GoogleSource>
  withIndex<T>(fn: (index: DocumentIndex) => Promise<T>): Promise<T>
  policyFlags(): PolicyFlags & { offline?: boolean }
  /** Ctrl-C or --timeout ends this command normally: a stream that stops is a complete answer. */
  endsOnStop(): void
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
