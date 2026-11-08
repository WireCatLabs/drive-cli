import { createHash } from "node:crypto"
import { CliError, captureStreams } from "@wirecat/cli-base"
import { openStore } from "@wirecat/cli-core/store"
import { describe, expect, it, vi } from "vitest"
import { writeConfig } from "./config.js"
import type { GoogleSource } from "./model.js"
import { openIndex } from "./store.js"
import { commandResult, content, testProgram as createProgram, file, fixture } from "./testing.js"

const URL = "https://docs.google.com/document/d/SyntheticDoc_1/edit"
const TEXT = "Synthetic harbour budget: 120 for hosting"

const setup = (names = ["personal", "team", "work"]) => {
  const f = fixture()
  writeConfig(f.env, {
    profiles: Object.fromEntries(
      names.map((name) => [name, { principal: `principal-${name}`, roots: [], storage: "keyring" as const }]),
    ),
  })
  const refused = (code: "not_found" | "permission_error" | "authentication_error" | "provider_unavailable") =>
    vi.fn(async () => {
      throw new CliError(code, "synthetic refusal")
    })
  const opened = vi.fn(async (id: string) => ({
    ...content(file(id), TEXT),
    metadata: { ...file(id), name: "Budget" },
  }))
  const sources: Record<string, Partial<GoogleSource>> = Object.fromEntries(
    names.map((name) => [name, { content: refused("not_found") }]),
  )
  const source = vi.fn(async (profile: string) => sources[profile] as GoogleSource)
  const run = async (args: string[], env: NodeJS.ProcessEnv = f.env) => {
    const streams = captureStreams()
    await createProgram({ env, streams, source }).parseAsync([...args, "--json"], { from: "user" })
    return commandResult(streams.stdout.join(""))
  }
  return { ...f, sources, source, refused, opened, run }
}

describe("documents add", () => {
  it("reads with the first named profile that opens the document and names it", async () => {
    const t = setup()
    t.sources.team = { content: t.opened }
    const added = await t.run(["documents", "add", URL, "--profiles", "work,team,personal"])
    expect(added).toMatchObject({
      created: true,
      duplicate_of: null,
      title: "Budget",
      url: URL,
      file_id: "SyntheticDoc_1",
      chars: TEXT.length,
      kept: "text",
      profile: "team",
      tried: [{ profile: "work", code: "not_found" }],
    })
    expect(added.ref).toMatch(/^document:\d+$/)
    expect(t.source.mock.calls.map(([profile]) => profile)).toEqual(["work", "team"])
    const again = await t.run(["documents", "add", URL, "--profiles", "team"])
    expect(again).toMatchObject({ ref: added.ref, created: false, profile: "team", tried: [] })
  })

  it("keeps the owner's title and subjects", async () => {
    const t = setup()
    const store = await openStore({ path: t.env.MESSAGING_STORE as string, env: t.env, command: "drive" })
    const key = { provider: "synthetic-messenger", account: "synthetic-account" }
    const person = await (async () => {
      await store.accounts.saveAccount(key, { name: "Synthetic" })
      await store.people.savePeople(key, [{ id: "synthetic-person", name: "Person Sample" }])
      return store.people.personOf({ provider: key.provider, id: "synthetic-person" })
    })().finally(() => store.close())
    t.sources.work = { content: t.opened }
    const subject = `person:${person?.uid}`
    const added = await t.run(["work", "documents", "add", URL, "--title", "Harbour budget", "--subject", subject])
    expect(added).toMatchObject({ title: "Harbour budget", subjects: [subject] })
  })

  it("reads with the profile word alone when no --profiles is given", async () => {
    const t = setup()
    t.sources.work = { content: t.opened }
    expect(await t.run(["work", "documents", "add", URL])).toMatchObject({ profile: "work", tried: [] })
  })

  it("keeps Google's address for a bare document id", async () => {
    const t = setup()
    t.sources.work = { content: t.opened }
    expect(await t.run(["work", "documents", "add", "SyntheticDoc_1"])).toMatchObject({ url: URL })
  })

  it("tries every profile, sorted, for --profiles all and passes on signed-out and denied ones", async () => {
    const t = setup()
    t.sources.personal = { content: t.refused("authentication_error") }
    t.sources.team = { content: t.refused("permission_error") }
    t.sources.work = { content: t.opened }
    const added = await t.run(["documents", "add", URL, "--profiles", "all"])
    expect(added.tried.map((one: { code: string }) => one.code)).toEqual(["authentication_error", "permission_error"])
    expect(added.profile).toBe("work")
  })

  it("lists every profile with what refused it when none opens the document", async () => {
    const t = setup()
    await expect(t.run(["documents", "add", URL, "--profiles", "work,personal"])).rejects.toMatchObject({
      code: "not_found",
      details: {
        reason: "document.not-opened",
        profiles: ["work", "personal"],
        tried: [
          { profile: "work", code: "not_found" },
          { profile: "personal", code: "not_found" },
        ],
      },
    })
  })

  it("stops at a failure that is not about access instead of trying the next profile", async () => {
    const t = setup()
    t.sources.work = { content: t.refused("provider_unavailable") }
    t.sources.team = { content: t.opened }
    await expect(t.run(["documents", "add", URL, "--profiles", "work,team"])).rejects.toMatchObject({
      code: "provider_unavailable",
    })
    expect(t.opened).not.toHaveBeenCalled()
  })

  it("refuses to pick a profile and lists the choices", async () => {
    const t = setup()
    await expect(t.run(["documents", "add", URL])).rejects.toMatchObject({
      code: "validation_error",
      details: { reason: "profile.required", profiles: ["personal", "team", "work"] },
    })
    expect(t.source).not.toHaveBeenCalled()
  })

  it("refuses more than five profiles and an unknown one before reading any", async () => {
    const t = setup(["a", "b", "c", "d", "e", "f"])
    await expect(t.run(["documents", "add", URL, "--profiles", "all"])).rejects.toMatchObject({
      details: { reason: "profile.too-many", profiles: ["a", "b", "c", "d", "e", "f"], max_add_profiles: 5 },
    })
    await expect(t.run(["documents", "add", URL, "--profiles", "a,nobody"])).rejects.toMatchObject({
      details: { reason: "profile.unknown" },
    })
    expect(t.source).not.toHaveBeenCalled()
  })

  it("tries as many profiles as max_add_profiles allows, and no more", async () => {
    const t = setup(["a", "b", "c", "d", "e", "f"])
    t.sources.f = { content: t.opened }
    await t.run(["a", "config", "set", "max_add_profiles", "6", "--defaults"])
    expect(await t.run(["documents", "add", URL, "--profiles", "all"])).toMatchObject({ profile: "f" })
    await t.run(["a", "config", "set", "max_add_profiles", "2", "--defaults"])
    await expect(t.run(["documents", "add", URL, "--profiles", "a,b,f"])).rejects.toMatchObject({
      details: { reason: "profile.too-many", max_add_profiles: 2 },
    })
    expect(t.opened).toHaveBeenCalledTimes(1)
    await expect(t.run(["a", "config", "set", "max_add_profiles", "2"])).rejects.toMatchObject({
      message: expect.stringContaining("--defaults"),
    })
  })

  it("reaches no profile but the locked one", async () => {
    const t = setup()
    const env = { ...t.env, DRIVE_PROFILE_LOCK: "work" }
    await expect(t.run(["documents", "add", URL, "--profiles", "work,team"], env)).rejects.toMatchObject({
      details: { reason: "profile.locked" },
    })
    t.sources.work = { content: t.opened }
    expect(await t.run(["documents", "add", URL], env)).toMatchObject({ profile: "work" })
  })

  it("refuses --read-only, --offline and a profile whose policy denies it before reading", async () => {
    const t = setup()
    t.sources.work = { content: t.opened }
    await expect(t.run(["--read-only", "documents", "add", URL, "--profiles", "work"])).rejects.toMatchObject({
      code: "permission_error",
    })
    await expect(t.run(["--offline", "documents", "add", URL, "--profiles", "work"])).rejects.toMatchObject({
      details: { reason: "offline.refused" },
    })
    await t.run(["team", "config", "set", "permissions.documents.add", '"deny"'])
    await expect(t.run(["documents", "add", URL, "--profiles", "work,team"])).rejects.toMatchObject({
      details: { reason: "policy.denied", permission: "documents.add" },
    })
    expect(t.opened).not.toHaveBeenCalled()
  })

  it("answers an already synced Drive document as duplicate_of and keeps no second copy", async () => {
    const t = setup()
    const synced = content(file("SyntheticDoc_1"), TEXT)
    const index = await openIndex(t.env)
    const reference = await index
      .save("principal-work", synced, createHash("sha256").update(TEXT).digest("hex"))
      .finally(() => index.close())
    t.sources.work = { content: t.opened }
    expect(await t.run(["documents", "add", URL, "--profiles", "work"])).toMatchObject({
      ref: reference,
      created: false,
      duplicate_of: reference,
      kept: null,
    })
  })
})
