import { OAuth2Client } from "google-auth-library"
import { describe, expect, it } from "vitest"
import { googleSource } from "./google.js"
import { SHEET } from "./model.js"
import { indexOver, openIndex } from "./store.js"
import { content, file, fixture, workbook } from "./testing.js"

describe("released shared store and search", () => {
  it("returns snake_case search fields for both empty accounts and indexed passages", async () => {
    const f = fixture()
    const index = await openIndex(f.env)
    try {
      expect(await index.search("empty-account", "budget", { limit: 5, offset: 0, exact: true })).toMatchObject({
        hits: [],
        has_more: false,
        meaning_skipped: "this Google account has no imported sources",
      })
      await index.save("synthetic-principal", content(file("snake-test")), "fixture-hash")
      const found = await index.search("synthetic-principal", "budget", { limit: 5, offset: 0, exact: true })
      expect(found).toMatchObject({
        has_more: false,
        hits: [
          { updated_at: expect.any(String), excerpt: expect.any(String), found_by: expect.arrayContaining(["words"]) },
        ],
      })
      const text = JSON.stringify(found)
      for (const key of ["hasMore", "meaningSkipped", "modifiedAt", "foundBy", "folderId"])
        expect(text).not.toContain(`"${key}"`)
    } finally {
      await index.close()
    }
  })
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
        hits: { ref: string; title: string; source_url: string }[]
      }
      expect(found.hits.some((hit) => hit.ref === first)).toBe(true)
      expect(found.hits[0]?.title).toBe("Renamed")
      expect(found.hits[0]?.source_url).toBe(file("doc-a").url)
      await index.remove("synthetic-principal", "doc-a")
      const gone = (await index.search("synthetic-principal", "budget", { limit: 10, offset: 0, exact: true })) as {
        hits: unknown[]
      }
      expect(gone.hits).toHaveLength(0)
    } finally {
      await index.close()
    }
  })
  it("finds a name-only document by its title, says it was not read and leaves it out of the text", async () => {
    const f = fixture()
    const index = await openIndex(f.env)
    try {
      const scan = { ...file("scan", ["root"], "image/png"), name: "Passport scan", size: 1234 }
      const ref = await index.save(
        "synthetic-principal",
        { metadata: scan, markdown: "", text: "", tabs: [], notRead: "unsupported type: image/png" },
        "hash",
      )
      await index.save("synthetic-principal", content(file("doc-a")), "hash-two")
      const found = (await index.search("synthetic-principal", "passport", { limit: 10, offset: 0, exact: true })) as {
        hits: { ref: string; source_url: string; not_read: string | null }[]
      }
      expect(found.hits).toMatchObject([{ ref, source_url: scan.url, not_read: "unsupported type: image/png" }])
      const body = (await index.search("synthetic-principal", "budget", {
        limit: 10,
        offset: 0,
        exact: true,
      })) as {
        hits: { ref: string; not_read: string | null }[]
      }
      expect(body.hits.map((hit) => hit.not_read)).toEqual([null])
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

  it("advises tg or max for a missing text model, not a drive command", async () => {
    const index = await openIndex(fixture().env)
    try {
      await expect(index.embed(10)).rejects.toThrow(
        /tg or max downloads it: `tg models text download [^`]+` or `max models/,
      )
    } finally {
      await index.close()
    }
  })

  describe("picture search", () => {
    const axis = (i: number) => Float32Array.from({ length: 512 }, (_, n) => (n === i ? 1 : 0))
    const embedder = {
      model: {},
      embedImage: async (bytes: Uint8Array) => axis(bytes[0] as number),
      embedQuery: async (text: string) => axis(text === "cat" ? 1 : 9),
      close: async () => {},
    } as unknown as Parameters<typeof indexOver>[2]
    const open = async () => {
      const f = fixture()
      const { openStore } = await import("@wirecat/cli-core/store")
      const store = await openStore({ path: f.env.DRIVE_STORE as string, env: f.env, command: "drive" })
      return { store, index: indexOver(store, f.env, embedder) }
    }
    const image = (id: string) => ({
      ...content({ ...file(id, ["root"], "image/png"), name: `${id}.png` }, ""),
      text: "",
    })
    it("returns pictures with the document's title and link when asked, and none when not", async () => {
      const { store, index } = await open()
      try {
        const reference = await index.save("synthetic-principal", image("cat"), "h")
        const writer = await index.openPictures()
        await writer.save(reference, Uint8Array.of(1))
        await writer.close()
        const on = (await index.search("synthetic-principal", "cat", {
          limit: 5,
          offset: 0,
          exact: false,
          pictures: true,
        })) as { pictures: { ref: string; title: string; source_url: string }[] }
        expect(on.pictures).toMatchObject([{ ref: reference, title: "cat.png", source_url: file("cat").url }])
        const off = (await index.search("synthetic-principal", "cat", { limit: 5, offset: 0, exact: false })) as object
        expect(off).not.toHaveProperty("pictures")
      } finally {
        await store.close()
      }
    })
    it("drops the picture when the document is removed", async () => {
      const { store, index } = await open()
      try {
        const reference = await index.save("synthetic-principal", image("cat"), "h")
        const writer = await index.openPictures()
        await writer.save(reference, Uint8Array.of(1))
        await index.remove("synthetic-principal", "cat")
        const found = (await index.search("synthetic-principal", "cat", {
          limit: 5,
          offset: 0,
          exact: false,
          pictures: true,
        })) as { pictures?: unknown[] }
        expect(found.pictures ?? []).toEqual([])
      } finally {
        await store.close()
      }
    })
  })
})
