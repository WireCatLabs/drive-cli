import { CliError } from "@wirecat/cli-base"

export const cellRectangle = (range: string) => {
  const match = /^([A-Za-z]{1,3})([1-9]\d*)(?::([A-Za-z]{1,3})([1-9]\d*))?$/.exec(range)
  const column = (text: string) => [...text.toUpperCase()].reduce((n, c) => n * 26 + c.charCodeAt(0) - 64, 0)
  if (!match) throw new CliError("validation_error", "range must be finite cells, such as A1:C4")
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
  return {
    rows: lastRow - firstRow + 1,
    columns: lastColumn - firstColumn + 1,
    startRowIndex: firstRow - 1,
    endRowIndex: lastRow,
    startColumnIndex: firstColumn - 1,
    endColumnIndex: lastColumn,
  }
}

export const namedRectangle = (range: string) => {
  const match = /^(?:'[^']*(?:''[^']*)*'|[^'!]+)!(.+)$/.exec(range)
  if (!match) throw new CliError("validation_error", "range must name a tab and finite cells, such as 'Budget!A1:C4'")
  return cellRectangle(match[1] as string)
}
