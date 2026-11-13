import { captureStreams, memoryKeyring } from "@wirecat/cli-base"
import { describe, expect, it, vi } from "vitest"
import { FOLDER } from "./model.js"
import { run } from "./program.js"
import { commandResult, fixture } from "./testing.js"

type Params = Record<string, unknown>
type Answer = (params: Params) => unknown

const fakeApi = (answers: Record<string, Answer>) => {
  const call = vi.fn(async (method: string, params: Params = {}) => {
    const answer = answers[method]
    if (!answer) throw new Error(`unexpected ${method}`)
    return answer(params)
  })
  return { call }
}

const browse = async (args: string[], api: ReturnType<typeof fakeApi>, roots = ["folder-added"]) => {
  const streams = captureStreams()
  const code = await run(["default", "folders", "browse", ...args, "--json"], {
    env: fixture(roots).env,
    streams,
    tty: false,
    api,
  })
  return { code, streams }
}

/** Answers a child-count query with one folder inside each parent the query names. */
const oneChildEach = (params: Params) => ({
  files: [...String(params.q).matchAll(/'([\w-]+)' in parents/g)].map(([, id]) => ({ parents: [id] })),
})

describe("folders browse", () => {
  it("lists My Drive, Shared with me and every shared drive at the top level", async () => {
    const api = fakeApi({
      "drive.files.get": () => ({ id: "my-drive-id" }),
      "drive.drives.list": (params) =>
        params.pageToken
          ? { drives: [{ id: "drive-a", name: "Alpha team" }] }
          : { drives: [{ id: "drive-z", name: "Zeta team" }], nextPageToken: "page-2" },
      "drive.files.list": oneChildEach,
    })
    const { code, streams } = await browse([], api, ["drive-z"])
    expect(code).toBe(0)
    expect(commandResult(streams.stdout.join("")).items).toEqual([
      {
        id: "my-drive-id",
        name: "My Drive",
        kind: "my_drive",
        parent: null,
        location: "my_drive",
        drive_id: null,
        child_folders: 1,
        added: false,
      },
      {
        id: "shared-with-me",
        name: "Shared with me",
        kind: "shared_with_me",
        parent: null,
        location: "shared_with_me",
        drive_id: null,
        child_folders: null,
        added: false,
      },
      {
        id: "drive-a",
        name: "Alpha team",
        kind: "shared_drive",
        parent: null,
        location: "shared_drive",
        drive_id: "drive-a",
        child_folders: 1,
        added: false,
      },
      {
        id: "drive-z",
        name: "Zeta team",
        kind: "shared_drive",
        parent: null,
        location: "shared_drive",
        drive_id: "drive-z",
        child_folders: 1,
        added: true,
      },
    ])
  })

  it("marks My Drive added when sync imports it as root", async () => {
    const api = fakeApi({
      "drive.files.get": () => ({ id: "my-drive-id" }),
      "drive.drives.list": () => ({ drives: [] }),
      "drive.files.list": () => ({ files: [] }),
    })
    const { streams } = await browse([], api, ["root"])
    const [myDrive] = commandResult(streams.stdout.join("")).items
    expect(myDrive).toMatchObject({ id: "my-drive-id", added: true, child_folders: 0 })
  })

  it("lists one level inside a folder across pages, by name, folders only", async () => {
    const listing = (params: Params) => {
      if (String(params.q).startsWith(`mimeType = '${FOLDER}'`)) return oneChildEach(params)
      return params.pageToken
        ? { files: [{ id: "folder-added", name: "budget", ownedByMe: true }] }
        : {
            files: [
              { id: "folder-shared", name: "Contracts", ownedByMe: false },
              { id: "folder-team", name: "archive", driveId: "drive-a" },
            ],
            nextPageToken: "page-2",
          }
    }
    const api = fakeApi({ "drive.files.list": listing })
    const { code, streams } = await browse(["--parent", "https://drive.google.com/drive/folders/parent-id"], api)
    expect(code).toBe(0)
    const { items } = commandResult(streams.stdout.join(""))
    expect(items.map((item: { name: string }) => item.name)).toEqual(["archive", "budget", "Contracts"])
    expect(items).toEqual([
      expect.objectContaining({ id: "folder-team", location: "shared_drive", drive_id: "drive-a" }),
      expect.objectContaining({ id: "folder-added", location: "my_drive", added: true }),
      expect.objectContaining({ id: "folder-shared", location: "shared_with_me", added: false }),
    ])
    for (const item of items) expect(item).toMatchObject({ kind: "folder", parent: "parent-id", child_folders: 1 })
    const [first] = api.call.mock.calls
    expect(first?.[1]).toMatchObject({
      q: `'parent-id' in parents and mimeType = '${FOLDER}' and trashed = false`,
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    })
    expect(api.call.mock.calls.every(([method]) => method.startsWith("drive.files.list"))).toBe(true)
  })

  it("lists the folders others shared under shared-with-me", async () => {
    const api = fakeApi({
      "drive.files.list": (params) =>
        String(params.q).startsWith("sharedWithMe")
          ? { files: [{ id: "folder-shared", name: "From a colleague", ownedByMe: false }] }
          : { files: [] },
    })
    const { streams } = await browse(["--parent", "shared-with-me"], api)
    expect(commandResult(streams.stdout.join("")).items).toEqual([
      {
        id: "folder-shared",
        name: "From a colleague",
        kind: "folder",
        parent: "shared-with-me",
        location: "shared_with_me",
        drive_id: null,
        child_folders: 0,
        added: false,
      },
    ])
  })

  it("leaves counts out when Google searched only part of the drives", async () => {
    const api = fakeApi({
      "drive.files.list": (params) =>
        String(params.q).includes("' in parents and")
          ? { files: [{ id: "folder-a", name: "A", ownedByMe: true }], incompleteSearch: true }
          : { files: [], incompleteSearch: true },
    })
    const { streams } = await browse(["--parent", "parent-id"], api)
    const answer = commandResult(streams.stdout.join(""))
    expect(answer.items[0].child_folders).toBeNull()
    expect(answer.missing).toEqual([expect.objectContaining({ field: "items" })])
  })

  it("refuses a parent that is not a Google id", async () => {
    const { code, streams } = await browse(["--parent", "a' or 'x"], fakeApi({}))
    expect(code).not.toBe(0)
    expect(JSON.parse(streams.stderr.join("").trim().split("\n")[0] ?? "").error.code).toBe("validation_error")
  })

  it.each([
    [
      { response: { status: 429, data: { error: { errors: [{ reason: "rateLimitExceeded" }] } } } },
      "provider.rate-limited",
    ],
    [{ response: { status: 401, data: { error: { message: "DO_NOT_LOG" } } } }, "oauth.expired"],
  ])("reports Google's refusal with a stable reason", async (refusal, reason) => {
    const api = { call: vi.fn(async () => Promise.reject(refusal)) }
    const { code, streams } = await browse(["--parent", "parent-id"], api)
    expect(code).not.toBe(0)
    const error = JSON.parse(streams.stderr.join("").trim().split("\n")[0] ?? "").error
    expect(error.reason).toBe(reason)
    expect(JSON.stringify(streams.stderr)).not.toContain("DO_NOT_LOG")
  })

  it("says the profile is not signed in when it has no saved sign-in", async () => {
    const streams = captureStreams()
    const code = await run(["default", "folders", "browse", "--json"], {
      env: fixture().env,
      streams,
      tty: false,
      keyring: memoryKeyring(),
    })
    expect(code).not.toBe(0)
    expect(JSON.parse(streams.stderr.join("").trim().split("\n")[0] ?? "").error.reason).toBe("session.missing")
  })
})
