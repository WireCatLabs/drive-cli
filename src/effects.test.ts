import { captureStreams } from "@wirecat/cli-base"
import { flatten } from "@wirecat/cli-base/commands"
import { describe, expect, it, vi } from "vitest"
import { createProgram } from "./program.js"
import { commandsDocument } from "./registry.js"
import { fixture } from "./testing.js"

describe("command data effects", () => {
  it("distinguishes provider reads, cached reads, discovery and writes", () => {
    const f = fixture()
    const document = commandsDocument(createProgram({ env: f.env, streams: captureStreams() }))
    const commands = flatten(document.commands)
    const effects = (path: string) => commands.find((command) => command.path.join(" ") === path)?.effects
    for (const path of [
      "sheets info",
      "sheets show",
      "api sheets-spreadsheets-get-by-data-filter",
      "files get",
      "files list",
      "documents get",
      "documents history",
      "comments get",
      "permissions get",
      "revisions get",
      "api drive-files-get",
    ]) {
      expect(effects(path), path).toEqual({ remote: "read", local: "none" })
    }
    for (const path of ["commands", "complete", "api list", "api show"]) {
      expect(effects(path), path).toEqual({ remote: "none", local: "none" })
    }
    expect(effects("documents show")).toEqual({ remote: "none", local: "read" })
    expect(effects("catalog list")).toEqual({ remote: "none", local: "read" })
    expect(effects("catalog import")).toEqual({ remote: "none", local: "write" })
    expect(effects("files copy")).toEqual({ remote: "write", local: "none" })
    expect(effects("sync")).toEqual({ remote: "read", local: "write" })
    expect(effects("session start")).toEqual({ remote: "write", local: "write" })
    expect(commands.filter((command) => !command.effects).map((command) => command.path.join(" "))).toEqual([])
  })

  it("runs provider-only reads without opening the content store and still refuses them offline", async () => {
    const f = fixture()
    const call = vi.fn(async () => ({ id: "synthetic-file" }))
    const index = vi.fn(async () => f.index)
    const options = { env: f.env, api: { call }, index, streams: captureStreams() }
    await createProgram(options).parseAsync(["default", "files", "get", "synthetic-file"], { from: "user" })
    expect(call).toHaveBeenCalledOnce()
    expect(index).not.toHaveBeenCalled()
    call.mockClear()
    await expect(
      createProgram(options).parseAsync(["default", "--offline", "files", "get", "synthetic-file"], { from: "user" }),
    ).rejects.toMatchObject({ code: "permission_error", details: { reason: "offline.refused" } })
    expect(call).not.toHaveBeenCalled()
    expect(index).not.toHaveBeenCalled()
  })
})
