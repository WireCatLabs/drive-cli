import { captureStreams } from "@wirecat/cli-base"
import { OAuth2Client } from "google-auth-library"
import { describe, expect, it } from "vitest"
import { googleError } from "./errors.js"
import { errorObject, mcpFailure, reportFailure } from "./failure.js"
import { googleApi } from "./google-api.js"

const info = {
  "@type": "type.googleapis.com/google.rpc.ErrorInfo",
  domain: "googleapis.com",
  reason: "SERVICE_DISABLED",
  metadata: { service: "sheets.googleapis.com", activationUrl: "https://example.invalid/DO_NOT_LOG" },
}
const refused = (payload: object, status = 403) => ({
  message: "DO_NOT_LOG",
  config: { headers: { Authorization: "Bearer DO_NOT_LOG" }, data: "DO_NOT_LOG" },
  response: { status, data: { error: { message: "DO_NOT_LOG", ...payload } } },
})

describe("Google API setup failures", () => {
  it.each([
    { errors: [{ reason: "accessNotConfigured" }] },
    { details: [info] },
    { details: [null, "DO_NOT_LOG", {}, info] },
  ])("distinguishes disabled APIs without copying provider values", (payload) => {
    const failure = googleError(refused(payload))
    expect(errorObject(failure).error).toMatchObject({
      code: "configuration_error",
      reason: "google-api.disabled",
      details: { status: 403 },
      retry: { safe: false },
    })
    expect(failure.message).toContain("OAuth project")
    expect(failure.message).toContain("API Library")
    expect(JSON.stringify(errorObject(failure))).not.toContain("DO_NOT_LOG")
  })

  it.each([
    {},
    { details: "DO_NOT_LOG" },
    { details: { reason: "SERVICE_DISABLED" } },
    { details: [null, false, "DO_NOT_LOG", {}] },
    { details: [{ ...info, domain: "unrelated.invalid" }] },
    { details: [{ ...info, "@type": "unrelated" }] },
    { details: [{ ...info, reason: "IAM_PERMISSION_DENIED" }] },
    { errors: [{ reason: "insufficientPermissions" }] },
  ])("keeps unrelated access failures separate", (payload) => {
    const failure = errorObject(googleError(refused(payload)))
    expect(failure.error).toMatchObject({ code: "permission_error", reason: "access.denied" })
    expect(JSON.stringify(failure)).not.toContain("DO_NOT_LOG")
  })

  it("does not reinterpret a different HTTP status as API setup", () => {
    expect(errorObject(googleError(refused({ details: [info] }, 401))).error.code).toBe("authentication_error")
  })

  it("preserves the registered error through SDK, CLI diagnostics and MCP", async () => {
    const auth = new OAuth2Client("synthetic-client")
    Object.defineProperty(auth, "request", {
      value: async () => {
        throw refused({ details: [info] })
      },
    })
    let failure: unknown
    try {
      await googleApi(auth).call("sheets.spreadsheets.get", { spreadsheetId: "synthetic-sheet" })
    } catch (error) {
      failure = error
    }
    expect(failure).toBeDefined()
    const streams = captureStreams()
    expect(
      reportFailure(failure, {
        args: ["verification", "sheets", "info", "synthetic-sheet", "--json", "--debug"],
        streams,
        tty: false,
      }),
    ).toBe(3)
    const [answer] = streams.stderr
      .join("")
      .trim()
      .split("\n")
      .map((line) => JSON.parse(line))
    expect(answer.error.reason).toBe("google-api.disabled")
    expect(JSON.stringify(mcpFailure(failure))).toContain("google-api.disabled")
    expect(JSON.stringify({ stdout: streams.stdout, stderr: streams.stderr, mcp: mcpFailure(failure) })).not.toContain(
      "DO_NOT_LOG",
    )
  })
})
