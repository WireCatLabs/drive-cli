import { Socket } from "node:net"
import { captureStreams } from "@wirecat/cli-base"
import { OAuth2Client } from "google-auth-library"
import { afterEach, describe, expect, it, vi } from "vitest"
import { googleApi } from "./google-api.js"

import { commandResult, testProgram as createProgram, fixture } from "./testing.js"

type Cell = { value: string | number; format: Record<string, unknown> }
const setup = () => {
  const f = fixture()
  const original: Cell = {
    value: "=B2*2",
    format: { textFormat: { bold: false, italic: true }, numberFormat: { type: "NUMBER", pattern: "0.00" } },
  }
  const tabs = new Map<number, { title: string; rows: Cell[][] }>([
    [0, { title: "Budget", rows: [[structuredClone(original)], [{ value: 12, format: {} }]] }],
    [42, { title: "Other", rows: [[{ value: "untouched", format: {} }]] }],
  ])
  let writes = 0
  let failAfterApply = false
  const network = vi.spyOn(Socket.prototype, "connect").mockImplementation(() => {
    throw new Error("fixture forbids network sockets")
  })
  const auth = new OAuth2Client({
    transporterOptions: {
      retryConfig: { retryBackoff: async () => {} },
      fetchImplementation: async (input, options) => {
        const url = new URL(String(input))
        expect(url.origin).toBe("https://sheets.googleapis.com")
        if (options?.method === "GET")
          return Response.json({
            spreadsheetId: "synthetic-sheet",
            sheets: [...tabs.entries()].map(([id, tab]) => ({
              properties: { sheetId: id, title: tab.title, gridProperties: { rowCount: tab.rows.length } },
              ...(url.searchParams.get("includeGridData") === "true"
                ? {
                    data: [
                      {
                        rowData: tab.rows.map((row) => ({
                          values: row.map((cell) => ({
                            userEnteredValue:
                              typeof cell.value === "number"
                                ? { numberValue: cell.value }
                                : cell.value.startsWith("=")
                                  ? { formulaValue: cell.value }
                                  : { stringValue: cell.value },
                            userEnteredFormat: cell.format,
                          })),
                        })),
                      },
                    ],
                  }
                : {}),
            })),
          })
        writes++
        expect(url.pathname).toBe("/v4/spreadsheets/synthetic-sheet:batchUpdate")
        const body = JSON.parse(String(options?.body))
        const replies: unknown[] = []
        for (const request of body.requests) {
          if (request.addSheet) {
            const id = 100 + tabs.size
            tabs.set(id, { title: request.addSheet.properties.title, rows: [[]] })
            replies.push({ addSheet: { properties: { sheetId: id, title: request.addSheet.properties.title } } })
          } else if (request.updateSheetProperties) {
            const { properties, fields } = request.updateSheetProperties
            expect(fields).toBe("title")
            const tab = tabs.get(properties.sheetId)
            if (!tab) throw new Error("unknown synthetic tab")
            tab.title = properties.title
            replies.push({})
          } else if (request.insertDimension) {
            const { range } = request.insertDimension
            const tab = tabs.get(range.sheetId)
            if (!tab) throw new Error("unknown synthetic tab")
            const count = range.endIndex - range.startIndex
            if (range.dimension === "ROWS")
              for (let index = 0; index < count; index++) tab.rows.splice(range.startIndex + index, 0, [])
            else
              for (const row of tab.rows)
                for (let index = 0; index < count; index++)
                  row.splice(range.startIndex + index, 0, { value: "", format: {} })
            replies.push({})
          } else if (request.repeatCell) {
            const { range, cell, fields } = request.repeatCell
            expect(Object.keys(cell)).toEqual(["userEnteredFormat"])
            const tab = tabs.get(range.sheetId)
            if (!tab) throw new Error("unknown synthetic tab")
            for (let row = range.startRowIndex; row < range.endRowIndex; row++)
              for (let col = range.startColumnIndex; col < range.endColumnIndex; col++) {
                const target = tab.rows[row]?.[col]
                if (!target) throw new Error("unexpected synthetic grid cell")
                for (const field of fields.split(",")) {
                  expect(field.startsWith("userEnteredFormat.")).toBe(true)
                  const parts = field.split(".").slice(1)
                  let source: Record<string, unknown> = cell.userEnteredFormat
                  let destination = target.format
                  for (const part of parts.slice(0, -1)) {
                    source = source[part] as Record<string, unknown>
                    destination[part] ??= {}
                    destination = destination[part] as Record<string, unknown>
                  }
                  const leaf = parts.at(-1)
                  if (!leaf) throw new Error("empty synthetic format path")
                  destination[leaf] = source[leaf]
                }
              }
            replies.push({})
          } else throw new Error("unexpected synthetic batch operation")
        }
        if (failAfterApply) {
          failAfterApply = false
          return Response.json({ error: { message: "SYNTHETIC-PRIVATE-BODY" } }, { status: 503 })
        }
        return Response.json({ spreadsheetId: "synthetic-sheet", replies })
      },
    },
  })
  auth.setCredentials({ access_token: "SYNTHETIC-STRUCTURE-BEARER", expiry_date: Date.now() + 3600000 })
  const api = googleApi(auth)
  const run = async (...args: string[]) => {
    const streams = captureStreams()
    await createProgram({ env: f.env, streams, api }).parseAsync(["default", ...args, "--json"], { from: "user" })
    return commandResult(streams.stdout.join(""))
  }
  return {
    run,
    tabs,
    original,
    network,
    writes: () => writes,
    failNextWrite: () => {
      failAfterApply = true
    },
  }
}
afterEach(() => vi.restoreAllMocks())

describe("stateful Sheets structure through the pinned SDK", () => {
  it("creates, renames and inserts, then reads back stable IDs and preserved data", async () => {
    const f = setup()
    const other = structuredClone(f.tabs.get(42))
    const created = await f.run("sheets", "create", "synthetic-sheet", "Quarter 2")
    expect(created.replies[0].add_sheet.properties.title).toBe("Quarter 2")
    await f.run("sheets", "rename", "synthetic-sheet", "0", "Quarter 1")
    await f.run("sheets", "insert", "synthetic-sheet", "0", "rows", "1", "2")
    const after = await f.run("sheets", "info", "synthetic-sheet")
    expect(
      after.sheets.find((sheet: { properties: { sheetId: number } }) => sheet.properties.sheetId === 0).properties,
    ).toMatchObject({ title: "Quarter 1", gridProperties: { rowCount: 4 } })
    expect(f.tabs.get(0)?.rows[0]?.[0]?.value).toBe("=B2*2")
    expect(f.tabs.get(0)?.rows[3]?.[0]?.value).toBe(12)
    expect(f.tabs.get(42)).toEqual(other)
    expect(f.network).not.toHaveBeenCalled()
  })
  it("formats one leaf then independently reads unchanged values and other formatting", async () => {
    const f = setup()
    await f.run("sheets", "format", "synthetic-sheet", "0", "A1", "--body", '{"textFormat":{"bold":true}}')
    const after = await f.run(
      "api",
      "sheets-spreadsheets-get",
      "--spreadsheet-id",
      "synthetic-sheet",
      "--include-grid-data",
      "true",
    )
    const cell = after.sheets[0].data[0].row_data[0].values[0]
    expect(cell.user_entered_value.formula_value).toBe("=B2*2")
    expect(cell.user_entered_format).toEqual({
      text_format: { bold: true, italic: true },
      number_format: { type: "NUMBER", pattern: "0.00" },
    })
    expect(f.tabs.get(42)?.rows[0]?.[0]?.value).toBe("untouched")
    expect(f.network).not.toHaveBeenCalled()
  })
  it("does not duplicate row insertion after an apply-then-error response", async () => {
    const f = setup()
    f.failNextWrite()
    const error: unknown = await f
      .run("sheets", "insert", "synthetic-sheet", "0", "rows", "0", "1")
      .catch((error: unknown) => error)
    expect(error).toMatchObject({ code: "outcome_unknown" })
    expect(f.writes()).toBe(1)
    expect(f.tabs.get(0)?.rows).toHaveLength(3)
    expect(JSON.stringify(error)).not.toContain("SYNTHETIC-PRIVATE-BODY")
    expect(f.network).not.toHaveBeenCalled()
  })
})
