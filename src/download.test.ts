import { existsSync, readFileSync, statSync, symlinkSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { captureStreams } from "@wirecat/cli-base"
import { describe, expect, it, vi } from "vitest"
import { writeConfig } from "./config.js"
import { EXPORT_FORMATS } from "./download.js"

import { commandResult, testProgram as createProgram, fixture } from "./testing.js"

const setup = () => {
  const f = fixture([])
  const download = vi.fn(async (_id: string, _mime?: string) => Uint8Array.of(0, 255, 10, 128))
  const path = join(f.directory, "output.bin")
  const run = async (...args: string[]) => {
    const streams = captureStreams()
    await createProgram({ env: f.env, streams, download }).parseAsync(["default", ...args, "--json"], { from: "user" })
    return commandResult(streams.stdout.join(""))
  }
  return { ...f, download, path, run }
}

describe("friendly file downloads", () => {
  it("writes binary bytes, reports only the id and size, and refuses overwrite before fetching", async () => {
    const t = setup()
    expect(await t.run("files", "download", "synthetic-file", "--output", t.path)).toMatchObject({
      id: "synthetic-file",
      bytes: 4,
    })
    expect(readFileSync(t.path)).toEqual(Buffer.from([0, 255, 10, 128]))
    if (process.platform !== "win32") expect(statSync(t.path).mode & 0o777).toBe(0o600)
    await expect(t.run("files", "download", "synthetic-file", "--output", t.path)).rejects.toMatchObject({
      details: { reason: "download.exists" },
    })
    expect(t.download).toHaveBeenCalledTimes(1)
    await t.run("files", "download", "synthetic-file", "--output", t.path, "--overwrite")
    expect(t.download).toHaveBeenCalledTimes(2)
  })
  it.each(Object.entries(EXPORT_FORMATS))("exports %s through the Google media seam", async (format, mime) => {
    const t = setup()
    const result = await t.run("files", "export", "synthetic-doc", "--format", format, "--output", t.path)
    expect(result).toMatchObject({ id: "synthetic-doc", format, bytes: 4 })
    expect(result).not.toHaveProperty("path")
    await t.run("files", "export", "synthetic-doc", "--format", format, "--output", t.path, "--overwrite")
    expect(t.download).toHaveBeenCalledWith("synthetic-doc", mime)
    expect(readFileSync(t.path)).toEqual(Buffer.from([0, 255, 10, 128]))
  })
  it("refuses invalid formats, missing output, offline, readonly and denied permissions before fetching", async () => {
    const t = setup()
    for (const args of [
      ["files", "export", "synthetic-doc", "--format", "invalid", "--output", t.path],
      ["files", "download", "synthetic-file"],
      ["--offline", "files", "download", "synthetic-file", "--output", t.path],
      ["--read-only", "files", "download", "synthetic-file", "--output", t.path],
      ["--permission", "files.download=deny", "files", "download", "synthetic-file", "--output", t.path],
      ["--permission", "files.export=deny", "files", "export", "synthetic-doc", "--format", "pdf", "--output", t.path],
    ])
      await expect(t.run(...args)).rejects.toBeInstanceOf(Error)
    expect(t.download).not.toHaveBeenCalled()
    expect(existsSync(t.path)).toBe(false)
    writeConfig(t.env, {
      profiles: {
        default: {
          principal: "synthetic-principal",
          roots: [],
          storage: "keyring",
          permissions: { "api.drive.files.get": "deny" },
        },
      },
    })
    await expect(t.run("files", "download", "synthetic-file", "--output", t.path)).rejects.toMatchObject({
      code: "permission_error",
    })
    expect(t.download).not.toHaveBeenCalled()
  })
  it("previews without creating files or fetching and preserves an existing output on provider failure", async () => {
    const t = setup()
    expect(await t.run("--dry-run", "files", "download", "synthetic-file", "--output", t.path)).toMatchObject({
      dry_run: true,
    })
    expect(t.download).not.toHaveBeenCalled()
    expect(existsSync(t.path)).toBe(false)
    writeFileSync(t.path, "kept")
    t.download.mockRejectedValueOnce(new Error("synthetic provider failure"))
    await expect(t.run("files", "download", "synthetic-file", "--output", t.path, "--overwrite")).rejects.toThrow(
      "synthetic provider failure",
    )
    expect(readFileSync(t.path, "utf8")).toBe("kept")
  })
  it("refuses an existing symlink and replaces it only with explicit overwrite", async () => {
    const t = setup()
    const target = join(t.directory, "target")
    writeFileSync(target, "kept")
    symlinkSync(target, t.path)
    await expect(t.run("files", "download", "synthetic-file", "--output", t.path)).rejects.toMatchObject({
      details: { reason: "download.exists" },
    })
    await t.run("files", "download", "synthetic-file", "--output", t.path, "--overwrite")
    expect(readFileSync(target, "utf8")).toBe("kept")
    expect(readFileSync(t.path)).toHaveLength(4)
  })
})
