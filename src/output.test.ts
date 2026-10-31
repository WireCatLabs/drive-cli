import { captureStreams } from "@wirecat/cli-base"
import { listEnvelopeSchema } from "@wirecat/cli-base/standards"
import * as v from "valibot"
import { afterEach, describe, expect, it, vi } from "vitest"
import { snakeKeys } from "./output.js"

import { testProgram as createProgram, fixture } from "./testing.js"

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

describe("times at the edges", () => {
  const zone = process.env.TZ
  afterEach(() => {
    if (zone === undefined) delete process.env.TZ
    else process.env.TZ = zone
  })

  it("sends timestamp offsets as UTC and interprets date bounds in the query zone", async () => {
    process.env.TZ = "Asia/Vladivostok"
    const call = vi.fn(async (_method: string, _params?: Record<string, unknown>) => ({ files: [] }))
    const answer = await drive(
      call,
      "files",
      "list",
      'modified_time>"2026-09-01T09:00:00+10:00" AND created_time<=2026-09-01 AND viewed_by_me_time<"2026-09-02T00:00:00Z"',
      "--timezone",
      "Asia/Vladivostok",
      "--json",
    )
    expect(call.mock.calls[0]?.[1]?.q).toBe(
      "modifiedTime > '2026-08-31T23:00:00.000Z' and createdTime < '2026-09-01T14:00:00.000Z' and viewedByMeTime < '2026-09-02T00:00:00.000Z' and trashed = false",
    )
    expect(answer.meta.timezone).toBe("Asia/Vladivostok")
  })

  it("sends the same UTC query whatever zone the computer is in when the time names one", async () => {
    const sent = async (tz: string) => {
      process.env.TZ = tz
      const call = vi.fn(async (_method: string, _params?: Record<string, unknown>) => ({ files: [] }))
      const answer = await drive(call, "files", "list", 'modified_time>"2026-09-01T09:00:00+02:00"', "--json")
      expect(answer.meta.timezone).toBe(tz)
      return call.mock.calls[0]?.[1]?.q
    }
    expect(await sent("Asia/Vladivostok")).toBe(await sent("America/Los_Angeles"))
  })

  it("converts a zone-less q in the generated files.list command", async () => {
    process.env.TZ = "Asia/Vladivostok"
    const call = vi.fn(async (_method: string, _params?: Record<string, unknown>) => ({ files: [] }))
    await drive(call, "api", "drive-files-list", "--q", "createdTime < '2026-09-01T10:00:00'", "--json")
    expect(call.mock.calls[0]?.[1]?.q).toBe("createdTime < '2026-09-01T00:00:00.000Z'")
  })

  it("converts a zone-less files.list query in api call too", async () => {
    process.env.TZ = "America/Los_Angeles"
    const call = vi.fn(async (_method: string, _params?: Record<string, unknown>) => ({ files: [] }))
    const answer = await drive(
      call,
      "api",
      "call",
      "drive.files.list",
      "--params",
      `{"q":"modifiedTime >= '2026-09-01T09:00'"}`,
      "--json",
    )
    expect(call.mock.calls[0]?.[1]?.q).toBe("modifiedTime >= '2026-09-01T16:00:00.000Z'")
    expect(answer.meta.timezone).toBe("America/Los_Angeles")
  })

  it("requires an offset on timestamp queries before remote I/O", async () => {
    process.env.TZ = "America/Los_Angeles"
    await expect(
      drive(async () => ({ files: [] }), "files", "list", 'modified_time>"2026-03-08T02:30:00"', "--json"),
    ).rejects.toThrow(/quoted timestamp with offset/)
  })

  it("shows a person the times in the computer's zone and says which zone", async () => {
    process.env.TZ = "Asia/Vladivostok"
    const tty = process.stdout.isTTY
    process.stdout.isTTY = true
    try {
      const streams = captureStreams()
      await createProgram({
        env: fixture().env,
        streams,
        api: { call: async () => ({ id: "doc-a", modifiedTime: "2026-10-21T14:03:00.000Z" }) },
      }).parseAsync(["default", "files", "get", "doc-a"], { from: "user" })
      const text = streams.stdout.join("\n")
      expect(text).toContain("2026-10-22 00:03:00")
      expect(text).not.toContain("2026-10-21T14:03:00.000Z")
      expect(streams.stdout.at(-1)).toBe("times in Asia/Vladivostok")
      const empty = captureStreams()
      await createProgram({
        env: fixture().env,
        streams: empty,
        api: { call: async () => ({ files: [] }) },
      }).parseAsync(["default", "files", "list", "modified_time>2026-09-01"], { from: "user" })
      expect(empty.stdout.at(-1)).toBe("times in Asia/Vladivostok")
    } finally {
      process.stdout.isTTY = tty
    }
  })

  it("keeps UTC in machine output", async () => {
    process.env.TZ = "Asia/Vladivostok"
    const answer = await drive(
      async () => ({ id: "doc-a", modifiedTime: "2026-10-21T14:03:00.000Z" }),
      "files",
      "get",
      "doc-a",
      "--json",
    )
    expect(answer.item.modified_time).toBe("2026-10-21T14:03:00.000Z")
  })
})
