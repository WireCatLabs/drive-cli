import { captureStreams, memoryKeyring } from "@wirecat/cli-base"
import { describe, expect, it } from "vitest"
import { commandResult, testProgram as createProgram, fixture } from "./testing.js"
import { saveSession } from "./tokens.js"

const status = async (env: NodeJS.ProcessEnv, keyring: ReturnType<typeof memoryKeyring>, profile: string) => {
  const streams = captureStreams()
  await createProgram({ env, keyring, streams }).parseAsync([profile, "session", "status", "--json"], {
    from: "user",
  })
  return commandResult(streams.stdout.join(""))
}

describe("drive session status", () => {
  it("says the profile is signed in, as which account and with which grants, asking Google nothing", async () => {
    const f = fixture()
    const keyring = memoryKeyring()
    saveSession(
      f.env,
      "default",
      {
        principal: "synthetic-principal",
        clientId: "fixture-client",
        tokens: { refresh_token: "fixture-refresh-token", scope: "https://www.googleapis.com/auth/drive.readonly" },
      },
      "keyring",
      keyring,
    )

    expect(await status(f.env, keyring, "default")).toEqual({
      profile: "default",
      signed_in: true,
      account: "synthetic-principal",
      storage: "keyring",
      scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    })
  })

  it("says a profile with no sign-in here, or none at all, is signed out", async () => {
    const f = fixture()
    const keyring = memoryKeyring()

    expect(await status(f.env, keyring, "default")).toEqual({
      profile: "default",
      signed_in: false,
      account: "synthetic-principal",
      storage: "keyring",
    })
    expect(await status(f.env, keyring, "fresh")).toEqual({ profile: "fresh", signed_in: false, account: null })
  })
})
