import { type ListBody, listOf } from "@wirecat/cli-core/cli"

// cli-core's snakeKeys has no keep-as-written option yet: provider dictionaries keep Google's spelling and
// profile/model names are identifiers, so drive keeps its own until cli-core can be told which keys to leave.
const VERBATIM = new Set([
  "frontMatter",
  "front_matter",
  "provider_metadata",
  "metadata",
  "headers",
  "properties",
  "appProperties",
  "app_properties",
  "request_schema",
  "response_schema",
  "body_schema",
  "schema",
  "inputSchema",
  "input_schema",
  "outputSchema",
  "output_schema",
])
const RECORDS = new Set(["profiles", "permissions", "models"])
const keyOf = (key: string) =>
  /^[a-z][a-zA-Z0-9]*$/.test(key) ? key.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase() : key

export const snakeKeys = (value: unknown, record = false): unknown => {
  if (Array.isArray(value)) return value.map((item) => snakeKeys(item))
  if (!value || typeof value !== "object" || value instanceof Date) return value
  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [
      record ? key : keyOf(key),
      VERBATIM.has(key) ? item : snakeKeys(item, RECORDS.has(key)),
    ]),
  )
}

/** A list that is never paged: everything there is, in one answer. */
export const allOf = <T>(items: T[]): ListBody<T> =>
  listOf("", { items, limit: Math.max(1, items.length), has_more: false })
