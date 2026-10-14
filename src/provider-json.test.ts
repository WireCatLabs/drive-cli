import { captureStreams } from "@wirecat/cli-base"
import { describe, expect, it, vi } from "vitest"
import { FOLDER } from "./model.js"
import { createProgram } from "./program.js"
import { commandsDocument } from "./registry.js"
import { saveState } from "./state.js"
import { file, fixture } from "./testing.js"

describe("provider result fields", () => {
  it("selects catalog names for items and lists, retaining envelope metadata", async () => {
    const f = fixture()
    const discovery = commandsDocument(createProgram({ env: f.env, streams: captureStreams() }), ["catalog", "list"])
    expect(discovery.commands[0]?.output).toEqual({ entity: "document", view: "drive_catalog" })
    saveState(f.env, "default", {
      version: 1,
      principal: "synthetic-principal",
      scope: "",
      folders: { root: file("root", [], FOLDER) },
      documents: {},
      skipped: [{ id: "file", reason: "fixture", file: { ...file("file"), name: "Synthetic source" } }],
    })
    const call = async (...words: string[]) => {
      const streams = captureStreams()
      await createProgram({ env: f.env, streams }).parseAsync(["default", "--offline", ...words], { from: "user" })
      return streams.stdout.map((line) => JSON.parse(line))
    }
    await call("catalog", "import")
    expect((await call("catalog", "show", "file", "--json=id,name"))[0]).toMatchObject({
      item: { id: "file", name: "Synthetic source" },
      meta: { complete: true },
    })
    const selected = (await call("catalog", "list", "kind:file", "--json", "id,name"))[0]
    expect(selected.items).toEqual([{ id: "file", name: "Synthetic source" }])
    expect(selected.page.mode).toBe("page")
    const lines = await call("catalog", "list", "kind:file", "--json=id,name", "--jsonl")
    expect(lines[0]).toEqual({ type: "item", data: { id: "file", name: "Synthetic source" } })
    expect(lines[1]).toMatchObject({ type: "end", complete: true })
    await expect(call("catalog", "list", "--json=title")).rejects.toThrow("no field title here")
    await expect(call("catalog", "show", "file", "--json=unknown")).rejects.toThrow("no field unknown here")
  })

  it("validates undeclared read responses and refuses undeclared write selection before execution", async () => {
    const f = fixture()
    const request = vi.fn(async () => ({ id: "synthetic-file", name: "Synthetic source" }))
    const call = async (...words: string[]) => {
      const streams = captureStreams()
      await createProgram({ env: f.env, streams, api: { call: request } }).parseAsync(["default", ...words], {
        from: "user",
      })
      return JSON.parse(streams.stdout.join(""))
    }
    expect((await call("files", "get", "file", "--json=id,name")).item).toEqual({
      id: "synthetic-file",
      name: "Synthetic source",
    })
    await expect(call("files", "get", "file", "--json=unknown")).rejects.toThrow("no field unknown here")
    request.mockClear()
    await expect(call("files", "copy", "file", "--json=id")).rejects.toThrow("write has no declared result fields")
    expect(request).not.toHaveBeenCalled()
  })
})
