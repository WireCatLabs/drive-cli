import { createHash } from "node:crypto"
import { mkdtempSync, readdirSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { captureStreams } from "@wirecat/cli-base"
import { afterAll, describe, expect, it, vi } from "vitest"
import { writeConfig } from "./config.js"
import { createProgram } from "./program.js"
import { fixture } from "./testing.js"
import { type UploadRequest, type UploadResponse, uploadFile } from "./upload.js"

const QUANTUM = 256 * 1024
const reply = (status: number, headers: Record<string, string> = {}, data: unknown = ""): UploadResponse => ({
  status,
  header: (name) => headers[name.toLowerCase()],
  data,
})

/** A Drive that keeps what arrives and answers as the resumable-upload guide describes. */
const fakeDrive = (options: { failAfterPuts?: number; md5?: string } = {}) => {
  let failAfterPuts = options.failAfterPuts
  let held = Buffer.alloc(0)
  let puts = 0
  let sessions = 0
  let total = 0
  const request: UploadRequest = async ({ method, headers, body }) => {
    if (method === "POST") {
      sessions++
      total = Number(headers["X-Upload-Content-Length"])
      held = Buffer.alloc(0)
      return reply(200, { location: `https://upload.example/session-${sessions}` })
    }
    const range = headers["Content-Range"] ?? ""
    if (range.startsWith("bytes */")) {
      if (held.length === total)
        return reply(
          200,
          {},
          { id: "file-1", md5Checksum: options.md5 ?? createHash("md5").update(held).digest("hex") },
        )
      return reply(308, held.length ? { range: `bytes=0-${held.length - 1}` } : {})
    }
    puts++
    if (failAfterPuts !== undefined && puts > failAfterPuts) throw new Error("connection dropped")
    const start = Number(/bytes (\d+)-/.exec(range)?.[1])
    held = Buffer.concat([held.subarray(0, start), body as Buffer])
    if (held.length === total)
      return reply(
        201,
        {},
        {
          id: "file-1",
          name: "backup.bin",
          size: String(total),
          md5Checksum: options.md5 ?? createHash("md5").update(held).digest("hex"),
          mimeType: "application/octet-stream",
          parents: ["folder-1"],
        },
      )
    return reply(308, { range: `bytes=0-${held.length - 1}` })
  }
  return {
    request,
    held: () => held,
    sessions: () => sessions,
    heal: () => {
      failAfterPuts = undefined
    },
  }
}

const made: string[] = []
afterAll(() => {
  for (const dir of made) rmSync(dir, { recursive: true, force: true })
})
const fileOf = (bytes: number) => {
  const dir = mkdtempSync(join(tmpdir(), "drive-upload-"))
  made.push(dir)
  const path = join(dir, "backup.bin")
  const content = Buffer.alloc(bytes)
  for (let i = 0; i < bytes; i++) content[i] = i % 251
  writeFileSync(path, content)
  return { dir, path, content }
}

describe("files upload", () => {
  it("sends the file in 256 KiB-multiple chunks and checks the MD5 Google returns", async () => {
    const { dir, path, content } = fileOf(QUANTUM * 2 + 1000)
    const drive = fakeDrive()
    const file = await uploadFile({
      path,
      parent: "folder-1",
      stateDir: dir,
      request: drive.request,
      chunkBytes: QUANTUM,
    })
    expect(drive.held().equals(content)).toBe(true)
    expect(file).toMatchObject({ id: "file-1", size: content.length, parents: ["folder-1"], resumed: false })
    expect(readdirSync(join(dir, "uploads"))).toEqual([])
  })

  it("continues an interrupted upload from the byte Google holds", async () => {
    const { dir, path, content } = fileOf(QUANTUM * 3)
    const drive = fakeDrive({ failAfterPuts: 1 })
    const sleep = async () => {}
    await expect(
      uploadFile({ path, stateDir: dir, request: drive.request, chunkBytes: QUANTUM, retries: 0, sleep }),
    ).rejects.toThrow("continue where it stopped")
    expect(drive.held().length).toBe(QUANTUM)
    drive.heal()
    const file = await uploadFile({ path, stateDir: dir, request: drive.request, chunkBytes: QUANTUM, sleep })
    expect(file.resumed).toBe(true)
    expect(drive.sessions()).toBe(1)
    expect(drive.held().equals(content)).toBe(true)
  })

  it("starts over when Google expired the session", async () => {
    const { dir, path, content } = fileOf(QUANTUM + 10)
    const first = fakeDrive({ failAfterPuts: 0 })
    await expect(
      uploadFile({
        path,
        stateDir: dir,
        request: first.request,
        chunkBytes: QUANTUM,
        retries: 0,
        sleep: async () => {},
      }),
    ).rejects.toThrow()
    const fresh = fakeDrive()
    const file = await uploadFile({
      path,
      stateDir: dir,
      request: async (input) =>
        input.method === "PUT" && String(input.headers["Content-Range"]).startsWith("bytes */")
          ? reply(404)
          : fresh.request(input),
      chunkBytes: QUANTUM,
    })
    expect(fresh.sessions()).toBe(1)
    expect(fresh.held().equals(content)).toBe(true)
    expect(file.resumed).toBe(false)
  })

  it("refuses an upload whose MD5 does not match the local file", async () => {
    const { dir, path } = fileOf(1000)
    const drive = fakeDrive({ md5: "0".repeat(32) })
    await expect(uploadFile({ path, stateDir: dir, request: drive.request })).rejects.toThrow(
      "differs from the local file",
    )
  })

  it("is a write: --dry-run previews and --read-only refuses, both before any request", async () => {
    const { path } = fileOf(10)
    const f = fixture()
    const request = vi.fn(async () => reply(500))
    const run = (...args: string[]) =>
      createProgram({ env: f.env, streams: captureStreams(), uploadRequest: request }).parseAsync(
        ["default", ...args, "files", "upload", path, "--parent", "folder-1", "--name", "renamed.txt", "--json"],
        { from: "user" },
      )
    await run("--dry-run")
    await expect(run("--read-only")).rejects.toThrow("policy refuses")
    expect(request).not.toHaveBeenCalled()
  })

  it("answers to the files.create permission, not only files.upload", async () => {
    const { path } = fileOf(10)
    const f = fixture()
    writeConfig(f.env, {
      profiles: {
        default: {
          principal: "synthetic-principal",
          roots: ["root"],
          storage: "keyring",
          permissions: { "files.create": "deny" },
        },
      },
    })
    const request = vi.fn(async () => reply(500))
    await expect(
      createProgram({ env: f.env, streams: captureStreams(), uploadRequest: request }).parseAsync(
        ["default", "--dry-run", "files", "upload", path, "--json"],
        { from: "user" },
      ),
    ).rejects.toMatchObject({ code: "permission_error", details: { permission: "files.create" } })
    expect(request).not.toHaveBeenCalled()
  })
})
