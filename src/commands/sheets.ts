import { CliError } from "@wirecat/cli-base"
import { annotate } from "@wirecat/cli-base/commands"
import { apiPlainJson, itemOf, parseApiJson } from "@wirecat/cli-core/cli"
import { type Command, Option } from "commander"
import { fileId } from "../config.js"
import { examples, GOOGLE_READ, GOOGLE_WRITE } from "../registry.js"
import type { RemoteCommands } from "./remote.js"

// Friendly writes require a concrete tab and finite cell rectangle. Named/unbounded ranges
// remain available through the generated API, where their broader semantics are explicit.
const rectangle = (range: string) => {
  const match = /^(?:'[^']*(?:''[^']*)*'|[^'!]+)!([A-Za-z]{1,3})([1-9]\d*)(?::([A-Za-z]{1,3})([1-9]\d*))?$/.exec(range)
  const column = (text: string) => [...text.toUpperCase()].reduce((n, c) => n * 26 + c.charCodeAt(0) - 64, 0)
  if (!match) throw new CliError("validation_error", "range must name a tab and finite cells, such as 'Budget!A1:C4'")
  const firstColumn = column(match[1] as string)
  const firstRow = Number(match[2])
  const lastColumn = column(match[3] ?? (match[1] as string))
  const lastRow = Number(match[4] ?? match[2])
  if (
    !Number.isSafeInteger(lastRow) ||
    lastRow > 10000000 ||
    lastColumn > 18278 ||
    lastRow < firstRow ||
    lastColumn < firstColumn
  )
    throw new CliError("validation_error", "range has invalid or reversed cell bounds")
  return { rows: lastRow - firstRow + 1, columns: lastColumn - firstColumn + 1 }
}
const values = (text: string): unknown[][] => {
  const parsed = parseApiJson(text)
  const native: unknown = JSON.parse(text)
  if (
    Array.isArray(native) &&
    native.some(
      (row) =>
        Array.isArray(row) &&
        row.some(
          (cell) =>
            typeof cell === "number" &&
            (!Number.isFinite(cell) || (Number.isInteger(cell) && !Number.isSafeInteger(cell))),
        ),
    )
  )
    throw new CliError(
      "validation_error",
      "--values numbers must be finite and integer values must be safe; quote large identifiers as strings",
    )
  const result = apiPlainJson(parsed)
  if (
    Array.isArray(native) &&
    Array.isArray(result) &&
    native.some(
      (row, index) =>
        Array.isArray(row) &&
        row.some((cell, column) => typeof cell === "number" && typeof result[index]?.[column] !== "number"),
    )
  )
    throw new CliError("validation_error", "--values numeric precision is unsafe; quote precise values as strings")
  if (
    !Array.isArray(result) ||
    !result.length ||
    result.length > 10000 ||
    result.some(
      (row) =>
        !Array.isArray(row) ||
        !row.length ||
        row.some(
          (cell) =>
            cell !== null &&
            typeof cell !== "string" &&
            typeof cell !== "boolean" &&
            (typeof cell !== "number" || !Number.isFinite(cell)),
        ),
    )
  )
    throw new CliError(
      "validation_error",
      "--values must be a nonempty JSON array of rows containing strings, numbers, booleans or null",
    )
  if (result.reduce((sum, row) => sum + row.length, 0) > 10000)
    throw new CliError("validation_error", "--values is limited to 10000 cells per call")
  return result
}

export const installSheetsCommands = (program: Command, { call, output }: RemoteCommands) => {
  const group = annotate(program.command("sheets"), { effects: GOOGLE_READ }).description(
    "read spreadsheet tabs and ranges, or change cells live in Google Sheets",
  )
  const sheetArg = "spreadsheet ID or Google Sheets URL"
  examples(
    annotate(group.command("info"), { effects: GOOGLE_READ })
      .description("list spreadsheet properties and tabs without downloading grid data")
      .argument("<spreadsheet>", sheetArg),
    ["drive personal sheets info SHEET_ID"],
  ).action(async (id: string) =>
    output(
      itemOf(
        await call("sheets.spreadsheets.get", {
          spreadsheetId: fileId(id),
          fields: "spreadsheetId,spreadsheetUrl,properties,sheets.properties",
          includeGridData: false,
        }),
      ),
    ),
  )
  examples(
    annotate(group.command("show"), { effects: GOOGLE_READ })
      .description("read a live A1 range; choose formatted values, raw values or formulas")
      .argument("<spreadsheet>", sheetArg)
      .argument("<range>", "A1 range, such as Budget!A1:C4"),
    [
      "drive personal sheets show SHEET_ID 'Budget!A1:C4'",
      "drive personal sheets show SHEET_ID 'Budget!C1:C4' --render formula",
    ],
  )
    .addOption(
      new Option("--render <mode>", "how Google renders cell values")
        .choices(["formatted", "unformatted", "formula"])
        .default("formatted"),
    )
    .action(async (id: string, range: string, args) => {
      if (!range.trim()) throw new CliError("validation_error", "range must not be empty")
      output(
        itemOf(
          await call("sheets.spreadsheets.values.get", {
            spreadsheetId: fileId(id),
            range,
            majorDimension: "ROWS",
            valueRenderOption:
              args.render.toUpperCase() === "FORMULA" ? "FORMULA" : `${args.render.toUpperCase()}_VALUE`,
          }),
        ),
      )
    })
  for (const name of ["update", "add"] as const) {
    examples(
      annotate(group.command(name), { effects: GOOGLE_WRITE })
        .description(
          name === "update"
            ? "set cells within a finite A1 rectangle; literal values by default"
            : "append rows after Google's detected table within a finite A1 range",
        )
        .argument("<spreadsheet>", sheetArg)
        .argument("<range>", "tab and finite A1 rectangle, such as Budget!A1:C4"),
      [`drive personal sheets ${name} SHEET_ID 'Budget!A1:B2' --values '[["Item",10]]'`],
    )
      .requiredOption("--values <json>", "JSON rows; null skips a cell and an empty string clears its value", values)
      .addOption(
        new Option("--input <mode>", "raw literals, or user-entered formulas/numbers using spreadsheet locale")
          .choices(["raw", "user-entered"])
          .default("raw"),
      )
      .action(async (id: string, range: string, args: { values: unknown[][]; input: string }) => {
        const bounds = rectangle(range)
        if (
          args.values.some((row) => row.length > bounds.columns) ||
          (name === "update" && args.values.length > bounds.rows)
        )
          throw new CliError("validation_error", "--values exceeds the selected range dimensions")
        output(
          itemOf(
            await call(
              `sheets.spreadsheets.values.${name === "add" ? "append" : name}`,
              {
                spreadsheetId: fileId(id),
                range,
                valueInputOption: args.input === "raw" ? "RAW" : "USER_ENTERED",
                includeValuesInResponse: true,
                responseValueRenderOption: "UNFORMATTED_VALUE",
                ...(name === "add" ? { insertDataOption: "INSERT_ROWS" } : {}),
              },
              { majorDimension: "ROWS", values: args.values },
            ),
          ),
        )
      })
  }
  examples(
    annotate(group.command("clear"), { effects: GOOGLE_WRITE })
      .description("clear cell values in a finite A1 rectangle; formatting remains")
      .argument("<spreadsheet>", sheetArg)
      .argument("<range>", "tab and finite A1 rectangle, such as Budget!A1:C4"),
    ["drive personal sheets clear SHEET_ID 'Budget!A2:C4'"],
  ).action(async (id: string, range: string) => {
    rectangle(range)
    output(itemOf(await call("sheets.spreadsheets.values.clear", { spreadsheetId: fileId(id), range }, {})))
  })
}
