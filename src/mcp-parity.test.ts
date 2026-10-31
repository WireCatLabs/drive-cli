import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { captureStreams } from "@wirecat/cli-base"
import type { Level } from "@wirecat/cli-core/sends"
import { describe, expect, it, vi } from "vitest"
import { readConfig, writeConfig } from "./config.js"
import { callTool, mcpClient } from "./testing/mcp.js"
import { testProgram as createProgram, fixture } from "./testing.js"

const setup = () => {
  const f = fixture()
  const call = vi.fn()
  const options = (env = f.env) => ({ env, api: { call }, source: async () => f.source, index: async () => f.index })
  const serve = async (flags: string[] = [], env = f.env) => {
    const server = await mcpClient(options(env), flags)
    return {
      ...server,
      read: (command: string, args = {}) => callTool(server.client, "drive_read", command, args),
      write: (command: string, args = {}) => callTool(server.client, "drive_write", command, args),
    }
  }
  const setPermissions = (permissions: Record<string, Level>) => {
    const config = readConfig(f.env)
    config.profiles.default = {
      ...(config.profiles.default as NonNullable<typeof config.profiles.default>),
      permissions,
    }
    writeConfig(f.env, config)
  }
  return { ...f, call, options, serve, setPermissions, allow: () => setPermissions({ "mcp.authority": "allow" }) }
}

describe("MCP parity and authority", () => {
  it("offers and runs the safe local reads, and keeps config and model changes behind mcp.authority", async () => {
    const t = setup()
    const { client, read, close } = await t.serve()
    try {
      for (const command of ["session list", "config show", "skill show", "guide"]) {
        const result = await read(command)
        expect(result, command).not.toHaveProperty("isError", true)
        expect(result.structuredContent).toBeDefined()
      }
      const found = await client.callTool({ name: "drive_tools_search", arguments: { query: "config set" } })
      const catalogue = (found.structuredContent as { items: { command: string; availability: unknown }[] }).items
      for (const command of ["config set", "config unset"])
        expect(catalogue.find((one) => one.command === command)?.availability).toMatchObject({
          available: false,
          permission: "mcp.authority",
        })
      const models = await client.callTool({ name: "drive_tools_search", arguments: { query: "models" } })
      const names = (models.structuredContent as { items: { command: string }[] }).items.map((one) => one.command)
      expect(names).toEqual(expect.arrayContaining(["models download", "images models download"]))
      expect(t.call).not.toHaveBeenCalled()
    } finally {
      expect(await close()).toBe(0)
    }
  })

  it("marks a denied command in profile-aware CLI help and discovery without calling Google", async () => {
    const t = setup()
    t.setPermissions({ files: "deny" })
    const streams = captureStreams()
    await createProgram({ ...t.options(), streams }).parseAsync(["default", "commands", "files", "--json"], {
      from: "user",
    })
    const document = JSON.parse(streams.stdout.join(""))
    const get = document.commands[0].commands.find((one: { name: string }) => one.name === "get")
    expect(get).toMatchObject({ availability: { available: false, permission: "files.get" } })
    const help = captureStreams()
    await createProgram({ ...t.options(), streams: help })
      .parseAsync(["default", "files", "get", "--help"], { from: "user" })
      .catch((error) => {
        if (error.code !== "commander.helpDisplayed") throw error
      })
    expect(help.stdout.join("")).toContain("Availability: unavailable")
    expect(t.call).not.toHaveBeenCalled()
  })

  it("refuses a --permission that loosens what the profile saves", async () => {
    const t = setup()
    const { client } = await t.serve(["--permission", "mcp.authority=allow"]).catch((error: Error) => ({
      client: undefined,
      error,
    }))
    expect(client).toBeUndefined()
  })

  it("requires saved authority, refuses self-grants and rechecks revoked permissions on every call", async () => {
    const t = setup()
    t.allow()
    const { read, write, close } = await t.serve()
    try {
      expect(await write("config set", { key: "max_text_chars", json_value: "1000" })).not.toHaveProperty(
        "isError",
        true,
      )
      expect(readConfig(t.env).profiles.default?.max_text_chars).toBe(1000)
      for (const key of ["permissions", "permissions.mcp.authority", "permissions.mcp"]) {
        expect(await write("config set", { key, json_value: "{}", defaults: true })).toMatchObject({
          isError: true,
          structuredContent: { error: { code: "permission_error" } },
        })
        expect(await write("config unset", { key, defaults: true })).toMatchObject({
          isError: true,
          structuredContent: { error: { code: "permission_error" } },
        })
      }
      expect(await write("models set", { provider: "off" })).not.toHaveProperty("isError", true)
      expect(readConfig(t.env).defaults?.models?.memories?.provider).toBe("off")
      t.setPermissions({ "mcp.authority": "deny" })
      expect(await write("config set", { key: "max_text_chars", json_value: "2000" })).toMatchObject({
        isError: true,
        structuredContent: { error: { code: "permission_error" } },
      })
      expect(readConfig(t.env).profiles.default?.max_text_chars).toBe(1000)
      expect((await read("config show")).isError).not.toBe(true)
    } finally {
      await close()
    }
  })

  it("refuses config changes on a read-only server", async () => {
    const t = setup()
    t.allow()
    const { write, close } = await t.serve(["--read-only"])
    try {
      expect(await write("config set", { key: "max_text_chars", json_value: "2000" })).toMatchObject({
        isError: true,
        structuredContent: { error: { code: "permission_error" } },
      })
      expect(readConfig(t.env).profiles.default?.max_text_chars).toBeUndefined()
    } finally {
      await close()
    }
  })

  it("refuses model downloads under read-only before fetching", async () => {
    const t = setup()
    const { write, close } = await t.serve([], { ...t.env, DRIVE_READ_ONLY: "1" })
    try {
      expect(await write("models download", { model: "e5-small" })).toMatchObject({
        isError: true,
        structuredContent: { error: { code: "permission_error" } },
      })
    } finally {
      await close()
    }
  })

  it("refuses a download and an export under read-only before writing", async () => {
    const t = setup()
    await createProgram({ ...t.options(), streams: captureStreams() }).parseAsync(["default", "sync"], { from: "user" })
    const download = vi.fn(async () => Uint8Array.of(0, 255))
    const server = await mcpClient({ ...t.options({ ...t.env, DRIVE_READ_ONLY: "1" }), download })
    const binary = join(t.directory, "download.bin")
    const markdown = join(t.directory, "document.md")
    try {
      expect(
        await callTool(server.client, "drive_write", "files download", { file: "synthetic-file", output: binary }),
      ).toHaveProperty("isError", true)
      expect(
        await callTool(server.client, "drive_write", "documents export", { document: "doc-a", output: markdown }),
      ).toHaveProperty("isError", true)
      expect(existsSync(binary)).toBe(false)
      expect(existsSync(markdown)).toBe(false)
    } finally {
      await server.close()
    }
  })

  it("exports Markdown to a new file and never overwrites an existing one", async () => {
    const t = setup()
    await createProgram({ ...t.options(), streams: captureStreams() }).parseAsync(["default", "sync"], { from: "user" })
    const { write, close } = await t.serve()
    const output = "document.md"
    try {
      expect(await write("documents export", { document: "doc-a", output })).not.toHaveProperty("isError", true)
      const written = join(t.options().env?.DRIVE_CACHE_DIR ?? "", "exports", "default", output)
      expect(readFileSync(written, "utf8")).toContain("budget decision")
      expect(await write("documents export", { document: "doc-a", output })).toHaveProperty("isError", true)
    } finally {
      await close()
    }
  })

  it("confines a download and an export to the profile export folder", async () => {
    const t = setup()
    await createProgram({ ...t.options(), streams: captureStreams() }).parseAsync(["default", "sync"], { from: "user" })
    const download = vi.fn(async () => Uint8Array.of(0, 255))
    const server = await mcpClient({ ...t.options(), download })
    const binary = join(t.directory, "escape.bin")
    const markdown = join(t.directory, "escape.md")
    try {
      const downloaded = await callTool(server.client, "drive_write", "files download", {
        file: "synthetic-file",
        output: binary,
      })
      const exported = await callTool(server.client, "drive_write", "documents export", {
        document: "doc-a",
        output: markdown,
      })
      expect(downloaded).toHaveProperty("isError", true)
      expect(exported).toHaveProperty("isError", true)
      expect(existsSync(binary) || existsSync(markdown)).toBe(false)
    } finally {
      await server.close()
    }
  })
})

it("prints an agent's entry for one profile with its stricter levels, and for every profile", async () => {
  const { env } = fixture()
  const entry = async (args: string[]) => {
    const streams = captureStreams()
    await createProgram({ env, streams }).parseAsync([...args, "--json"])
    return Object.values(JSON.parse(streams.stdout.join("")).item.config.mcpServers)[0] as { args: string[] }
  }
  expect((await entry(["default", "mcp", "config", "--permission", "files.trash=deny"])).args.slice(-5)).toEqual([
    "default",
    "mcp",
    "serve",
    "--permission",
    "files.trash=deny",
  ])
  expect((await entry(["mcp", "config", "--profiles", "all"])).args.slice(-4)).toEqual([
    "mcp",
    "serve",
    "--profiles",
    "all",
  ])
})
