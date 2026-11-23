import { createHash } from "node:crypto"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { Readable } from "node:stream"
import { captureStreams } from "@wirecat/cli-base"
import { describeProgram } from "@wirecat/cli-base/commands"
import { toolsFromCommands } from "@wirecat/cli-core/mcp"
import { readDocxParagraphs, readXlsxCells } from "@wirecat/cli-core/office"
import { describe, expect, it, vi } from "vitest"
import { writeConfig } from "./config.js"
import { createProgram as commandTree } from "./program.js"
import { commandResult, testProgram as createProgram, errorObject, fixture } from "./testing.js"
import type { UploadRequest, UploadResponse } from "./upload.js"

const sha256 = (bytes: string | Uint8Array) => createHash("sha256").update(bytes).digest("hex")
const md5 = (bytes: Uint8Array) => createHash("md5").update(bytes).digest("hex")
const sample = (name: string) => readFileSync(join(import.meta.dirname, "testing", "fixtures", name))
const OLD = "# Notes\nthe first draft\n"
const NEW = "# Notes\nthe second draft\n"
const XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
const DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

interface Stored {
  name: string
  mimeType: string
  bytes: Buffer
  trashed?: boolean
  /** Google fills sha256Checksum only "if available"; false leaves it out. */
  hashed?: boolean
}

/** Google Drive as the edits reach it: files.get metadata, alt=media downloads and resumable PATCH uploads. */
const fakeDrive = () => {
  const files = new Map<string, Stored>([
    ["notes-id", { name: "notes.md", mimeType: "text/markdown", bytes: Buffer.from(OLD) }],
    ["budget-id", { name: "budget.xlsx", mimeType: XLSX, bytes: sample("budget.xlsx") }],
    ["letter-id", { name: "letter.docx", mimeType: DOCX, bytes: sample("letter.docx") }],
    ["doc-id", { name: "Plan", mimeType: "application/vnd.google-apps.document", bytes: Buffer.alloc(0) }],
  ])
  const uploads: { id: string; mime: string | undefined }[] = []
  /** Runs once, after the next download, as another device's edit would land. */
  let afterDownload: (() => void) | undefined
  const call = vi.fn(async (method: string, params: Record<string, unknown>, body?: Record<string, unknown>) => {
    const file = files.get(String(params.fileId))
    if (!file) throw Object.assign(new Error("not found"), { status: 404 })
    if (method === "drive.files.update") {
      file.trashed = body?.trashed === true
      return { id: params.fileId, trashed: file.trashed }
    }
    if (method !== "drive.files.get") throw new Error(`unexpected ${method}`)
    const native = file.mimeType.startsWith("application/vnd.google-apps.")
    return {
      id: params.fileId,
      name: file.name,
      mimeType: file.mimeType,
      trashed: file.trashed ?? false,
      ...(native ? {} : { size: String(file.bytes.length), md5Checksum: md5(file.bytes) }),
      ...(native || file.hashed === false ? {} : { sha256Checksum: sha256(file.bytes) }),
    }
  })
  const download = vi.fn(async (id: string) => {
    const bytes = Buffer.from(files.get(id)?.bytes ?? Buffer.alloc(0))
    const after = afterDownload
    afterDownload = undefined
    after?.()
    return Readable.from([bytes])
  })
  const reply = (status: number, headers: Record<string, string> = {}, data: unknown = ""): UploadResponse => ({
    status,
    header: (name) => headers[name.toLowerCase()],
    data,
  })
  const sessions = new Map<string, { id: string; held: Buffer }>()
  const uploadRequest: UploadRequest = async ({ url, method, headers, body }) => {
    if (method === "PATCH") {
      const id = /files\/([^?]+)\?/.exec(url)?.[1] ?? ""
      uploads.push({ id, mime: headers["X-Upload-Content-Type"] })
      sessions.set(`https://upload.example/${id}`, { id, held: Buffer.alloc(0) })
      return reply(200, { location: `https://upload.example/${id}` })
    }
    const session = sessions.get(url)
    if (!session) throw new Error(`unexpected ${method} ${url}`)
    session.held = Buffer.concat([session.held, (body as Buffer | undefined) ?? Buffer.alloc(0)])
    const file = files.get(session.id) as Stored
    file.bytes = session.held
    return reply(
      200,
      {},
      { id: session.id, name: file.name, size: String(file.bytes.length), md5Checksum: md5(file.bytes) },
    )
  }
  return {
    files,
    uploads,
    call,
    download,
    uploadRequest,
    later: (edit: () => void) => {
      afterDownload = edit
    },
    text: (id: string) => files.get(id)?.bytes.toString("utf8"),
  }
}

const setup = (permissions: Record<string, "allow" | "ask" | "deny"> = { "files.delete": "allow" }) => {
  const f = fixture([])
  writeConfig(f.env, {
    profiles: { default: { principal: "synthetic-principal", roots: [], storage: "keyring", permissions } },
  })
  const drive = fakeDrive()
  const run = async (args: string[], options: { stdin?: string; ask?: (key: string) => Promise<boolean> } = {}) => {
    const streams = captureStreams()
    await createProgram({
      env: f.env,
      streams,
      api: { call: drive.call },
      download: drive.download,
      uploadRequest: drive.uploadRequest,
      ...(options.ask ? { ask: options.ask } : {}),
      ...(options.stdin === undefined ? {} : { stdin: Readable.from([options.stdin]) as never }),
    }).parseAsync(["default", "files", ...args, "--json"], { from: "user" })
    return commandResult(streams.stdout.join(""))
  }
  const fails = async (args: string[], options: Parameters<typeof run>[1] = {}) => {
    try {
      await run(args, options)
    } catch (error) {
      return errorObject(error).error
    }
    throw new Error(`${args.join(" ")} did not fail`)
  }
  return { ...f, drive, run, fails }
}

describe("files update", () => {
  it("replaces the text at the sha256 it was read at, keeps what it replaced, and history lists it", async () => {
    const t = setup()
    const read = await t.run(["download", "notes-id"])
    expect(read).toMatchObject({ id: "notes-id", text: OLD, sha256: sha256(OLD), truncated: false })

    const done = await t.run(["update", "notes-id", "--text", NEW, "--expected-fingerprint", read.sha256])
    expect(done).toMatchObject({ path: "notes-id", sha256: sha256(NEW), replaced: { sha256: sha256(OLD) } })
    expect(t.drive.text("notes-id")).toBe(NEW)
    expect(t.drive.uploads).toEqual([{ id: "notes-id", mime: "text/markdown" }])
    expect(done.replaced.kept_at.startsWith(join(t.env.DRIVE_STATE_DIR ?? "", "profiles", "default"))).toBe(true)
    expect(readFileSync(done.replaced.kept_at, "utf8")).toBe(OLD)

    expect(await t.run(["history", "notes-id"])).toMatchObject({
      path: "notes-id",
      versions: [{ event: "changed", version: sha256(OLD), available: true, new: sha256(NEW) }],
    })
  })

  it("reads the text from stdin", async () => {
    const t = setup()
    await t.run(["update", "notes-id", "--expected-fingerprint", sha256(OLD)], { stdin: NEW })
    expect(t.drive.text("notes-id")).toBe(NEW)
  })

  it("a fingerprint the file no longer has is a conflict that says how to read it again; nothing is uploaded", async () => {
    const t = setup()
    const stale = await t.fails(["update", "notes-id", "--text", NEW, "--expected-fingerprint", sha256("old")])
    expect(stale).toMatchObject({ code: "conflict", reason: "mirror.remote-changed" })
    expect(stale.message).toContain("drive default files download notes-id --json")
    expect(t.drive.uploads).toEqual([])
    expect(t.drive.text("notes-id")).toBe(OLD)
  })

  it("a change that lands after the old content was kept is caught by the check just before the upload", async () => {
    const t = setup()
    t.drive.later(() => {
      const notes = t.drive.files.get("notes-id") as Stored
      notes.bytes = Buffer.from("another device's edit")
    })
    const raced = await t.fails(["update", "notes-id", "--text", NEW, "--expected-fingerprint", sha256(OLD)])
    expect(raced).toMatchObject({ code: "conflict", reason: "mirror.remote-changed" })
    expect(t.drive.uploads).toEqual([])
    expect(t.drive.text("notes-id")).toBe("another device's edit")
  })

  it("proves the content by its bytes when Google gives no sha256Checksum", async () => {
    const t = setup()
    ;(t.drive.files.get("notes-id") as Stored).hashed = false
    await t.run(["update", "notes-id", "--text", NEW, "--expected-fingerprint", sha256(OLD)])
    expect(t.drive.text("notes-id")).toBe(NEW)
  })

  it("refuses a Google Doc, a .docx, a .xlsx, a missing fingerprint and a file that is not there", async () => {
    const t = setup()
    const native = await t.fails(["update", "doc-id", "--text", NEW, "--expected-fingerprint", sha256(OLD)])
    expect(native).toMatchObject({ code: "validation_error", reason: "file.native-google" })
    expect(native.message).toContain("drive default documents update")
    for (const id of ["letter-id", "budget-id"])
      expect(await t.fails(["update", id, "--text", "x", "--expected-fingerprint", sha256("x")])).toMatchObject({
        reason: "file.not-plain-text",
      })
    expect(await t.fails(["update", "notes-id", "--text", NEW])).toMatchObject({
      code: "validation_error",
      param: "--expected-fingerprint",
    })
    const missing = await t.fails(["update", "no-such-id", "--text", NEW])
    expect(missing).toMatchObject({ code: "not_found", reason: "file.not-found" })
    expect(missing.message).toContain("files upload")
    expect(t.drive.uploads).toEqual([])
  })

  it("an overwrite asks as files.delete does, and a no sends nothing", async () => {
    const t = setup({ "files.delete": "ask" })
    const ask = vi.fn(async () => false)
    const refused = await t.fails(["update", "notes-id", "--text", NEW, "--expected-fingerprint", sha256(OLD)], { ask })
    expect(refused).toMatchObject({ code: "confirmation_required" })
    expect(ask).toHaveBeenCalledWith("files.delete")
    expect(t.drive.uploads).toEqual([])
    const denied = setup({ "files.delete": "deny" })
    expect(
      await denied.fails(["update", "notes-id", "--text", NEW, "--expected-fingerprint", sha256(OLD)]),
    ).toMatchObject({ code: "permission_error" })
  })
})

describe("a preview", () => {
  it("--dry-run reads and writes nothing", async () => {
    const t = setup()
    const shown = await t.run(["--dry-run", "update", "notes-id", "--text", NEW, "--expected-fingerprint", sha256(OLD)])
    expect(shown).toMatchObject({ dry_run: true })
    expect(t.drive.call).not.toHaveBeenCalled()
    expect(t.drive.uploads).toEqual([])
  })
})

describe("files restore", () => {
  it("puts back a version history lists, keeping the current content first", async () => {
    const t = setup()
    await t.run(["update", "notes-id", "--text", NEW, "--expected-fingerprint", sha256(OLD)])
    const restored = await t.run(["restore", "notes-id", sha256(OLD), "--expected-fingerprint", sha256(NEW)])
    expect(restored).toMatchObject({ path: "notes-id", restored: sha256(OLD), replaced: { sha256: sha256(NEW) } })
    expect(t.drive.text("notes-id")).toBe(OLD)
    const history = await t.run(["history", "notes-id"])
    expect(history.versions).toEqual([
      expect.objectContaining({ version: sha256(OLD) }),
      expect.objectContaining({ version: sha256(NEW), direction: "restored", available: true }),
    ])
    expect(
      await t.fails(["restore", "notes-id", sha256("never kept"), "--expected-fingerprint", sha256(OLD)]),
    ).toMatchObject({ code: "not_found" })
  })

  it("with no version still takes the file out of the trash", async () => {
    const t = setup()
    ;(t.drive.files.get("notes-id") as Stored).trashed = true
    expect(await t.run(["restore", "notes-id"])).toMatchObject({ id: "notes-id", trashed: false })
    expect(t.drive.call).toHaveBeenCalledWith("drive.files.update", expect.objectContaining({ fileId: "notes-id" }), {
      trashed: false,
    })
  })
})

describe("Office files edited in place", () => {
  it("sheets show gives the cells and the sha256; sheets update writes them and keeps the rest", async () => {
    const t = setup()
    const shown = await t.run(["sheets", "show", "budget-id", "Synthetic Budget!A1:B2"])
    expect(shown.sha256).toBe(sha256(sample("budget.xlsx")))
    expect(shown.sheets[0].cells.map((cell: { address: string }) => cell.address)).toEqual(["A1", "B1", "A2", "B2"])
    expect(
      await t.fails([
        "sheets",
        "update",
        "budget-id",
        "B2",
        "--values",
        "[[1300]]",
        "--expected-fingerprint",
        sha256("x"),
      ]),
    ).toMatchObject({ code: "conflict", reason: "mirror.remote-changed" })

    const updated = await t.run([
      "sheets",
      "update",
      "budget-id",
      "B2:C2",
      "--values",
      '[[1300, "paid"]]',
      "--expected-fingerprint",
      shown.sha256,
    ])
    expect(updated).toMatchObject({ replaced: { sha256: shown.sha256 } })
    expect(t.drive.uploads).toEqual([{ id: "budget-id", mime: XLSX }])
    const [sheet] = await readXlsxCells(new Uint8Array(t.drive.files.get("budget-id")?.bytes ?? []), {})
    const value = (address: string) => sheet?.cells.find((cell) => cell.address === address)?.value
    expect(value("B2")).toBe(1300)
    expect(value("C2")).toBe("paid")
    expect(value("A3")).toBe("Heron food")
  })

  it("sheets update refuses a formula cell unless --replace", async () => {
    const t = setup()
    const fingerprint = () => sha256(t.drive.files.get("budget-id")?.bytes ?? "")
    const formula = ["sheets", "update", "budget-id", "B4", "--values", "[[1]]", "--expected-fingerprint"]
    const refused = await t.fails([...formula, fingerprint()])
    expect(refused).toMatchObject({ code: "validation_error" })
    expect(refused.message).toContain("--replace")
    await t.run([...formula, fingerprint(), "--replace"])
    const [sheet] = await readXlsxCells(new Uint8Array(t.drive.files.get("budget-id")?.bytes ?? []), {})
    expect(sheet?.cells.find((cell) => cell.address === "B4")).toMatchObject({ value: 1 })
  })

  it("documents show gives the paragraphs and the sha256; documents update changes one and keeps the rest", async () => {
    const t = setup()
    const shown = await t.run(["documents", "show", "letter-id"])
    expect(shown.paragraphs.map((one: { text: string }) => one.text)).toContain("Plain second paragraph.")
    await t.run([
      "documents",
      "update",
      "letter-id",
      "--payload",
      '[{"index": 2, "text": "A new second paragraph."}]',
      "--expected-fingerprint",
      shown.sha256,
    ])
    const texts = (await readDocxParagraphs(new Uint8Array(t.drive.files.get("letter-id")?.bytes ?? []))).map(
      (one) => one.text,
    )
    expect(texts).toContain("A new second paragraph.")
    expect(texts).toContain("Closing words.")
    expect((await t.run(["history", "letter-id"])).versions).toEqual([
      expect.objectContaining({ version: shown.sha256, available: true }),
    ])
  })

  it("refuses a Google Sheet or Doc with drive's own command to change it", async () => {
    const t = setup()
    const refused = await t.fails(["sheets", "show", "doc-id"])
    expect(refused).toMatchObject({ code: "validation_error", reason: "file.native-google" })
    expect(refused.message).toContain("drive default sheets update")
  })

  it("a download of a .docx answers its text without a sha256 to write it back with", async () => {
    const t = setup()
    expect(await t.run(["download", "letter-id"])).toMatchObject({ sha256: null, truncated: false })
  })
})

describe("the MCP catalogue", () => {
  it("offers every edit as a write and every read as a read", () => {
    const tools = toolsFromCommands(describeProgram(commandTree()), { includeUnavailable: true, exclude: [["mcp"]] })
    const writes = Object.fromEntries(tools.map((tool) => [tool.path.join(" "), tool.writes]))
    expect(writes).toMatchObject({
      "files update": true,
      "files sheets update": true,
      "files documents update": true,
      "files restore": true,
      "files sheets show": false,
      "files documents show": false,
      "files history": false,
    })
  })
})
