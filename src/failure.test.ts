import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { CliError, captureStreams, errorObjectOf } from "@wirecat/cli-base"
import { BASE_REASONS, type ErrorObject } from "@wirecat/cli-base/standards"
import { CORE_REASONS, failureContext } from "@wirecat/cli-core"
import { describe, expect, it } from "vitest"
import { readConfig, writeConfig } from "./config.js"
import type { GoogleApi } from "./google-api.js"
import { type ProgramOptions, run } from "./program.js"
import { REASONS } from "./reasons.js"
import { fixture } from "./testing.js"

const failing = (error: unknown): GoogleApi => ({
  call: async () => {
    throw error
  },
})

const drive = async (args: string[], api?: GoogleApi, env = fixture().env, index?: ProgramOptions["index"]) => {
  const streams = captureStreams()
  const exit = await run(args, { env, streams, tty: false, ...(api ? { api } : {}), ...(index ? { index } : {}) })
  const lines = streams.stderr.join("\n").trim().split("\n")
  return { exit, error: JSON.parse(lines[0] ?? "{}").error, lines }
}

const GET = ["default", "api", "call", "drive.files.get", "--params", '{"fileId":"synthetic"}', "--json"]
const LIST = ["default", "documents", "list", "--json"]
const crashing = (message: string) => async () => {
  throw new Error(message)
}

describe("failure handler", () => {
  it("reports a crash as internal_error without its own text", async () => {
    const { exit, error, lines } = await drive(LIST, undefined, undefined, crashing("token=secret-value"))
    expect(exit).toBe(1)
    expect(error).toMatchObject({ code: "internal_error", message: "the command failed; this is a bug" })
    expect(lines.join("\n")).not.toContain("secret-value")
  })

  it("calls a transient failure safe to retry only for a command that writes nothing", async () => {
    const unavailable = failing(new CliError("provider_unavailable", "Google did not answer"))
    expect((await drive(["default", "files", "get", "synthetic", "--json"], unavailable)).error.retry).toEqual({
      safe: true,
    })
    const copy = ["default", "files", "copy", "synthetic", "--json"]
    expect((await drive(copy, unavailable)).error.retry).toEqual({ safe: false })
  })

  it("prints the whole record after the object under --debug", async () => {
    const { lines } = await drive([...LIST, "--debug"], undefined, undefined, crashing("boom"))
    expect(JSON.parse(lines.at(-1) ?? "{}")).toMatchObject({
      severity: "error",
      attributes: { thrown_message: "boom" },
      resource: { service: "drive" },
    })
  })

  it("keeps a registered reason and its details", async () => {
    const { env } = fixture()
    const config = readConfig(env)
    writeConfig(env, { ...config, defaults: { permissions: { "files.copy": "deny" } } })
    const { exit, error } = await drive(["default", "files", "copy", "synthetic", "--json"], undefined, env)
    expect(exit).toBe(5)
    expect(error).toMatchObject({ reason: "policy.denied", details: { permission: "files.copy" } })
  })

  it("names the cause of a parse failure: unknown command, missing argument, missing option", async () => {
    const message = async (args: string[]) => (await drive([...args, "--json"])).error
    expect(await message(["default", "serch", "foo"])).toMatchObject({
      code: "validation_error",
      message: expect.stringContaining("unknown command 'serch' (Did you mean search?)"),
    })
    expect((await message(["default", "search"])).message).toBe("missing required argument 'query'")
    expect((await message(["default", "documents", "export", "DOC_ID"])).message).toBe(
      "required option '--output <file>' not specified",
    )
  })

  it("tells an agent that the sign-in expired", async () => {
    const expired = new CliError("authentication_error", "Google sign-in expired", { reason: "sign-in.expired" })
    let failure: ErrorObject | undefined
    await run(GET, {
      env: fixture().env,
      streams: captureStreams(),
      api: failing(expired),
      agent: { result: () => {}, failure: (object) => (failure = object) },
    })
    expect(failure?.error).toMatchObject({ code: "authentication_error", reason: "sign-in.expired" })
  })

  it("registers every reason drive raises", () => {
    const known = new Set([...REASONS, ...BASE_REASONS, ...CORE_REASONS].map((entry) => entry.reason))
    const raised = readdirSync("src", { recursive: true, encoding: "utf8" })
      .filter((file) => file.endsWith(".ts") && !file.endsWith(".test.ts") && !file.startsWith("generated"))
      .flatMap((file) =>
        [...readFileSync(join("src", file), "utf8").matchAll(/reason: "([a-z][a-z0-9-]*(?:\.[a-z][a-z0-9-]*)+)"/g)].map(
          (match) => match[1],
        ),
      )
    expect(raised.length).toBeGreaterThan(20)
    expect(raised.filter((reason) => !known.has(reason as string))).toEqual([])
  })
})

it("retains shared Core reasons and their declared details", () => {
  const failure = new CliError("not_found", "fixture model unavailable", {
    reason: "model.not-downloaded",
    model: "fixture-model",
  })
  expect(errorObjectOf(failure, failureContext({ reasons: REASONS }))).toMatchObject({
    error: { code: "not_found", reason: "model.not-downloaded", details: { model: "fixture-model" } },
  })
})
