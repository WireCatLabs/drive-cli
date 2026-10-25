import { captureStreams } from "@wirecat/cli-base"
import { expect, it, vi } from "vitest"
import { configuredMirrors, configuredSessions, readConfig, selectedFolders, writeConfig } from "./config.js"
import { createProgram } from "./program.js"
import { commandResult, fixture } from "./testing.js"

it("selects configured folders, mirrors and profiles without changing their saved state", () => {
  const f = fixture(["root", "other"])
  const config = readConfig(f.env)
  const profile = config.profiles.default
  if (!profile) throw new Error("missing synthetic profile")
  profile.mirrors = [
    { id: "one", path: "/example/one", folder: "root" },
    { id: "two", path: "/example/two", folder: "other" },
  ]
  config.profiles.second = { principal: "synthetic-other", roots: [], storage: "file" }
  writeConfig(f.env, config)
  expect(selectedFolders(f.env, "default", { id: "other" })).toEqual([{ id: "other" }])
  expect(configuredMirrors(f.env, "default", { folder: "root" })).toEqual([profile.mirrors[0]])
  expect(configuredSessions(f.env, { storage: "file" }, new Set())).toEqual([
    { profile: "second", selected_folders: 0, storage: "file" },
  ])
  expect(readConfig(f.env)).toEqual(config)
})
it("sends canonical file selectors before pagination and preserves their query in the continuation", async () => {
  const f = fixture()
  const call = vi.fn(async () => ({
    files: [{ id: "one", name: "Example's plan", modifiedTime: "2026-01-01T00:00:00Z" }],
    nextPageToken: "next",
  }))
  const streams = captureStreams()
  await createProgram({ env: f.env, streams, api: { call } }).parseAsync(
    ["default", "files", "list", 'name:"Example\'s plan"', "--limit", "1", "--json"],
    { from: "user" },
  )
  expect(call).toHaveBeenCalledWith(
    "drive.files.list",
    expect.objectContaining({ q: "name = 'Example\\'s plan' and trashed = false", pageSize: 1 }),
    undefined,
  )
  const found = commandResult(streams.stdout.join(""))
  expect(found.items[0]).toMatchObject({ id: "one", modified_time: "2026-01-01T00:00:00Z" })
  expect(found.next[0].args.query).toBe('name:"Example\'s plan"')
})
it.each([
  ["files", "list", "id:one"],
  ["files", "list", "name:a OR name:b"],
  ["comments", "list", "doc-a", "id:one"],
  ["permissions", "list", "doc-a", "id:one"],
  ["revisions", "list", "doc-a", "id:one"],
])("refuses unsupported %j before remote I/O", async (...args) => {
  const f = fixture()
  const call = vi.fn(async () => ({}))
  await expect(
    createProgram({ env: f.env, streams: captureStreams(), api: { call } }).parseAsync(["default", ...args], {
      from: "user",
    }),
  ).rejects.toThrow()
  expect(call).not.toHaveBeenCalled()
})
