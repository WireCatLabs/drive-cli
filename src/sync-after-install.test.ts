import { readFileSync } from "node:fs"
import { join } from "node:path"
import { captureStreams } from "@wirecat/cli-base"
import { syncAfterInstallCases } from "@wirecat/cli-core/testing"
import { describe, it } from "vitest"
import { readConfig, writeConfig } from "./config.js"
import { run } from "./program.js"
import { fixture } from "./testing.js"

// The kit writes the profile's levels into a config of its own; they go into the fixture's, which holds the profile.
const LEVELS_DIR = "DRIVE_TEST_LEVELS_DIR"

describe("sync runs right after install, whatever the shared WireCat config holds", () => {
  for (const one of syncAfterInstallCases({
    sync: ["default", "sync"],
    profileLevels: { variable: LEVELS_DIR, keys: ["sync"] },
    run: async (argv, { [LEVELS_DIR]: levels, ...env }) => {
      const f = fixture()
      if (levels) {
        const own = JSON.parse(readFileSync(join(levels, "config.json"), "utf8"))
        const config = readConfig(f.env)
        const profile = config.profiles?.default
        if (!profile) throw new Error("the fixture has no default profile")
        profile.permissions = own.profiles.default.permissions
        writeConfig(f.env, config)
      }
      const streams = captureStreams()
      const code = await run(argv, {
        env: { ...f.env, ...env },
        streams,
        tty: false,
        source: async () => f.source,
        index: async () => f.index,
      })
      return { code, err: streams.stderr.join("") }
    },
  }))
    it(one.name, () => one.run())
})
