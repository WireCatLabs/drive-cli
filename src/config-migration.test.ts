import { chmodSync, readFileSync, statSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import { activeProfile, paths, readConfig, writeConfig } from "./config.js"
import { policySettings } from "./policy.js"
import { fixture } from "./testing.js"

describe("existing AI settings", () => {
  it.each(["read_only", "readOnly"])("refuses retired %s without rewriting configuration", (key) => {
    const f = fixture()
    const path = join(paths(f.env).config, "config.json")
    const text = JSON.stringify({ ...readConfig(f.env), defaults: { [key]: true } })
    writeFileSync(path, text)
    expect(() => readConfig(f.env)).toThrow("read_only is retired")
    expect(readFileSync(path, "utf8")).toBe(text)
  })
  it("migrates an old file once, retaining its mode, profile names and permission paths", () => {
    const f = fixture()
    const path = join(paths(f.env).config, "config.json")
    const existing = readConfig(f.env)
    writeFileSync(
      path,
      JSON.stringify({
        ...existing,
        profiles: {
          ...existing.profiles,
          personalAccount: { ...activeProfile(f.env, "default"), pictureSearch: true },
        },
        defaults: {
          embeddingModel: "all-MiniLM-L6-v2",
          maxTextChars: 2048,
          permissions: { "documents.memories.extract": "deny" },
          models: { memories: { provider: "openai", model: "fixture-model", baseUrl: "http://127.0.0.1:1" } },
        },
      }),
    )
    chmodSync(path, 0o640)
    const config = readConfig(f.env)
    expect(config.defaults).toMatchObject({
      embedding_model: "all-MiniLM-L6-v2",
      max_text_chars: 2048,
      permissions: { "documents.memories.extract": "deny" },
      models: { memories: { base_url: "http://127.0.0.1:1" } },
    })
    expect(config.profiles.personalAccount?.picture_search).toBe(true)
    expect(policySettings(f.env, "personalAccount").readOnly).toBe(false)
    const text = readFileSync(path, "utf8")
    expect(text).not.toContain('"embeddingModel"')
    expect(text).not.toContain('"baseUrl"')
    if (process.platform !== "win32") expect(statSync(path).mode & 0o777).toBe(0o640)
    const before = statSync(path, { bigint: true })
    expect(readConfig(f.env)).toEqual(config)
    const after = statSync(path, { bigint: true })
    expect([after.ino, after.mtimeNs, readFileSync(path, "utf8")]).toEqual([before.ino, before.mtimeNs, text])
  })

  it("leaves an invalid legacy file unchanged instead of partially upgrading it", () => {
    const f = fixture()
    const path = join(paths(f.env).config, "config.json")
    const text = JSON.stringify({
      ...readConfig(f.env),
      defaults: { embeddingModel: "fixture", maxTextChars: 0, unknownSetting: true },
    })
    writeFileSync(path, text)
    expect(() => readConfig(f.env)).toThrow("defaults.max_text_chars has the wrong type or is out of range")
    expect(readFileSync(path, "utf8")).toBe(text)
  })

  it("refuses conflicting aliases without rewriting or exposing settings", () => {
    const f = fixture()
    const path = join(paths(f.env).config, "config.json")
    const text = JSON.stringify({
      ...readConfig(f.env),
      defaults: { embeddingModel: "fixture-model-alpha", embedding_model: "fixture-model-beta" },
    })
    writeFileSync(path, text)
    const message = errorOf(() => readConfig(f.env))
    expect(message).toBe(
      "defaults.embeddingModel is the old name of defaults.embedding_model, and both are set — keep only embedding_model",
    )
    expect(readFileSync(path, "utf8")).toBe(text)
  })
})

const errorOf = (run: () => unknown) => {
  try {
    run()
  } catch (error) {
    return error instanceof Error ? error.message : String(error)
  }
  throw new Error("expected an error")
}

describe("an invalid config names the first bad key and never its value", () => {
  const write = (config: unknown) => {
    const f = fixture()
    const path = join(paths(f.env).config, "config.json")
    writeFileSync(path, JSON.stringify(config))
    return { env: f.env, path }
  }

  it("names a missing key", () => {
    const { env, path } = write({ defaultProfile: "work", profiles: { work: {} } })
    expect(errorOf(() => readConfig(env))).toBe(`${path}: profiles.work.principal is missing`)
  })

  it("names an unknown key", () => {
    const { env, path } = write({ profiles: {}, colour: "fixture-colour" })
    expect(errorOf(() => readConfig(env))).toBe(`${path}: colour is not a known setting`)
  })

  it("hides a value placed in a field of the wrong type", () => {
    const { env, path } = write({
      profiles: { work: { principal: "p", roots: [], storage: "keyring", max_text_chars: "fixture-hidden-value-42" } },
    })
    const message = errorOf(() => readConfig(env))
    expect(message).toBe(`${path}: profiles.work.max_text_chars has the wrong type or is out of range`)
    expect(message).not.toContain("fixture-hidden-value-42")
  })

  it("does not quote broken JSON", () => {
    const { env, path } = write("placeholder")
    writeFileSync(path, '{"profiles": fixture-hidden-value-42')
    const message = errorOf(() => readConfig(env))
    expect(message).toBe(`${path} is not valid JSON`)
  })

  it("names the key when saving settings of the wrong type", () => {
    const f = fixture()
    const config = {
      profiles: { work: { principal: "p", roots: [], storage: "keyring", max_text_chars: "fixture-hidden-value-42" } },
    }
    const message = errorOf(() => writeConfig(f.env, config as never))
    expect(message).toBe("drive settings: profiles.work.max_text_chars has the wrong type or is out of range")
  })
})
