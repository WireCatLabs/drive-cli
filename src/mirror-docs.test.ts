import { markdownBlocks } from "@wirecat/cli-core/documents"
import { describe, expect, it } from "vitest"
import { editRequests, insertRequests, readDoc, representable } from "./mirror-docs.js"

const paragraph = (start: number, text: string, extra: Record<string, unknown> = {}, style: object = {}) => ({
  startIndex: start,
  endIndex: start + text.length,
  paragraph: {
    elements: [{ startIndex: start, endIndex: start + text.length, textRun: { content: text, textStyle: style } }],
    paragraphStyle: { namedStyleType: "NORMAL_TEXT" },
    ...extra,
  },
})

/** Shaped like Google's documents.get answer for a Doc the writer made (see cli-testing drive-push). */
const document = {
  revisionId: "rev-1",
  lists: {
    bullets: { listProperties: { nestingLevels: [{ glyphSymbol: "●" }, { glyphSymbol: "○" }] } },
    checks: { listProperties: { nestingLevels: [{ glyphType: "GLYPH_TYPE_UNSPECIFIED" }] } },
    numbers: { listProperties: { nestingLevels: [{ glyphType: "DECIMAL" }] } },
  },
  body: {
    content: [
      { startIndex: 0, endIndex: 1, sectionBreak: {} },
      paragraph(1, "Plan\n", { paragraphStyle: { namedStyleType: "HEADING_1" } }),
      paragraph(6, "call\n", { bullet: { listId: "checks" } }),
      paragraph(11, "write\n", { bullet: { listId: "checks" } }, { strikethrough: true }),
      paragraph(17, "one\n", { bullet: { listId: "bullets" } }),
      paragraph(21, "nested\n", { bullet: { listId: "bullets", nestingLevel: 1 } }),
      paragraph(28, "first\n", { bullet: { listId: "numbers" } }),
      paragraph(
        34,
        "x = 1\n",
        {
          paragraphStyle: { namedStyleType: "NORMAL_TEXT", shading: { backgroundColor: { color: { rgbColor: {} } } } },
        },
        { weightedFontFamily: { fontFamily: "Roboto Mono" } },
      ),
      paragraph(40, "\n"),
    ],
  },
}

describe("readDoc", () => {
  it("reads native formatting back into blocks, with ticks from the export or a full strike", () => {
    const read = readDoc(document, [true, false])
    expect(read.placed.map((item) => item.block)).toEqual([
      { kind: "heading", level: 1, inlines: [{ text: "Plan" }] },
      { kind: "item", list: "check", depth: 0, checked: true, inlines: [{ text: "call" }] },
      { kind: "item", list: "check", depth: 0, checked: true, inlines: [{ text: "write" }] },
      { kind: "item", list: "bullet", depth: 0, inlines: [{ text: "one" }] },
      { kind: "item", list: "bullet", depth: 1, inlines: [{ text: "nested" }] },
      { kind: "item", list: "number", depth: 0, inlines: [{ text: "first" }] },
      { kind: "code", text: "x = 1" },
    ])
    expect(read).toMatchObject({ revisionId: "rev-1", end: 40, needsTrailingParagraph: false, suggestions: false })
  })

  it("ignores export ticks that do not line up with the Doc's checklist", () => {
    const read = readDoc(document, [true])
    expect(read.placed[1]?.block).toMatchObject({ checked: false })
  })

  it("notices pending suggestions", () => {
    const suggested = structuredClone(document)
    const target = suggested.body.content[1]
    if (!target || !("paragraph" in target)) throw new Error("missing paragraph")
    Object.assign(target.paragraph.elements[0]?.textRun ?? {}, { suggestedInsertionIds: ["suggest.1"] })
    expect(readDoc(suggested).suggestions).toBe(true)
  })
})

describe("representable", () => {
  it("drops what a Doc cannot hold, so an unchanged block compares equal after a round trip", async () => {
    expect(
      representable(
        await markdownBlocks(
          "```js\nx\n```\n\n![logo](./logo.png)\n\n![web](https://example.invalid/a.png)\n\n- [ ] ~~done~~\n",
        ),
      ),
    ).toEqual([
      { kind: "code", text: "x" },
      { kind: "paragraph", inlines: [{ text: "![logo](./logo.png)" }] },
      { kind: "image", url: "https://example.invalid/a.png", alt: "" },
      { kind: "item", list: "check", depth: 0, checked: true, inlines: [{ text: "done" }] },
    ])
  })
})

describe("insertRequests", () => {
  it("inserts a list as one bullet group, nested by tabs, with checked items struck", async () => {
    const requests = insertRequests(representable(await markdownBlocks("- [x] call\n- [ ] write\n  - [ ] draft\n")), 5)
    expect(requests[0]).toEqual({ insertText: { location: { index: 5 }, text: "call\nwrite\n\tdraft\n" } })
    expect(requests).toContainEqual({
      updateTextStyle: {
        range: { startIndex: 5, endIndex: 9 },
        textStyle: { strikethrough: true },
        fields: "strikethrough",
      },
    })
    expect(requests.at(-1)).toEqual({
      createParagraphBullets: { range: { startIndex: 5, endIndex: 23 }, bulletPreset: "BULLET_CHECKBOX" },
    })
  })

  it("inserts later blocks first at the same index", async () => {
    const requests = insertRequests(await markdownBlocks("# A\n\nb\n"), 1)
    const inserts = requests.flatMap((request) => ("insertText" in request ? [request.insertText] : []))
    expect(inserts).toEqual([
      { location: { index: 1 }, text: "b\n" },
      { location: { index: 1 }, text: "A\n" },
    ])
  })
})

describe("editRequests", () => {
  it("rewrites only the changed block, from the end of the Doc backwards", async () => {
    const read = readDoc(document, [true, false])
    const next = read.placed.map((item) => item.block)
    next[5] = { kind: "item", list: "number", depth: 0, inlines: [{ text: "first, changed" }] }
    const requests = editRequests(read, next)
    expect(requests[0]).toEqual({ deleteContentRange: { range: { startIndex: 28, endIndex: 34 } } })
    expect(requests[1]).toEqual({ insertText: { location: { index: 28 }, text: "first, changed\n" } })
    expect(requests.filter((request) => "deleteContentRange" in request)).toHaveLength(1)
  })

  it("does nothing when the Doc already matches", () => {
    const read = readDoc(document, [true, false])
    expect(
      editRequests(
        read,
        read.placed.map((item) => item.block),
      ),
    ).toEqual([])
  })

  it("opens an empty last paragraph before appending to a Doc that ends in text", () => {
    const read = readDoc({ body: { content: [paragraph(1, "only\n")] } })
    expect(read.needsTrailingParagraph).toBe(true)
    const requests = editRequests(read, [...read.placed.map((item) => item.block), { kind: "rule" }])
    expect(requests[0]).toEqual({ insertText: { location: { index: 5 }, text: "\n" } })
    expect(requests[1]).toEqual({ insertText: { location: { index: 6 }, text: "\n" } })
  })
})
