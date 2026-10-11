import { describe, expect, it } from "vitest"
import { openIndex } from "./store.js"
import { content, file, fixture } from "./testing.js"

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
})
