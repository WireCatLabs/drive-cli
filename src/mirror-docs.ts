import { readFileSync } from "node:fs"
import { isCliError } from "@wirecat/cli-base"
import {
  type Block,
  blockKey,
  blocksMarkdown,
  diffBlocks,
  type Inline,
  type Keep,
  type ListKind,
  type LocalDocument,
  markdownBlocks,
  mergeBlocks,
  normalizeInlines,
  type Prepared,
  type Pushed,
  spliceMarkdown,
} from "@wirecat/cli-core/documents"
import { type ImageOptions, isWeb, localImage, serveImages } from "./mirror-images.js"
import { type Call, lastChange } from "./mirror-sheets.js"

/** The local image a Doc's image was inserted from: Google keeps only the one-off address it fetched. */
export interface LocalImageRef {
  url: string
  alt: string
}

export interface DocSnapshot {
  kind: "doc"
  /** The Doc's blocks as read back after the last push. */
  written: Block[]
  /** The local file's blocks at the last push: a checklist tick follows the side that changed it. */
  local: Block[]
  /** Local images in the Doc, by the address Google fetched each from. */
  images?: Record<string, LocalImageRef>
}

// A line break inside a paragraph: Docs stores it as a vertical tab.
const LINE_BREAK = String.fromCharCode(11)
const MONO = "Roboto Mono"
const MONO_FONTS = new Set([MONO, "Courier New", "Consolas", "Source Code Pro", "Inconsolata"])
const BORDER = {
  color: { color: { rgbColor: { red: 0.8, green: 0.8, blue: 0.8 } } },
  width: { magnitude: 1, unit: "PT" },
  padding: { magnitude: 4, unit: "PT" },
  dashStyle: "SOLID",
}
const NO_BORDER = { width: { magnitude: 0, unit: "PT" }, padding: { magnitude: 0, unit: "PT" }, dashStyle: "SOLID" }
const SHADE = { color: { rgbColor: { red: 0.95, green: 0.95, blue: 0.95 } } }
const PRESETS: Record<ListKind, string> = {
  bullet: "BULLET_DISC_CIRCLE_SQUARE",
  number: "NUMBERED_DECIMAL_ALPHA_ROMAN",
  check: "BULLET_CHECKBOX",
}

const imageText = (image: LocalImageRef) => `![${image.alt}](${image.url})`

/**
 * What the push left on the local side: an image Google did not take counts as its text, so the next push sees
 * the image as a local change and tries again instead of settling on the text.
 */
const settled = (next: Block[], doc: ReadDoc): Block[] => {
  const inDoc = new Set(Object.values(doc.images).map((image) => image.url))
  return next.map((block) =>
    block.kind === "image" && !isWeb(block.url) && !inDoc.has(block.url)
      ? { kind: "paragraph", inlines: [{ text: imageText(block) }] }
      : block,
  )
}

/**
 * The local blocks as a Doc can hold them, so a block that is unchanged compares equal after a round trip:
 * a code block's language and a web image's alt text cannot be stored, a local image that cannot be inserted
 * becomes its Markdown as text, a line break inside a table cell becomes a space, and a checklist item whose
 * whole text is struck is a checked one (the Doc writes checked items that way).
 */
export const representableWith =
  (insertable: (url: string) => boolean) =>
  (blocks: Block[]): Block[] =>
    blocks.map((block): Block => representBlock(block, insertable))

export const representable = representableWith(() => false)

const representBlock = (block: Block, insertable: (url: string) => boolean): Block => {
  switch (block.kind) {
    case "code":
      return { kind: "code", text: block.text }
    case "image":
      if (isWeb(block.url)) return { kind: "image", url: block.url, alt: "" }
      return insertable(block.url)
        ? { kind: "image", url: block.url, alt: block.alt }
        : { kind: "paragraph", inlines: [{ text: imageText(block) }] }
    case "table": {
      const cell = (inlines: Inline[]) =>
        normalizeInlines(inlines.map((inline) => ({ ...inline, text: inline.text.replace(/\n/g, " ") })))
      return { kind: "table", header: block.header.map(cell), rows: block.rows.map((row) => row.map(cell)) }
    }
    case "item": {
      if (block.list !== "check") return block
      const inlines = normalizeInlines(block.inlines)
      const struck = inlines.length > 0 && inlines.every((inline) => inline.strike)
      return struck
        ? { ...block, checked: true, inlines: inlines.map(({ strike: _, ...rest }) => rest) }
        : { ...block, checked: Boolean(block.checked) }
    }
    default:
      return block
  }
}

/**
 * How this file's blocks look in its Doc. A local image is an image once it is in the Doc, or when it can be
 * served now; otherwise its Markdown stays as text, and a reason is warned once.
 */
const representation = (file: LocalDocument, known: Record<string, LocalImageRef>, images?: ImageOptions) => {
  const inDoc = new Set(Object.values(known).map((image) => image.url))
  const verdicts = new Map<string, boolean>()
  return representableWith((url) => {
    if (inDoc.has(url)) return true
    if (!images?.host) return false
    let verdict = verdicts.get(url)
    if (verdict === undefined) {
      const found = localImage(file, url)
      verdict = !("reason" in found)
      if ("reason" in found) images.warn(`${file.path}: image ${url} ${found.reason}; it stays as text in the Doc`)
      verdicts.set(url, verdict)
    }
    return verdict
  })
}

const sameBlocks = (a: Block[], b: Block[]) =>
  a.length === b.length && a.every((block, index) => blockKey(block) === blockKey(b[index] as Block))

interface TextStyle {
  bold?: boolean
  italic?: boolean
  strikethrough?: boolean
  link?: { url?: string }
  weightedFontFamily?: { fontFamily?: string }
}
interface ParagraphElement {
  startIndex?: number
  endIndex?: number
  textRun?: {
    content?: string
    textStyle?: TextStyle
    suggestedInsertionIds?: string[]
    suggestedDeletionIds?: string[]
  }
  inlineObjectElement?: { inlineObjectId?: string }
}
interface Paragraph {
  elements?: ParagraphElement[]
  paragraphStyle?: {
    namedStyleType?: string
    shading?: { backgroundColor?: { color?: unknown } }
    borderLeft?: { width?: { magnitude?: number } }
    borderBottom?: { width?: { magnitude?: number } }
  }
  bullet?: { listId?: string; nestingLevel?: number }
  suggestedParagraphStyleChanges?: unknown
  suggestedBulletChanges?: unknown
}
interface StructuralElement {
  startIndex?: number
  endIndex?: number
  paragraph?: Paragraph
  table?: { tableRows?: { tableCells?: { content?: StructuralElement[] }[] }[] }
  sectionBreak?: unknown
  tableOfContents?: unknown
}
interface DocsDocument {
  revisionId?: string
  body?: { content?: StructuralElement[] }
  lists?: Record<string, { listProperties?: { nestingLevels?: { glyphType?: string; glyphSymbol?: string }[] } }>
  inlineObjects?: Record<
    string,
    { inlineObjectProperties?: { embeddedObject?: { imageProperties?: { sourceUri?: string } } } }
  >
}
/** A block read from the Doc, with the index range it occupies. */
export interface Placed {
  block: Block
  start: number
  end: number
}
export interface ReadDoc {
  revisionId: string
  placed: Placed[]
  /** Where text goes to land after every block: the start of the Doc's last, empty paragraph. */
  end: number
  /** True when the last paragraph holds text, so an append must first open an empty one. */
  needsTrailingParagraph: boolean
  suggestions: boolean
  /** The local images found in the Doc, by the address Google fetched each from. */
  images: Record<string, LocalImageRef>
}

const inlinesOf = (elements: ParagraphElement[]): Inline[] =>
  normalizeInlines(
    elements.flatMap((element): Inline[] => {
      const run = element.textRun
      if (!run?.content) return []
      const style = run.textStyle ?? {}
      const inline: Inline = { text: run.content.replace(/\n$/, "").replaceAll(LINE_BREAK, "\n") }
      if (style.bold) inline.bold = true
      if (style.italic) inline.italic = true
      if (style.strikethrough) inline.strike = true
      if (style.weightedFontFamily?.fontFamily && MONO_FONTS.has(style.weightedFontFamily.fontFamily))
        inline.code = true
      if (style.link?.url) inline.link = style.link.url
      return [inline]
    }),
  )
const plain = (inlines: Inline[]) => inlines.map((inline) => inline.text).join("")
const listKind = (document: DocsDocument, listId: string, level: number): ListKind => {
  const glyph = document.lists?.[listId]?.listProperties?.nestingLevels?.[level]
  if (glyph?.glyphSymbol) return "bullet"
  if (glyph?.glyphType && glyph.glyphType !== "GLYPH_TYPE_UNSPECIFIED" && glyph.glyphType !== "NONE") return "number"
  return "check"
}
const hasSuggestion = (paragraph: Paragraph) =>
  Boolean(paragraph.suggestedParagraphStyleChanges || paragraph.suggestedBulletChanges) ||
  (paragraph.elements ?? []).some(
    (element) => element.textRun?.suggestedInsertionIds?.length || element.textRun?.suggestedDeletionIds?.length,
  )

/** The Doc as blocks. `ticks` are the checklist ticks Google's Markdown export shows, in document order. */
export const readDoc = (
  document: DocsDocument,
  ticks: boolean[] = [],
  known: Record<string, LocalImageRef> = {},
): ReadDoc => {
  const content = document.body?.content ?? []
  const placed: Placed[] = []
  const images: Record<string, LocalImageRef> = {}
  let suggestions = false
  let tick = 0
  const checkCount = content.filter((element) => {
    const bullet = element.paragraph?.bullet
    return bullet?.listId && listKind(document, bullet.listId, bullet.nestingLevel ?? 0) === "check"
  }).length
  const useTicks = ticks.length === checkCount
  for (const element of content) {
    const start = element.startIndex ?? 0
    const end = element.endIndex ?? start
    if (element.table) {
      const cell = (cellContent: StructuralElement[] = []) =>
        normalizeInlines(
          cellContent.flatMap((part, index) => {
            const inlines = part.paragraph ? inlinesOf(part.paragraph.elements ?? []) : []
            return index > 0 && inlines.length ? [{ text: " " }, ...inlines] : inlines
          }),
        )
      const rows = (element.table.tableRows ?? []).map((row) => (row.tableCells ?? []).map((c) => cell(c.content)))
      placed.push({ block: { kind: "table", header: rows[0] ?? [], rows: rows.slice(1) }, start, end })
      continue
    }
    const paragraph = element.paragraph
    if (!paragraph) continue
    if (hasSuggestion(paragraph)) suggestions = true
    const elements = paragraph.elements ?? []
    const style = paragraph.paragraphStyle ?? {}
    const inlines = inlinesOf(elements)
    const image = elements.find((part) => part.inlineObjectElement)?.inlineObjectElement?.inlineObjectId
    let block: Block | undefined
    if (paragraph.bullet?.listId) {
      const depth = paragraph.bullet.nestingLevel ?? 0
      const list = listKind(document, paragraph.bullet.listId, depth)
      if (list === "check") {
        const struck = inlines.length > 0 && inlines.every((inline) => inline.strike)
        const checked = (useTicks && ticks[tick]) || struck
        tick++
        block = {
          kind: "item",
          list,
          depth,
          checked: Boolean(checked),
          inlines: checked ? inlines.map(({ strike: _, ...rest }) => rest) : inlines,
        }
      } else block = { kind: "item", list, depth, inlines }
    } else if (image && !plain(inlines).trim()) {
      const url = document.inlineObjects?.[image]?.inlineObjectProperties?.embeddedObject?.imageProperties?.sourceUri
      const local = url ? known[url] : undefined
      if (url && local) images[url] = local
      block = local ? { kind: "image", ...local } : url ? { kind: "image", url, alt: "" } : undefined
    } else if (/^HEADING_[1-6]$/.test(style.namedStyleType ?? "")) {
      block = { kind: "heading", level: Number(style.namedStyleType?.at(-1)) as 1, inlines }
    } else if (style.shading?.backgroundColor?.color && inlines.length && inlines.every((inline) => inline.code)) {
      const text = plain(inlines)
      const last = placed.at(-1)
      if (last?.block.kind === "code" && last.end === start) {
        last.block = { kind: "code", text: `${last.block.text}\n${text}` }
        last.end = end
        continue
      }
      block = { kind: "code", text }
    } else if (!plain(inlines) && style.borderBottom?.width?.magnitude) block = { kind: "rule" }
    else if (style.borderLeft?.width?.magnitude && inlines.length) block = { kind: "quote", inlines }
    else if (inlines.length) block = { kind: "paragraph", inlines }
    if (block) placed.push({ block, start, end })
  }
  const last = content.at(-1)
  const lastEmpty = Boolean(last?.paragraph && !plain(inlinesOf(last.paragraph.elements ?? [])).trim())
  const endIndex = last?.endIndex ?? 2
  return {
    revisionId: document.revisionId ?? "",
    placed,
    end: lastEmpty ? (last?.startIndex ?? endIndex - 1) : endIndex - 1,
    needsTrailingParagraph: !lastEmpty,
    suggestions,
    images,
  }
}

type Request = Record<string, unknown>
const RESET_TEXT = "bold,italic,strikethrough,link,weightedFontFamily"
const PLAIN_PARAGRAPH = {
  paragraphStyle: {
    namedStyleType: "NORMAL_TEXT",
    shading: { backgroundColor: {} },
    borderLeft: NO_BORDER,
    borderBottom: NO_BORDER,
    indentStart: { magnitude: 0, unit: "PT" },
    indentFirstLine: { magnitude: 0, unit: "PT" },
  },
  fields: "namedStyleType,shading,borderLeft,borderBottom,indentStart,indentFirstLine",
}

const textRequests = (inlines: Inline[], at: number, extra: { strike?: boolean; code?: boolean } = {}): Request[] => {
  const requests: Request[] = []
  let offset = at
  for (const inline of inlines) {
    const length = inline.text.length
    const range = { startIndex: offset, endIndex: offset + length }
    const style: Record<string, unknown> = {
      ...(inline.bold ? { bold: true } : {}),
      ...(inline.italic ? { italic: true } : {}),
      ...(inline.strike || extra.strike ? { strikethrough: true } : {}),
      ...(inline.code || extra.code ? { weightedFontFamily: { fontFamily: MONO } } : {}),
      ...(inline.link ? { link: { url: inline.link } } : {}),
    }
    const fields = Object.keys(style)
    if (fields.length && length)
      requests.push({ updateTextStyle: { range, textStyle: style, fields: fields.join(",") } })
    offset += length
  }
  return requests
}
const docText = (inlines: Inline[]) => inlines.map((inline) => inline.text.replaceAll("\n", LINE_BREAK)).join("")

/**
 * Requests that insert `blocks` before the paragraph starting at `at`. Blocks go in from last to first at the
 * same index, so no request needs to know how long the blocks after it became. Items in a row share one
 * `createParagraphBullets` (one list); it runs last because it strips the tabs that set nesting.
 */
export const insertRequests = (blocks: Block[], at: number): Request[] => {
  const groups: Block[][] = []
  for (const given of blocks) {
    // A local image goes in as its Markdown first; `placeImages` swaps it for the image in a batch of its own.
    const block: Block =
      given.kind === "image" && !isWeb(given.url) ? { kind: "paragraph", inlines: [{ text: imageText(given) }] } : given
    const last = groups.at(-1)
    const head = last?.[0]
    if (block.kind === "item" && head?.kind === "item" && head.list === block.list) last?.push(block)
    else groups.push([block])
  }
  const requests: Request[] = []
  for (const group of groups.reverse()) {
    const first = group[0] as Block
    if (first.kind === "table") {
      const columns = Math.max(first.header.length, ...first.rows.map((row) => row.length), 1)
      const rows = [first.header, ...first.rows]
      requests.push(
        { insertTable: { rows: rows.length, columns, location: { index: at } } },
        // The table comes with an empty paragraph before it that takes the style of whatever followed `at`.
        { updateParagraphStyle: { range: { startIndex: at, endIndex: at + 1 }, ...PLAIN_PARAGRAPH } },
        { deleteParagraphBullets: { range: { startIndex: at, endIndex: at + 1 } } },
      )
      // A table inserted at `at` starts one index later; each row adds 1 and each empty cell 2 (cell + paragraph).
      const cells: Request[][] = []
      rows.forEach((row, r) => {
        for (let c = 0; c < columns; c++) {
          const inlines = row[c] ?? []
          const index = at + 4 + r * (columns * 2 + 1) + c * 2
          if (docText(inlines))
            cells.push([
              { insertText: { location: { index }, text: docText(inlines) } },
              ...textRequests(inlines, index),
            ])
        }
      })
      requests.push(...cells.reverse().flat())
      continue
    }
    if (first.kind === "image") {
      requests.push(
        { insertText: { location: { index: at }, text: "\n" } },
        {
          updateParagraphStyle: {
            range: { startIndex: at, endIndex: at + 1 },
            paragraphStyle: { namedStyleType: "NORMAL_TEXT" },
            fields: "namedStyleType",
          },
        },
        { deleteParagraphBullets: { range: { startIndex: at, endIndex: at + 1 } } },
        { insertInlineImage: { location: { index: at }, uri: first.url } },
      )
      continue
    }
    const lines = group.map((block) => {
      if (block.kind === "item") return `${"\t".repeat(block.depth)}${docText(block.inlines)}`
      if (block.kind === "code") return block.text
      if (block.kind === "rule") return ""
      if (block.kind === "heading" || block.kind === "paragraph" || block.kind === "quote")
        return docText(block.inlines)
      return ""
    })
    const text = `${lines.join("\n")}\n`
    const range = { startIndex: at, endIndex: at + text.length }
    requests.push(
      { insertText: { location: { index: at }, text } },
      { updateTextStyle: { range, textStyle: {}, fields: RESET_TEXT } },
      {
        updateParagraphStyle: {
          range,
          paragraphStyle: {
            namedStyleType: first.kind === "heading" ? `HEADING_${first.level}` : "NORMAL_TEXT",
            shading: first.kind === "code" ? { backgroundColor: SHADE } : { backgroundColor: {} },
            borderLeft: first.kind === "quote" ? BORDER : NO_BORDER,
            borderBottom: first.kind === "rule" ? BORDER : NO_BORDER,
            indentStart: { magnitude: first.kind === "quote" ? 36 : 0, unit: "PT" },
            indentFirstLine: { magnitude: 0, unit: "PT" },
          },
          fields: "namedStyleType,shading,borderLeft,borderBottom,indentStart,indentFirstLine",
        },
      },
    )
    // Text inserted before a list paragraph joins that list: clear it, so items start the list they belong to.
    requests.push({ deleteParagraphBullets: { range } })
    let offset = at
    group.forEach((block, index) => {
      const line = lines[index] ?? ""
      if (block.kind === "item") {
        const done = block.list === "check" && block.checked
        requests.push(...textRequests(block.inlines, offset + block.depth, done ? { strike: true } : {}))
      } else if (block.kind === "code") {
        if (line)
          requests.push({
            updateTextStyle: {
              range: { startIndex: offset, endIndex: offset + line.length },
              textStyle: { weightedFontFamily: { fontFamily: MONO } },
              fields: "weightedFontFamily",
            },
          })
      } else if (block.kind === "heading" || block.kind === "paragraph" || block.kind === "quote")
        requests.push(...textRequests(block.inlines, offset))
      offset += line.length + 1
    })
    if (first.kind === "item") requests.push({ createParagraphBullets: { range, bulletPreset: PRESETS[first.list] } })
  }
  return requests
}

/** One all-or-nothing request list that turns the Doc into `next`, hunk by hunk from the end. */
export const editRequests = (doc: ReadDoc, next: Block[]): Request[] => {
  const hunks = diffBlocks(
    doc.placed.map((item) => item.block),
    next,
  )
  const requests: Request[] = []
  let end = doc.end
  if (doc.needsTrailingParagraph && hunks.some((hunk) => hunk.from === doc.placed.length && hunk.blocks.length)) {
    requests.push({ insertText: { location: { index: end }, text: "\n" } })
    end += 1
  }
  for (const hunk of [...hunks].reverse()) {
    const start = doc.placed[hunk.from]?.start ?? end
    const stop = doc.placed[hunk.to]?.start ?? end
    if (stop > start) requests.push({ deleteContentRange: { range: { startIndex: start, endIndex: stop } } })
    requests.push(...insertRequests(hunk.blocks, start))
  }
  return requests
}

const exportTicks = async (call: Call, id: string): Promise<boolean[]> => {
  const markdown = await call("drive.files.export", { fileId: id, mimeType: "text/markdown" })
  if (typeof markdown !== "string") return []
  return (await markdownBlocks(markdown)).flatMap((block) =>
    block.kind === "item" && block.list === "check" ? [Boolean(block.checked)] : [],
  )
}
const fetchDoc = async (call: Call, id: string, known: Record<string, LocalImageRef> = {}): Promise<ReadDoc> => {
  const document = (await call("docs.documents.get", { documentId: id })) as DocsDocument
  return readDoc(document, await exportTicks(call, id), known)
}

/**
 * Swaps each local image's Markdown, written by the text batch, for the image itself. Google fetches the file
 * from a one-off address on the owner's tunnel, live only during this batch. It is a batch of its own, so an
 * image Google cannot fetch leaves the text written and the image as Markdown, with a warning.
 */
const placeImages = async (
  call: Call,
  id: string,
  file: LocalDocument,
  next: Block[],
  known: Record<string, LocalImageRef>,
  images?: ImageOptions,
): Promise<ReadDoc> => {
  const doc = await fetchDoc(call, id, known)
  const host = images?.host
  if (!host) return doc
  const pending = next.flatMap((block, index) =>
    block.kind === "image" && !isWeb(block.url) ? [{ block, index }] : [],
  )
  const wanted = pending.flatMap(({ block, index }) => {
    const placed = doc.placed[index]
    if (doc.placed.length !== next.length || placed?.block.kind !== "paragraph") return []
    if (placed.block.inlines.map((inline) => inline.text).join("") !== imageText(block)) return []
    const found = localImage(file, block.url)
    return "reason" in found ? [] : [{ image: { url: block.url, alt: block.alt }, placed, found }]
  })
  if (!wanted.length) return doc
  const learned: Record<string, LocalImageRef> = {}
  try {
    await serveImages(
      host,
      wanted.map((item) => item.found),
      async (urls) => {
        const requests = wanted
          .map(({ placed }, index) => [
            { deleteContentRange: { range: { startIndex: placed.start, endIndex: placed.end - 1 } } },
            { insertInlineImage: { location: { index: placed.start }, uri: urls[index] } },
          ])
          .reverse()
          .flat()
        await call(
          "docs.documents.batchUpdate",
          { documentId: id },
          { requests, writeControl: { requiredRevisionId: doc.revisionId } },
        )
        urls.forEach((url, index) => {
          learned[url] = (wanted[index] as (typeof wanted)[number]).image
        })
      },
    )
  } catch (error) {
    const why = isCliError(error) ? error.message : "Google did not take them"
    images.warn(`${file.path}: ${wanted.length} image(s) stay as text in the Doc: ${why}`)
    return doc
  }
  return fetchDoc(call, id, { ...known, ...learned })
}
const docUrl = (id: string) => `https://docs.google.com/document/d/${id}/edit`

export const createDoc = async (
  call: Call,
  input: { file: LocalDocument; name: string; parent: string; origin: string },
  images?: ImageOptions,
): Promise<Pushed<DocSnapshot>> => {
  const local = representation(input.file, {}, images)(await markdownBlocks(readFileSync(input.file.absolute, "utf8")))
  const created = (await call(
    "drive.files.create",
    { fields: "id,webViewLink", supportsAllDrives: true },
    {
      name: input.name.replace(/\.md$/i, ""),
      mimeType: "application/vnd.google-apps.document",
      parents: [input.parent],
      appProperties: { wirecatOrigin: input.origin },
    },
  )) as { id: string; webViewLink?: string }
  const empty = await fetchDoc(call, created.id)
  const requests = editRequests(empty, local)
  if (requests.length)
    await call(
      "docs.documents.batchUpdate",
      { documentId: created.id },
      { requests, writeControl: { requiredRevisionId: empty.revisionId } },
    )
  const written = await placeImages(call, created.id, input.file, local, {}, images)
  return {
    id: created.id,
    url: created.webViewLink ?? docUrl(created.id),
    snapshot: {
      kind: "doc",
      written: written.placed.map((item) => item.block),
      local: settled(local, written),
      images: written.images,
    },
  }
}

/** A Doc found after a crash holds what Google has; the push then writes the local file over it. */
export const recoveredDoc = async (call: Call, id: string): Promise<DocSnapshot> => {
  const doc = await fetchDoc(call, id)
  const blocks = doc.placed.map((item) => item.block)
  return { kind: "doc", written: blocks, local: blocks }
}

/**
 * Merges the Doc and the local file against what the last sync left on both. Google's changes are spliced into
 * the Markdown, the file's changes become block edits; a part both changed is a conflict unless `keep` settles it.
 */
export const prepareDoc = async (
  call: Call,
  input: { id: string; url: string; file: LocalDocument; recorded: DocSnapshot; keep?: Keep },
  images?: ImageOptions,
): Promise<Prepared<DocSnapshot>> => {
  const { id, recorded, keep } = input
  const known = recorded.images ?? {}
  const doc = await fetchDoc(call, id, known)
  // Suggested text reads as if it were accepted; it must neither reach the file nor be written over.
  if (doc.suggestions) return { conflict: "the Doc has pending suggestions; accept or reject them in Google first" }
  const text = readFileSync(input.file.absolute, "utf8")
  const represent = representation(input.file, known, images)
  const local = represent(await markdownBlocks(text))
  const current = doc.placed.map((item) => item.block)
  const merged = mergeBlocks(recorded.local, recorded.written, local, current, keep)
  let next: Block[]
  if (merged.status === "unaligned") {
    if (!keep)
      return {
        conflict: "the Doc no longer matches what the last sync wrote; choose a side with --keep",
        remote: await lastChange(call, id),
      }
    next = keep === "local" ? local : keep === "remote" ? current : [...local, ...current]
  } else if (merged.status === "conflict")
    return {
      conflict: "the same part changed here and in Google",
      parts: merged.conflicts.map((part) => ({
        base: blocksMarkdown(part.base),
        local: blocksMarkdown(part.local),
        remote: blocksMarkdown(part.remote),
      })),
      remote: await lastChange(call, id),
    }
  else next = merged.blocks

  let content: string | undefined
  if (!sameBlocks(local, next)) {
    content = await spliceMarkdown(text, next, represent)
    if (content === undefined)
      return {
        conflict: "Google's changes cannot be written into the Markdown file without changing other lines",
        remote: await lastChange(call, id),
      }
  }
  const requests = editRequests(doc, next)
  const pushed = (written: ReadDoc): Pushed<DocSnapshot> => ({
    id,
    url: input.url,
    snapshot: {
      kind: "doc",
      written: written.placed.map((item) => item.block),
      local: settled(next, written),
      images: written.images,
    },
  })
  if (!requests.length && content === undefined) return { unchanged: pushed(doc) }
  return {
    ...(content === undefined
      ? {}
      : { local: content, afterLocal: { kind: "doc" as const, written: current, local: current, images: doc.images } }),
    remote: requests.length > 0,
    write: async () => {
      if (!requests.length) return pushed(doc)
      await call(
        "docs.documents.batchUpdate",
        { documentId: id },
        { requests, writeControl: { requiredRevisionId: doc.revisionId } },
      )
      return pushed(await placeImages(call, id, input.file, next, known, images))
    },
  }
}
