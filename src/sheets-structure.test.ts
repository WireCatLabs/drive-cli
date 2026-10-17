import { captureStreams } from "@wirecat/cli-base"
import { describe, expect, it, vi } from "vitest"
import { readConfig, writeConfig } from "./config.js"
import { createProgram } from "./program.js"
import { commandResult, fixture } from "./testing.js"

const setup = () => {
  const f = fixture()
  const call = vi.fn(async () => ({ replies: [{ synthetic: true }] }))
  const run = async (...args: string[]) => {
    const streams = captureStreams()
    await createProgram({ env: f.env, streams, api: { call } }).parseAsync(["default", ...args, "--json"], {
      from: "user",
    })
    return commandResult(streams.stdout.join(""))
  }
  return { ...f, run, call }
}

describe("bounded native Sheets structure and formatting", () => {
  it("creates and renames only the selected tab fields", async () => {
    const f = setup()
    await f.run("sheets", "create", "synthetic-sheet", "Quarter 2")
    expect(f.call).toHaveBeenLastCalledWith(
      "sheets.spreadsheets.batchUpdate",
      { spreadsheetId: "synthetic-sheet" },
      {
        requests: [{ addSheet: { properties: { title: "Quarter 2" } } }],
      },
    )
    await f.run("sheets", "rename", "https://docs.google.com/spreadsheets/d/synthetic-sheet/edit", "0", "Q2")
    expect(f.call).toHaveBeenLastCalledWith(
      "sheets.spreadsheets.batchUpdate",
      { spreadsheetId: "synthetic-sheet" },
      {
        requests: [{ updateSheetProperties: { properties: { sheetId: 0, title: "Q2" }, fields: "title" } }],
      },
    )
  })
  it.each(["rows", "columns"])("inserts a bounded %s range using explicit zero-based indexes", async (axis) => {
    const f = setup()
    await f.run("sheets", "insert", "synthetic-sheet", "101", axis, "1", "3")
    expect(f.call).toHaveBeenCalledWith(
      "sheets.spreadsheets.batchUpdate",
      { spreadsheetId: "synthetic-sheet" },
      {
        requests: [
          {
            insertDimension: {
              range: { sheetId: 101, dimension: axis.toUpperCase(), startIndex: 1, endIndex: 4 },
              inheritFromBefore: false,
            },
          },
        ],
      },
    )
  })
  it("derives leaf field masks and a finite GridRange without supplying cell values", async () => {
    const f = setup()
    const format = { textFormat: { bold: true, italic: false }, numberFormat: { type: "NUMBER", pattern: "0.00" } }
    await f.run("sheets", "format", "synthetic-sheet", "101", "B2:C4", "--body", JSON.stringify(format))
    expect(f.call).toHaveBeenCalledWith(
      "sheets.spreadsheets.batchUpdate",
      { spreadsheetId: "synthetic-sheet" },
      {
        requests: [
          {
            repeatCell: {
              range: { sheetId: 101, startRowIndex: 1, endRowIndex: 4, startColumnIndex: 1, endColumnIndex: 3 },
              cell: { userEnteredFormat: format },
              fields:
                "userEnteredFormat.textFormat.bold,userEnteredFormat.textFormat.italic,userEnteredFormat.numberFormat.type,userEnteredFormat.numberFormat.pattern",
            },
          },
        ],
      },
    )
  })
  it.each([
    ["create", "synthetic-sheet", " "],
    ["create", "synthetic-sheet", "x".repeat(101)],
    ["rename", "synthetic-sheet", "-1", "Q2"],
    ["rename", "synthetic-sheet", "2147483648", "Q2"],
    ["insert", "synthetic-sheet", "0", "diagonal", "1", "1"],
    ["insert", "synthetic-sheet", "0", "rows", "-1", "1"],
    ["insert", "synthetic-sheet", "0", "rows", "0", "0"],
    ["insert", "synthetic-sheet", "0", "rows", "0", "1001"],
    ["insert", "synthetic-sheet", "0", "columns", "18278", "1"],
    ["format", "synthetic-sheet", "0", "A:C", "--body", '{"textFormat":{"bold":true}}'],
    ["format", "synthetic-sheet", "0", "Budget!A1:C4", "--body", '{"textFormat":{"bold":true}}'],
    ["format", "synthetic-sheet", "0", "A1:Z1000", "--body", '{"textFormat":{"bold":true}}'],
    ["format", "synthetic-sheet", "0", "A1", "--body", "{}"],
    ["format", "synthetic-sheet", "0", "A1", "--body", '{"textFormat":{}}'],
    ["format", "synthetic-sheet", "0", "A1", "--body", '{"userEnteredValue":{"stringValue":"DO_NOT_LOG"}}'],
    ["format", "synthetic-sheet", "0", "A1", "--body", '{"textFormat":{"invented":"DO_NOT_LOG"}}'],
    ["format", "synthetic-sheet", "0", "A1", "--body", '{"textFormat":{"bold":"DO_NOT_LOG"}}'],
  ])("refuses invalid structure/formatting before providers: %j", async (...args: string[]) => {
    const f = setup()
    const error: unknown = await f.run("sheets", ...args).catch((error: unknown) => error)
    expect(error).toMatchObject({ code: "validation_error" })
    expect(JSON.stringify(error)).not.toContain("DO_NOT_LOG")
    expect(f.call).not.toHaveBeenCalled()
  })
  it("retains dry-run, offline and read-only behavior", async () => {
    const f = setup()
    expect(await f.run("--dry-run", "sheets", "create", "synthetic-sheet", "Q2")).toMatchObject({
      dry_run: true,
      method: "sheets.spreadsheets.batchUpdate",
    })
    await expect(f.run("--offline", "sheets", "rename", "synthetic-sheet", "0", "Q2")).rejects.toMatchObject({
      code: "permission_error",
    })
    await expect(
      f.run("--read-only", "sheets", "format", "synthetic-sheet", "0", "A1", "--body", '{"textFormat":{"bold":true}}'),
    ).rejects.toMatchObject({ code: "permission_error" })
    expect(f.call).not.toHaveBeenCalled()
  })
  it.each([
    [
      "rename",
      { updateSheetProperties: { properties: { sheetId: 0, title: "Q2" }, fields: "title" } },
      ["rename", "synthetic-sheet", "0", "Q2"],
    ],
    ["create", { addSheet: { properties: { title: "Q2" } } }, ["create", "synthetic-sheet", "Q2"]],
    [
      "insert",
      { insertDimension: { range: { sheetId: 0, dimension: "ROWS", startIndex: 0, endIndex: 1 } } },
      ["insert", "synthetic-sheet", "0", "rows", "0", "1"],
    ],
    [
      "format",
      {
        repeatCell: {
          range: { sheetId: 0 },
          cell: { userEnteredFormat: { textFormat: { bold: true } } },
          fields: "userEnteredFormat.textFormat.bold",
        },
      },
      ["format", "synthetic-sheet", "0", "A1", "--body", '{"textFormat":{"bold":true}}'],
    ],
  ] as const)(
    "applies sheets.%s policy to friendly, raw and generated batch requests",
    async (permission, request, friendly) => {
      const f = setup()
      const config = readConfig(f.env)
      config.defaults = { permissions: { [`sheets.${permission}`]: "deny" } }
      writeConfig(f.env, config)
      const body = JSON.stringify({ requests: [request] })
      for (const args of [
        ["sheets", ...friendly],
        [
          "api",
          "call",
          "sheets.spreadsheets.batchUpdate",
          "--params",
          '{"spreadsheetId":"synthetic-sheet"}',
          "--body",
          body,
          "--allow-writes",
        ],
        ["api", "sheets-spreadsheets-batch-update", "--spreadsheet-id", "synthetic-sheet", "--body", body],
      ])
        await expect(f.run(...args)).rejects.toMatchObject({ code: "permission_error" })
      expect(f.call).not.toHaveBeenCalled()
    },
  )
})
