import { existsSync, mkdirSync, mkdtempSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { captureStreams, memoryKeyring } from "@wirecat/cli-base"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { paths, readConfig, writeConfig } from "./config.js"
import { lockProfile } from "./profile-lock.js"
import { profileDir } from "./state.js"
import { commandResult, fixture, testProgram } from "./testing.js"
import { credentials, saveSession } from "./tokens.js"

const setup = () => {
  const t = fixture()
  const keyring = memoryKeyring()
  const mirrorFolder = mkdtempSync(join(tmpdir(), "drive-owner-mirror-"))
  const mirrored = join(mirrorFolder, "budget.csv")
  writeFileSync(mirrored, "owner data\n")
  writeConfig(t.env, {
    profiles: {
      default: {
        principal: "synthetic-principal",
        roots: ["root"],
        storage: "keyring",
        mirrors: [{ id: "budget", path: mirrored, folder: "folder-a" }],
      },
      other: { principal: "other-principal", roots: ["root"], storage: "keyring" },
    },
  })
  for (const name of ["default", "other"]) {
    saveSession(
      t.env,
      name,
      {
        principal: `${name}-principal`,
        clientId: "synthetic-client",
        tokens: { refresh_token: `refresh-of-${name}`, access_token: "a", expiry_date: 1 },
      },
      "keyring",
      keyring,
    )
    mkdirSync(join(profileDir(t.env, name), "documents"), { recursive: true })
    writeFileSync(join(profileDir(t.env, name), "documents", "a.json"), "{}")
    mkdirSync(join(paths(t.env).cache, "exports", name), { recursive: true })
    writeFileSync(join(paths(t.env).cache, "exports", name, "out.csv"), "x")
  }
  const remove = async (...args: string[]) => {
    const streams = captureStreams()
    let error: unknown
    try {
      await testProgram({ env: t.env, streams, keyring }).parseAsync(
        ["default", "account", "remove", "--json", "--yes", ...args],
        { from: "user" },
      )
    } catch (caught) {
      error = caught
    }
    return { error, item: streams.stdout.length ? commandResult(streams.stdout.join("")) : undefined }
  }
  const signedIn = (name: string) => credentials(t.env, "keyring", keyring).read(name)?.secret !== undefined
  return { ...t, keyring, mirrored, remove, signedIn }
}

describe("drive account remove", () => {
  const revoked = vi.fn(async (_url: unknown, _init?: unknown) => new Response("{}"))
  beforeEach(() => vi.stubGlobal("fetch", revoked))
  afterEach(() => {
    vi.unstubAllGlobals()
    revoked.mockClear()
  })

  it("refuses to choose what happens to the data", async () => {
    const t = setup()
    expect((await t.remove()).error).toMatchObject({ details: { reason: "account-remove.no-choice" } })
    expect(t.signedIn("default")).toBe(true)
  })

  it("keeps the documents with --keep-data, forgets the profile and leaves the other one and the mirror alone", async () => {
    const t = setup()
    const { item, error } = await t.remove("--keep-data")

    expect(error).toBeUndefined()
    expect(item.account).toEqual({ provider: "google-drive", account: "synthetic-principal" })
    expect(item.revoked).toBe(true)
    expect(revoked.mock.calls.map(([url]) => String(url))).toEqual(["https://oauth2.googleapis.com/revoke"])
    expect(String(revoked.mock.calls[0]?.[1] && (revoked.mock.calls[0][1] as RequestInit).body)).toContain(
      "refresh-of-default",
    )
    expect(t.signedIn("default")).toBe(false)
    expect(readConfig(t.env).profiles.default).toBeUndefined()
    expect(existsSync(join(profileDir(t.env, "default"), "documents", "a.json"))).toBe(true)
    expect(t.signedIn("other")).toBe(true)
    expect(readConfig(t.env).profiles.other).toBeDefined()
    expect(existsSync(join(profileDir(t.env, "other"), "documents", "a.json"))).toBe(true)
    expect(existsSync(t.mirrored)).toBe(true)
  })

  it("deletes the snapshots and exports with --delete-data, but never a mirror folder", async () => {
    const t = setup()
    await t.remove("--delete-data")

    expect(existsSync(profileDir(t.env, "default"))).toBe(false)
    expect(existsSync(join(paths(t.env).cache, "exports", "default"))).toBe(false)
    expect(existsSync(join(paths(t.env).cache, "exports", "other", "out.csv"))).toBe(true)
    expect(existsSync(t.mirrored)).toBe(true)
  })

  it("previews with --dry-run and changes nothing", async () => {
    const t = setup()
    const { item } = await t.remove("--delete-data", "--dry-run")

    expect(item).toMatchObject({ dry_run: true, action_invoked: false })
    expect(t.signedIn("default")).toBe(true)
    expect(revoked).not.toHaveBeenCalled()
    expect(readConfig(t.env).profiles.default).toBeDefined()
  })

  it("succeeds for a profile that is already signed out", async () => {
    const t = setup()
    credentials(t.env, "keyring", t.keyring).remove("default")

    expect((await t.remove("--keep-data")).error).toBeUndefined()
    expect(readConfig(t.env).profiles.default).toBeUndefined()
  })

  it("refuses while a sync holds the profile and removes nothing", async () => {
    const t = setup()
    const { release } = await lockProfile(t.env, "default")
    try {
      expect((await t.remove("--delete-data")).error).toMatchObject({ details: { reason: "account-remove.busy" } })
    } finally {
      await release()
    }
    expect(t.signedIn("default")).toBe(true)
    expect(existsSync(profileDir(t.env, "default"))).toBe(true)
  })
})
