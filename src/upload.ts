import { createHash } from "node:crypto"
import { createReadStream, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs"
import { open } from "node:fs/promises"
import { basename, join, resolve } from "node:path"
import { CliError } from "@wirecat/cli-base"

/** Google's resumable upload: https://developers.google.com/workspace/drive/api/guides/manage-uploads */
const START = "https://www.googleapis.com/upload/drive/v3/files"
const FIELDS = "id,name,size,md5Checksum,mimeType,parents"
const QUANTUM = 256 * 1024
export const CHUNK_BYTES = 32 * QUANTUM

export interface UploadResponse {
  status: number
  header(name: string): string | undefined
  data: unknown
}
export type UploadRequest = (request: {
  url: string
  method: "POST" | "PUT"
  headers: Record<string, string>
  body?: Buffer | string
}) => Promise<UploadResponse>

export interface UploadInput {
  path: string
  name?: string
  parent?: string
  mime?: string
  /** Where the session URI waits between runs, so an interrupted upload continues instead of starting again. */
  stateDir: string
  request: UploadRequest
  chunkBytes?: number
  retries?: number
  sleep?: (ms: number) => Promise<void>
}
export interface UploadedFile {
  id: string
  name: string
  size: number
  md5: string
  parents: string[]
  mime_type: string
  resumed: boolean
}

interface Checkpoint {
  session_uri: string
  path: string
  size: number
  modified_ms: number
  saved_at: string
}

const md5Of = (path: string): Promise<string> =>
  new Promise((done, fail) => {
    const hash = createHash("md5")
    createReadStream(path)
      .on("data", (chunk) => hash.update(chunk))
      .on("error", fail)
      .on("end", () => done(hash.digest("hex")))
  })

/** The next byte Google wants: `Range: bytes=0-42` means 0..42 arrived; no Range means nothing did. */
const nextByte = (response: UploadResponse): number => {
  const range = /bytes=0-(\d+)/.exec(response.header("range") ?? "")
  return range ? Number(range[1]) + 1 : 0
}

const done = (status: number) => status === 200 || status === 201

export const uploadFile = async (input: UploadInput): Promise<UploadedFile> => {
  const path = resolve(input.path)
  let stat: ReturnType<typeof statSync>
  try {
    stat = statSync(path)
  } catch {
    throw new CliError("validation_error", "the file to upload could not be read", { reason: "file.unreadable" })
  }
  if (!stat.isFile())
    throw new CliError("validation_error", "upload takes one file, not a folder", { reason: "file.not-file" })
  const size = stat.size
  const name = input.name ?? basename(path)
  const chunk = input.chunkBytes ?? CHUNK_BYTES
  if (chunk % QUANTUM !== 0) throw new CliError("validation_error", "a chunk must be a multiple of 256 KiB")
  const sleep = input.sleep ?? ((ms: number) => new Promise((wake) => setTimeout(wake, ms)))
  const key = createHash("sha256")
    .update(JSON.stringify([path, size, stat.mtimeMs, name, input.parent ?? ""]))
    .digest("hex")
    .slice(0, 24)
  const checkpointPath = join(input.stateDir, "uploads", `${key}.json`)
  const readCheckpoint = (): Checkpoint | undefined => {
    try {
      return JSON.parse(readFileSync(checkpointPath, "utf8")) as Checkpoint
    } catch {
      return undefined
    }
  }
  const saveCheckpoint = (sessionUri: string) => {
    mkdirSync(join(input.stateDir, "uploads"), { recursive: true, mode: 0o700 })
    const checkpoint: Checkpoint = {
      session_uri: sessionUri,
      path,
      size,
      modified_ms: stat.mtimeMs,
      saved_at: new Date().toISOString(),
    }
    writeFileSync(checkpointPath, JSON.stringify(checkpoint), { mode: 0o600 })
  }
  const clearCheckpoint = () => rmSync(checkpointPath, { force: true })

  const start = async (): Promise<string> => {
    const metadata = JSON.stringify({ name, ...(input.parent ? { parents: [input.parent] } : {}) })
    const response = await input.request({
      url: `${START}?uploadType=resumable&supportsAllDrives=true&fields=${FIELDS}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        "X-Upload-Content-Type": input.mime ?? "application/octet-stream",
        "X-Upload-Content-Length": String(size),
      },
      body: metadata,
    })
    const location = response.header("location")
    if (!done(response.status) || !location)
      throw new CliError("provider_error", `Google refused to start the upload (HTTP ${response.status})`, {
        reason: "upload.start-refused",
      })
    saveCheckpoint(location)
    return location
  }
  /** An empty PUT asks how much of the file Google already holds. */
  const status = (session: string) =>
    input.request({ url: session, method: "PUT", headers: { "Content-Range": `bytes */${size}` } })

  let session = ""
  let offset = 0
  let resumed = false
  let finished: UploadResponse | undefined
  const saved = readCheckpoint()
  if (saved) {
    const answer = await status(saved.session_uri).catch(() => undefined)
    if (answer && done(answer.status)) finished = answer
    if (answer?.status === 308) {
      session = saved.session_uri
      offset = nextByte(answer)
      resumed = true
    } else if (!finished) {
      clearCheckpoint()
      session = await start()
    }
  } else session = await start()

  const handle = await open(path, "r")
  try {
    let failures = 0
    while (!finished) {
      const end = Math.min(offset + chunk, size)
      const body = Buffer.alloc(end - offset)
      if (body.length) await handle.read(body, 0, body.length, offset)
      const range = size === 0 ? `bytes */0` : `bytes ${offset}-${end - 1}/${size}`
      let response: UploadResponse | undefined
      try {
        response = await input.request({
          url: session,
          method: "PUT",
          headers: { "Content-Length": String(body.length), "Content-Range": range },
          body,
        })
      } catch {
        response = undefined
      }
      if (response && done(response.status)) {
        finished = response
        break
      }
      if (response?.status === 308) {
        offset = nextByte(response)
        failures = 0
        continue
      }
      if (response?.status === 404) {
        clearCheckpoint()
        throw new CliError("provider_error", "Google expired the upload session; run the upload again to start over", {
          reason: "upload.session-expired",
          retryable: true,
        })
      }
      if (response && response.status < 500)
        throw new CliError("provider_error", `Google refused part of the upload (HTTP ${response.status})`, {
          reason: "upload.refused",
        })
      // A 5xx or a dropped connection: Google may hold more than we think, so ask before sending again.
      failures++
      if (failures > (input.retries ?? 5))
        throw new CliError("provider_error", "the upload kept failing; run it again to continue where it stopped", {
          reason: "upload.interrupted",
          retryable: true,
        })
      await sleep(Math.min(1000 * 2 ** failures, 30000))
      const answer = await status(session).catch(() => undefined)
      if (answer && done(answer.status)) finished = answer
      else if (answer?.status === 308) offset = nextByte(answer)
    }
  } finally {
    await handle.close()
  }
  clearCheckpoint()
  const file = finished.data as {
    id?: string
    name?: string
    size?: string
    md5Checksum?: string
    mimeType?: string
    parents?: string[]
  }
  const local = await md5Of(path)
  if (file.md5Checksum && file.md5Checksum !== local)
    throw new CliError(
      "provider_error",
      `uploaded file ${file.id} differs from the local file (MD5); upload it again`,
      {
        reason: "upload.checksum-mismatch",
        file_id: file.id,
      },
    )
  return {
    id: String(file.id),
    name: file.name ?? name,
    size: Number(file.size ?? size),
    md5: file.md5Checksum ?? local,
    parents: file.parents ?? [],
    mime_type: file.mimeType ?? input.mime ?? "application/octet-stream",
    resumed,
  }
}
