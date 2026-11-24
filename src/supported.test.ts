import { describe, expect, it } from "vitest"
import { DOC, type FileMetadata } from "./model.js"
import { plainText, supported } from "./supported.js"

const file = (name: string, mime: string) => ({ name, mime }) as FileMetadata

describe("supported", () => {
  it("reads every format cli-core's readers read, and Google's own Docs and Sheets", () => {
    for (const [name, mime] of [
      ["deck.pptx", "application/vnd.openxmlformats-officedocument.presentationml.presentation"],
      ["old.doc", "application/msword"],
      ["note.odt", "application/vnd.oasis.opendocument.text"],
      ["book.epub", "application/epub+zip"],
      ["page.html", "text/html"],
      ["Plan", DOC],
    ])
      expect(supported(file(name, mime))).toBe(true)
  })

  it("skips Slides, images and other Google types, and reads only text files as they are", () => {
    expect(supported(file("Deck", "application/vnd.google-apps.presentation"))).toBe(false)
    expect(supported(file("scan.png", "image/png"))).toBe(false)
    expect(plainText(file("notes.md", "application/octet-stream"))).toBe(true)
    expect(
      plainText(file("deck.pptx", "application/vnd.openxmlformats-officedocument.presentationml.presentation")),
    ).toBe(false)
  })
})
