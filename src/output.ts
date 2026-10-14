import { randomUUID } from "node:crypto"
import type { ItemEnvelope, ListEnvelope, Meta } from "@wirecat/cli-base/standards"

// Provider/user dictionaries retain their vocabulary; profile/model names are identifiers.
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

/** One invocation's standard envelope, shared by CLI output and the MCP executor. */
export const answerOf = (
  value: unknown,
  context: { startedAt: number; runId?: string; limit?: number },
): ItemEnvelope<unknown> | ListEnvelope<unknown> => {
  const data = snakeKeys(value)
  const meta: Meta = {
    run_id: context.runId ?? randomUUID(),
    duration_ms: Math.max(0, Math.round(Date.now() - context.startedAt)),
  }
  // Rich results (search/context/config) stay together in an item, rather than losing their metadata.
  const list = Array.isArray(data)
    ? { items: data, has_more: false }
    : data &&
        typeof data === "object" &&
        "items" in data &&
        Array.isArray(data.items) &&
        Object.keys(data).every((key) => ["items", "has_more", "next_offset"].includes(key))
      ? data
      : undefined
  if (!list) return { item: data, meta }
  const items = list.items as unknown[]
  const hasMore = "has_more" in list && list.has_more === true
  return {
    items,
    page: {
      limit: context.limit ?? Math.max(1, items.length),
      has_more: hasMore,
      ...("next_offset" in list && list.next_offset !== null && list.next_offset !== undefined
        ? { cursor: String(list.next_offset) }
        : {}),
    },
    meta,
  }
}
