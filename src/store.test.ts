import { OAuth2Client } from "google-auth-library"
import { describe, expect, it } from "vitest"
import { googleSource } from "./google.js"
import { SHEET } from "./model.js"
import { openIndex } from "./store.js"
import { content, file, fixture, workbook } from "./testing.js"

describe("released shared store and search", () => {
  it("searches document tags through the shared query language and preserves account scope", async () => {
    const f = fixture()
    const index = await openIndex(f.env)
    try {
      const tagged = await index.save("synthetic-principal", content(file("doc-a")), "hash-one")
      await index.save("synthetic-principal", content(file("doc-b")), "hash-two")
      const other = await index.save("other-principal", content(file("doc-c")), "hash-three")
      await index.knowledge?.tags("synthetic-principal", tagged, "add", ["budget"])
      await index.knowledge?.tags("other-principal", other, "add", ["budget"])
      const result = (await index.search("synthetic-principal", "tag:budget", {
        limit: 10,
        offset: 0,
        exact: true,
      })) as { hits: { ref: string }[] }
      expect(result.hits.map((hit) => hit.ref)).toEqual([tagged])
    } finally {
      await index.close()
    }
  })
  it("preserves note identity across edits and removes text from retrieval", async () => {
    const f = fixture()
    const index = await openIndex(f.env)
    try {
      const first = await index.save("synthetic-principal", content(file("doc-a")), "hash-one")
      const second = await index.save("synthetic-principal", content({ ...file("doc-a"), name: "Renamed" }), "hash-one")
      expect(second).toBe(first)
      const found = (await index.search("synthetic-principal", "budget", { limit: 10, offset: 0, exact: true })) as {
        hits: { ref: string; title: string; sourceUrl: string }[]
      }
      expect(found.hits.some((hit) => hit.ref === first)).toBe(true)
      expect(found.hits[0]?.title).toBe("Renamed")
      expect(found.hits[0]?.sourceUrl).toBe(file("doc-a").url)
      await index.remove("synthetic-principal", "doc-a")
      const gone = (await index.search("synthetic-principal", "budget", { limit: 10, offset: 0, exact: true })) as {
        hits: unknown[]
      }
      expect(gone.hits).toHaveLength(0)
    } finally {
      await index.close()
    }
  })
  it("does not search another principal when this account has no indexed folder", async () => {
    const f = fixture()
    const index = await openIndex(f.env)
    try {
      await index.save("other-principal", content(file("doc-a")), "hash")
      const result = (await index.search("synthetic-principal", "budget", { limit: 10, offset: 0, exact: true })) as {
        hits: unknown[]
      }
      expect(result.hits).toHaveLength(0)
    } finally {
      await index.close()
    }
  })
  it("finds a word from a native Sheet cell", async () => {
    const auth = new OAuth2Client("fixture-client")
    Object.defineProperty(auth, "request", {
      value: async (options: { url: string }) => ({
        data: options.url.endsWith("/export")
          ? workbook({ Семантика: "аренда функциональной кровати" })
          : { id: "sheet-a", name: "Core", mimeType: SHEET, parents: ["root"], version: "1" },
      }),
    })
    const sheet = await googleSource(auth).content("sheet-a")
    const index = await openIndex(fixture().env)
    try {
      const ref = await index.save("synthetic-principal", sheet, "hash")
      const found = (await index.search("synthetic-principal", "кровати", { limit: 10, offset: 0, exact: true })) as {
        hits: { ref: string; tabs: { title: string }[] }[]
      }
      expect(found.hits.map((hit) => hit.ref)).toEqual([ref])
      expect(found.hits[0]?.tabs).toEqual([{ id: "Семантика", title: "Семантика" }])
    } finally {
      await index.close()
    }
  })
})
