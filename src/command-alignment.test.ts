import { join } from "node:path"
import { captureStreams } from "@wirecat/cli-base"
import { SendJournal } from "@wirecat/cli-core/sends"
import { describe, expect, it, vi } from "vitest"
import { readConfig, writeConfig } from "./config.js"
import { createProgram } from "./program.js"
import { commandResult, fixture } from "./testing.js"

const setup = () => {
  const f = fixture()
  const call = vi.fn(async () => ({ id: "synthetic-reply" }))
  const run = async (...args: string[]) => {
    const streams = captureStreams()
    await createProgram({ env: f.env, api: { call }, streams }).parseAsync(["default", ...args, "--json"], {
      from: "user",
    })
    return commandResult(streams.stdout.join(""))
  }
  return { ...f, call, run }
}

describe("comment writes and operation IDs", () => {
  it.each(["reply", "resolve", "reopen"])("maps comment %s and returns the journal operation id", async (action) => {
    const t = setup()
    const result = await t.run(
      "comments",
      action,
      "synthetic-file",
      "synthetic-comment",
      ...(action === "reply" ? ["Synthetic reply"] : []),
    )
    expect(t.call).toHaveBeenCalledWith(
      "drive.replies.create",
      { fileId: "synthetic-file", commentId: "synthetic-comment", fields: "*" },
      action === "reply" ? { content: "Synthetic reply" } : { action },
    )
    const journal = new SendJournal(join(t.env.DRIVE_STATE_DIR as string, "sends", "default.jsonl")).entries()
    expect(result.operation_id).toBeTypeOf("string")
    expect(journal.some((entry) => entry.operationId === result.operation_id)).toBe(true)
    expect(JSON.stringify(journal)).not.toContain("Synthetic reply")
  })
  it("applies friendly permissions to equivalent generated reply actions", async () => {
    const t = setup()
    const config = readConfig(t.env)
    config.defaults = { permissions: { "comments.resolve": "deny" } }
    writeConfig(t.env, config)
    await expect(t.run("comments", "resolve", "synthetic-file", "synthetic-comment")).rejects.toMatchObject({
      code: "permission_error",
    })
    await expect(
      t.run(
        "api",
        "drive-replies-create",
        "--file-id",
        "synthetic-file",
        "--comment-id",
        "synthetic-comment",
        "--body",
        '{"action":"resolve"}',
      ),
    ).rejects.toMatchObject({ code: "permission_error" })
    expect(t.call).not.toHaveBeenCalled()
  })
  it("returns operation IDs for generated writes and refuses comment writes under read-only", async () => {
    const t = setup()
    const result = await t.run(
      "api",
      "drive-replies-create",
      "--file-id",
      "synthetic-file",
      "--comment-id",
      "synthetic-comment",
      "--body",
      '{"content":"Synthetic reply"}',
    )
    expect(result.operation_id).toBeTypeOf("string")
    t.call.mockClear()
    await expect(
      t.run("--read-only", "comments", "reply", "synthetic-file", "synthetic-comment", "text"),
    ).rejects.toMatchObject({ code: "permission_error" })
    expect(t.call).not.toHaveBeenCalled()
  })
})
