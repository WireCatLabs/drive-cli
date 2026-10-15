import { captureStreams } from "@wirecat/cli-base"
import type { MessageStore } from "@wirecat/cli-core/store"
import { Command } from "commander"
import { describe, expect, it, vi } from "vitest"
import { documentKnowledge } from "./knowledge.js"
import { installKnowledgeCommands } from "./knowledge-commands.js"
import { mcpTools, toolArgv } from "./mcp.js"
import { createProgram } from "./program.js"
import { commandResult, fixture } from "./testing.js"

const ref = "document:1"
const stubStore = () => {
  const store = {
    notes: { resolveNote: vi.fn(async () => ({ source: "file", folderId: "folder-1", deletedAt: null })) },
    facts: { list: vi.fn(async () => []) },
    memories: { list: vi.fn(async () => []), search: vi.fn(async () => []) },
  }
  return store
}
const commands = (store: ReturnType<typeof stubStore>) => {
  const knowledge = documentKnowledge(store as unknown as MessageStore, async () => "folder-1")
  const program = new Command().exitOverride()
  program.command("documents")
  const bodies: unknown[] = []
  installKnowledgeCommands(program, {
    document: () => {
      throw new Error("not used")
    },
    run: (_input, fn) => fn(knowledge, "synthetic-principal", ref),
    output: (body) => bodies.push(body),
    positive: Number,
    complete: () => {
      throw new Error("not used")
    },
  })
  return { run: (...args: string[]) => program.parseAsync(args, { from: "user" }), bodies }
}

describe("document knowledge lists filter in the store's query", () => {
  it("hands facts list kind: and status: to the store's WHERE, beside the document", async () => {
    const store = stubStore()
    await commands(store).run("facts", "list", "DOC", "kind:decision", "status:proposed")
    expect(store.facts.list).toHaveBeenCalledWith({ type: "decision", status: "proposed", limit: 50, subject: ref })
  })
  it("hands memories list kind:, status: and scope: to the store's WHERE", async () => {
    const store = stubStore()
    await commands(store).run("memories", "list", "DOC", "scope:work", "kind:preference", "status:confirmed")
    expect(store.memories.list).toHaveBeenCalledWith({
      kind: "preference",
      status: "confirmed",
      scope: "work",
      limit: 50,
      subject: ref,
    })
  })
  it("searches memories by the words and the scope: term in one store query", async () => {
    const store = stubStore()
    await commands(store).run("memories", "search", "DOC", "async", "reviews", "scope:work")
    expect(store.memories.search).toHaveBeenCalledWith("async reviews", { scope: "work", limit: 200 })
    await commands(store).run("memories", "search", "DOC", "reviews")
    expect(store.memories.search).toHaveBeenLastCalledWith("reviews", { limit: 200 })
  })
  it("refuses the removed filter flags and unknown fields before the store is asked", async () => {
    const store = stubStore()
    const { run } = commands(store)
    for (const args of [
      ["facts", "list", "DOC", "--status", "proposed"],
      ["facts", "list", "DOC", "--type", "decision"],
      ["facts", "list", "DOC", "type:decision"],
      ["memories", "list", "DOC", "--scope", "work"],
      ["memories", "list", "DOC", "--kind", "preference"],
      ["memories", "search", "DOC", "reviews", "--scope", "work"],
      ["memories", "search", "DOC", "scope:work"],
    ])
      await expect(run(...args), args.join(" ")).rejects.toMatchObject({ code: "validation_error" })
    expect(store.facts.list).not.toHaveBeenCalled()
    expect(store.memories.list).not.toHaveBeenCalled()
    expect(store.memories.search).not.toHaveBeenCalled()
  })
})

describe("api list", () => {
  const list = async (...args: string[]) => {
    const streams = captureStreams()
    await createProgram({ env: fixture().env, streams }).parseAsync(["api", "list", ...args, "--json"], {
      from: "user",
    })
    return commandResult(streams.stdout.join(""))
  }
  it("keeps one service's methods with service:, and refuses --service", async () => {
    const all = await list()
    const docs = await list("service:docs")
    expect(docs.items.length).toBeGreaterThan(0)
    expect(docs.items.length).toBeLessThan(all.items.length)
    expect(docs.items.every((method: { name: string }) => method.name.startsWith("docs."))).toBe(true)
    await expect(list("--service", "docs")).rejects.toMatchObject({ code: "validation_error" })
    await expect(list("service:sheets")).rejects.toMatchObject({ code: "validation_error" })
  })
})

describe("MCP list tools", () => {
  it("take the query as one string, as the CLI list takes it after its arguments", () => {
    const f = fixture()
    const tools = mcpTools(createProgram, { env: f.env, streams: captureStreams() }, "default")
    for (const name of ["drive_facts_list", "drive_memories_list", "drive_memories_search", "drive_catalog_list"]) {
      const properties = tools.find((one) => one.name === name)?.schema.properties as
        | Record<string, { type: string }>
        | undefined
      expect(properties?.query?.type, name).toBe("string")
    }
    const facts = tools.find((tool) => tool.name === "drive_facts_list")
    if (!facts) throw new Error("missing facts list tool")
    expect(toolArgv(facts, { document: "doc-a", query: "kind:decision status:proposed" })).toEqual([
      "facts",
      "list",
      "--",
      "doc-a",
      "kind:decision status:proposed",
    ])
  })
})
