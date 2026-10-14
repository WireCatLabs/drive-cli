import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { CliError, captureStreams } from "@wirecat/cli-base"
import { BASE_REASONS } from "@wirecat/cli-base/standards"
import { CommanderError } from "commander"
import { describe, expect, it } from "vitest"
import { errorObject, mcpFailure, REASONS, reportFailure } from "./failure.js"
import { createProgram } from "./program.js"

const report = (error: unknown, args: string[] = [], tty = false) => {
  const streams = captureStreams()
  const exit = reportFailure(error, { args, program: createProgram({ streams }), streams, tty })
  return { exit, text: streams.stderr.join("") }
}

describe("failure handler", () => {
  it("reports a crash as internal_error without its own text", () => {
    const { exit, text } = report(new Error("token=secret-value"), ["default", "status", "--json"])
    expect(exit).toBe(1)
    expect(JSON.parse(text)).toEqual({
      error: {
        code: "internal_error",
        reason: "command.crashed",
        message: "the command failed; this is a bug",
        retry: { safe: false },
      },
    })
    expect(text).not.toContain("secret-value")
  })

  it("prints the whole record after the object under --debug", () => {
    const { text } = report(new Error("boom"), ["default", "status", "--json", "--debug"])
    const [object, record] = text
      .trim()
      .split("\n")
      .map((line) => JSON.parse(line))
    expect(object.error.code).toBe("internal_error")
    expect(record).toMatchObject({
      severity: "error",
      command: "status",
      attributes: { thrown_message: "boom" },
      resource: { service: "drive" },
    })
  })

  it("keeps a registered reason and its details", () => {
    const denied = new CliError("permission_error", "profile policy refuses this operation", {
      reason: "policy.denied",
      permission: "files.copy",
    })
    const { exit, text } = report(denied, ["--json"])
    expect(exit).toBe(5)
    expect(JSON.parse(text).error).toMatchObject({ reason: "policy.denied", details: { permission: "files.copy" } })
  })

  it("answers a parse failure as validation_error", () => {
    const { exit, text } = report(new CommanderError(1, "commander.unknownOption", "unknown option"), ["--json"])
    expect(exit).toBe(2)
    expect(JSON.parse(text).error).toMatchObject({ code: "validation_error", reason: "input.invalid" })
  })

  it("writes one line for a person at a terminal", () => {
    expect(report(new CliError("not_found", "nothing here"), ["default", "status"], true).text).toBe("✗ nothing here")
  })

  it("gives MCP the same object as the CLI", () => {
    const failure = new CliError("not_found", "nothing here")
    expect(mcpFailure(failure)).toMatchObject({ isError: true, structuredContent: errorObject(failure) })
  })

  it("registers every reason drive raises", () => {
    const known = new Set([...REASONS, ...BASE_REASONS].map((entry) => entry.reason))
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
  expect(errorObject(failure)).toMatchObject({
    error: { code: "not_found", reason: "model.not-downloaded", details: { model: "fixture-model" } },
  })
})
