import { timezoneOf, zonedMoment } from "@wirecat/cli-base/query"

const DRIVE_TIME = /\b(modifiedTime|createdTime|viewedByMeTime|sharedWithMeTime)(\s*)(<=|>=|!=|<|>|=)(\s*)'([^'\\]*)'/g
const ZONED = /(?:Z|[+-]\d{2}:?\d{2})$/i

/**
 * Google reads a Drive query time without a zone as UTC
 * (https://developers.google.com/workspace/drive/api/guides/ref-search-terms), so drive reads it in `zone` and
 * sends UTC. A date alone covers the whole local day: `<=` and `>` take its last millisecond.
 */
export const utcDriveQuery = (query: string, zone = timezoneOf()) => {
  let changed = false
  const sent = query.replace(DRIVE_TIME, (whole, field, before, operator, after, value: string, offset: number) => {
    if (ZONED.test(value)) return whole
    const start = offset + whole.length - value.length - 1
    const end = operator === "<=" || operator === ">"
    const time = zonedMoment(value, zone, { start, end: start + value.length }, { end })
    changed = true
    return `${field}${before}${operator}${after}'${new Date(time).toISOString()}'`
  })
  return { query: sent, timezone: changed ? zone : undefined }
}

const UTC_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/

const wallClock = (zone: string) => {
  const format = new Intl.DateTimeFormat("en-CA", {
    timeZone: zone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  })
  return (time: string) => {
    const part = Object.fromEntries(format.formatToParts(new Date(time)).map(({ type, value }) => [type, value]))
    return `${part.year}-${part.month}-${part.day} ${part.hour}:${part.minute}:${part.second}`
  }
}

/** UTC times in a value, rewritten as wall-clock time in `zone` for a person to read. */
export const localTimes = (value: unknown, zone: string) => {
  const shown = wallClock(zone)
  let changed = false
  const walk = (item: unknown): unknown => {
    if (typeof item === "string" && UTC_TIME.test(item)) {
      changed = true
      return shown(item)
    }
    if (Array.isArray(item)) return item.map(walk)
    if (item && typeof item === "object")
      return Object.fromEntries(Object.entries(item).map(([key, entry]) => [key, walk(entry)]))
    return item
  }
  const result = walk(value)
  return { value: result, changed }
}
