import { Socket } from "node:net"
import { captureStreams } from "@wirecat/cli-base"
import { OAuth2Client } from "google-auth-library"
import { afterEach, describe, expect, it, vi } from "vitest"
import { googleApi } from "./google-api.js"
import { createProgram } from "./program.js"
import { commandResult, fixture } from "./testing.js"

type Cell = { value: string | number | boolean; formula?: string }
const copy = <T>(value: T): T => structuredClone(value)
const cell = (value: Cell["value"]): Cell => ({ value })
const setup = () => {
  const f = fixture()
  const grid: (Cell | undefined)[][] = [
    [cell("Item"), cell("Amount"), cell("Note")],
    [cell("Travel"), cell(10), cell("keep")],
    [cell("Supplies"), cell(20), cell("unchanged")],
    [cell("Reserve"), cell(30), cell("keep too")],
  ]
  const otherTab = [[cell("untouched tab")]]
  const requests: { method: string; url: URL; body?: Record<string, unknown> }[] = []
  const network = vi.spyOn(Socket.prototype, "connect").mockImplementation(() => {
    throw new Error("synthetic Sheets roundtrip forbids network sockets")
  })
  let failAfterApply = false
  const auth = new OAuth2Client({
    transporterOptions: {
      retryConfig: { retryBackoff: async () => {} },
      fetchImplementation: async (input, options) => {
        const url = new URL(String(input))
        expect(url.origin).toBe("https://sheets.googleapis.com")
        expect(new Headers(options?.headers).get("authorization")).toBe("Bearer SYNTHETIC-SHEETS-BEARER")
        const body = options?.body ? (JSON.parse(String(options.body)) as Record<string, unknown>) : undefined
        const method = options?.method ?? "GET"
        requests.push({ method, url, ...(body ? { body } : {}) })
        const prefix = "/v4/spreadsheets/synthetic-sheet"
        if (url.pathname === prefix)
          return Response.json({
            spreadsheetId: "synthetic-sheet",
            properties: { title: "Synthetic workbook" },
            sheets: [
              { properties: { sheetId: 101, title: "Budget 2026" } },
              { properties: { sheetId: 102, title: "Other" } },
            ],
          })
        expect(url.pathname).toContain(`${prefix}/values/`)
        const route = decodeURIComponent(url.pathname.slice(`${prefix}/values/`.length))
        const clear = route.endsWith(":clear")
        const append = route.endsWith(":append")
        const range = route.replace(/:(clear|append)$/, "")
        const match = /^'Budget 2026'!([A-C])([1-9]\d*)(?::([A-C])([1-9]\d*))?$/.exec(range)
        if (!match) throw new Error("unexpected synthetic cell range")
        const firstColumn = (match[1] as string).charCodeAt(0) - 65
        const lastColumn = (match[3] ?? (match[1] as string)).charCodeAt(0) - 65
        const firstRow = Number(match[2]) - 1
        const lastRow = Number(match[4] ?? match[2]) - 1
        if (method === "GET") {
          const values = grid
            .slice(firstRow, lastRow + 1)
            .map((row) =>
              row
                .slice(firstColumn, lastColumn + 1)
                .map((entry) =>
                  url.searchParams.get("valueRenderOption") === "FORMULA" && entry?.formula
                    ? entry.formula
                    : (entry?.value ?? ""),
                ),
            )
          return Response.json({ range, majorDimension: "ROWS", values })
        }
        if (clear) {
          for (let row = firstRow; row <= lastRow; row++)
            for (let column = firstColumn; column <= lastColumn; column++) if (grid[row]) grid[row][column] = undefined
          return Response.json({ spreadsheetId: "synthetic-sheet", clearedRange: range })
        }
        const rows = body?.values as (Cell["value"] | null)[][]
        expect(body?.majorDimension).toBe("ROWS")
        expect(url.searchParams.get("includeValuesInResponse")).toBe("true")
        if (append) expect(url.searchParams.get("insertDataOption")).toBe("INSERT_ROWS")
        const offset = append ? grid.length : firstRow
        for (const [index, row] of rows.entries()) {
          grid[offset + index] ??= []
          for (const [column, value] of row.entries()) {
            if (value === null) continue
            grid[offset + index][firstColumn + column] =
              value === ""
                ? undefined
                : {
                    value,
                    ...(url.searchParams.get("valueInputOption") === "USER_ENTERED" &&
                    typeof value === "string" &&
                    value.startsWith("=")
                      ? { formula: value }
                      : {}),
                  }
          }
        }
        if (failAfterApply) {
          failAfterApply = false
          return Response.json({ error: { message: "SYNTHETIC-PRIVATE-SERVER-BODY" } }, { status: 503 })
        }
        const updatedRange = `'Budget 2026'!${match[1]}${offset + 1}:${String.fromCharCode(65 + firstColumn + rows.reduce((width, row) => Math.max(width, row.length), 0) - 1)}${offset + rows.length}`
        const result = {
          spreadsheetId: "synthetic-sheet",
          updatedRange,
          updatedRows: rows.length,
          updatedData: { range: updatedRange, values: rows },
        }
        return Response.json(
          append ? { spreadsheetId: "synthetic-sheet", tableRange: "'Budget 2026'!A1:C4", updates: result } : result,
        )
      },
    },
  })
  auth.setCredentials({ access_token: "SYNTHETIC-SHEETS-BEARER", expiry_date: Date.now() + 3600000 })
  const api = googleApi(auth)
  const run = async (...args: string[]) => {
    const streams = captureStreams()
    await createProgram({ env: f.env, streams, api }).parseAsync(["default", ...args, "--json"], { from: "user" })
    return commandResult(streams.stdout.join(""))
  }
  return {
    run,
    grid,
    otherTab,
    requests,
    network,
    failNextWriteAfterApply: () => {
      failAfterApply = true
    },
  }
}
afterEach(() => vi.restoreAllMocks())

describe("CLI roundtrips through the pinned Sheets SDK and auth transporter", () => {
  it("reads tabs, changes a selected rectangle and independently reads it back without touching neighbors", async () => {
    const f = setup()
    const before = copy(f.grid)
    const otherTab = copy(f.otherTab)
    expect((await f.run("sheets", "info", "synthetic-sheet")).sheets).toHaveLength(2)
    await f.run("sheets", "update", "synthetic-sheet", "'Budget 2026'!A2:B2", "--values", '[["Updated",25]]')
    const readback = await f.run("sheets", "show", "synthetic-sheet", "'Budget 2026'!A1:C4", "--render", "unformatted")
    expect(readback.values).toEqual([
      ["Item", "Amount", "Note"],
      ["Updated", 25, "keep"],
      ["Supplies", 20, "unchanged"],
      ["Reserve", 30, "keep too"],
    ])
    expect(f.grid[0]).toEqual(before[0])
    expect(f.grid[2]).toEqual(before[2])
    expect(f.grid[3]).toEqual(before[3])
    expect(f.otherTab).toEqual(otherTab)
    expect(f.requests.map((request) => request.method)).toEqual(["GET", "PUT", "GET"])
    expect(f.network).not.toHaveBeenCalled()
  })
  it("keeps raw formulas literal, opts into formula parsing, and preserves null versus empty cells", async () => {
    const f = setup()
    await f.run("sheets", "update", "synthetic-sheet", "'Budget 2026'!A2:B2", "--values", '[["=SUM(1,2)",null]]')
    expect(f.grid[1]?.[0]).toEqual({ value: "=SUM(1,2)" })
    expect(f.grid[1]?.[1]).toEqual({ value: 10 })
    await f.run(
      "sheets",
      "update",
      "synthetic-sheet",
      "'Budget 2026'!C2",
      "--values",
      '[["=B2*2"]]',
      "--input",
      "user-entered",
    )
    expect(f.grid[1]?.[2]?.formula).toBe("=B2*2")
    expect(
      (await f.run("sheets", "show", "synthetic-sheet", "'Budget 2026'!C2", "--render", "formula")).values,
    ).toEqual([["=B2*2"]])
    await f.run("sheets", "update", "synthetic-sheet", "'Budget 2026'!A2:B2", "--values", '[[null,""]]')
    expect((await f.run("sheets", "show", "synthetic-sheet", "'Budget 2026'!A2:B2")).values).toEqual([
      ["=SUM(1,2)", ""],
    ])
    expect(f.network).not.toHaveBeenCalled()
  })
  it("reports an append beyond the table search rectangle, then clears selected values only", async () => {
    const f = setup()
    const before = copy(f.grid)
    const added = await f.run(
      "sheets",
      "add",
      "synthetic-sheet",
      "'Budget 2026'!A1:C4",
      "--values",
      '[["New",40,"new note"]]',
    )
    expect(added.updates.updated_range).toBe("'Budget 2026'!A5:C5")
    expect((await f.run("sheets", "show", "synthetic-sheet", "'Budget 2026'!A5:C5")).values).toEqual([
      ["New", 40, "new note"],
    ])
    await f.run("sheets", "clear", "synthetic-sheet", "'Budget 2026'!B5:C5")
    expect((await f.run("sheets", "show", "synthetic-sheet", "'Budget 2026'!A5:C5")).values).toEqual([["New", "", ""]])
    expect(f.grid.slice(0, 4)).toEqual(before)
    expect(f.network).not.toHaveBeenCalled()
  })
  it("does not replay an append after the provider applied it but returned a server failure", async () => {
    const f = setup()
    f.failNextWriteAfterApply()
    const error: unknown = await f
      .run("sheets", "add", "synthetic-sheet", "'Budget 2026'!A1:C4", "--values", '[["Once",50]]')
      .catch((error: unknown) => error)
    expect(error).toMatchObject({ code: "outcome_unknown", details: { retryable: false } })
    expect(f.requests.filter((request) => request.method === "POST")).toHaveLength(1)
    expect(f.grid).toHaveLength(5)
    expect((await f.run("sheets", "show", "synthetic-sheet", "'Budget 2026'!A5:B5")).values).toEqual([["Once", 50]])
    expect(JSON.stringify(error)).not.toContain("SYNTHETIC-SHEETS-BEARER")
    expect(JSON.stringify(error)).not.toContain("SYNTHETIC-PRIVATE-SERVER-BODY")
    expect(f.network).not.toHaveBeenCalled()
  })
})
