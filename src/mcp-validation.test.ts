import { Client, InMemoryTransport } from "@modelcontextprotocol/client"
import { openStore } from "@wirecat/cli-core/store"
import { describe, expect, it, vi } from "vitest"
import { buildMcpServer, mcpTools } from "./mcp.js"
import { createProgram } from "./program.js"
import { fixture } from "./testing.js"

describe("MCP validation through the SDK", () => {
  it("returns our field-specific error and audits bad types and unknown arguments before providers", async () => {
    const f = fixture()
    const call = vi.fn(async () => ({ id: "fixture-file" }))
    const { server } = buildMcpServer(createProgram, { env: f.env, api: { call } }, "default")
    const client = new Client({ name: "fixture-client", version: "1" })
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair()
    await server.connect(serverTransport)
    await client.connect(clientTransport)
    try {
      for (const [field, args] of [
        ["file-id", { "file-id": 42 }],
        ["unknown-field", { "file-id": "fixture-file", "unknown-field": "DO_NOT_LOG_ARGUMENT" }],
        ["file-id", {}],
      ] as const) {
        const result = await client.callTool({
          name: "drive_read",
          arguments: { command: "api drive-files-get", arguments: args },
        })
        expect(result).toMatchObject({
          isError: true,
          structuredContent: { error: { code: "validation_error", message: expect.stringContaining(field) } },
        })
        expect(JSON.stringify(result)).not.toContain("DO_NOT_LOG_ARGUMENT")
      }
      expect(call).not.toHaveBeenCalled()
      const good = await client.callTool({
        name: "drive_read",
        arguments: { command: "api drive-files-get", arguments: { "file-id": "fixture-file" } },
      })
      expect(good).toMatchObject({
        structuredContent: { item: { id: "fixture-file" }, meta: { run_id: expect.any(String) } },
      })
      expect(call).toHaveBeenCalledTimes(1)
      const sheetsResult = await client.callTool({
        name: "drive_write",
        arguments: {
          command: "sheets update",
          arguments: { spreadsheet: "synthetic-sheet", range: "Budget!A1", values: "[[1,2]]" },
        },
      })
      expect(sheetsResult).toMatchObject({
        isError: true,
        structuredContent: {
          error: { code: "validation_error", message: expect.stringContaining("--values") },
        },
      })
      const unknownSheetArgument = await client.callTool({
        name: "drive_read",
        arguments: {
          command: "sheets show",
          arguments: { spreadsheet: "synthetic-sheet", range: "Budget!A1", unknown: "DO_NOT_LOG_ARGUMENT" },
        },
      })
      expect(unknownSheetArgument).toMatchObject({
        isError: true,
        structuredContent: {
          error: { code: "validation_error", message: expect.stringContaining("unknown") },
        },
      })
      expect(JSON.stringify(unknownSheetArgument)).not.toContain("DO_NOT_LOG_ARGUMENT")
      expect((await client.listTools()).tools.map((tool) => tool.name).sort()).toEqual([
        "drive_read",
        "drive_tools_search",
        "drive_write",
      ])
      const unknownTransferArgument = await client.callTool({
        name: "drive_write",
        arguments: {
          command: "store import",
          arguments: { source: "DO_NOT_LOG_ARGUMENT", fingerprint: "0".repeat(64), "unknown-field": true },
        },
      })
      expect(unknownTransferArgument).toMatchObject({
        isError: true,
        structuredContent: { error: { code: "validation_error", message: expect.stringContaining("unknown-field") } },
      })
      expect(JSON.stringify(unknownTransferArgument)).not.toContain("DO_NOT_LOG_ARGUMENT")
      expect(call).toHaveBeenCalledTimes(1)
      const store = await openStore({ path: f.env.MESSAGING_STORE, env: f.env })
      try {
        const rows = await store.agentActions.list({ tool: "drive_api_drive_files_get" })
        expect(rows).toHaveLength(4)
        expect(rows.filter((row) => row.status === "failed")).toHaveLength(3)
        expect(rows.filter((row) => row.status === "failed").every((row) => row.error === "validation_error")).toBe(
          true,
        )
        expect(JSON.stringify(rows)).not.toContain("DO_NOT_LOG_ARGUMENT")
        expect(await store.agentActions.list({ tool: "drive_store_import" })).toMatchObject([
          { status: "failed", error: "validation_error" },
        ])
      } finally {
        await store.close()
      }
    } finally {
      await client.close()
      await server.close()
    }
  })

  it("finds commands with drive_tools_search and offers no drive_write to a read-only profile", async () => {
    const f = fixture()
    const { server } = buildMcpServer(createProgram, { env: f.env, api: { call: vi.fn() } }, "default", {
      readOnly: true,
    })
    const client = new Client({ name: "fixture-client", version: "1" })
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair()
    await server.connect(serverTransport)
    await client.connect(clientTransport)
    try {
      expect((await client.listTools()).tools.map((tool) => tool.name).sort()).toEqual([
        "drive_read",
        "drive_tools_search",
      ])
      const found = await client.callTool({ name: "drive_tools_search", arguments: { query: "files get" } })
      expect(found).toMatchObject({
        structuredContent: {
          items: expect.arrayContaining([
            expect.objectContaining({
              command: "api drive-files-get",
              writes: false,
              arguments: expect.objectContaining({ required: ["file-id"] }),
            }),
          ]),
        },
      })
      expect(JSON.stringify(found)).not.toContain("drive-files-delete")
    } finally {
      await client.close()
      await server.close()
    }
  })

  it("gives every command a name drive_read and drive_write can tell apart", () => {
    const f = fixture()
    const tools = mcpTools(createProgram, { env: f.env, api: { call: vi.fn() } }, "default")
    // cli-core finds a command with spaces, "_" and "-" folded together; two paths that fold alike hide one.
    const folded = new Set(tools.map((tool) => tool.command.path.join(" ").replace(/[\s_-]+/g, " ")))
    expect(folded.size).toBe(tools.length)
  })
})
