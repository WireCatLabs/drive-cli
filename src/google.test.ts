import { OAuth2Client } from "google-auth-library"
import { describe, expect, it, vi } from "vitest"
import { googleSource } from "./google.js"
import { DOC, FOLDER } from "./model.js"

interface Request {
  url: string | URL
  params?: Record<string, unknown>
  method?: string
}
const metadata = (id = "doc-a", mime = DOC, version = "1") => ({
  id,
  name: "Fixture",
  mimeType: mime,
  parents: ["root"],
  version,
  capabilities: { canDownload: true },
})
const scripted = (respond: (request: Request) => unknown) => {
  const auth = new OAuth2Client("fixture-client")
  const request = vi.fn(async (options: Request) => ({
    data: respond(options),
    status: 200,
    headers: new Headers(),
    config: options,
  }))
  Object.defineProperty(auth, "request", { value: request })
  return { source: googleSource(auth), request }
}
describe("official Google SDK source", () => {
  it("requests all tabs and preserves native Markdown independently of searchable tab text", async () => {
    const f = scripted((request) => {
      const url = String(request.url)
      if (url.includes("docs.googleapis.com")) {
        expect(request.params?.includeTabsContent).toBe(true)
        return {
          tabs: [
            {
              tabProperties: { tabId: "first", title: "First" },
              documentTab: {
                body: { content: [{ paragraph: { elements: [{ textRun: { content: "FIRST_SENTINEL" } }] } }] },
              },
              childTabs: [
                {
                  tabProperties: { tabId: "child", title: "Nested" },
                  documentTab: {
                    body: { content: [{ paragraph: { elements: [{ textRun: { content: "NESTED_SENTINEL" } }] } }] },
                  },
                },
              ],
            },
          ],
        }
      }
      if (url.endsWith("/export")) {
        expect(request.params?.mimeType).toBe("text/markdown")
        return "# Native export\n"
      }
      return metadata()
    })
    const result = await f.source.content("doc-a")
    expect(result.markdown).toBe("# Native export\n")
    expect(result.text).toContain("FIRST_SENTINEL")
    expect(result.text).toContain("NESTED_SENTINEL")
    expect(result.tabs).toHaveLength(2)
  })
  it("handles folder pagination and includes Shared Drive flags", async () => {
    const f = scripted((request) => {
      expect(request.params?.supportsAllDrives).toBe(true)
      expect(request.params?.includeItemsFromAllDrives).toBe(true)
      return request.params?.pageToken
        ? { files: [metadata("doc-b")] }
        : { files: [metadata()], nextPageToken: "second" }
    })
    expect((await f.source.children("root")).map((file) => file.id)).toEqual(["doc-a", "doc-b"])
    expect(f.request).toHaveBeenCalledTimes(2)
  })
  it("does not accept incomplete or looping folder listings", async () => {
    const incomplete = scripted(() => ({ incompleteSearch: true, files: [] }))
    await expect(incomplete.source.children("root")).rejects.toThrow("incomplete")
    const repeated = scripted(() => ({ files: [], nextPageToken: "same" }))
    await expect(repeated.source.children("root")).rejects.toThrow("repeated")
  })
  it("preserves the final change cursor and requests parent IDs", async () => {
    const f = scripted((request) => {
      expect(String(request.params?.fields)).toContain("parents")
      return request.params?.pageToken === "start"
        ? { changes: [{ fileId: "doc-a", file: metadata() }], nextPageToken: "second" }
        : { changes: [{ fileId: "doc-b", removed: true }], newStartPageToken: "future" }
    })
    const result = await f.source.changes("start")
    expect(result.cursor).toBe("future")
    expect(result.items[0]?.file?.parents).toEqual(["root"])
    expect(result.items[1]?.removed).toBe(true)
  })
  it("rejects a change response without a final cursor", async () => {
    const f = scripted(() => ({ changes: [] }))
    await expect(f.source.changes("start")).rejects.toThrow("final")
  })
  it("refuses a document modified during export", async () => {
    let reads = 0
    const f = scripted((request) => {
      const url = String(request.url)
      if (url.includes("docs.googleapis.com"))
        return { tabs: [{ tabProperties: { tabId: "first" }, documentTab: { body: { content: [] } } }] }
      if (url.endsWith("/export")) return "Markdown"
      return metadata("doc-a", DOC, String(++reads))
    })
    await expect(f.source.content("doc-a")).rejects.toThrow("changed during export")
  })
  it("downloads uploaded Markdown rather than exporting it", async () => {
    const f = scripted((request) =>
      request.params?.alt === "media" ? "uploaded text" : metadata("uploaded", "text/markdown"),
    )
    expect((await f.source.content("uploaded")).text).toBe("uploaded text")
    expect(f.request.mock.calls.some(([request]) => String(request.url).endsWith("/export"))).toBe(false)
  })
  it("sanitizes provider errors instead of printing request credentials", async () => {
    const f = scripted(() => {
      throw { status: 403, config: { headers: { Authorization: "fixture-bearer-secret" } } }
    })
    await expect(f.source.metadata("root")).rejects.toThrow("denied")
    await expect(f.source.metadata("root")).rejects.not.toThrow("fixture-bearer-secret")
  })
  it("rejects incomplete metadata and restricted downloads", async () => {
    const incomplete = scripted(() => ({ id: "root", mimeType: FOLDER }))
    await expect(incomplete.source.metadata("root")).rejects.toThrow("incomplete")
    const restricted = scripted(() => ({ ...metadata(), capabilities: { canDownload: false } }))
    await expect(restricted.source.content("doc-a")).rejects.toThrow("restricted")
  })
})
