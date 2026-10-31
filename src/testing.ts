import { mkdtempSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { crc32 } from "node:zlib"
import { errorObjectOf } from "@wirecat/cli-base"
import { itemEnvelopeSchema, listEnvelopeSchema } from "@wirecat/cli-base/standards"
import { failureContext } from "@wirecat/cli-core"
import { type RunOptions, run } from "@wirecat/cli-core/cli"
import type { Command } from "commander"
import * as v from "valibot"
import { vi } from "vitest"
import { writeConfig } from "./config.js"
import { DRIVE_APP } from "./identity.js"
import { DOC, type DocumentContent, type DocumentIndex, type FileMetadata, FOLDER, type GoogleSource } from "./model.js"
import { createProgram, definition, type ProgramOptions } from "./program.js"

export const file = (id: string, parents = ["root"], mime = DOC): FileMetadata => ({
  id,
  name: "Same name",
  parents,
  mime,
  version: "1",
  url: `https://docs.google.com/document/d/${id}/edit`,
  trashed: false,
  canDownload: true,
})
export const content = (metadata: FileMetadata, text = "budget decision"): DocumentContent => ({
  metadata,
  markdown: `# ${text}\n`,
  text,
  tabs: [],
})
export const fixture = (roots = ["root"]) => {
  const directory = mkdtempSync(join(tmpdir(), "drive-test-"))
  const env: NodeJS.ProcessEnv = {
    DRIVE_CONFIG_DIR: join(directory, "config"),
    DRIVE_STATE_DIR: join(directory, "state"),
    DRIVE_CACHE_DIR: join(directory, "cache"),
    WIRECAT_STATE_DIR: join(directory, "wirecat"),
    MESSAGING_STORE: join(directory, "never-owner.db"),
  }
  writeConfig(env, { profiles: { default: { principal: "synthetic-principal", roots, storage: "keyring" } } })
  const stored = new Map<string, DocumentContent>()
  const pictures = new Map<string, string>()
  const index: DocumentIndex = {
    save: vi.fn(async (_principal, doc) => {
      stored.set(doc.metadata.id, doc)
      return `document:${doc.metadata.id}`
    }),
    remove: vi.fn(async (_principal, id) => {
      stored.delete(id)
    }),
    openPictures: vi.fn(async () => ({
      save: vi.fn(async (reference: string, bytes: Uint8Array) => {
        const hash = Buffer.from(bytes).toString("base64")
        if (pictures.get(reference) === hash) return "unchanged" as const
        pictures.set(reference, hash)
        return "saved" as const
      }),
      close: vi.fn(async () => {}),
    })),
    search: vi.fn(async () => ({ hits: [] })),
    embed: vi.fn(async () => ({ embedded: 0 })),
    close: vi.fn(async () => {}),
  }
  const source: GoogleSource = {
    identity: vi.fn(async () => "synthetic-principal"),
    metadata: vi.fn(async (id) => file(id, [], FOLDER)),
    children: vi.fn(async () => [file("doc-a"), file("doc-b")]),
    startToken: vi.fn(async () => "before-crawl"),
    changes: vi.fn(async () => ({ items: [], cursor: "after-changes" })),
    content: vi.fn(async (id) => content(file(id))),
    bytes: vi.fn(async () => Uint8Array.of(1)),
  }
  return { directory, env, index, source, stored, pictures }
}

export const zip = (entries: Record<string, string>): Buffer => {
  const locals: Buffer[] = []
  const centrals: Buffer[] = []
  let offset = 0
  for (const [name, text] of Object.entries(entries)) {
    const path = Buffer.from(name)
    const data = Buffer.from(text)
    const sum = crc32(data)
    const local = Buffer.alloc(30)
    local.writeUInt32LE(0x04034b50, 0)
    local.writeUInt16LE(20, 4)
    local.writeUInt32LE(sum, 14)
    local.writeUInt32LE(data.length, 18)
    local.writeUInt32LE(data.length, 22)
    local.writeUInt16LE(path.length, 26)
    const central = Buffer.alloc(46)
    central.writeUInt32LE(0x02014b50, 0)
    central.writeUInt16LE(20, 4)
    central.writeUInt16LE(20, 6)
    central.writeUInt32LE(sum, 16)
    central.writeUInt32LE(data.length, 20)
    central.writeUInt32LE(data.length, 24)
    central.writeUInt16LE(path.length, 28)
    central.writeUInt32LE(offset, 42)
    locals.push(local, path, data)
    centrals.push(central, path)
    offset += local.length + path.length + data.length
  }
  const directory = Buffer.concat(centrals)
  const end = Buffer.alloc(22)
  end.writeUInt32LE(0x06054b50, 0)
  end.writeUInt16LE(Object.keys(entries).length, 8)
  end.writeUInt16LE(Object.keys(entries).length, 10)
  end.writeUInt32LE(directory.length, 12)
  end.writeUInt32LE(offset, 16)
  return Buffer.concat([...locals, directory, end])
}

const SHEET_NS = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"
const REL = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
const relations = (items: [string, string, string][]) =>
  `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${items
    .map(([id, target, type]) => `<Relationship Id="${id}" Target="${target}" Type="${REL}/${type}"/>`)
    .join("")}</Relationships>`
const contentTypes = (part: string, type: string) =>
  `<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/${part}" ContentType="${type}"/></Types>`

export const workbook = (sheets: Record<string, string>): Buffer => {
  const names = Object.keys(sheets)
  return zip({
    "[Content_Types].xml": contentTypes(
      "xl/workbook.xml",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml",
    ),
    "_rels/.rels": relations([["main", "xl/workbook.xml", "officeDocument"]]),
    "xl/workbook.xml": `<workbook xmlns="${SHEET_NS}" xmlns:r="${REL}"><sheets>${names
      .map((name, index) => `<sheet name="${name}" sheetId="${index + 1}" r:id="s${index}"/>`)
      .join("")}</sheets></workbook>`,
    "xl/_rels/workbook.xml.rels": relations(names.map((_, index) => [`s${index}`, `sheet${index}.xml`, "worksheet"])),
    ...Object.fromEntries(
      names.map((name, index) => [
        `xl/sheet${index}.xml`,
        `<worksheet xmlns="${SHEET_NS}"><sheetData><row r="1"><c r="A1" t="inlineStr"><is><t>${sheets[name]}</t></is></c></row></sheetData></worksheet>`,
      ]),
    ),
  })
}

export const wordDocument = (text: string): Buffer =>
  zip({
    "[Content_Types].xml": contentTypes(
      "word/document.xml",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml",
    ),
    "_rels/.rels": relations([["main", "word/document.xml", "officeDocument"]]),
    "word/document.xml": `<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>${text}</w:t></w:r></w:p></w:body></w:document>`,
  })

export const pdf = (text?: string): Buffer => {
  const stream = text ? `BT /F1 12 Tf 72 720 Td (${text}) Tj ET` : ""
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ]
  let body = "%PDF-1.4\n"
  const offsets = objects.map((object, index) => {
    const at = body.length
    body += `${index + 1} 0 obj\n${object}\nendobj\n`
    return at
  })
  const xref = body.length
  body += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets
    .map((at) => `${String(at).padStart(10, "0")} 00000 n \n`)
    .join("")}trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`
  return Buffer.from(body, "latin1")
}

/** Verify the public envelope before semantic command tests inspect its payload. */
export const commandResult = (text: string) => {
  const data = JSON.parse(text)
  v.parse(v.union([itemEnvelopeSchema(v.unknown()), listEnvelopeSchema(v.unknown())]), data)
  return Object.hasOwn(data, "item") ? data.item : data
}

/**
 * The program's command tree, whose `parseAsync` runs the real program as the binary does and throws what the command
 * threw instead of returning its exit code, so a test can match the error itself.
 */
export const testProgram = (options: ProgramOptions = {}): Command => {
  const shared = definition()
  const program = createProgram()
  program.parseAsync = async (argv) => {
    let failure: unknown
    const onFailure = async (error: unknown, failed: Command) => {
      failure = error
      await shared.onFailure?.(error, failed)
    }
    await run([...(argv ?? [])], { ...shared, onFailure }, options as RunOptions)
    if (failure !== undefined) throw failure
    return program
  }
  return program
}

/** The error object a failure becomes, as `run` reports it. */
export const errorObject = (error: unknown) => errorObjectOf(error, failureContext(DRIVE_APP.errors))
