import { readFileSync, writeFileSync } from "node:fs"
import { captureStreams } from "@wirecat/cli-base"
import { MAX_TEXT_CHARS } from "@wirecat/cli-core/documents"
import { describe, expect, it } from "vitest"
import { configPath, writeConfig } from "./config.js"
import { commandResult, testProgram as createProgram, fixture } from "./testing.js"

const PROFILE = { principal: "synthetic-principal", roots: ["root"], storage: "keyring" }

const setup = (config: unknown) => {
  const f = fixture()
  writeFileSync(configPath(f.env), JSON.stringify(config))
  return f.env
}
const file = (env: NodeJS.ProcessEnv) => readFileSync(configPath(env), "utf8")
const drive = async (env: NodeJS.ProcessEnv, ...args: string[]) => {
  const streams = captureStreams()
  await createProgram({ env, streams }).parseAsync(["--json", ...args], { from: "user" })
  return commandResult(streams.stdout.join(""))
}

describe("every setting in the config file with its default", () => {
  it("config show lists each setting's value, default and source, and writes nothing", async () => {
    const env = setup({ defaults: { limit: 7 }, profiles: { work: PROFILE } })
    const before = file(env)
    const { settings } = await drive(env, "config", "show")
    expect(settings).toContainEqual(
      expect.objectContaining({ setting: "defaults.limit", value: 7, from: "config file" }),
    )
    expect(settings).toContainEqual(
      expect.objectContaining({ setting: "defaults.max_text_chars", value: MAX_TEXT_CHARS, from: "default" }),
    )
    expect(file(env)).toBe(before)
  })

  it("config migrate adds what the file lacks, keeps values, order and other sections, and repeats as a no-op", async () => {
    const env = setup({ profiles: { work: PROFILE }, defaults: { record: false } })
    const { added } = await drive(env, "config", "migrate")
    const saved = JSON.parse(file(env))
    expect(added).toContain("defaults.max_text_chars")
    expect(Object.keys(saved)).toEqual(["profiles", "defaults"])
    expect(saved.profiles).toEqual({ work: PROFILE })
    expect(saved.defaults).toMatchObject({ record: false, max_text_chars: MAX_TEXT_CHARS, update_check: true })
    expect(Object.keys(saved.defaults)[0]).toBe("record")
    const again = file(env)
    expect((await drive(env, "config", "migrate")).added).toEqual([])
    expect(file(env)).toBe(again)
  })

  it("set and other writes fill the file, and unset does not put back what it removed", async () => {
    const env = setup({ profiles: { work: PROFILE } })
    await drive(env, "work", "config", "set", "max_text_chars", "1000")
    expect(JSON.parse(file(env)).defaults).toMatchObject({ max_text_chars: MAX_TEXT_CHARS, limit: expect.any(Number) })
    await drive(env, "config", "unset", "limit", "--defaults")
    expect(JSON.parse(file(env)).defaults).not.toHaveProperty("limit")
    writeConfig(env, { profiles: {} })
    expect(JSON.parse(file(env)).defaults).toMatchObject({ max_text_chars: MAX_TEXT_CHARS })
  })
})
