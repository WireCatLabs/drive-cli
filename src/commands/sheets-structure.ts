import { CliError } from "@wirecat/cli-base"
import { annotate } from "@wirecat/cli-base/commands"
import { itemOf } from "@wirecat/cli-core/cli"
import type { Command } from "commander"
import { jsonObject } from "../api-contract.js"
import { fileId } from "../config.js"
import { examples, GOOGLE_WRITE } from "../registry.js"
import { cellRectangle } from "../sheets-input.js"
import type { RemoteCommands } from "./remote.js"

const integer = (name: string, raw: string, maximum: number, minimum = 0) => {
  if (!/^\d+$/.test(raw) || !Number.isSafeInteger(Number(raw)) || Number(raw) < minimum || Number(raw) > maximum)
    throw new CliError("validation_error", `${name} must be an integer from ${minimum} to ${maximum}`)
  return Number(raw)
}
const sheetId = (raw: string) => integer("sheet-id", raw, 2147483647)
const title = (raw: string) => {
  if (!raw.trim() || raw.length > 100) throw new CliError("validation_error", "title must contain 1 to 100 characters")
  return raw
}
const color = (prefix: string) => ["red", "green", "blue", "alpha"].map((key) => `${prefix}.${key}`)
const FORMAT_PATHS = new Set([
  ...color("backgroundColor"),
  ...color("backgroundColorStyle.rgbColor"),
  "backgroundColorStyle.themeColor",
  "horizontalAlignment",
  "verticalAlignment",
  "wrapStrategy",
  "numberFormat.type",
  "numberFormat.pattern",
  "textFormat.bold",
  "textFormat.italic",
  "textFormat.underline",
  "textFormat.strikethrough",
  "textFormat.fontFamily",
  "textFormat.fontSize",
  ...color("textFormat.foregroundColor"),
  ...color("textFormat.foregroundColorStyle.rgbColor"),
  "textFormat.foregroundColorStyle.themeColor",
])
const formatFields = (body: Record<string, unknown>, prefix = ""): string[] => {
  const paths: string[] = []
  if (!Object.keys(body).length) throw new CliError("validation_error", "--body must set at least one formatting field")
  for (const [key, value] of Object.entries(body)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (FORMAT_PATHS.has(path)) {
      paths.push(`userEnteredFormat.${path}`)
    } else if (
      [...FORMAT_PATHS].some((candidate) => candidate.startsWith(`${path}.`)) &&
      value &&
      typeof value === "object" &&
      !Array.isArray(value)
    ) {
      for (const field of formatFields(value as Record<string, unknown>, path)) paths.push(field)
    } else throw new CliError("validation_error", "--body contains an unsupported formatting field or shape")
  }
  return paths
}
export const installSheetsStructureCommands = (
  group: Command,
  { call, output }: Pick<RemoteCommands, "call" | "output">,
) => {
  const batch = async (spreadsheet: string, request: Record<string, unknown>) =>
    output(
      itemOf(
        await call("sheets.spreadsheets.batchUpdate", { spreadsheetId: fileId(spreadsheet) }, { requests: [request] }),
      ),
    )
  examples(
    annotate(group.command("create"), { effects: GOOGLE_WRITE })
      .description("create an empty tab inside an existing spreadsheet")
      .argument("<spreadsheet>", "spreadsheet ID or Google Sheets URL")
      .argument("<title>", "name of the new tab", title),
    ['drive personal sheets create SHEET_ID "Quarter 2"'],
  ).action(async (spreadsheet: string, name: string) =>
    batch(spreadsheet, { addSheet: { properties: { title: name } } }),
  )
  examples(
    annotate(group.command("rename"), { effects: GOOGLE_WRITE })
      .description("rename one tab while preserving its ID and other properties")
      .argument("<spreadsheet>", "spreadsheet ID or Google Sheets URL")
      .argument("<sheet-id>", "numeric tab ID from sheets info", sheetId)
      .argument("<title>", "new tab name", title),
    ['drive personal sheets rename SHEET_ID 0 "Quarter 2"'],
  ).action(async (spreadsheet: string, id: number, name: string) =>
    batch(spreadsheet, {
      updateSheetProperties: { properties: { sheetId: id, title: name }, fields: "title" },
    }),
  )
  examples(
    annotate(group.command("insert"), { effects: GOOGLE_WRITE })
      .description("insert bounded rows or columns before a zero-based index")
      .argument("<spreadsheet>", "spreadsheet ID or Google Sheets URL")
      .argument("<sheet-id>", "numeric tab ID from sheets info", sheetId)
      .argument("<axis>", "rows or columns", (raw: string) => {
        if (raw !== "rows" && raw !== "columns") throw new CliError("validation_error", "axis must be rows or columns")
        return raw
      })
      .argument("<index>", "zero-based index to insert before", (raw: string) => integer("index", raw, 9999999))
      .argument("<count>", "number to insert, from 1 to 1000", (raw: string) => integer("count", raw, 1000, 1)),
    ["drive personal sheets insert SHEET_ID 0 rows 1 3"],
  ).action(async (spreadsheet: string, id: number, axis: string, index: number, count: number) => {
    if (index + count > (axis === "rows" ? 10000000 : 18278))
      throw new CliError("validation_error", "index and count exceed the dimension bound")
    return batch(spreadsheet, {
      insertDimension: {
        range: { sheetId: id, dimension: axis.toUpperCase(), startIndex: index, endIndex: index + count },
        inheritFromBefore: false,
      },
    })
  })
  examples(
    annotate(group.command("format"), { effects: GOOGLE_WRITE })
      .description("change only supplied formatting fields in at most 10000 cells")
      .argument("<spreadsheet>", "spreadsheet ID or Google Sheets URL")
      .argument("<sheet-id>", "numeric tab ID from sheets info", sheetId)
      .argument("<range>", "finite cells within that tab, such as A1:C4; no tab prefix"),
    [`drive personal sheets format SHEET_ID 0 A1:C1 --body '{"textFormat":{"bold":true}}'`],
  )
    .requiredOption("--body <json>", "supported CellFormat fields as JSON; values and formulas are refused", jsonObject)
    .action(async (spreadsheet: string, id: number, range: string, args: { body: Record<string, unknown> }) => {
      const { rows, columns, ...bounds } = cellRectangle(range)
      if (rows * columns > 10000) throw new CliError("validation_error", "format range is limited to 10000 cells")
      return batch(spreadsheet, {
        repeatCell: {
          range: { sheetId: id, ...bounds },
          cell: { userEnteredFormat: args.body },
          fields: formatFields(args.body).join(","),
        },
      })
    })
}
