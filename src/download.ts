import { randomUUID } from "node:crypto"
import { closeSync, linkSync, lstatSync, openSync, renameSync, rmSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { CliError } from "@wirecat/cli-base"

export const EXPORT_FORMATS = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  csv: "text/csv",
} as const

export type Download = (id: string, mime?: string) => Promise<Uint8Array>

const exists = () =>
  new CliError("validation_error", "the output file already exists; pass --overwrite to replace it", {
    reason: "download.exists",
    param: "--out",
  })

export const saveDownload = async (path: string, overwrite: boolean, read: () => Promise<Uint8Array>) => {
  if (!overwrite) {
    try {
      lstatSync(path)
      throw exists()
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error
    }
  }
  const bytes = await read()
  const temp = join(dirname(path), `.${randomUUID()}.tmp`)
  let created = false
  try {
    const fd = openSync(temp, "wx", 0o600)
    created = true
    try {
      writeFileSync(fd, bytes)
    } finally {
      closeSync(fd)
    }
    if (overwrite) renameSync(temp, path)
    else linkSync(temp, path)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "EEXIST") throw exists()
    throw error
  } finally {
    if (created) rmSync(temp, { force: true })
  }
  return bytes.byteLength
}
