import { describeProgram } from "@wirecat/cli-base/commands"
import { toolsFromCommands } from "@wirecat/cli-core/mcp"
import { describe, expect, it, vi } from "vitest"
import { createProgram } from "./program.js"
import { callTool, mcpClient } from "./testing/mcp.js"
import { fixture } from "./testing.js"

describe("MCP validation through the SDK", () => {
  it("returns our field-specific error for bad types and unknown arguments before providers", async () => {
    const f = fixture()
    const call = vi.fn(async () => ({ id: "fixture-file" }))
    const { client, close } = await mcpClient({ env: f.env, api: { call } })
    try {
      for (const [field, args] of [
        ["file_id", { file_id: 42 }],
        ["unknown_field", { file_id: "fixture-file", unknown_field: "DO_NOT_LOG_ARGUMENT" }],
        ["file_id", {}],
      ] as const) {
        const result = await callTool(client, "drive_read", "api drive-files-get", args)
        expect(result).toMatchObject({
          isError: true,
          structuredContent: { error: { code: "validation_error", message: expect.stringContaining(field) } },
        })
        expect(JSON.stringify(result)).not.toContain("DO_NOT_LOG_ARGUMENT")
      }
      expect(call).not.toHaveBeenCalled()
      const good = await callTool(client, "drive_read", "api drive-files-get", { file_id: "fixture-file" })
      expect(good).toMatchObject({
        structuredContent: { item: { id: "fixture-file" }, meta: { run_id: expect.any(String) } },
      })
      expect(call).toHaveBeenCalledTimes(1)
      const sheetsResult = await callTool(client, "drive_write", "sheets update", {
        spreadsheet: "synthetic-sheet",
        range: "Budget!A1",
        values: "[[1,2]]",
      })
      expect(sheetsResult).toMatchObject({
        isError: true,
        structuredContent: { error: { code: "validation_error", message: expect.stringContaining("--values") } },
      })
      const unknownSheetArgument = await callTool(client, "drive_read", "sheets show", {
        spreadsheet: "synthetic-sheet",
        range: "Budget!A1",
        unknown: "DO_NOT_LOG_ARGUMENT",
      })
      expect(unknownSheetArgument).toMatchObject({
        isError: true,
        structuredContent: { error: { code: "validation_error", message: expect.stringContaining("unknown") } },
      })
      expect(JSON.stringify(unknownSheetArgument)).not.toContain("DO_NOT_LOG_ARGUMENT")
      expect((await client.listTools()).tools.map((tool) => tool.name).sort()).toEqual([
        "drive_read",
        "drive_tools_search",
        "drive_write",
      ])
      const unknownTransferArgument = await callTool(client, "drive_write", "store import", {
        source: "DO_NOT_LOG_ARGUMENT",
        fingerprint: "0".repeat(64),
        unknown_field: true,
      })
      expect(unknownTransferArgument).toMatchObject({
        isError: true,
        structuredContent: { error: { code: "validation_error", message: expect.stringContaining("unknown_field") } },
      })
      expect(JSON.stringify(unknownTransferArgument)).not.toContain("DO_NOT_LOG_ARGUMENT")
      expect(call).toHaveBeenCalledTimes(1)
    } finally {
      await close()
    }
  })

  it("keeps denied commands discoverable with availability on a read-only profile", async () => {
    const f = fixture()
    const { client, close } = await mcpClient({ env: { ...f.env, DRIVE_READ_ONLY: "1" }, api: { call: vi.fn() } })
    try {
      expect((await client.listTools()).tools.map((tool) => tool.name).sort()).toEqual([
        "drive_read",
        "drive_tools_search",
        "drive_write",
      ])
      const found = await client.callTool({ name: "drive_tools_search", arguments: { query: "files get" } })
      expect(found).toMatchObject({
        structuredContent: {
          items: expect.arrayContaining([
            expect.objectContaining({
              command: "files get",
              writes: false,
              arguments: expect.objectContaining({ required: ["file"] }),
            }),
          ]),
        },
      })
      const blocked = await client.callTool({
        name: "drive_tools_search",
        arguments: { query: "api drive-files-delete" },
      })
      expect(blocked).toMatchObject({
        structuredContent: {
          items: expect.arrayContaining([
            expect.objectContaining({
              command: "api drive-files-delete",
              availability: expect.objectContaining({ available: false }),
            }),
          ]),
        },
      })
      expect(
        await callTool(client, "drive_write", "api drive-files-delete", { file_id: "fixture-file" }),
      ).toMatchObject({ isError: true, structuredContent: { error: { code: "permission_error" } } })
    } finally {
      await close()
    }
  })

  it("gives every command a name drive_read and drive_write can tell apart", () => {
    const tools = toolsFromCommands(describeProgram(createProgram()), { includeUnavailable: true, exclude: [["mcp"]] })
    // cli-core finds a command with spaces, "_" and "-" folded together; two paths that fold alike hide one.
    const folded = new Set(tools.map((tool) => tool.command.replace(/[\s_-]+/g, " ")))
    expect(folded.size).toBe(tools.length)
  })
})
