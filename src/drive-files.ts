import { createHash } from "node:crypto"
import { createReadStream, createWriteStream } from "node:fs"
import { Readable } from "node:stream"
import { pipeline } from "node:stream/promises"
import { CliError, isCliError } from "@wirecat/cli-base"
import { type FileTarget, type RemoteFile, sizeText } from "@wirecat/cli-core/documents"
import type { Download } from "./download.js"
import { FOLDER } from "./model.js"
import type { UploadedFile } from "./upload.js"

const FIELDS = "id,name,mimeType,trashed,size,sha256Checksum,md5Checksum,modifiedTime"
const NATIVE = "application/vnd.google-apps."
// A read gives the text extracted from these, never the file: written back as text, it would replace the document.
const EXTRACTED = /\.(pdf|docx|xlsx)$/iu
const EXTRACTED_MIME = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
])

interface Meta {
  id: string
  name?: string
  mimeType?: string
  trashed?: boolean
  size?: string
  sha256Checksum?: string
  md5Checksum?: string
  modifiedTime?: string
}

export interface DriveFilePort {
  /** drive's policy-checked, journaled Google call. */
  call(method: string, params: Record<string, unknown>, body?: Record<string, unknown>): Promise<unknown>
  download: Download
  /** Replaces the file's content with the local file `from`, keeping its id, name and folder. */
  replace(id: string, from: string, mime: string | undefined): Promise<UploadedFile>
  identity(): Promise<string>
  /** `drive <profile>`, for the commands a refusal points to. */
  prefix: string
  /** `files update` writes a whole text: a PDF, Word or Excel file is refused, as cli-core refuses them by name. */
  plainText?: boolean
}

const sha256Of = (path: string): Promise<string> =>
  new Promise((done, fail) => {
    const hash = createHash("sha256")
    createReadStream(path)
      .on("data", (chunk) => hash.update(chunk))
      .on("error", fail)
      .on("end", () => done(hash.digest("hex")))
  })

// cli-core's file edits read, check and write one file; only a mirror lists, trashes or makes folders.
const unsupported = (what: string) => () => {
  throw new Error(`drive's file edits do not ${what}`)
}

/**
 * A file stored in Google Drive as cli-core's file edits write it (`FileTarget`); the path is the file id. Drive's v3
 * API has no conditional upload (no ETag on a file, no precondition on files.update), so `upload` reads the file's
 * hash just before it writes, and the upload keeps the id. Google Docs, Sheets and other native files have no stored
 * content: they are refused with the drive command that changes them.
 */
export const driveFileTarget = (port: DriveFilePort): FileTarget => {
  const meta = async (id: string): Promise<Meta | undefined> => {
    try {
      return (await port.call("drive.files.get", { fileId: id, fields: FIELDS, supportsAllDrives: true })) as Meta
    } catch (error) {
      if (isCliError(error) && error.code === "not_found") return undefined
      throw error
    }
  }
  const editable = (id: string, file: Meta) => {
    const mime = file.mimeType ?? ""
    if (mime === FOLDER)
      throw new CliError("validation_error", `${id} is a folder; give the id of a file`, { reason: "file.not-a-file" })
    if (mime.startsWith(NATIVE))
      throw new CliError(
        "validation_error",
        `${id} is a Google ${mime.slice(NATIVE.length)} file, which has no stored content to edit. Change a Google Doc ` +
          `with ${port.prefix} documents update and a Google Sheet with ${port.prefix} sheets update`,
        { reason: "file.native-google" },
      )
    if (port.plainText && (EXTRACTED_MIME.has(mime) || EXTRACTED.test(file.name ?? "")))
      throw new CliError(
        "validation_error",
        `${id} is not a plain-text file; change a .docx with files documents update and a .xlsx with files sheets update`,
        { reason: "file.not-plain-text" },
      )
    return file
  }
  const there = async (id: string) => {
    const file = await meta(id)
    return file && !file.trashed ? editable(id, file) : undefined
  }
  /**
   * Whether the file still holds the content read at `sha256`. Google's sha256Checksum is the quick answer; Google
   * fills it only "if available" and may lag an upload, so when it is missing or differs, the bytes decide.
   */
  const holds = async (id: string, file: Meta, sha256: string) => {
    if (file.sha256Checksum === sha256) return true
    const source = await port.download(id)
    const hash = createHash("sha256")
    if (source instanceof Uint8Array) hash.update(source)
    else for await (const chunk of source) hash.update(chunk as Buffer)
    return hash.digest("hex") === sha256
  }
  const changed = (id: string) =>
    new CliError("conflict", `${id} is not the file that was read`, { reason: "mirror.remote-changed" })
  return {
    identity: port.identity,
    exists: async (id) => (await there(id)) !== undefined,
    download: async (id, into) => {
      const file = await meta(id)
      if (!file || file.trashed)
        throw new CliError("not_found", `no file ${id} in Google Drive`, { reason: "file.not-found" })
      editable(id, file)
      const source = await port.download(id)
      await pipeline(
        source instanceof Uint8Array ? Readable.from([source]) : source,
        createWriteStream(into, { flags: "wx", mode: 0o600 }),
      )
    },
    upload: async (id, from, expect): Promise<RemoteFile> => {
      if ("absent" in expect)
        throw new CliError(
          "not_found",
          `no file ${id} in Google Drive to write; Google Drive names a file by its id, so a new file goes there with ` +
            `${port.prefix} files upload`,
          { reason: "file.not-found" },
        )
      const file = await there(id)
      if (!file || !(await holds(id, file, expect.sha256))) throw changed(id)
      const done = await port.replace(id, from, file.mimeType)
      return {
        path: id,
        id: done.id,
        size: done.size,
        sha256: await sha256Of(from),
        md5: done.md5,
        modifiedAt: new Date().toISOString(),
      }
    },
    list: unsupported("list folders"),
    trash: unsupported("trash files"),
    ensureFolder: unsupported("create folders"),
  }
}

/** The bytes of a download, refused past `max`. */
export const bytesOf = async (source: Uint8Array | Readable, max: number): Promise<Uint8Array> => {
  if (source instanceof Uint8Array) return source
  const chunks: Buffer[] = []
  let size = 0
  for await (const chunk of source) {
    size += (chunk as Buffer).length
    if (size > max) {
      source.destroy()
      throw new CliError(
        "validation_error",
        `the file is larger than ${sizeText(max)}; save it with --output or configure MESSAGING_ATTACHMENT_MAX_MIB`,
        {
          reason: "file.too-large",
        },
      )
    }
    chunks.push(chunk as Buffer)
  }
  return Buffer.concat(chunks)
}
