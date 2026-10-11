import type { docs_v1 } from "@googleapis/docs"
import type { TabText } from "./model.js"

const elementsText = (elements: docs_v1.Schema$StructuralElement[]): string =>
  elements
    .map((element) => {
      if (element.paragraph)
        return (element.paragraph.elements ?? [])
          .map(
            (part) =>
              part.textRun?.content ??
              part.person?.personProperties?.name ??
              part.richLink?.richLinkProperties?.title ??
              "",
          )
          .join("")
      if (element.table)
        return `${(element.table.tableRows ?? [])
          .map((row) => (row.tableCells ?? []).map((cell) => elementsText(cell.content ?? []).trim()).join("\t"))
          .join("\n")}\n`
      if (element.tableOfContents) return elementsText(element.tableOfContents.content ?? [])
      return ""
    })
    .join("")

export const documentTabs = (document: docs_v1.Schema$Document): TabText[] => {
  const walk = (tabs: docs_v1.Schema$Tab[]): TabText[] =>
    tabs.flatMap((tab) => {
      const content = tab.documentTab
      const footnotes = Object.values(content?.footnotes ?? {})
        .map((footnote) => elementsText(footnote.content ?? []))
        .join("\n")
      return [
        {
          id: tab.tabProperties?.tabId ?? "",
          title: tab.tabProperties?.title ?? "",
          text: [elementsText(content?.body?.content ?? []), footnotes].filter(Boolean).join("\n"),
        },
        ...walk(tab.childTabs ?? []),
      ]
    })
  return walk(document.tabs ?? [])
}
