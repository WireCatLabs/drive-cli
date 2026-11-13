import { captureStreams } from "@wirecat/cli-base"
import { syncAfterInstallCases } from "@wirecat/cli-core/testing"
import { describe, it } from "vitest"
import { run } from "./program.js"
import { fixture } from "./testing.js"

describe("sync runs right after install, whatever the shared WireCat config holds", () => {
  for (const one of syncAfterInstallCases({
    sync: ["default", "sync"],
    run: async (argv, env) => {
      const f = fixture()
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
