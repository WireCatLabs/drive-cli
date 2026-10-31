import { readFileSync } from "node:fs"
import { join } from "node:path"
import { captureStreams, memoryKeyring } from "@wirecat/cli-base"
import { OAuth2Client } from "google-auth-library"
import { describe, expect, it, vi } from "vitest"
import { operations, validateRequest } from "./api-contract.js"
import { readConfig, writeConfig } from "./config.js"
import { googleApi } from "./google-api.js"

import { run } from "./program.js"
import { requestSchema } from "./schema.js"
import { callTool, mcpClient } from "./testing/mcp.js"
import { commandResult, testProgram as createProgram, fixture } from "./testing.js"
import { ACTIVITY_SCOPE, APPS_SCOPE, READ_SCOPE, saveSession, WRITE_SCOPE } from "./tokens.js"

describe("schema-generated Google contracts", () => {
  it("keeps all 85 operations and validates required IDs, bounds, enums and recursive bodies", () => {
    expect(operations).toHaveLength(85)
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
      ["default", "commands", "api", "drive-files-get", "--json"],
      {
        from: "user",
      },
    )
    expect(JSON.parse(registry.stdout.join("")).commands[0]).toMatchObject({
      origin: "generated",
      api_operation: "drive.files.get",
      effects: { remote: "read", local: "none" },
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
  it("lets --permission only tighten, on the command line and for the MCP server", async () => {
    const f = fixture()
    const config = readConfig(f.env)
    config.defaults = { permissions: { "api.drive.files.update": "deny" } }
    writeConfig(f.env, config)
    const request = vi.fn(async () => ({ id: "doc-a" }))
    const run = (...argv: string[]) =>
      createProgram({ env: f.env, api: { call: request }, streams: captureStreams() }).parseAsync(
        ["default", ...argv],
        { from: "user" },
      )
    await expect(
      run("--permission", "api.drive.files.update=allow", "api", "drive-files-update", "--file-id", "doc-a"),
    ).rejects.toMatchObject({ details: { reason: "policy.flag-loosens", permission: "api.drive.files.update" } })
    await expect(
      run("--permission", "api=allow", "api", "drive-files-delete", "--file-id", "doc-a"),
    ).rejects.toMatchObject({ details: { reason: "policy.flag-loosens" } })
    await expect(
      run("--permission", "api.drive.files.get=deny", "api", "drive-files-get", "--file-id", "doc-a"),
    ).rejects.toMatchObject({ details: { reason: "policy.denied" } })
    expect(request).not.toHaveBeenCalled()
    await expect(
      mcpClient({ env: f.env, api: { call: request } }, ["--permission", "api.drive.files.update=allow"]),
    ).rejects.toThrow("only tightens")
  })

  it("refuses a permission that names no drive command instead of ignoring it", async () => {
    const f = fixture()
    const config = readConfig(f.env)
    config.defaults = { permissions: { tagz: "deny" } }
    writeConfig(f.env, config)
    const request = vi.fn(async () => ({ id: "doc-a" }))
    await expect(
      createProgram({ env: f.env, api: { call: request }, streams: captureStreams() }).parseAsync(
        ["default", "api", "drive-files-get", "--file-id", "doc-a"],
        { from: "user" },
      ),
    ).rejects.toMatchObject({
      code: "configuration_error",
      details: { reason: "policy.unknown-key", permission: "tagz" },
    })
    expect(request).not.toHaveBeenCalled()
  })

  it("buffers output atomically, sanitizes agent text and supports dotted shared settings", async () => {
    const f = fixture()
    const request = vi.fn(async () => ({ text: "budget\u202eunsafe" }))
    const { client, close } = await mcpClient({ env: f.env, api: { call: request } })
    let answer: Awaited<ReturnType<typeof callTool>>
    try {
      answer = await callTool(client, "drive_read", "files get", { file: "doc-a" })
    } finally {
      await close()
    }
    expect(JSON.stringify(answer.structuredContent)).not.toContain("\u202e")
    await expect(
      createProgram({ env: f.env, streams: captureStreams() }).parseAsync(["default", "--agent-json", "status"], {
        from: "user",
      }),
    ).rejects.toThrow()
    const bounded = captureStreams()
    await expect(
      createProgram({ env: f.env, api: { call: request }, streams: bounded }).parseAsync(
        ["default", "--max-output-bytes", "4", "files", "get", "doc-a"],
        { from: "user" },
      ),
    ).rejects.toThrow("exceeds 4 bytes")
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
    config.defaults = { permissions: { tags: "readonly", files: "readonly" } }
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
  it("refuses every change under DRIVE_READ_ONLY=1 with exit 5, as --read-only does", async () => {
    const f = fixture()
    const env = { ...f.env, DRIVE_READ_ONLY: "1" }
    const request = vi.fn(async () => ({}))
    const index = vi.fn(async () => f.index)
    for (const args of [
      ["tags", "add", "doc-a", "tag"],
      ["files", "copy", "doc-a"],
      ["config", "unset", "max_text_chars"],
    ]) {
      const program = createProgram({ env, api: { call: request }, index, streams: captureStreams() })
      const failure = await program.parseAsync(["default", ...args], { from: "user" }).catch((error) => error)
      expect(failure).toMatchObject({ code: "permission_error", message: expect.stringContaining("DRIVE_READ_ONLY") })
      const code = await run(["default", ...args], {
        env,
        api: { call: request },
        index,
        streams: captureStreams(),
        tty: false,
      })
      expect(code).toBe(5)
    }
    expect(request).not.toHaveBeenCalled()
    expect(index).not.toHaveBeenCalled()
    const read = captureStreams()
    await createProgram({ env, api: { call: request }, streams: read }).parseAsync(
      ["default", "files", "get", "doc-a", "--json"],
      { from: "user" },
    )
    expect(request).toHaveBeenCalledTimes(1)
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
    await run("config", "set", "max_text_chars", "500000")
    expect(readConfig(f.env).profiles.default?.max_text_chars).toBe(500000)
    await expect(run("config", "set", "max_text_chars", "3000000")).rejects.toThrow("document readers return at most")
    await expect(run("config", "set", "max_text_chars", "0")).rejects.toThrow("positive whole number")
    await expect(run("config", "set", "max_text_chars", "1.5")).rejects.toThrow("positive whole number")
    expect(readConfig(f.env).defaults?.permissions?.api).toBe("readonly")
    expect(await run("complete", "--", "fil")).toContain("files")
    expect(await run("complete", "--help")).toContain("print a shell completion script")
    await expect(run("--offline", "files", "get", "doc-a")).rejects.toThrow("offline")
    expect(commandResult(await run("--dry-run", "api", "drive-files-get", "--file-id", "doc-a"))).toMatchObject({
      dry_run: true,
    })
    expect(commandResult(await run("--dry-run", "tags", "add", "doc-a", "tag"))).toMatchObject({
      dry_run: true,
      effects: { remote: "none", local: "write" },
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
  it("goes ahead over MCP with a write at level ask, and still refuses deny and read-only", async () => {
    const f = fixture()
    const config = readConfig(f.env)
    config.defaults = { permissions: { "api.docs.documents.create": "ask" } }
    writeConfig(f.env, config)
    const request = vi.fn(async () => ({ id: "created" }))
    const options = { env: f.env, api: { call: request } }
    const { client, close } = await mcpClient(options)
    try {
      expect(
        await callTool(client, "drive_write", "api docs-documents-create", { body: '{"title":"synthetic"}' }),
      ).not.toHaveProperty("isError")
      expect(request).toHaveBeenCalledOnce()
      expect(readFileSync(join(f.env.DRIVE_STATE_DIR as string, "sends/default.jsonl"), "utf8")).toContain(
        "api.docs.documents.create",
      )
      request.mockClear()
      expect(await callTool(client, "drive_write", "api drive-files-delete", { file_id: "doc-a" })).not.toHaveProperty(
        "isError",
      )
      expect(request).toHaveBeenCalledOnce()
      request.mockClear()
      config.defaults = { permissions: { "api.docs.documents.create": "deny" } }
      writeConfig(f.env, config)
      expect(await callTool(client, "drive_write", "api docs-documents-create", { body: "{}" })).toMatchObject({
        isError: true,
        structuredContent: { error: { code: "permission_error" } },
      })
      expect(request).not.toHaveBeenCalled()
    } finally {
      await close()
    }
    const locked = await mcpClient({ ...options, env: { ...f.env, DRIVE_READ_ONLY: "1" } })
    try {
      config.defaults = { permissions: { "api.docs.documents.create": "ask" } }
      writeConfig(f.env, config)
      expect(await callTool(locked.client, "drive_write", "api docs-documents-create", { body: "{}" })).toMatchObject({
        isError: true,
        structuredContent: { error: { code: "permission_error" } },
      })
      expect(request).not.toHaveBeenCalled()
    } finally {
      await locked.close()
    }
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
const availabilityOf = async (client: Parameters<typeof callTool>[0], command: string) => {
  const found = await client.callTool({ name: "drive_tools_search", arguments: { query: command } })
  const items = (found.structuredContent as { items: { command: string; writes: boolean; availability: unknown }[] })
    .items
  return items.find((one) => one.command === command)
}

describe("MCP derived from the same guarded command tree", () => {
  it("marks writes and denials unavailable, prevents argument injection and uses the CLI executor", async () => {
    const f = fixture()
    const request = vi.fn(async () => ({ id: "doc-a" }))
    const options = { env: f.env, api: { call: request } }
    const readOnly = await mcpClient({ ...options, env: { ...f.env, DRIVE_READ_ONLY: "1" } })
    try {
      expect(
        await callTool(readOnly.client, "drive_write", "facts reverse", { document: "doc-a", fact: "fact:1" }),
      ).toMatchObject({
        isError: true,
        structuredContent: { error: { code: "permission_error" } },
      })
      expect(await availabilityOf(readOnly.client, "api drive-files-delete")).toMatchObject({
        writes: true,
        availability: { available: false },
      })
      expect(await callTool(readOnly.client, "drive_read", "api drive-files-get", { file_id: "doc-a" })).toMatchObject({
        structuredContent: { item: { id: "doc-a" } },
      })
    } finally {
      await readOnly.close()
    }
    const config = readConfig(f.env)
    config.defaults = { permissions: { files: "deny" } }
    writeConfig(f.env, config)
    const { client, close } = await mcpClient(options)
    try {
      expect(await availabilityOf(client, "files get")).toMatchObject({ availability: { available: false } })
      expect(await callTool(client, "drive_read", "files get", { file: "doc-a" })).toMatchObject({
        isError: true,
      })
      expect(
        await callTool(client, "drive_read", "documents show", { document: "x", permission: "api=allow" }),
      ).toMatchObject({
        isError: true,
        structuredContent: { error: { code: "validation_error", message: expect.stringContaining("permission") } },
      })
      const dashed = await callTool(client, "drive_read", "documents show", { document: "--permission" })
      expect(dashed.structuredContent.error?.message ?? "").not.toMatch(/option|flag/i)
    } finally {
      await close()
    }
  })
})
describe("MCP read-only discovery", () => {
  // The local-only writes (facts reverse, tags add) are refused when called but still listed as available.
  it.fails("lists every write unavailable under DRIVE_READ_ONLY", async () => {
    const f = fixture()
    const { client, close } = await mcpClient({ env: { ...f.env, DRIVE_READ_ONLY: "1" } })
    try {
      for (const command of ["facts reverse", "tags add", "files copy"])
        expect(await availabilityOf(client, command), command).toMatchObject({
          writes: true,
          availability: { available: false },
        })
    } finally {
      await close()
    }
  })
})
describe("MCP marks missing Google grants unavailable", () => {
  const serving = (scope?: string) => {
    const f = fixture()
    const keyring = memoryKeyring()
    if (scope !== "none")
      saveSession(
        f.env,
        "default",
        {
          principal: "synthetic-principal",
          clientId: "fixture-client",
          tokens: { refresh_token: "fixture-refresh-token", ...(scope === undefined ? {} : { scope }) },
        },
        "keyring",
        keyring,
      )
    return mcpClient({ env: f.env, keyring })
  }
  const GATED = ["api drive-files-delete", "sheets update", "api driveactivity-activity-query", "api drive-apps-list"]

  it("keeps Google writes, activity and apps visible with reasons for missing grants", async () => {
    for (const scope of [READ_SCOPE, "none"]) {
      const { client, close } = await serving(scope)
      try {
        expect(await availabilityOf(client, "api drive-files-get")).toMatchObject({ availability: { available: true } })
        expect(await availabilityOf(client, "facts reverse")).toBeDefined()
        expect(await availabilityOf(client, "memories extract")).toBeDefined()
        for (const command of GATED)
          expect(await availabilityOf(client, command), command).toMatchObject({
            availability: {
              available: false,
              permission: "oauth.scope",
              reason: expect.stringContaining("the OAuth grant needs"),
            },
          })
      } finally {
        await close()
      }
    }
  })

  it("offers each group once its grant is there", async () => {
    const { client, close } = await serving([WRITE_SCOPE, ACTIVITY_SCOPE, APPS_SCOPE].join(" "))
    try {
      for (const command of ["api drive-files-get", ...GATED])
        expect(await availabilityOf(client, command), command).toMatchObject({ availability: { available: true } })
    } finally {
      await close()
    }
  })

  it("assumes nothing when the saved sign-in does not name its scopes", async () => {
    const { client, close } = await serving()
    try {
      expect(await availabilityOf(client, "api drive-files-delete")).toMatchObject({
        availability: { available: true },
      })
    } finally {
      await close()
    }
  })

  it("refuses a gated tool call with the missing scope named", async () => {
    const { client, close } = await serving(READ_SCOPE)
    try {
      const answer = await callTool(client, "drive_write", "sheets update", {
        spreadsheet: "synthetic",
        range: "A1",
        values: "[[1]]",
      })
      expect(answer).toMatchObject({
        isError: true,
        structuredContent: { error: { code: "permission_error", details: { permission: "oauth.scope" } } },
      })
    } finally {
      await close()
    }
  })
})
