import { expect, it } from "vitest"
import { documentTabs } from "./documents.js"

it("extracts sibling and nested tab text, tables and footnotes for shared search", () => {
  const tabs = documentTabs({
    tabs: [
      {
        tabProperties: { tabId: "main", title: "Main" },
        documentTab: { body: { content: [{ paragraph: { elements: [{ textRun: { content: "Main text\n" } }] } }] } },
        childTabs: [
          {
            tabProperties: { tabId: "child", title: "Nested" },
            documentTab: {
              body: {
                content: [
                  {
                    table: {
                      tableRows: [
                        {
                          tableCells: [
                            { content: [{ paragraph: { elements: [{ textRun: { content: "Hosting 120\n" } }] } }] },
                          ],
                        },
                      ],
                    },
                  },
                ],
              },
            },
          },
        ],
      },
      {
        tabProperties: { tabId: "second", title: "Second" },
        documentTab: {
          body: { content: [] },
          footnotes: { f: { content: [{ paragraph: { elements: [{ textRun: { content: "Footnote text\n" } }] } }] } },
        },
      },
    ],
  })
  expect(tabs.map((tab) => tab.id)).toEqual(["main", "child", "second"])
  expect(tabs[1]?.text).toContain("Hosting 120")
  expect(tabs[2]?.text).toContain("Footnote text")
})
