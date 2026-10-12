import { OAuth2Client } from "google-auth-library"
import { describe, expect, it, vi } from "vitest"
import { googleSource } from "./google.js"
import { DOC, FOLDER, SHEET } from "./model.js"
import { pdf, wordDocument, workbook } from "./testing.js"

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
  it("hydrates owner/editor provenance and retains it in validated checkpoints", async () => {
    const f = scripted((request) => {
      expect(String(request.params?.fields)).toContain("lastModifyingUser")
      return {
        ...metadata(),
        createdTime: "2026-10-01T00:00:00Z",
        description: "Synthetic",
        driveId: "drive-one",
        owners: [{ permissionId: "owner-user", displayName: "Owner Sample" }],
        lastModifyingUser: { permissionId: "editor-user", emailAddress: "editor@example.invalid" },
      }
    })
    const file = await f.source.metadata("doc-a")
    expect(file).toMatchObject({
      owners: [{ id: "owner-user", name: "Owner Sample" }],
      lastModifiedBy: { id: "editor-user" },
    })
    const { fixture } = await import("./testing.js")
    const { readState, saveState } = await import("./state.js")
    const local = fixture()
    const state = readState(local.env, "default", "synthetic-principal")
    state.documents["doc-a"] = { metadata: file, hash: "hash", reference: "document:1", tabs: 1 }
    saveState(local.env, "default", state)
    expect(readState(local.env, "default", "synthetic-principal").documents["doc-a"]?.metadata.lastModifiedBy?.id).toBe(
      "editor-user",
    )
  })
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
  it("exports a native Sheet as xlsx and keeps every tab as a heading", async () => {
    const f = scripted((request) => {
      if (String(request.url).endsWith("/export")) {
        expect(request.params?.mimeType).toBe("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        return workbook({ Budget: "rentneedle", Redirects: "/old-page" })
      }
      return metadata("sheet-a", SHEET)
    })
    const result = await f.source.content("sheet-a")
    expect(result.tabs.map((tab) => tab.title)).toEqual(["Budget", "Redirects"])
    expect(result.text).toMatch(/^# Budget\n\nA1: rentneedle\n\n# Redirects\n\nA1: \/old-page$/)
    expect(result.markdown).toBe(result.text)
  })
  it.each([
    ["application/pdf", () => pdf("pdfneedle"), "pdfneedle"],
    [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      () => wordDocument("wordneedle"),
      "wordneedle",
    ],
    [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      () => workbook({ Core: "cellneedle" }),
      "# Core",
    ],
    ["text/csv", () => Buffer.from("query,volume\nаренда кровати,40\n"), "аренда кровати"],
  ])("downloads an uploaded %s and reads its text", async (mime, bytes, needle) => {
    const f = scripted((request) => (request.params?.alt === "media" ? bytes() : metadata("upload", mime)))
    expect((await f.source.content("upload")).text).toContain(needle)
  })
  it("refuses a PDF without a text layer instead of guessing", async () => {
    const f = scripted((request) => (request.params?.alt === "media" ? pdf() : metadata("scan", "application/pdf")))
    await expect(f.source.content("scan")).rejects.toMatchObject({
      code: "validation_error",
      message: expect.stringContaining("no text layer"),
    })
  })
  it("names Google's export cap when a Sheet is too large to export", async () => {
    const f = scripted((request) => {
      if (String(request.url).endsWith("/export"))
        throw {
          status: 403,
          response: { status: 403, data: { error: { errors: [{ reason: "exportSizeLimitExceeded" }] } } },
        }
      return metadata("big", SHEET)
    })
    await expect(f.source.content("big")).rejects.toMatchObject({
      code: "validation_error",
      message: expect.stringContaining("10 MB"),
    })
  })
  it("refuses a file over the size bound before downloading it", async () => {
    const f = scripted(() => ({ ...metadata("huge", "application/pdf"), size: String(60 * 1024 * 1024) }))
    await expect(f.source.content("huge")).rejects.toMatchObject({ code: "validation_error" })
    expect(f.request.mock.calls.some(([request]) => request.params?.alt === "media")).toBe(false)
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
