import { mkdirSync, mkdtempSync, symlinkSync, writeFileSync } from "node:fs"
import { createServer } from "node:net"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { isCliError } from "@wirecat/cli-base"
import { describe, expect, it } from "vitest"
import { createDoc, prepareDoc } from "./mirror-docs.js"
import { checkPort, localImage } from "./mirror-images.js"

const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2, 3])

const freePort = () =>
  new Promise<number>((done) => {
    const server = createServer().listen(0, "127.0.0.1", () => {
      const { port } = server.address() as { port: number }
      server.close(() => done(port))
    })
  })

const folder = (markdown: string) => {
  const root = mkdtempSync(join(tmpdir(), "mirror-images-"))
  mkdirSync(join(root, "pics"))
  writeFileSync(join(root, "pics", "chart.png"), PNG)
  writeFileSync(join(root, "pics", "notes.txt"), "not an image")
  writeFileSync(join(root, "plan.md"), markdown)
  return { root, file: { path: "plan.md", absolute: join(root, "plan.md"), hash: "h", kind: "doc" } }
}

const paragraph = (start: number, text: string) => ({
  startIndex: start,
  endIndex: start + text.length,
  paragraph: {
    elements: [{ startIndex: start, endIndex: start + text.length, textRun: { content: text } }],
    paragraphStyle: { namedStyleType: "NORMAL_TEXT" },
  },
})
const imageParagraph = (start: number) => ({
  startIndex: start,
  endIndex: start + 2,
  paragraph: {
    elements: [
      { startIndex: start, endIndex: start + 1, inlineObjectElement: { inlineObjectId: "kix.1" } },
      { startIndex: start + 1, endIndex: start + 2, textRun: { content: "\n" } },
    ],
    paragraphStyle: { namedStyleType: "NORMAL_TEXT" },
  },
})

/**
 * The Docs calls the push makes, as Google answers them: the text batch leaves the image's Markdown in the Doc,
 * and the image batch fetches the one-off address the way Google does, then holds the image with it as source.
 */
const fakeDocs = (options: { failImage?: boolean } = {}) => {
  let content: object[] = [paragraph(1, "\n")]
  let sources: string[] = []
  let revision = 0
  const batches: object[][] = []
  const fetched: { status: number; type: string | null; bytes: number; other: number; head: number }[] = []
  const call = async (method: string, _params: Record<string, unknown>, body?: Record<string, unknown>) => {
    if (method === "drive.files.create") return { id: "doc-1", webViewLink: "https://example.invalid/doc-1" }
    if (method === "drive.files.export") return ""
    if (method === "docs.documents.get")
      return {
        revisionId: `rev-${revision}`,
        body: { content: [{ startIndex: 0, endIndex: 1, sectionBreak: {} }, ...content] },
        inlineObjects: Object.fromEntries(
          sources.map((sourceUri) => [
            "kix.1",
            { inlineObjectProperties: { embeddedObject: { imageProperties: { sourceUri } } } },
          ]),
        ),
      }
    if (method === "docs.documents.batchUpdate") {
      const requests = body?.requests as Record<string, { uri?: string }>[]
      batches.push(requests)
      const image = requests.find((request) => request.insertInlineImage)?.insertInlineImage?.uri
      if (!image) {
        content = [paragraph(1, "Plan\n"), paragraph(6, "![chart](pics/chart.png)\n"), paragraph(32, "\n")]
      } else {
        if (options.failImage) throw Object.assign(new Error("Invalid requests[1].insertInlineImage"), {})
        const got = await fetch(image)
        const other = await fetch(new URL("/images/guess", image))
        const head = await fetch(image, { method: "HEAD" })
        fetched.push({
          status: got.status,
          type: got.headers.get("content-type"),
          bytes: (await got.arrayBuffer()).byteLength,
          other: other.status,
          head: head.status,
        })
        content = [paragraph(1, "Plan\n"), imageParagraph(6), paragraph(8, "\n")]
        sources = [image]
      }
      revision++
      return {}
    }
    throw new Error(`unexpected ${method}`)
  }
  return { call, batches, fetched }
}

describe("localImage", () => {
  it("takes PNG, JPEG or GIF files inside the mirrored folder only", () => {
    const { file } = folder("")
    expect(localImage(file, "pics/chart.png")).toMatchObject({ type: "image/png" })
    expect(localImage(file, "pics/notes.txt")).toEqual({ reason: "is not PNG, JPEG or GIF" })
    expect(localImage(file, "../outside.png")).toEqual({ reason: "is outside the mirrored folder" })
    expect(localImage(file, "/etc/hosts")).toEqual({ reason: "is not a path inside the folder" })
    expect(localImage(file, "pics/missing.png")).toEqual({ reason: "does not exist" })
    const outside = mkdtempSync(join(tmpdir(), "mirror-outside-"))
    writeFileSync(join(outside, "secret.png"), PNG)
    symlinkSync(join(outside, "secret.png"), join(dirname(file.absolute), "pics", "link.png"))
    expect(localImage(file, "pics/link.png")).toEqual({ reason: "is outside the mirrored folder" })
  })
})

describe("local images in a mirrored Doc", () => {
  it("serves the image once at a one-off address, then a second push of the same file sends nothing", async () => {
    const { file } = folder("Plan\n\n![chart](pics/chart.png)\n")
    const port = await freePort()
    const warnings: string[] = []
    const images = {
      host: { publicUrl: new URL(`http://127.0.0.1:${port}`), port },
      warn: (t: string) => warnings.push(t),
    }
    const docs = fakeDocs()
    const pushed = await createDoc(docs.call, { file, name: "plan.md", parent: "folder", origin: "o" }, images)

    expect(docs.fetched).toEqual([{ status: 200, type: "image/png", bytes: PNG.length, other: 404, head: 200 }])
    const uri = Object.keys(pushed.snapshot.images ?? {})[0] as string
    expect(uri).toMatch(new RegExp(`^http://127\\.0\\.0\\.1:${port}/images/[\\w-]{32}$`))
    await expect(fetch(uri)).rejects.toThrow()
    expect(pushed.snapshot.written).toContainEqual({ kind: "image", url: "pics/chart.png", alt: "chart" })
    expect(warnings).toEqual([])

    const batches = docs.batches.length
    const again = await prepareDoc(docs.call, { id: "doc-1", url: pushed.url, file, recorded: pushed.snapshot })
    expect(again).toHaveProperty("unchanged")
    expect(docs.batches).toHaveLength(batches)
  })

  it("keeps the image as Markdown text and warns when Google cannot take it; the push still succeeds", async () => {
    const { file } = folder("Plan\n\n![chart](pics/chart.png)\n")
    const port = await freePort()
    const warnings: string[] = []
    const images = {
      host: { publicUrl: new URL(`http://127.0.0.1:${port}`), port },
      warn: (t: string) => warnings.push(t),
    }
    const docs = fakeDocs({ failImage: true })
    const pushed = await createDoc(docs.call, { file, name: "plan.md", parent: "folder", origin: "o" }, images)
    expect(pushed.snapshot.written).toContainEqual({
      kind: "paragraph",
      inlines: [{ text: "![chart](pics/chart.png)" }],
    })
    expect(warnings).toEqual(["plan.md: 1 image(s) stay as text in the Doc: Google did not take them"])
    const retry = fakeDocs()
    await retry.call("docs.documents.batchUpdate", {}, { requests: [{}] })
    const prepared = await prepareDoc(
      retry.call,
      { id: "doc-1", url: pushed.url, file, recorded: pushed.snapshot },
      images,
    )
    expect(prepared).toMatchObject({ remote: true })
    if (!("write" in prepared)) throw new Error("expected a write")
    const written = await prepared.write()
    expect(retry.fetched).toHaveLength(1)
    expect(written.snapshot.written).toContainEqual({ kind: "image", url: "pics/chart.png", alt: "chart" })
  })

  it("leaves a local image as text without --public-url, as before", async () => {
    const { file } = folder("Plan\n\n![chart](pics/chart.png)\n")
    const docs = fakeDocs()
    const pushed = await createDoc(docs.call, { file, name: "plan.md", parent: "folder", origin: "o" })
    expect(docs.batches).toHaveLength(1)
    expect(pushed.snapshot.images).toEqual({})
  })

  it("refuses a busy port before anything is synced", async () => {
    const port = await freePort()
    const blocker = createServer().listen(port, "127.0.0.1")
    await new Promise((done) => blocker.once("listening", done))
    try {
      const error = await checkPort(port).catch((caught: unknown) => caught)
      expect(isCliError(error) && error.details?.reason).toBe("mirror.port-busy")
    } finally {
      blocker.close()
    }
  })
})
