import { existsSync, mkdtempSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { captureStreams } from "@wirecat/cli-base"
import { openStore } from "@wirecat/cli-core/store"
import { expect, it } from "vitest"
import { testProgram as createProgram } from "./testing.js"

const environment = () => {
  const directory = mkdtempSync(join(tmpdir(), "drive-test-store-info-"))
  return {
    DRIVE_CONFIG_DIR: join(directory, "config"),
    DRIVE_STATE_DIR: join(directory, "state"),
    WIRECAT_STATE_DIR: join(directory, "wirecat"),
    MESSAGING_STORE: join(directory, "wirecat.db"),
  }
}

const storeInfo = async (env: NodeJS.ProcessEnv) => {
  const streams = captureStreams()
  await createProgram({ env, streams }).parseAsync(["store", "info", "--json"], { from: "user" })
  return JSON.parse(streams.stdout.join("")).item
}

it("describes the shared store with no profile and without creating it", async () => {
  const env = environment()
  expect(await storeInfo(env)).toMatchObject({ exists: false, schema: { reason: "missing", writable: true } })
  expect(existsSync(env.MESSAGING_STORE)).toBe(false)
})

it("says the store is drive's own schema once drive has opened it", async () => {
  const env = environment()
  await (await openStore({ path: env.MESSAGING_STORE, env, command: "drive" })).close()
  const answer = await storeInfo(env)
  expect(answer.schema).toMatchObject({ reason: "current", upgrade: null })
  expect(answer.schema.version).toBe(answer.schema.speaks)
})
