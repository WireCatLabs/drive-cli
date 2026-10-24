import { mkdtempSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { levelFor } from "@wirecat/cli-core/sends"
import { expect, it } from "vitest"
import { policySettings } from "./policy.js"
import { fixture } from "./testing.js"

it('**the shared setup answer "read only" makes every profile read-only**, over its own allow', () => {
  const f = fixture()
  const shared = mkdtempSync(join(tmpdir(), "drive-setup-"))
  writeFileSync(join(shared, "config.json"), JSON.stringify({ setup: { permissions: "readonly" } }))
  const env = { ...f.env, WIRECAT_CONFIG_DIR: shared }
  const capped = policySettings(env, "default", { permission: [] })
  expect(capped.readOnly).toBe(true)
  expect(levelFor(capped.levels, "files.trash").level).toBe("readonly")
  writeFileSync(join(shared, "config.json"), JSON.stringify({ setup: { permissions: "allow" } }))
  expect(policySettings(env, "default").readOnly).toBe(false)
})
