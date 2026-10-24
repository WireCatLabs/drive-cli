import { isCliError } from "@wirecat/cli-base"
import type { DocumentTarget, Pushed } from "@wirecat/cli-core/documents"
import { createDoc, type DocSnapshot, prepareDoc, recoveredDoc } from "./mirror-docs.js"
import type { ImageOptions } from "./mirror-images.js"
import { type Call, createSheet, prepareSheet, recoveredSheet, type SheetSnapshot } from "./mirror-sheets.js"
import { DOC, FOLDER } from "./model.js"

export type MirrorSnapshot = DocSnapshot | SheetSnapshot

export const mirrorKind = (path: string): "doc" | "sheet" | undefined =>
  /\.(md|markdown)$/i.test(path) ? "doc" : /\.(csv|tsv|xlsx)$/i.test(path) ? "sheet" : undefined

const byOrigin = (origin: string) =>
  `appProperties has { key='wirecatOrigin' and value='${origin}' } and trashed = false`

/** Google Docs and Sheets as a push target. Every call goes through `call`, which checks policy and journals writes. */
export const googleTarget = (
  call: Call,
  identity: () => Promise<string>,
  images?: ImageOptions,
): DocumentTarget<MirrorSnapshot> => ({
  identity,
  kindOf: mirrorKind,
  ensureFolder: async ({ parent, name, origin }) => {
    const found = (await call("drive.files.list", {
      q: `${byOrigin(origin)} and mimeType = '${FOLDER}'`,
      fields: "files(id)",
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    })) as { files?: { id: string }[] }
    const existing = found.files?.[0]?.id
    if (existing) return existing
    const created = (await call(
      "drive.files.create",
      { fields: "id", supportsAllDrives: true },
      { name, mimeType: FOLDER, parents: [parent], appProperties: { wirecatOrigin: origin } },
    )) as { id: string }
    return created.id
  },
  findByOrigin: async (origin): Promise<Pushed<MirrorSnapshot> | undefined> => {
    const found = (await call("drive.files.list", {
      q: byOrigin(origin),
      fields: "files(id,webViewLink,mimeType)",
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    })) as { files?: { id: string; webViewLink?: string; mimeType?: string }[] }
    const file = found.files?.[0]
    if (!file) return undefined
    const snapshot = file.mimeType === DOC ? await recoveredDoc(call, file.id) : await recoveredSheet(call, file.id)
    return { id: file.id, url: file.webViewLink ?? "", snapshot }
  },
  create: (input) => (input.file.kind === "doc" ? createDoc(call, input, images) : createSheet(call, input)),
  prepare: async (input) => {
    let file: { trashed?: boolean; webViewLink?: string }
    try {
      file = (await call("drive.files.get", {
        fileId: input.id,
        fields: "trashed,webViewLink",
        supportsAllDrives: true,
      })) as typeof file
    } catch (error) {
      if (isCliError(error) && error.code === "not_found") return { missing: true }
      throw error
    }
    if (file.trashed) return { missing: true }
    const args = { ...input, url: file.webViewLink ?? "" }
    if (input.recorded.kind === "doc") return prepareDoc(call, { ...args, recorded: input.recorded }, images)
    return prepareSheet(call, { ...args, recorded: input.recorded })
  },
})
