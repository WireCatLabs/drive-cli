import { createHash } from "node:crypto"
import { readFileSync } from "node:fs"
import { CliError } from "@wirecat/cli-base"
import {
  columnName,
  type Keep,
  type LocalDocument,
  type Prepared,
  type Pushed,
  type RemoteChange,
  readSpreadsheet,
} from "@wirecat/cli-core/documents"

export type Cell = string | number
export interface LocalTab {
  title: string
  rows: Cell[][]
}
/** A mirrored tab, tracked by Google's `sheetId` because people rename tabs. */
export interface MirroredTab {
  sheetId: number
  source: string
  rows: number
  columns: number
  hash: string
}
export interface SheetSnapshot {
  kind: "sheet"
  tabs: MirroredTab[]
}
export type Call = (method: string, params: Record<string, unknown>, body?: Record<string, unknown>) => Promise<unknown>

/** When and by whom the file last changed, from its revision list; nothing when Google does not say. */
export const lastChange = async (call: Call, id: string): Promise<RemoteChange> => {
  try {
    let last: { modifiedTime?: string; lastModifyingUser?: { displayName?: string } } | undefined
    let pageToken: string | undefined
    for (let page = 0; page < 20; page++) {
      const data = (await call("drive.revisions.list", {
        fileId: id,
        pageSize: 1000,
        fields: "nextPageToken,revisions(modifiedTime,lastModifyingUser(displayName))",
        ...(pageToken ? { pageToken } : {}),
      })) as { nextPageToken?: string; revisions?: (typeof last)[] }
      last = data.revisions?.at(-1) ?? last
      pageToken = data.nextPageToken
      if (!pageToken) break
    }
    return {
      ...(last?.modifiedTime ? { changedAt: last.modifiedTime } : {}),
      ...(last?.lastModifyingUser?.displayName ? { changedBy: last.lastModifyingUser.displayName } : {}),
    }
  } catch {
    return {}
  }
}

const MAX_CELLS = 200_000
const NUMBER = /^-?(0|[1-9]\d*)(\.\d+)?([eE][-+]?\d+)?$/

/** Plain numbers become numbers, sent RAW: typed cells, no formula from a cell that starts with `=`, no locale guess. */
export const typed = (value: string): Cell => {
  if (!NUMBER.test(value)) return value
  const number = Number(value)
  return Number.isFinite(number) && (!Number.isInteger(number) || Number.isSafeInteger(number)) ? number : value
}

/** RFC 4180: quoted fields may hold the delimiter, doubled quotes and line breaks. */
export const parseDelimited = (text: string, delimiter: string): string[][] => {
  const rows: string[][] = []
  let row: string[] = []
  let field = ""
  let quoted = false
  for (let at = 0; at < text.length; at++) {
    const char = text[at] as string
    if (quoted) {
      if (char === '"' && text[at + 1] === '"') {
        field += '"'
        at++
      } else if (char === '"') quoted = false
      else field += char
    } else if (char === '"' && field === "") quoted = true
    else if (char === delimiter) {
      row.push(field)
      field = ""
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && text[at + 1] === "\n") at++
      row.push(field)
      rows.push(row)
      row = []
      field = ""
    } else field += char
  }
  if (field !== "" || row.length) {
    row.push(field)
    rows.push(row)
  }
  return rows
}

const stem = (path: string) => (path.split("/").at(-1) ?? path).replace(/\.[^.]+$/, "")

export const readLocalTabs = async (file: LocalDocument): Promise<LocalTab[]> => {
  const bytes = readFileSync(file.absolute)
  let tabs: LocalTab[]
  if (/\.(csv|tsv)$/i.test(file.path)) {
    const text = new TextDecoder().decode(bytes).replace(/^﻿/, "")
    const rows = parseDelimited(text, /\.tsv$/i.test(file.path) ? "\t" : ",")
    tabs = [{ title: stem(file.path), rows: rows.map((row) => row.map(typed)) }]
  } else {
    const sheets = await readSpreadsheet(bytes, "xlsx")
    tabs = sheets.map((sheet) => {
      const rows: Cell[][] = []
      for (const cell of sheet.cells) {
        const row = rows[cell.row - 1] ?? []
        row[cell.column - 1] = typed(cell.value)
        rows[cell.row - 1] = row
      }
      return { title: sheet.name, rows: Array.from(rows, (row) => Array.from(row ?? [], (cell) => cell ?? "")) }
    })
  }
  const cells = tabs.reduce((sum, tab) => sum + tab.rows.reduce((n, row) => n + row.length, 0), 0)
  if (cells > MAX_CELLS)
    throw new CliError("validation_error", `a mirrored spreadsheet is limited to ${MAX_CELLS} cells`, {
      reason: "mirror.too-many-cells",
    })
  return tabs
}

/** Trailing empty cells and rows carry no value: Google drops them on read, so they never count as a change. */
const trimmed = (rows: unknown[][]): Cell[][] => {
  const out = rows.map((row) => {
    const cells = row.map((cell) => (typeof cell === "number" ? cell : cell == null ? "" : String(cell)))
    while (cells.length && cells.at(-1) === "") cells.pop()
    return cells
  })
  while (out.length && !out.at(-1)?.length) out.pop()
  return out
}
const hashRows = (rows: unknown[][]) =>
  createHash("sha256")
    .update(JSON.stringify(trimmed(rows)))
    .digest("hex")
const size = (rows: Cell[][]) => ({ rows: rows.length, columns: Math.max(0, ...rows.map((row) => row.length)) })
const quoted = (title: string) => `'${title.replace(/'/g, "''")}'`
const range = (title: string, rows: number, columns: number) =>
  `${quoted(title)}!A1:${columnName(Math.max(columns, 1))}${Math.max(rows, 1)}`
/** The mirrored columns, every row: rows added below in Google count as a change. */
const columnsRange = (title: string, columns: number) => `${quoted(title)}!A1:${columnName(Math.max(columns, 1))}`

/**
 * Google's rows as the file's text. A cell whose value the file already holds keeps its spelling (`1.50` stays
 * `1.50`); the delimiter, line endings, byte-order mark and final line break stay the file's.
 */
export const delimitedText = (rows: Cell[][], original: string, delimiter: string): string => {
  const bom = original.startsWith("\uFEFF") ? "\uFEFF" : ""
  const eol = original.includes("\r\n") ? "\r\n" : "\n"
  const before = parseDelimited(original.replace(/^\uFEFF/, ""), delimiter)
  const field = (cell: Cell, was: string | undefined) => {
    const text = was !== undefined && typed(was) === cell ? was : String(cell)
    return text.includes(delimiter) || /["\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
  }
  const lines = rows.map((row, r) => row.map((cell, c) => field(cell, before[r]?.[c])).join(delimiter))
  const final = /\r?\n$/.test(original) || !original ? eol : ""
  return bom + lines.join(eol) + (lines.length ? final : "")
}

interface RemoteTab {
  sheetId: number
  title: string
}
const remoteTabs = async (call: Call, id: string): Promise<RemoteTab[]> => {
  const data = (await call("sheets.spreadsheets.get", {
    spreadsheetId: id,
    fields: "sheets(properties(sheetId,title))",
  })) as { sheets?: { properties?: { sheetId?: number; title?: string } }[] }
  return (data.sheets ?? []).map((sheet) => ({
    sheetId: sheet.properties?.sheetId ?? 0,
    title: sheet.properties?.title ?? "",
  }))
}
const readRanges = async (call: Call, id: string, ranges: string[]): Promise<unknown[][][]> => {
  if (!ranges.length) return []
  const data = (await call("sheets.spreadsheets.values.batchGet", {
    spreadsheetId: id,
    ranges,
    valueRenderOption: "UNFORMATTED_VALUE",
    majorDimension: "ROWS",
  })) as { valueRanges?: { values?: unknown[][] }[] }
  return ranges.map((_, index) => data.valueRanges?.[index]?.values ?? [])
}

/** Reads back what is in each written tab now, so the next push compares Google against what Google holds. */
const snapshotOf = async (call: Call, id: string, written: { sheetId: number; source: string; rows: Cell[][] }[]) => {
  const titles = new Map((await remoteTabs(call, id)).map((tab) => [tab.sheetId, tab.title]))
  const sized = written.map((tab) => ({ ...tab, ...size(tab.rows) }))
  const values = await readRanges(
    call,
    id,
    sized.map((tab) => range(titles.get(tab.sheetId) ?? "", tab.rows, tab.columns)),
  )
  return {
    kind: "sheet" as const,
    tabs: sized.map((tab, index) => ({
      sheetId: tab.sheetId,
      source: tab.source,
      rows: tab.rows,
      columns: tab.columns,
      hash: hashRows(values[index] ?? []),
    })),
  }
}

const writeValues = async (
  call: Call,
  id: string,
  titles: Map<number, string>,
  writes: { sheetId: number; rows: Cell[][]; clearRows: number; clearColumns: number }[],
) => {
  const data = writes.map((write) => {
    const { rows, columns } = size(write.rows)
    const height = Math.max(rows, write.clearRows, 1)
    const width = Math.max(columns, write.clearColumns, 1)
    // Empty strings over the last push's range clear what the new data no longer covers, in the same request.
    const values = Array.from({ length: height }, (_, r) =>
      Array.from({ length: width }, (_, c) => write.rows[r]?.[c] ?? ""),
    )
    return { range: range(titles.get(write.sheetId) ?? "", height, width), values }
  })
  await call("sheets.spreadsheets.values.batchUpdate", { spreadsheetId: id }, { valueInputOption: "RAW", data })
}

export const createSheet = async (
  call: Call,
  input: { file: LocalDocument; name: string; parent: string; origin: string },
): Promise<Pushed<SheetSnapshot>> => {
  const tabs = await readLocalTabs(input.file)
  const created = (await call(
    "drive.files.create",
    { fields: "id,webViewLink", supportsAllDrives: true },
    {
      name: stem(input.name),
      mimeType: "application/vnd.google-apps.spreadsheet",
      parents: [input.parent],
      appProperties: { wirecatOrigin: input.origin },
    },
  )) as { id: string; webViewLink?: string }
  const [first] = await remoteTabs(call, created.id)
  const requests: Record<string, unknown>[] = []
  tabs.forEach((tab, index) => {
    if (index === 0 && first)
      requests.push({
        updateSheetProperties: {
          properties: { sheetId: first.sheetId, title: tab.title, gridProperties: { frozenRowCount: 1 } },
          fields: "title,gridProperties.frozenRowCount",
        },
      })
    else requests.push({ addSheet: { properties: { title: tab.title, gridProperties: { frozenRowCount: 1 } } } })
  })
  const reply = (await call("sheets.spreadsheets.batchUpdate", { spreadsheetId: created.id }, { requests })) as {
    replies?: { addSheet?: { properties?: { sheetId?: number } } }[]
  }
  const ids = tabs.map((_, index) =>
    index === 0 && first ? first.sheetId : (reply.replies?.[index]?.addSheet?.properties?.sheetId ?? -1),
  )
  await call(
    "sheets.spreadsheets.batchUpdate",
    { spreadsheetId: created.id },
    {
      requests: ids.map((sheetId) => ({
        repeatCell: {
          range: { sheetId, startRowIndex: 0, endRowIndex: 1 },
          cell: { userEnteredFormat: { textFormat: { bold: true } } },
          fields: "userEnteredFormat.textFormat.bold",
        },
      })),
    },
  )
  const titles = new Map(tabs.map((tab, index) => [ids[index] as number, tab.title]))
  await writeValues(
    call,
    created.id,
    titles,
    tabs.map((tab, index) => ({ sheetId: ids[index] as number, rows: tab.rows, clearRows: 0, clearColumns: 0 })),
  )
  return {
    id: created.id,
    url: created.webViewLink ?? `https://docs.google.com/spreadsheets/d/${created.id}/edit`,
    snapshot: await snapshotOf(
      call,
      created.id,
      tabs.map((tab, index) => ({ sheetId: ids[index] as number, source: tab.title, rows: tab.rows })),
    ),
  }
}

/** A Sheet found after a crash: its first tab is taken as the mirror of the file's first tab, to be rewritten. */
export const recoveredSheet = async (call: Call, id: string): Promise<SheetSnapshot> => {
  const [first] = await remoteTabs(call, id)
  return { kind: "sheet", tabs: first ? [{ sheetId: first.sheetId, source: "", rows: 0, columns: 0, hash: "" }] : [] }
}

/**
 * Compares the mirrored cells in Google and the file with what the last sync left. One side changed: it is taken,
 * Google's cells written back into a CSV or TSV file. Both changed: a conflict unless `keep` picks a side.
 */
export const prepareSheet = async (
  call: Call,
  input: { id: string; url: string; file: LocalDocument; recorded: SheetSnapshot; keep?: Keep },
): Promise<Prepared<SheetSnapshot>> => {
  const { id, recorded, keep } = input
  const titles = new Map((await remoteTabs(call, id)).map((tab) => [tab.sheetId, tab.title]))
  const kept = recorded.tabs.filter((tab) => titles.has(tab.sheetId))
  if (kept.length < recorded.tabs.length && keep !== "local")
    return { conflict: "a mirrored tab was deleted in Google", remote: await lastChange(call, id) }
  const current = (
    await readRanges(
      call,
      id,
      kept.map((tab) => columnsRange(titles.get(tab.sheetId) ?? "", tab.columns)),
    )
  ).map(trimmed)
  const recovered = kept.some((tab) => tab.hash === "")
  const remoteChanged = !recovered && kept.some((tab, index) => hashRows(current[index] ?? []) !== tab.hash)

  const tabs = await readLocalTabs(input.file)
  const pairs = tabs.map((tab, index) => ({
    tab,
    mirror:
      kept.find((mirror) => mirror.source === tab.title) ??
      (tabs.length === 1 || (recovered && index === 0) ? kept[0] : undefined),
  }))
  const localChanged = recovered || !pairs.every(({ tab, mirror }) => mirror && hashRows(tab.rows) === mirror.hash)
  const pushed = (snapshot: SheetSnapshot): Pushed<SheetSnapshot> => ({ id, url: input.url, snapshot })
  if (!remoteChanged && !localChanged) return { unchanged: pushed(recorded) }

  const delimiter = /\.tsv$/i.test(input.file.path) ? "\t" : /\.csv$/i.test(input.file.path) ? "," : undefined
  const [only] = tabs
  const [mirror] = kept
  const single = delimiter !== undefined && tabs.length === 1 && kept.length === 1 && only && mirror
  const pulled = (rows: Cell[][]): SheetSnapshot => ({
    kind: "sheet",
    tabs: mirror ? [{ ...mirror, source: only?.title ?? mirror.source, ...size(rows), hash: hashRows(rows) }] : [],
  })
  if (remoteChanged && localChanged && single && hashRows(only.rows) === hashRows(current[0] ?? []))
    return { unchanged: pushed(pulled(current[0] ?? [])) }
  let take: "local" | "remote" = remoteChanged ? "remote" : "local"
  if (remoteChanged && localChanged) {
    if (!keep) return { conflict: "the mirrored cells changed here and in Google", remote: await lastChange(call, id) }
    if (keep === "both")
      return {
        conflict: "a Sheet cannot keep both versions; choose --keep local or --keep remote",
        remote: await lastChange(call, id),
      }
    take = keep
  }
  if (take === "remote" && !single && keep === "local") take = "local"
  if (take === "remote") {
    if (!single)
      return {
        conflict: "the Sheet changed in Google; only CSV and TSV files take changes back, so choose --keep local",
        remote: await lastChange(call, id),
      }
    const rows = current[0] ?? []
    return {
      local: delimitedText(rows, readFileSync(input.file.absolute, "utf8"), delimiter),
      remote: false,
      write: async () => pushed(pulled(rows)),
    }
  }
  return {
    remote: true,
    write: async () => {
      const missing = pairs.filter((pair) => !pair.mirror)
      const added = new Map<string, number>()
      if (missing.length) {
        const reply = (await call(
          "sheets.spreadsheets.batchUpdate",
          { spreadsheetId: id },
          { requests: missing.map(({ tab }) => ({ addSheet: { properties: { title: tab.title } } })) },
        )) as { replies?: { addSheet?: { properties?: { sheetId?: number; title?: string } } }[] }
        missing.forEach(({ tab }, index) => {
          const properties = reply.replies?.[index]?.addSheet?.properties
          if (properties?.sheetId !== undefined) {
            added.set(tab.title, properties.sheetId)
            titles.set(properties.sheetId, properties.title ?? tab.title)
          }
        })
      }
      const writes = pairs.map(({ tab, mirror }) => ({
        sheetId: mirror?.sheetId ?? (added.get(tab.title) as number),
        rows: tab.rows,
        clearRows: mirror?.rows ?? 0,
        clearColumns: mirror?.columns ?? 0,
      }))
      await writeValues(call, id, titles, writes)
      return pushed(
        await snapshotOf(
          call,
          id,
          pairs.map(({ tab }, index) => ({
            sheetId: writes[index]?.sheetId as number,
            source: tab.title,
            rows: tab.rows,
          })),
        ),
      )
    },
  }
}
