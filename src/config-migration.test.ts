import { chmodSync, readFileSync, statSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import { activeProfile, paths, readConfig } from "./config.js"
import { policySettings } from "./policy.js"
import { fixture } from "./testing.js"

describe("existing AI settings", () => {
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
          personalAccount: { ...activeProfile(f.env, "default"), readOnly: true, pictureSearch: true },
        },
        defaults: {
          embeddingModel: "all-MiniLM-L6-v2",
          readOnly: false,
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
      read_only: false,
      max_text_chars: 2048,
      permissions: { "documents.memories.extract": "deny" },
      models: { memories: { base_url: "http://127.0.0.1:1" } },
    })
    expect(config.profiles.personalAccount?.read_only).toBe(true)
    expect(config.profiles.personalAccount?.picture_search).toBe(true)
    expect(policySettings(f.env, "personalAccount").readOnly).toBe(true)
    const text = readFileSync(path, "utf8")
    expect(text).not.toContain('"embeddingModel"')
    expect(text).not.toContain('"baseUrl"')
    expect(statSync(path).mode & 0o777).toBe(0o640)
    const before = statSync(path, { bigint: true })
    expect(readConfig(f.env)).toEqual(config)
    const after = statSync(path, { bigint: true })
    expect([after.ino, after.mtimeNs, readFileSync(path, "utf8")]).toEqual([before.ino, before.mtimeNs, text])
  })

  it("refuses conflicting aliases without rewriting or exposing settings", () => {
    const f = fixture()
    const path = join(paths(f.env).config, "config.json")
    const text = JSON.stringify({
      ...readConfig(f.env),
      defaults: { embeddingModel: "old", embedding_model: "different" },
    })
    writeFileSync(path, text)
    expect(() => readConfig(f.env)).toThrow("drive configuration is invalid")
    expect(readFileSync(path, "utf8")).toBe(text)
  })
})
