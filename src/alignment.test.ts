import { readFileSync } from "node:fs"
import { join } from "node:path"
import { captureStreams } from "@wirecat/cli-base"
import { OAuth2Client } from "google-auth-library"
import { describe, expect, it, vi } from "vitest"
import { operations, validateRequest } from "./api-contract.js"
import { readConfig, writeConfig } from "./config.js"
import { googleApi } from "./google-api.js"
import { invokeTool, mcpTools, toolArgv } from "./mcp.js"
import { createProgram } from "./program.js"
import { requestSchema } from "./schema.js"
import { fixture } from "./testing.js"

describe("schema-generated Google contracts", () => {
  it("keeps all 68 operations and validates required IDs, bounds, enums and recursive bodies", () => {
    expect(operations).toHaveLength(68)
    expect(() => validateRequest("drive.files.get", {})).toThrow("fileId")
    expect(() => validateRequest("drive.files.list", { pageSize: 1001 })).toThrow("1000")
    expect(() => validateRequest("drive.files.list", { alt: "invented" })).toThrow()
    expect(() => validateRequest("drive.files.get", { fileId: "doc-a", invented: true })).toThrow("unsupported")
    expect(() =>
      validateRequest(
        "docs.documents.batchUpdate",
        { documentId: "doc-a" },
        { requests: [{ insertText: { text: 42 } }] },
      ),
    ).toThrow()
    validateRequest(
      "docs.documents.batchUpdate",
      { documentId: "doc-a" },
      { requests: [{ insertText: { text: "text", location: { index: 1 } } }] },
    )
    validateRequest("drive.files.update", { fileId: "doc-a" }, { quotaBytesUsed: "9007199254740993" })
    expect(requestSchema("docs.documents.batchUpdate")).toMatchObject({
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $defs: expect.any(Object),
    })
    expect(requestSchema("drive.files.get")).toBeNull()
  })
  it("constructs generated argument flags with original metadata and shares friendly validation", async () => {
    const f = fixture()
    const request = vi.fn(async () => ({ id: "doc-a" }))
    const streams = captureStreams()
    await createProgram({ env: f.env, streams, api: { call: request } }).parseAsync(
      ["default", "api", "drive-files-get", "--file-id", "doc-a"],
      { from: "user" },
    )
    expect(request).toHaveBeenCalledWith("drive.files.get", { fileId: "doc-a" }, undefined)
    const registry = captureStreams()
    await createProgram({ env: f.env, streams: registry }).parseAsync(
      ["default", "commands", "api", "drive-files-get"],
      {
        from: "user",
      },
    )
    expect(JSON.parse(registry.stdout.join("")).items[0]).toMatchObject({
      origin: "generated",
      operationId: "drive.files.get",
      mutates: false,
    })
    await expect(
      createProgram({ env: f.env, api: { call: request }, streams: captureStreams() }).parseAsync(
        ["default", "api", "drive-files-list", "--page-size", "1001"],
        { from: "user" },
      ),
    ).rejects.toThrow("1000")
  })
})
describe("shared CLI policy and execution", () => {
  it("buffers output atomically, sanitizes agent text and supports dotted shared settings", async () => {
    const f = fixture()
    const request = vi.fn(async () => ({ text: "budget\u202eunsafe" }))
    const streams = captureStreams()
    await createProgram({ env: f.env, api: { call: request }, streams }).parseAsync(
      ["default", "--agent-json", "files", "get", "doc-a"],
      { from: "user" },
    )
    expect(streams.stdout.join("")).not.toContain("\u202e")
    const bounded = captureStreams()
    await expect(
      createProgram({ env: f.env, api: { call: request }, streams: bounded }).parseAsync(
        ["default", "--max-output-bytes", "4", "files", "get", "doc-a"],
        { from: "user" },
      ),
    ).rejects.toThrow("byte limit")
    expect(bounded.stdout).toEqual([])
    await createProgram({ env: f.env, streams: captureStreams() }).parseAsync(
      ["default", "config", "set", "permissions.files", '"readonly"', "--defaults"],
      { from: "user" },
    )
    expect(readConfig(f.env).defaults?.permissions?.files).toBe("readonly")
  })
  it("blocks local and all equivalent remote mutation paths before touching credentials, stores or network", async () => {
    const f = fixture()
    const config = readConfig(f.env)
    config.defaults = { readOnly: true }
    writeConfig(f.env, config)
    const request = vi.fn(async () => ({}))
    const index = vi.fn(async () => f.index)
    for (const args of [
      ["tags", "add", "doc-a", "tag"],
      ["files", "copy", "doc-a"],
      ["api", "drive-files-copy", "--file-id", "doc-a"],
    ]) {
      await expect(
        createProgram({ env: f.env, api: { call: request }, index, streams: captureStreams() }).parseAsync(
          ["default", ...args],
          {
            from: "user",
          },
        ),
      ).rejects.toThrow("policy")
    }
    expect(request).not.toHaveBeenCalled()
    expect(index).not.toHaveBeenCalled()
    config.defaults = { permissions: { files: "readonly" } }
    writeConfig(f.env, config)
    await expect(
      createProgram({ env: f.env, api: { call: request }, streams: captureStreams() }).parseAsync(
        ["default", "api", "drive-files-copy", "--file-id", "doc-a"],
        { from: "user" },
      ),
    ).rejects.toThrow("policy")
    config.defaults = { permissions: { api: "deny" } }
    writeConfig(f.env, config)
    await expect(
      createProgram({ env: f.env, api: { call: request }, streams: captureStreams() }).parseAsync(
        ["default", "files", "get", "doc-a"],
        { from: "user" },
      ),
    ).rejects.toThrow("policy")
  })
  it("supports profile-first syntax, config, completion and offline/dry-run without network", async () => {
    const f = fixture()
    const request = vi.fn(async () => ({}))
    const run = async (...args: string[]) => {
      const streams = captureStreams()
      await createProgram({ env: f.env, api: { call: request }, streams }).parseAsync(["default", ...args], {
        from: "user",
      })
      return streams.stdout.join("")
    }
    await run("config", "set", "permissions", '{"api":"readonly"}', "--defaults")
    expect(readConfig(f.env).defaults?.permissions?.api).toBe("readonly")
    expect(await run("complete", "--", "fil")).toContain("files")
    await expect(run("--offline", "files", "get", "doc-a")).rejects.toThrow("offline")
    expect(JSON.parse(await run("--dry-run", "api", "drive-files-get", "--file-id", "doc-a"))).toMatchObject({
      dryRun: true,
    })
    expect(JSON.parse(await run("--dry-run", "tags", "add", "doc-a", "tag"))).toMatchObject({
      dryRun: true,
      local: true,
    })
    expect(request).not.toHaveBeenCalled()
  })
  it("asks once, journals Google writes without body content, and enforces explicit destructive confirmation", async () => {
    const f = fixture()
    const config = readConfig(f.env)
    config.defaults = { permissions: { "api.docs.documents.create": "ask" } }
    writeConfig(f.env, config)
    const ask = vi.fn(async () => true)
    const request = vi.fn(async () => ({ id: "created" }))
    await createProgram({ env: f.env, ask, api: { call: request }, streams: captureStreams() }).parseAsync(
      ["default", "documents", "create", "--title", "private-synthetic-title"],
      { from: "user" },
    )
    expect(ask).toHaveBeenCalledOnce()
    const journal = readFileSync(join(f.env.DRIVE_STATE_DIR as string, "sends/default.jsonl"), "utf8")
    expect(journal).toContain("api.docs.documents.create")
    expect(journal).not.toContain("private-synthetic-title")
    await expect(
      createProgram({ env: f.env, api: { call: request }, streams: captureStreams() }).parseAsync(
        ["default", "api", "drive-files-delete", "--file-id", "doc-a"],
        { from: "user" },
      ),
    ).rejects.toThrow("allow-dangerous")
    await createProgram({ env: f.env, api: { call: request }, streams: captureStreams() }).parseAsync(
      ["default", "--allow-dangerous", "api", "drive-files-delete", "--file-id", "doc-a"],
      { from: "user" },
    )
  })
  it("reports ambiguous Google writes without enabling retry", async () => {
    const auth = new OAuth2Client("fixture-client")
    const request = vi.fn(async () => {
      throw { status: 503, message: "fixture-secret" }
    })
    Object.defineProperty(auth, "request", { value: request })
    await expect(googleApi(auth).call("docs.documents.create", {}, { title: "Synthetic" })).rejects.toMatchObject({
      code: "outcome_unknown",
      details: { retryable: false },
    })
    expect(request).toHaveBeenCalledOnce()
  })
})
describe("MCP derived from the same guarded command tree", () => {
  it("filters writes and denials, prevents argument injection and uses the CLI executor", async () => {
    const f = fixture()
    const request = vi.fn(async () => ({ id: "doc-a" }))
    const options = { env: f.env, api: { call: request } }
    const readonly = mcpTools(options, "default", { readOnly: true })
    expect(readonly.every((tool) => !tool.command.mutates)).toBe(true)
    const get = readonly.find((tool) => tool.name === "drive_api_drive_files_get")
    if (!get) throw new Error("missing generated tool")
    expect(await invokeTool(get, { "file-id": "doc-a" }, options, "default")).toMatchObject({
      structuredContent: { result: { id: "doc-a" } },
    })
    const config = readConfig(f.env)
    config.defaults = { permissions: { files: "deny" } }
    writeConfig(f.env, config)
    expect(mcpTools(options, "default").some((tool) => tool.name === get.name)).toBe(false)
    expect(await invokeTool(get, { "file-id": "doc-a" }, options, "default")).toMatchObject({ isError: true })
    const tools = mcpTools(options, "default")
    const show = tools.find((tool) => tool.name === "drive_documents_show")
    if (!show) throw new Error("missing local tool")
    expect(toolArgv(show, { "url-or-id": "--permission", permission: "api=allow" })).toEqual([
      "documents",
      "show",
      "--",
      "--permission",
    ])
  })
})
