import { captureStreams } from "@wirecat/cli-base"
import { describe, expect, it, vi } from "vitest"
import { readConfig, writeConfig } from "./config.js"
import { SHEET } from "./model.js"
import { run } from "./program.js"
import { readState } from "./state.js"
import { sync } from "./sync.js"
import { commandResult, content, file, fixture } from "./testing.js"
import { isTranscript, TRANSCRIPT_WORDS, transcriptsDriveQuery } from "./transcripts.js"

const named = (id: string, name: string, parents = ["organizers-folder"], mime?: string) => ({
  ...file(id, parents, mime),
  name,
})
const setTranscripts = (env: NodeJS.ProcessEnv, mode: "include" | "skip" | "exclude", roots?: string[]) => {
  const config = readConfig(env)
  const profile = config.profiles.default
  if (!profile) throw new Error("fixture profile missing")
  profile.transcripts = mode
  if (roots) profile.roots = roots
  writeConfig(env, config)
}

describe("Meet transcripts and Gemini notes", () => {
  it("asks Drive for each phrase's last word and keeps only Google Docs holding a whole phrase", () => {
    expect(transcriptsDriveQuery(["Transcript", "Notes by Gemini", "Заметки Gemini", "O'Brien notes"])).toBe(
      "mimeType = 'application/vnd.google-apps.document' and trashed = false and " +
        "(name contains 'Transcript' or name contains 'Gemini' or name contains 'notes')",
    )
    expect(transcriptsDriveQuery(["it's"])).toContain("name contains 'it\\'s'")
    const matches = isTranscript(TRANSCRIPT_WORDS)
    expect(matches(named("a", "Weekly sync (2026-11-10 10:00 CET) - Transcript"))).toBe(true)
    expect(matches(named("b", "Weekly sync - 2026/11/10 10:00 CET - Notes by Gemini"))).toBe(true)
    expect(matches(named("c", "Планёрка — Заметки Gemini"))).toBe(true)
    expect(matches(named("d", "Gemini pricing notes"))).toBe(false)
    expect(matches(named("e", "Weekly sync - Transcript", [], SHEET))).toBe(false)
  })

  it("imports nothing while the setting is unset, then include imports the ones in other people's Drives", async () => {
    const f = fixture([])
    const shared = named("shared-transcript", "Invented call - Transcript")
    const search = vi.fn(async () => [shared, named("budget", "Budget")])
    const source = { ...f.source, search }
    vi.mocked(f.source.content).mockImplementation(async (id) => content(id === shared.id ? shared : file(id)))
    await sync(source, f.index, f.env, "default", 200)
    expect(search).not.toHaveBeenCalled()
    expect(f.stored.size).toBe(0)
    setTranscripts(f.env, "include")
    expect(await sync(source, f.index, f.env, "default", 200)).toMatchObject({ saved: 1 })
    expect([...f.stored.keys()]).toEqual(["shared-transcript"])
    expect(readState(f.env, "default", "synthetic-principal").matched).toEqual(["shared-transcript"])
    setTranscripts(f.env, "skip")
    expect(await sync(source, f.index, f.env, "default", 200)).toMatchObject({ removed: 1 })
    expect(f.stored.size).toBe(0)
  })

  it("exclude leaves a transcript out even inside a chosen folder", async () => {
    const f = fixture()
    vi.mocked(f.source.children).mockResolvedValue([file("doc-a"), named("doc-t", "Standup - Transcript", ["root"])])
    vi.mocked(f.source.content).mockImplementation(async (id) =>
      content(id === "doc-t" ? named("doc-t", "Standup - Transcript", ["root"]) : file(id)),
    )
    await sync(f.source, f.index, f.env, "default", 200)
    expect([...f.stored.keys()].sort()).toEqual(["doc-a", "doc-t"])
    setTranscripts(f.env, "exclude")
    expect(await sync(f.source, f.index, f.env, "default", 200)).toMatchObject({ removed: 1 })
    expect([...f.stored.keys()]).toEqual(["doc-a"])
  })

  it("refuses an unknown mode and empty words in the profile", () => {
    const f = fixture()
    const config = readConfig(f.env)
    const profile = config.profiles.default
    if (!profile) throw new Error("fixture profile missing")
    const withProfile = (extra: Record<string, unknown>) =>
      writeConfig(f.env, { ...config, profiles: { default: { ...profile, ...extra } as typeof profile } })
    expect(() => withProfile({ transcripts: "always" })).toThrow(/transcripts/)
    expect(() => withProfile({ transcript_words: [] })).toThrow(/transcript_words/)
  })

  it("transcripts list shows what sync would take and whose Drive each is in, without importing", async () => {
    const f = fixture([])
    const theirs = { ...named("theirs", "Invented call - Transcript"), providerMetadata: { ownedByMe: false } }
    const mine = { ...named("mine", "Invented call - Notes by Gemini"), providerMetadata: { ownedByMe: true } }
    const search = vi.fn(async () => [theirs, mine, named("other", "Budget")])
    const list = async (...words: string[]) => {
      const streams = captureStreams()
      const code = await run(["default", "transcripts", "list", ...words, "--json"], {
        env: f.env,
        streams,
        tty: false,
        source: async () => ({ ...f.source, search }),
      })
      return { code, items: commandResult(streams.stdout.join("")).items }
    }
    const all = await list()
    expect(all.code).toBe(0)
    expect(
      all.items.map(({ name, owned_by_me }: { name: string; owned_by_me: boolean }) => [name, owned_by_me]),
    ).toEqual([
      ["Invented call - Transcript", false],
      ["Invented call - Notes by Gemini", true],
    ])
    expect((await list("owned_by_me:false")).items.map(({ id }: { id: string }) => id)).toEqual(["theirs"])
    expect(f.index.save).not.toHaveBeenCalled()
  })

  it("config set takes the mode per profile only", async () => {
    const f = fixture()
    const set = async (...args: string[]) =>
      run(["default", "config", "set", ...args, "--json"], { env: f.env, streams: captureStreams(), tty: false })
    expect(await set("transcripts", '"exclude"')).toBe(0)
    expect(readConfig(f.env).profiles.default?.transcripts).toBe("exclude")
    expect(await set("transcripts", '"sometimes"')).not.toBe(0)
    expect(await set("transcripts", '"include"', "--defaults")).not.toBe(0)
    expect(readConfig(f.env).profiles.default?.transcripts).toBe("exclude")
  })
})
