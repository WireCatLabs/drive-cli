import { captureStreams } from "@wirecat/cli-base"
import { listEnvelopeSchema } from "@wirecat/cli-base/standards"
import * as v from "valibot"
import { describe, expect, it, vi } from "vitest"
import { snakeKeys } from "./output.js"
import { createProgram } from "./program.js"
import { fixture } from "./testing.js"

const drive = async (call: (method: string) => Promise<unknown>, ...args: string[]) => {
  const f = fixture()
  const streams = captureStreams()
  await createProgram({ env: f.env, streams, api: { call } }).parseAsync(["default", ...args], { from: "user" })
  return JSON.parse(streams.stdout.join(""))
}

describe("answers", () => {
  it("snake-cases field names but keeps provider dictionaries and record keys as written", () => {
    expect(
      snakeKeys({
        updatedAt: "2026-10-14",
        provider_metadata: { modifiedTime: "provider spelling" },
        profiles: { personalAccount: { embeddingModel: "fixture" } },
      }),
    ).toEqual({
      updated_at: "2026-10-14",
      provider_metadata: { modifiedTime: "provider spelling" },
      profiles: { personalAccount: { embedding_model: "fixture" } },
    })
  })

  it("reports Google's page token as the cursor of the next files page", async () => {
    const call = vi.fn(async () => ({ nextPageToken: "token-2", files: [{ id: "doc-a", mimeType: "text/plain" }] }))
    const answer = await drive(call, "files", "list", "--limit", "1", "--json")
    expect(v.safeParse(listEnvelopeSchema(v.unknown()), answer).success).toBe(true)
    expect(answer.items).toEqual([{ id: "doc-a", mime_type: "text/plain" }])
    expect(answer.page).toEqual({ mode: "cursor", limit: 1, has_more: true, next_cursor: "token-2" })
    expect(answer.next[0]).toMatchObject({ step: "page.next", command: "files list", args: { cursor: "token-2" } })
  })

  it("ends a cursor list without a cursor and flags a search Google did not finish", async () => {
    const answer = await drive(async () => ({ incompleteSearch: true, files: [] }), "files", "list", "--json")
    expect(answer.page).toEqual({ mode: "cursor", limit: 100, has_more: false })
    expect(answer.next).toBeUndefined()
    expect(answer.missing[0].field).toBe("files")
  })

  it("pages documents history by Google's token", async () => {
    const call = async () => ({ nextPageToken: "more", revisions: [{ id: "r1" }] })
    const answer = await drive(call, "documents", "history", "doc-a", "--json")
    expect(answer.items).toEqual([{ id: "r1" }])
    expect(answer.page.next_cursor).toBe("more")
  })

  it("keeps only the chosen fields of each listed file", async () => {
    const call = async () => ({ files: [{ id: "doc-a", name: "Plan", mimeType: "text/plain" }] })
    const answer = await drive(call, "files", "list", "--json=id,name")
    expect(answer.items).toEqual([{ id: "doc-a", name: "Plan" }])
  })

  it("previews a dry-run list as one item without calling Google", async () => {
    const call = vi.fn(async () => ({}))
    const answer = await drive(call, "--dry-run", "files", "list", "--json")
    expect(call).not.toHaveBeenCalled()
    expect(answer.item).toMatchObject({ dry_run: true, method: "drive.files.list" })
  })
})
