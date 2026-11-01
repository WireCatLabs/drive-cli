import { resolve } from "node:path"
import { captureStreams } from "@wirecat/cli-base"
import { expect, it } from "vitest"
import { saveSnapshot, saveState } from "./state.js"
import { openIndex } from "./store.js"
import { content, testProgram as createProgram, file, fixture } from "./testing.js"

const principal = "synthetic-principal"
const run = async (env: NodeJS.ProcessEnv, args: string[]) => {
  const streams = captureStreams()
  await createProgram({
    env,
    streams,
    source: async () => {
      throw new Error("synthetic check refuses Google")
    },
  }).parseAsync(["default", "--offline", ...args, "--json"], { from: "user" })
  return JSON.parse(streams.stdout.join(""))
}
const imported = async () => {
  const f = fixture()
  const document = content(file("SyntheticDoc_Ref"), "Synthetic harbour budget")
  const index = await openIndex(f.env)
  let reference: string
  try {
    reference = await index.save(principal, document, "synthetic-hash")
  } finally {
    await index.close()
  }
  saveSnapshot(f.env, "default", document)
  saveState(f.env, "default", {
    version: 1,
    principal,
    store: resolve(f.env.MESSAGING_STORE as string),
    scope: "",
    folders: {},
    documents: {
      [document.metadata.id]: { metadata: document.metadata, hash: "synthetic-hash", reference, tabs: 0 },
    },
    skipped: [],
  })
  return { ...f, reference }
}

it("shows the document a search hit's ref names, offline, from the local copy", async () => {
  const f = await imported()
  const found = await run(f.env, ["search", "harbour", "--exact"])
  const ref = found.item.hits[0].ref
  expect(ref).toBe(f.reference)
  expect(ref).toMatch(/^document:\d+$/)
  expect((await run(f.env, ["documents", "show", ref])).item).toMatchObject({
    metadata: { id: "SyntheticDoc_Ref" },
    text: "Synthetic harbour budget",
  })
})

it("refuses a document ref the selected profile has not imported", async () => {
  const f = await imported()
  await expect(run(f.env, ["documents", "show", "document:999999"])).rejects.toMatchObject({ code: "not_found" })
})
