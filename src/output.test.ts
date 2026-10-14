import { itemEnvelopeSchema, listEnvelopeSchema } from "@wirecat/cli-base/standards"
import * as v from "valibot"
import { describe, expect, it } from "vitest"
import { answerOf } from "./output.js"

describe("contract 3 output", () => {
  it("preserves rich results in an item with snake_case keys and verbatim provider data", () => {
    const result = answerOf(
      {
        updatedAt: "2026-10-14",
        hasMore: false,
        provider_metadata: { modifiedTime: "provider spelling" },
        profiles: { personalAccount: { embeddingModel: "fixture" } },
      },
      { startedAt: Date.now(), runId: "synthetic-run" },
    )
    expect(v.safeParse(itemEnvelopeSchema(v.unknown()), result).success).toBe(true)
    expect(result).toMatchObject({
      item: {
        updated_at: "2026-10-14",
        has_more: false,
        provider_metadata: { modifiedTime: "provider spelling" },
        profiles: { personalAccount: { embedding_model: "fixture" } },
      },
      meta: { run_id: "synthetic-run" },
    })
  })

  it("gives lists a page, including an empty list, without discarding rich metadata", () => {
    for (const value of [[], { items: [], hasMore: false }]) {
      const result = answerOf(value, { startedAt: Date.now(), limit: 10 })
      expect(v.safeParse(listEnvelopeSchema(v.unknown()), result).success).toBe(true)
      expect(result).toMatchObject({ items: [], page: { limit: 10, has_more: false } })
    }
    expect(answerOf({ items: [], total: 15, scope: "selected" }, { startedAt: Date.now() })).toMatchObject({
      item: { items: [], total: 15, scope: "selected" },
    })
  })
})
