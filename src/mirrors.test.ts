import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { captureStreams, isCliError } from "@wirecat/cli-base"
import { describe, expect, it } from "vitest"
import { parseDelimited, typed } from "./mirror-sheets.js"
import { FOLDER, SHEET } from "./model.js"
import { createProgram } from "./program.js"
import { commandResult, fixture, workbook } from "./testing.js"

type Cell = string | number
interface FakeFile {
  name: string
  mimeType: string
  parents: string[]
  appProperties?: Record<string, string>
  trashed?: boolean
}

/** Drive and Sheets in memory: enough of each method the mirror calls to round-trip values by sheetId. */
const fakeGoogle = () => {
  const files = new Map<string, FakeFile>()
  const tabs = new Map<string, { sheetId: number; title: string; cells: Cell[][] }[]>()
  const calls: string[] = []
  let ids = 0
  const tabOf = (spreadsheetId: string, range: string) => {
    const match = /^'((?:[^']|'')*)'!A1:([A-Z]+)(\d+)$/.exec(range)
    if (!match) throw new Error(`unexpected range ${range}`)
    const title = (match[1] as string).replace(/''/g, "'")
    const tab = tabs.get(spreadsheetId)?.find((item) => item.title === title)
    if (!tab) throw new Error(`no tab ${title}`)
    const columns = [...(match[2] as string)].reduce((sum, letter) => sum * 26 + letter.charCodeAt(0) - 64, 0)
    return { tab, rows: Number(match[3]), columns }
  }
  const call = async (method: string, params: Record<string, unknown>, body?: Record<string, unknown>) => {
    calls.push(method)
    switch (method) {
      case "drive.files.list": {
        const origin = /value='([^']+)'/.exec(String(params.q))?.[1]
        const folder = String(params.q).includes(FOLDER)
        return {
          files: [...files.entries()]
            .filter(
              ([, file]) =>
                file.appProperties?.wirecatOrigin === origin && !file.trashed && (!folder || file.mimeType === FOLDER),
            )
            .map(([id, file]) => ({ id, mimeType: file.mimeType, webViewLink: `https://example.invalid/${id}` })),
        }
      }
      case "drive.files.create": {
        const id = `file-${++ids}`
        files.set(id, body as unknown as FakeFile)
        if (body?.mimeType === SHEET) tabs.set(id, [{ sheetId: 0, title: "Sheet1", cells: [] }])
        return { id, webViewLink: `https://example.invalid/${id}` }
      }
      case "drive.files.get": {
        const file = files.get(String(params.fileId))
        if (!file) throw Object.assign(new Error("gone"), { code: "not_found" })
        return { trashed: Boolean(file.trashed), webViewLink: `https://example.invalid/${params.fileId}` }
      }
      case "sheets.spreadsheets.get":
        return {
          sheets: (tabs.get(String(params.spreadsheetId)) ?? []).map((tab) => ({
            properties: { sheetId: tab.sheetId, title: tab.title },
          })),
        }
      case "sheets.spreadsheets.batchUpdate": {
        const list = tabs.get(String(params.spreadsheetId)) ?? []
        const replies = ((body?.requests as Record<string, Record<string, Record<string, unknown>>>[]) ?? []).map(
          (request) => {
            if (request.addSheet) {
              const sheetId = list.length * 100 + 7
              list.push({ sheetId, title: String(request.addSheet.properties?.title), cells: [] })
              return { addSheet: { properties: { sheetId, title: request.addSheet.properties?.title } } }
            }
            const update = request.updateSheetProperties?.properties as { sheetId: number; title?: string } | undefined
            const tab = list.find((item) => item.sheetId === update?.sheetId)
            if (tab && update?.title) tab.title = update.title
            return {}
          },
        )
        return { replies }
      }
      case "sheets.spreadsheets.values.batchUpdate":
        for (const write of (body?.data ?? []) as { range: string; values: Cell[][] }[]) {
          const { tab } = tabOf(String(params.spreadsheetId), write.range)
          write.values.forEach((row, r) => {
            const target = tab.cells[r] ?? []
            row.forEach((value, c) => {
              target[c] = value
            })
            tab.cells[r] = target
          })
        }
        return {}
      case "sheets.spreadsheets.values.batchGet":
        return {
          valueRanges: (params.ranges as string[]).map((range) => {
            const { tab, rows, columns } = tabOf(String(params.spreadsheetId), range)
            return { values: tab.cells.slice(0, rows).map((row) => row.slice(0, columns)) }
          }),
        }
      default:
        throw new Error(`fake Google does not know ${method}`)
    }
  }
  return { files, tabs, calls, call }
}

const setup = () => {
  const f = fixture([])
  const google = fakeGoogle()
  const local = mkdtempSync("/var/tmp/drive-mirror-")
  const write = (path: string, text: string | Buffer) => {
    mkdirSync(join(local, path, ".."), { recursive: true })
    writeFileSync(join(local, path), text)
  }
  const run = async (...args: string[]) => {
    const streams = captureStreams()
    try {
      await createProgram({
        env: f.env,
        streams,
        source: async () => f.source,
        api: { call: google.call },
      }).parseAsync(["default", ...args, "--json"], { from: "user" })
    } catch (error) {
      if (!isCliError(error)) throw error
      return { error, result: streams.stdout.length ? commandResult(streams.stdout.join("")) : undefined }
    }
    return { result: commandResult(streams.stdout.join("")) }
  }
  return { ...f, google, local, write, run }
}

const tabCells = (t: ReturnType<typeof setup>, id: string) =>
  (t.google.tabs.get(id) ?? []).map((tab) => [tab.title, tab.cells])

describe("mirrors", () => {
  it("adds a mirror, then creates a Sheet with typed cells and a frozen bold header", async () => {
    const t = setup()
    t.write("data/budget.csv", 'item,amount,code\n"rent, flat",950.5,007\nfood,=1+1,42\n')
    const added = await t.run("mirrors", "add", t.local, "--parent", "root-folder")
    const id = (added.result as { id: string }).id
    expect((await t.run("mirrors", "status")).result).toMatchObject({
      items: [{ id, create: ["data/budget.csv"], update: [], remote_checked: false }],
    })
    const pushed = await t.run("mirrors", "sync")
    expect(pushed.error).toBeUndefined()
    const sheetId = [...t.google.files.entries()].find(([, file]) => file.mimeType === SHEET)?.[0] as string
    expect(t.google.files.get(sheetId)).toMatchObject({ name: "budget", parents: [expect.stringMatching(/^file-/)] })
    expect(tabCells(t, sheetId)).toEqual([
      [
        "budget",
        [
          ["item", "amount", "code"],
          ["rent, flat", 950.5, "007"],
          ["food", "=1+1", 42],
        ],
      ],
    ])
    expect((await t.run("mirrors", "status")).result).toMatchObject({
      items: [{ create: [], update: [], unchanged: 1 }],
    })
  })

  it("rewrites only the mirrored range, clears what the new data no longer covers and keeps other tabs", async () => {
    const t = setup()
    t.write("budget.csv", "a,b\n1,2\n3,4\n")
    await t.run("mirrors", "add", t.local, "--parent", "root-folder")
    await t.run("mirrors", "sync")
    const sheetId = [...t.google.files.entries()].find(([, file]) => file.mimeType === SHEET)?.[0] as string
    const sheet = t.google.tabs.get(sheetId) ?? []
    sheet.push({ sheetId: 55, title: "Notes", cells: [["kept by a person"]] })
    const mirrored = sheet[0]
    if (!mirrored) throw new Error("missing tab")
    mirrored.title = "Renamed by a person"
    for (const row of mirrored.cells) row.push("formula column a person added")
    t.write("budget.csv", "a,b\n9\n")
    const pushed = await t.run("mirrors", "sync")
    expect(pushed.error).toBeUndefined()
    expect(mirrored.cells.map((row) => row.slice(0, 2))).toEqual([
      ["a", "b"],
      [9, ""],
      ["", ""],
    ])
    expect(mirrored.cells.map((row) => row[2])).toEqual(Array(3).fill("formula column a person added"))
    expect(sheet.find((tab) => tab.title === "Notes")?.cells).toEqual([["kept by a person"]])
  })

  it("stops when the mirrored cells changed in Google, and overwrites only with --replace", async () => {
    const t = setup()
    t.write("budget.csv", "a\n1\n")
    await t.run("mirrors", "add", t.local, "--parent", "root-folder")
    await t.run("mirrors", "sync")
    const sheetId = [...t.google.files.entries()].find(([, file]) => file.mimeType === SHEET)?.[0] as string
    const tab = t.google.tabs.get(sheetId)?.[0]
    if (!tab) throw new Error("missing tab")
    ;(tab.cells[1] as Cell[])[0] = "edited in Google"
    t.write("budget.csv", "a\n2\n")
    const stopped = await t.run("mirrors", "sync")
    expect(stopped.error).toMatchObject({ code: "provider_error", details: { reason: "mirror.partial" } })
    expect(stopped.result).toMatchObject({
      items: [
        { conflicts: [{ path: "budget.csv", reason: "the mirrored cells changed in Google since the last push" }] },
      ],
    })
    expect(tab.cells[1]).toEqual(["edited in Google"])
    expect((await t.run("mirrors", "sync", "--replace")).error).toBeUndefined()
    expect(tab.cells[1]).toEqual([2])
  })

  it("mirrors every worksheet of an XLSX file as its own tab", async () => {
    const t = setup()
    t.write("book.xlsx", workbook({ First: "alpha", Second: "beta" }))
    await t.run("mirrors", "add", t.local, "--parent", "root-folder")
    expect((await t.run("mirrors", "sync")).error).toBeUndefined()
    const sheetId = [...t.google.files.entries()].find(([, file]) => file.mimeType === SHEET)?.[0] as string
    expect(tabCells(t, sheetId)).toEqual([
      ["First", [["alpha"]]],
      ["Second", [["beta"]]],
    ])
  })

  it("never deletes in Google: removing a mirror or a local file only stops pushing it", async () => {
    const t = setup()
    t.write("a.csv", "x\n")
    const id = ((await t.run("mirrors", "add", t.local, "--parent", "root-folder")).result as { id: string }).id
    await t.run("mirrors", "sync")
    const before = t.google.calls.length
    expect((await t.run("mirrors", "remove", id)).result).toEqual({ id, removed: true })
    expect(t.google.calls.length).toBe(before)
    expect((await t.run("mirrors", "list")).result).toMatchObject({ items: [] })
  })

  it("refuses a path that is not a folder and a push with no mirrors", async () => {
    const t = setup()
    t.write("file.csv", "x")
    expect((await t.run("mirrors", "add", join(t.local, "file.csv"), "--parent", "root-folder")).error).toMatchObject({
      details: { reason: "mirror.not-folder" },
    })
    expect((await t.run("mirrors", "sync")).error).toMatchObject({ details: { reason: "mirror.none" } })
  })
})

describe("CSV values", () => {
  it("reads quoted fields, doubled quotes and line breaks", () => {
    expect(parseDelimited('a,"b, c","say ""hi""","two\nlines"\r\nx,,z', ",")).toEqual([
      ["a", "b, c", 'say "hi"', "two\nlines"],
      ["x", "", "z"],
    ])
  })

  it("types plain numbers only, never a leading zero, a formula or an unsafe integer", () => {
    expect(["12", "-3.5", "1e3", "007", "=SUM(A1)", "1,5", "9007199254740993", "TRUE"].map(typed)).toEqual([
      12,
      -3.5,
      1000,
      "007",
      "=SUM(A1)",
      "1,5",
      "9007199254740993",
      "TRUE",
    ])
  })
})
