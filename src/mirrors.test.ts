import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs"
import { createServer } from "node:net"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { captureStreams, isCliError } from "@wirecat/cli-base"
import { describe, expect, it, vi } from "vitest"
import { mcpTools } from "./mcp.js"
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
    const match = /^'((?:[^']|'')*)'!A1:([A-Z]+)(\d*)$/.exec(range)
    if (!match) throw new Error(`unexpected range ${range}`)
    const title = (match[1] as string).replace(/''/g, "'")
    const tab = tabs.get(spreadsheetId)?.find((item) => item.title === title)
    if (!tab) throw new Error(`no tab ${title}`)
    const columns = [...(match[2] as string)].reduce((sum, letter) => sum * 26 + letter.charCodeAt(0) - 64, 0)
    return { tab, rows: match[3] ? Number(match[3]) : Number.POSITIVE_INFINITY, columns }
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
      case "drive.revisions.list":
        return {
          revisions: [
            { modifiedTime: "2026-10-22T09:00:00.000Z", lastModifyingUser: { displayName: "Synthetic Editor" } },
          ],
        }
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
  const local = mkdtempSync(join(tmpdir(), "drive-mirror-"))
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
  it("omits local roots and file names from status while retaining counts", async () => {
    const t = setup()
    t.write("SECRET-NAME.csv", "item,amount\nrent,950\n")
    await t.run("mirrors", "add", t.local, "--parent", "root-folder")
    const before = t.google.calls.length
    const status = await t.run("mirrors", "status")
    expect(status.error).toBeUndefined()
    expect(JSON.stringify(status.result)).not.toContain("SECRET-NAME")
    expect(JSON.stringify(status.result)).not.toContain(t.local)
    expect(status.result).toMatchObject({
      items: [{ create: 1, update: 0, orphans: 0, unsupported: 0, remote_checked: false }],
    })
    expect(t.google.calls).toHaveLength(before)
  })

  it("adds a mirror, then creates a Sheet with typed cells and a frozen bold header", async () => {
    const t = setup()
    t.write("data/budget.csv", 'item,amount,code\n"rent, flat",950.5,007\nfood,=1+1,42\n')
    const added = await t.run("mirrors", "add", t.local, "--parent", "root-folder")
    const id = (added.result as { id: string }).id
    expect((await t.run("mirrors", "status")).result).toMatchObject({
      items: [{ id, create: 1, update: 0, remote_checked: false }],
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
      items: [{ create: 0, update: 0, unchanged: 1 }],
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

  it("reports cells changed on both sides with when Google changed them, and keeps the side asked for", async () => {
    const t = setup()
    t.write("budget.csv", "a\n1\n")
    t.write("other.csv", "x\n1\n")
    await t.run("mirrors", "add", t.local, "--parent", "root-folder")
    await t.run("mirrors", "sync")
    const sheetId = [...t.google.files.entries()].find(([, file]) => file.name === "budget")?.[0] as string
    const tab = t.google.tabs.get(sheetId)?.[0]
    if (!tab) throw new Error("missing tab")
    ;(tab.cells[1] as Cell[])[0] = "edited in Google"
    t.write("budget.csv", "a\n2\n")
    t.write("other.csv", "x\n2\n")
    const stopped = await t.run("mirrors", "sync")
    expect(stopped.error).toMatchObject({ code: "provider_error", details: { reason: "mirror.partial" } })
    expect(stopped.result).toMatchObject({
      meta: { complete: false, issues: [{ code: "provider_error", reason: "mirror.partial" }] },
    })
    expect(stopped.result).toMatchObject({
      items: [
        {
          updated: ["other.csv"],
          conflicts: [
            {
              path: "budget.csv",
              reason: "the mirrored cells changed here and in Google",
              local_changed_at: expect.any(String),
              google_changed_at: "2026-10-22T09:00:00.000Z",
              google_changed_by: "Synthetic Editor",
            },
          ],
        },
      ],
    })
    expect(tab.cells[1]).toEqual(["edited in Google"])
    expect((await t.run("mirrors", "sync", "--keep", "both")).error).toMatchObject({ code: "provider_error" })
    expect((await t.run("mirrors", "sync", "--keep", "google")).error).toBeUndefined()
    expect(readFileSync(join(t.local, "budget.csv"), "utf8")).toBe("a\nedited in Google\n")
    t.write("budget.csv", "a\n3\n")
    ;(tab.cells[1] as Cell[])[0] = "again in Google"
    expect((await t.run("mirrors", "sync", "--replace")).error).toBeUndefined()
    expect(tab.cells[1]).toEqual([3])
  })

  it("brings cells edited in Google back into the CSV, keeping how the file spells unchanged values", async () => {
    const t = setup()
    t.write("prices.csv", '\uFEFFitem,price\r\ntea,1.50\r\n"milk, oat",2\r\n')
    await t.run("mirrors", "add", t.local, "--parent", "root-folder")
    await t.run("mirrors", "sync")
    const sheetId = [...t.google.files.entries()].find(([, file]) => file.mimeType === SHEET)?.[0] as string
    const tab = t.google.tabs.get(sheetId)?.[0]
    if (!tab) throw new Error("missing tab")
    ;(tab.cells[2] as Cell[])[1] = 2.25
    tab.cells.push(["bread", 3])
    const pulled = await t.run("mirrors", "sync")
    expect(pulled.error).toBeUndefined()
    expect(pulled.result).toMatchObject({ items: [{ pulled: ["prices.csv"], updated: [] }] })
    expect(readFileSync(join(t.local, "prices.csv"), "utf8")).toBe(
      '\uFEFFitem,price\r\ntea,1.50\r\n"milk, oat",2.25\r\nbread,3\r\n',
    )
    expect((await t.run("mirrors", "sync")).result).toMatchObject({
      items: [{ pulled: [], updated: [], unchanged: 1 }],
    })
  })

  it("does not write Google's changes into an XLSX file", async () => {
    const t = setup()
    t.write("book.xlsx", workbook({ First: "alpha" }))
    await t.run("mirrors", "add", t.local, "--parent", "root-folder")
    await t.run("mirrors", "sync")
    const sheetId = [...t.google.files.entries()].find(([, file]) => file.mimeType === SHEET)?.[0] as string
    const tab = t.google.tabs.get(sheetId)?.[0]
    if (!tab) throw new Error("missing tab")
    ;(tab.cells[0] as Cell[])[0] = "edited in Google"
    const stopped = await t.run("mirrors", "sync")
    expect(stopped.result).toMatchObject({ items: [{ conflicts: [{ path: "book.xlsx" }] }] })
    expect((await t.run("mirrors", "sync", "--keep", "local")).error).toBeUndefined()
    expect(tab.cells[0]).toEqual(["alpha"])
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

/** Runs `mirrors watch` with JSON lines until `stop` says so; the lines it printed and the error it ended with. */
const watching = async (
  t: ReturnType<typeof setup>,
  args: string[],
  stop: (lines: Record<string, unknown>[], controller: AbortController) => void = () => {},
  env: NodeJS.ProcessEnv = t.env,
) => {
  const streams = captureStreams()
  const controller = new AbortController()
  const lines = () =>
    streams.stdout
      .join("\n")
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line) as Record<string, unknown>)
  const running = createProgram({
    env,
    streams,
    source: async () => t.source,
    api: { call: t.google.call },
    signal: controller.signal,
  }).parseAsync(["default", "mirrors", "watch", ...args, "--jsonl"], { from: "user" })
  const ticker = setInterval(() => stop(lines(), controller), 20)
  try {
    await running
    return { lines: lines() }
  } catch (error) {
    if (!isCliError(error)) throw error
    return { lines: lines(), error }
  } finally {
    clearInterval(ticker)
    controller.abort()
  }
}
const items = (lines: Record<string, unknown>[]) =>
  lines.filter((line) => line.type === "item").map((line) => line.data as Record<string, unknown>)

describe("mirrors watch", () => {
  it("syncs at start, then a saved file, and ends normally on Ctrl-C with the end record", async () => {
    const t = setup()
    t.write("budget.csv", "a\n1\n")
    await t.run("mirrors", "add", t.local, "--parent", "root-folder")
    let saved = false
    const { lines, error } = await watching(t, [], (printed, controller) => {
      const cycles = items(printed)
      if (cycles.length === 1 && !saved) {
        saved = true
        t.write("budget.csv", "a\n2\n")
      }
      if (cycles.length === 2) controller.abort()
    })
    expect(error).toBeUndefined()
    expect(items(lines).map((cycle) => cycle.triggers)).toEqual([["start"], ["local"]])
    expect(items(lines)[0]).toMatchObject({ results: [{ created: ["budget.csv"] }] })
    expect(items(lines)[1]).toMatchObject({ results: [{ updated: ["budget.csv"] }] })
    expect(lines.at(-1)).toMatchObject({ type: "end", complete: true })
  })

  it("ends normally at --timeout", async () => {
    const t = setup()
    t.write("budget.csv", "a\n1\n")
    await t.run("mirrors", "add", t.local, "--parent", "root-folder")
    const streams = captureStreams()
    await createProgram({
      env: t.env,
      streams,
      source: async () => t.source,
      api: { call: t.google.call },
    }).parseAsync(["default", "--timeout", "1s", "mirrors", "watch", "--jsonl"], { from: "user" })
    const printed = streams.stdout.join("\n").trim().split("\n")
    expect(JSON.parse(printed.at(-1) as string)).toMatchObject({ type: "end", complete: true })
  })

  it("syncs a mirror when Google's change feed names one of its files", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "Date"] })
    try {
      const t = setup()
      t.write("budget.csv", "a\n1\n")
      await t.run("mirrors", "add", t.local, "--parent", "root-folder")
      const sheetOf = () => [...t.google.files.entries()].find(([, file]) => file.mimeType === SHEET)?.[0]
      vi.mocked(t.source.changes).mockImplementation(async () => ({
        items: [{ id: sheetOf() as string, removed: false }],
        cursor: "next",
      }))
      let advanced = false
      const { lines } = await watching(t, ["--every", "10s"], (printed, controller) => {
        if (items(printed).length === 1 && !advanced) {
          advanced = true
          void vi.advanceTimersByTimeAsync(10_000)
        }
        if (items(printed).length === 2) controller.abort()
      })
      expect(items(lines).map((cycle) => cycle.triggers)).toEqual([["start"], ["remote"]])
      expect(t.source.changes).toHaveBeenCalledWith("before-crawl")
    } finally {
      vi.useRealTimers()
    }
  })

  it("is refused under DRIVE_READ_ONLY and is not an MCP tool", async () => {
    const t = setup()
    t.write("budget.csv", "a\n1\n")
    await t.run("mirrors", "add", t.local, "--parent", "root-folder")
    const { error } = await watching(t, [], () => {}, { ...t.env, DRIVE_READ_ONLY: "1" })
    expect(error).toMatchObject({ code: "permission_error" })
    const tools = mcpTools(createProgram, { env: t.env, api: { call: t.google.call } }, "default").map(
      (tool) => tool.name,
    )
    expect(tools).toContain("drive_mirrors_sync")
    expect(tools).not.toContain("drive_mirrors_watch")
  })

  it("refuses a poll more often than every 10 seconds", async () => {
    const t = setup()
    t.write("budget.csv", "a\n1\n")
    await t.run("mirrors", "add", t.local, "--parent", "root-folder")
    expect((await watching(t, ["--every", "1s"])).error).toMatchObject({ code: "validation_error" })
  })

  it("refuses a busy image port and a --port without --public-url before syncing anything", async () => {
    const t = setup()
    t.write("plan.md", "Plan\n\n![chart](chart.png)\n")
    await t.run("mirrors", "add", t.local, "--parent", "root-folder")
    const blocker = createServer().listen(0, "127.0.0.1")
    await new Promise((done) => blocker.once("listening", done))
    const port = String((blocker.address() as { port: number }).port)
    const tunnel = ["--public-url", `http://127.0.0.1:${port}`, "--port", port]
    try {
      const calls = t.google.calls.length
      expect((await t.run("mirrors", "sync", ...tunnel)).error).toMatchObject({
        details: { reason: "mirror.port-busy" },
      })
      expect((await watching(t, tunnel)).error).toMatchObject({ details: { reason: "mirror.port-busy" } })
      expect((await t.run("mirrors", "sync", "--port", port)).error).toMatchObject({ code: "validation_error" })
      expect((await watching(t, ["--port", port])).error).toMatchObject({ code: "validation_error" })
      expect(t.google.calls.length).toBe(calls)
    } finally {
      blocker.close()
    }
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
