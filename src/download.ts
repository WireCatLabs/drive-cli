import { randomUUID } from "node:crypto"
import {
  closeSync,
  createWriteStream,
  linkSync,
  lstatSync,
  mkdirSync,
  openSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import { dirname, join } from "node:path"
import type { Readable } from "node:stream"
import { pipeline } from "node:stream/promises"
import { CliError } from "@wirecat/cli-base"

export const EXPORT_FORMATS = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  csv: "text/csv",
} as const

export type Download = (id: string, mime?: string) => Promise<Uint8Array | Readable>

const exists = () =>
  new CliError("validation_error", "the output file already exists; pass --overwrite to replace it", {
    reason: "download.exists",
    param: "--output",
  })

export const saveDownload = async (
  path: string,
  overwrite: boolean,
  read: () => Promise<Uint8Array | Readable>,
  createDirectory = false,
) => {
  if (!overwrite) {
    try {
      lstatSync(path)
      throw exists()
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error
    }
  }
  const source = await read()
  if (createDirectory) mkdirSync(dirname(path), { recursive: true, mode: 0o700 })
  const temp = join(dirname(path), `.${randomUUID()}.tmp`)
  let created = false
  let size = 0
  try {
    if (source instanceof Uint8Array) {
      const fd = openSync(temp, "wx", 0o600)
      created = true
      try {
        writeFileSync(fd, source)
      } finally {
        closeSync(fd)
      }
      size = source.byteLength
    } else {
      created = true
      source.on("data", (chunk: Buffer) => {
        size += chunk.length
      })
      await pipeline(source, createWriteStream(temp, { flags: "wx", mode: 0o600 }))
    }
    if (overwrite) renameSync(temp, path)
    else linkSync(temp, path)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "EEXIST") throw exists()
    throw error
  } finally {
    if (created) rmSync(temp, { force: true })
  }
  return size
}
