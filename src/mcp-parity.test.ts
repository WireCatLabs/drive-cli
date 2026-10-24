import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { captureStreams } from "@wirecat/cli-base"
import { describe, expect, it, vi } from "vitest"
import { paths, readConfig, writeConfig } from "./config.js"
import { invokeTool, mcpTools } from "./mcp.js"
import { createProgram } from "./program.js"
import { fixture } from "./testing.js"

const setup = () => {
  const f = fixture()
  const options = { env: f.env, api: { call: vi.fn() }, source: async () => f.source, index: async () => f.index }
  const tools = () => mcpTools(createProgram, options, "default")
  const tool = (name: string) => {
    const found = tools().find((item) => item.command.path.join(" ") === name)
    if (!found) throw new Error(`missing tool ${name}`)
    return found
  }
  const allow = () => {
    const config = readConfig(f.env)
    config.profiles.default = {
      ...(config.profiles.default as NonNullable<typeof config.profiles.default>),
      permissions: { "mcp.authority": "allow" },
    }
    writeConfig(f.env, config)
  }
  return { ...f, options, tools, tool, allow }
}

describe("MCP parity and authority", () => {
  it("offers and invokes the safe local reads", async () => {
    const t = setup()
    for (const name of ["session list", "config show", "skill show", "guide"]) {
      const result = await invokeTool(createProgram, t.tool(name), {}, t.options, "default")
      expect(result, name).not.toHaveProperty("isError", true)
      expect(result.structuredContent).toBeDefined()
    }
    for (const name of ["models text download", "images models download"])
      expect(t.tools().some((tool) => tool.command.path.join(" ") === name)).toBe(true)
    for (const tool of t.tools())
      for (const key of Object.keys(tool.schema.properties as object)) expect(key).not.toContain("-")
    expect(t.options.api.call).not.toHaveBeenCalled()
    expect(t.tools().map((tool) => tool.command.path.join(" "))).not.toContain("config set")
    expect(t.tools().map((tool) => tool.command.path.join(" "))).not.toContain("models set")
  })
  it("requires saved authority, refuses self-grants and rechecks revoked permissions", async () => {
    const t = setup()
    expect(() => mcpTools(createProgram, t.options, "default", { permission: ["mcp.authority=allow"] })).toThrow(
      "loosen",
    )
    t.allow()
    const config = t.tool("config set")
    const models = t.tool("models set")
    expect(t.tool("skill install")).toBeDefined()
    expect(
      await invokeTool(createProgram, config, { key: "max_text_chars", json_value: "1000" }, t.options, "default"),
    ).not.toHaveProperty("isError", true)
    expect(readConfig(t.env).profiles.default?.max_text_chars).toBe(1000)
    for (const key of ["permissions", "permissions.mcp.authority", "permissions.mcp", "read_only"]) {
      expect(
        await invokeTool(createProgram, config, { key, json_value: "{}", defaults: true }, t.options, "default"),
      ).toMatchObject({ isError: true, structuredContent: { error: { code: "permission_error" } } })
    }
    expect(await invokeTool(createProgram, models, { provider: "off" }, t.options, "default")).not.toHaveProperty(
      "isError",
      true,
    )
    expect(readConfig(t.env).defaults?.models?.memories?.provider).toBe("off")
    const current = readConfig(t.env)
    current.profiles.default = {
      ...(current.profiles.default as NonNullable<typeof current.profiles.default>),
      permissions: { "mcp.authority": "deny" },
    }
    writeConfig(t.env, current)
    expect(
      await invokeTool(createProgram, config, { key: "max_text_chars", json_value: "2000" }, t.options, "default"),
    ).toHaveProperty("isError", true)
    expect(readConfig(t.env).profiles.default?.max_text_chars).toBe(1000)
    t.allow()
    expect(
      await invokeTool(createProgram, config, { key: "max_text_chars", json_value: "2000" }, t.options, "default", {
        readOnly: true,
      }),
    ).toHaveProperty("isError", true)
  })
  it("exports only inside the profile folder and never overwrites existing Markdown", async () => {
    const t = setup()
    await createProgram({ ...t.options, streams: captureStreams() }).parseAsync(["default", "sync"], { from: "user" })
    const tool = t.tool("documents export")
    expect(
      await invokeTool(createProgram, tool, { document: "doc-a", output: "document.md" }, t.options, "default", {
        readOnly: true,
      }),
    ).toHaveProperty("isError", true)
    expect(existsSync(join(paths(t.env).cache, "exports"))).toBe(false)
    for (const output of ["../escape.md", "/tmp/escape.md", "folder/file.md", "..", "a\\b.md"]) {
      expect(await invokeTool(createProgram, tool, { document: "doc-a", output }, t.options, "default")).toHaveProperty(
        "isError",
        true,
      )
    }
    expect(
      await invokeTool(createProgram, tool, { document: "doc-a", output: "document.md" }, t.options, "default"),
    ).not.toHaveProperty("isError", true)
    const path = join(paths(t.env).cache, "exports", "default", "document.md")
    expect(readFileSync(path, "utf8")).toContain("budget decision")
    expect(
      await invokeTool(createProgram, tool, { document: "doc-a", output: "document.md" }, t.options, "default"),
    ).toHaveProperty("isError", true)
  })
})
