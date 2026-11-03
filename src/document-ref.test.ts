import { readFileSync } from "node:fs"
import { join, resolve } from "node:path"
import { DatabaseSync } from "node:sqlite"
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

it("refuses a bare number that is a document's ref, naming the ref", async () => {
  const f = await imported()
  const id = f.reference.slice("document:".length)
  for (const args of [
    ["documents", "show", id],
    ["documents", "context", id],
  ])
    await expect(run(f.env, args)).rejects.toMatchObject({
      code: "validation_error",
      details: { reason: "ref.bare-number" },
      message: expect.stringContaining(f.reference),
    })
})

it("reads a document's context and exports it by its ref", async () => {
  const f = await imported()
  expect((await run(f.env, ["documents", "context", f.reference])).item).toMatchObject({
    document: { ref: f.reference },
  })
  const output = join(f.directory, "harbour.md")
  await run(f.env, ["documents", "export", f.reference, "--output", output])
  expect(readFileSync(output, "utf8")).toContain("Synthetic harbour budget")
})

it("leaves drive's provider entry in the store, so other tools can say how to open a document ref", async () => {
  const f = await imported()
  await run(f.env, ["documents", "show", f.reference])
  const database = new DatabaseSync(f.env.MESSAGING_STORE as string, { readOnly: true })
  try {
    const row = database.prepare("SELECT value FROM store_settings WHERE key = 'providers'").get() as { value: string }
    expect(JSON.parse(row.value)).toContainEqual(
      expect.objectContaining({ name: "google-drive", command: "drive", opens: { document: "documents show" } }),
    )
  } finally {
    database.close()
  }
})

it("lists documents one line each with --compact", async () => {
  const f = await imported()
  const streams = captureStreams()
  await createProgram({ env: f.env, streams }).parseAsync(["default", "--offline", "documents", "list", "--compact"], {
    from: "user",
  })
  const lines = streams.stdout.join("").trim().split("\n")
  expect(lines.some((line) => line.startsWith(f.reference) && line.includes("Same name"))).toBe(true)
  expect(lines.join("\n")).not.toContain("{")
})
