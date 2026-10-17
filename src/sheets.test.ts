import { captureStreams } from "@wirecat/cli-base"
import { OAuth2Client } from "google-auth-library"
import { describe, expect, it, vi } from "vitest"
import { apiMethod, googleApi } from "./google-api.js"
import { methodPolicyKeys } from "./policy.js"
import { createProgram } from "./program.js"
import { commandResult, fixture } from "./testing.js"
import { READ_SCOPE, WRITE_SCOPE } from "./tokens.js"

const setup = () => {
  const f = fixture()
  const call = vi.fn(async () => ({ spreadsheetId: "synthetic-sheet", updatedRange: "Budget!A1:B2" }))
  const run = async (...args: string[]) => {
    const streams = captureStreams()
    await createProgram({ env: f.env, streams, api: { call } }).parseAsync(["default", ...args, "--json"], {
      from: "user",
    })
    return commandResult(streams.stdout.join(""))
  }
  return { ...f, call, run }
}

describe("native Google Sheets operations", () => {
  it("uses existing grants and correctly classifies read-only POST queries", () => {
    for (const name of [
      "get",
      "getByDataFilter",
      "values.get",
      "values.batchGetByDataFilter",
      "developerMetadata.search",
    ])
      expect(apiMethod(`sheets.spreadsheets.${name}`)).toMatchObject({
        mutates: false,
        scope: name === "get" || name === "values.get" ? READ_SCOPE : WRITE_SCOPE,
      })
    for (const name of ["create", "batchUpdate", "values.update", "values.append", "values.clear"])
      expect(apiMethod(`sheets.spreadsheets.${name}`)).toMatchObject({ mutates: true, scope: WRITE_SCOPE })
    expect(methodPolicyKeys("sheets.spreadsheets.values.update")).toContain("sheets.update")
  })
  it("lists tabs without grid data and reads values or formulas with source IDs preserved", async () => {
    const f = setup()
    expect(await f.run("sheets", "info", "https://docs.google.com/spreadsheets/d/synthetic-sheet/edit")).toMatchObject({
      spreadsheet_id: "synthetic-sheet",
    })
    expect(f.call).toHaveBeenLastCalledWith(
      "sheets.spreadsheets.get",
      expect.objectContaining({ spreadsheetId: "synthetic-sheet", includeGridData: false }),
      undefined,
    )
    await f.run("sheets", "show", "synthetic-sheet", "'Quarter 1'!A1:B4", "--render", "formula")
    expect(f.call).toHaveBeenLastCalledWith(
      "sheets.spreadsheets.values.get",
      expect.objectContaining({ range: "'Quarter 1'!A1:B4", valueRenderOption: "FORMULA" }),
      undefined,
    )
    await f.run("sheets", "show", "synthetic-sheet", "Budget!A1:B4", "--render", "unformatted")
    expect(f.call).toHaveBeenLastCalledWith(
      "sheets.spreadsheets.values.get",
      expect.objectContaining({ valueRenderOption: "UNFORMATTED_VALUE" }),
      undefined,
    )
  })
  it("defaults to raw literals, bounds updates and requests returned values", async () => {
    const f = setup()
    expect(
      await f.run("sheets", "update", "synthetic-sheet", "Budget!A1:B2", "--values", '[["=SUM(A2:A3)",4],[null,""]]'),
    ).toMatchObject({ updated_range: "Budget!A1:B2" })
    expect(f.call).toHaveBeenCalledWith(
      "sheets.spreadsheets.values.update",
      expect.objectContaining({ range: "Budget!A1:B2", valueInputOption: "RAW", includeValuesInResponse: true }),
      {
        majorDimension: "ROWS",
        values: [
          ["=SUM(A2:A3)", 4],
          [null, ""],
        ],
      },
    )
    await f.run(
      "sheets",
      "update",
      "synthetic-sheet",
      "Budget!B1",
      "--input",
      "user-entered",
      "--values",
      '[["=SUM(A2:A3)"]]',
    )
    expect(f.call).toHaveBeenLastCalledWith(
      "sheets.spreadsheets.values.update",
      expect.objectContaining({ valueInputOption: "USER_ENTERED" }),
      expect.anything(),
    )
  })
  it("appends with row insertion and clears only values in the selected rectangle", async () => {
    const f = setup()
    await f.run("sheets", "add", "synthetic-sheet", "Budget!A1:B4", "--values", '[["item",5]]')
    expect(f.call).toHaveBeenLastCalledWith(
      "sheets.spreadsheets.values.append",
      expect.objectContaining({ insertDataOption: "INSERT_ROWS" }),
      { majorDimension: "ROWS", values: [["item", 5]] },
    )
    await f.run("sheets", "clear", "synthetic-sheet", "Budget!A2:B4")
    expect(f.call).toHaveBeenLastCalledWith(
      "sheets.spreadsheets.values.clear",
      { spreadsheetId: "synthetic-sheet", range: "Budget!A2:B4" },
      {},
    )
  })
  it.each([
    ["A1:B2", "[[1]]"],
    ["Budget!A:B", "[[1]]"],
    ["Budget!B2:A1", "[[1]]"],
    ["Budget!A1", "[[1,2]]"],
    ["Budget!A1", "[[1],[2]]"],
    ["Budget!A1", "[]"],
    ["Budget!A1", "[[]]"],
    ["Budget!A1", '[[{"unknown":"do-not-log"}]]'],
    ["Budget!A1", "[[1e999]]"],
    ["Budget!A1", "[[0.123456789012345678901]]"],
    ["Budget!A1:ZZZ999999999999999999", "[[1]]"],
  ])("rejects invalid range/values before the API (%s)", async (range, values) => {
    const f = setup()
    await expect(f.run("sheets", "update", "synthetic-sheet", range, "--values", values)).rejects.toMatchObject({
      code: "validation_error",
    })
    expect(f.call).not.toHaveBeenCalled()
  })
  it("preserves offline/read-only/dry-run gates and rejects unknown flags", async () => {
    const f = setup()
    await expect(f.run("--offline", "sheets", "show", "synthetic-sheet", "Budget!A1")).rejects.toMatchObject({
      code: "permission_error",
    })
    await expect(f.run("--read-only", "sheets", "clear", "synthetic-sheet", "Budget!A1")).rejects.toMatchObject({
      code: "permission_error",
    })
    await expect(f.run("sheets", "show", "synthetic-sheet", "Budget!A1", "--unknown", "secret")).rejects.toThrow(
      "unknown option",
    )
    const preview = await f.run("--dry-run", "sheets", "update", "synthetic-sheet", "Budget!A1", "--values", "[[1]]")
    expect(preview).toMatchObject({ dry_run: true })
    expect(f.call).not.toHaveBeenCalled()
  })
  it("refuses raw API writes without explicit --allow-writes", async () => {
    const f = setup()
    await expect(
      f.run(
        "api",
        "call",
        "sheets.spreadsheets.values.clear",
        "--params",
        '{"spreadsheetId":"synthetic-sheet","range":"Budget!A1"}',
        "--body",
        "{}",
      ),
    ).rejects.toThrow("--allow-writes")
    expect(f.call).not.toHaveBeenCalled()
    await f.run(
      "api",
      "call",
      "sheets.spreadsheets.values.clear",
      "--params",
      '{"spreadsheetId":"synthetic-sheet","range":"Budget!A1"}',
      "--body",
      "{}",
      "--allow-writes",
    )
    expect(f.call).toHaveBeenCalledOnce()
  })
  it("passes declared repeated ranges as SDK arrays and refuses nested transport values", async () => {
    const auth = new OAuth2Client("synthetic-client")
    const request = vi.fn(async (_options: unknown) => ({ data: { valueRanges: [] } }))
    Object.defineProperty(auth, "request", { value: request })
    const api = googleApi(auth)
    await api.call("sheets.spreadsheets.values.batchGet", {
      spreadsheetId: "synthetic-sheet",
      ranges: "Budget!A1, Budget!C1",
    })
    expect(request.mock.calls[0]?.[0]).toMatchObject({ params: { ranges: ["Budget!A1", "Budget!C1"] } })
    await api.call("sheets.spreadsheets.values.batchGet", {
      spreadsheetId: "synthetic-sheet",
      ranges: ["'Quarter, One'!A1"],
    })
    await expect(
      api.call("sheets.spreadsheets.values.batchGet", {
        spreadsheetId: "synthetic-sheet",
        ranges: [{ headers: "override" }],
      }),
    ).rejects.toThrow("override")
    expect(request).toHaveBeenCalledTimes(2)
  })
  it("uses the official SDK URL/body and reports an uncertain write without retry", async () => {
    const auth = new OAuth2Client("synthetic-client")
    const request = vi.fn(async (_options: unknown, _extra?: unknown) => ({ data: { updatedRange: "'Quarter 1'!A1" } }))
    Object.defineProperty(auth, "request", { value: request })
    const api = googleApi(auth)
    await api.call(
      "sheets.spreadsheets.values.update",
      { spreadsheetId: "synthetic-sheet", range: "'Quarter 1'!A1", valueInputOption: "RAW" },
      { values: [["literal"]] },
    )
    expect(request.mock.calls[0]?.[0]).toMatchObject({ method: "PUT", data: { values: [["literal"]] }, retry: false })
    expect(String((request.mock.calls[0]?.[0] as { url: unknown } | undefined)?.url)).toContain("sheets.googleapis.com")
    request.mockRejectedValueOnce({ status: 503, message: "DO_NOT_LOG" } as never)
    await expect(
      api.call(
        "sheets.spreadsheets.values.append",
        { spreadsheetId: "synthetic-sheet", range: "Budget!A1", valueInputOption: "RAW" },
        { values: [[1]] },
      ),
    ).rejects.toMatchObject({ code: "outcome_unknown" })
    expect(request).toHaveBeenCalledTimes(2)
  })
})
