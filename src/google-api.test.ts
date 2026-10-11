import { OAuth2Client } from "google-auth-library"
import { describe, expect, it, vi } from "vitest"
import { apiMethod, apiMethods, googleApi, validateApiParams } from "./google-api.js"
import { jsonObject } from "./remote-commands.js"
import { ACTIVITY_SCOPE, checkAuthorization, READ_SCOPE, WRITE_SCOPE } from "./tokens.js"

describe("official SDK method surface", () => {
  it("discovers read, write and destructive methods across the three official clients", () => {
    expect(apiMethods().length).toBeGreaterThan(50)
    expect(apiMethod("docs.documents.batchUpdate")).toMatchObject({ mutates: true, scope: WRITE_SCOPE })
    expect(apiMethod("drive.files.delete")).toMatchObject({ destructive: true })
    expect(apiMethod("drive.files.emptyTrash")).toMatchObject({ destructive: true })
    expect(apiMethod("drive.files.generateIds")).toMatchObject({ scope: WRITE_SCOPE })
    expect(apiMethod("drive.apps.list").scope).toBe("https://www.googleapis.com/auth/drive.apps.readonly")
    expect(apiMethod("driveactivity.activity.query")).toMatchObject({ mutates: false, scope: ACTIVITY_SCOPE })
    expect(() => apiMethod("drive.context.auth.request")).toThrow("unknown")
  })
  it("uses official SDK requests and returns data only, with sanitized failures", async () => {
    const auth = new OAuth2Client("fixture-client")
    const request = vi.fn(async (options: { url?: unknown; data?: unknown }) => ({
      data: { fixture: true },
      config: options,
      headers: { Authorization: "fixture-secret" },
    }))
    Object.defineProperty(auth, "request", { value: request })
    const api = googleApi(auth)
    expect(await api.call("drive.files.get", { fileId: "doc-a" })).toEqual({ fixture: true })
    await api.call("docs.documents.batchUpdate", { documentId: "doc-a" }, { requests: [] })
    await api.call("driveactivity.activity.query", {}, { itemName: "items/doc-a" })
    expect(request.mock.calls[1]?.[0].data).toEqual({ requests: [] })
    request.mockRejectedValueOnce({ status: 403, message: "fixture-secret" } as never)
    await expect(api.call("drive.files.get", { fileId: "doc-a" })).rejects.toThrow("denied")
    await expect(api.call("drive.files.get", {}, [] as never)).rejects.toThrow("JSON object")
  })
  it.each([
    { auth: "override" },
    { rootUrl: "https://example.invalid" },
    { options: {} },
    { key: "fixture-key" },
    { headers: "override" },
  ])("rejects transport/authentication overrides", (params) => {
    expect(() => validateApiParams(params)).toThrow("override")
  })
  it("parses ordinary request numbers through the shared API JSON helpers", () => {
    expect(jsonObject('{"index":1,"requests":[]}')).toEqual({ index: 1, requests: [] })
    expect(() => jsonObject("[]")).toThrow("JSON object")
    expect(() => jsonObject("fixture-secret-not-json")).toThrow("not valid JSON")
  })
  it("accepts full Drive grants for reads while enforcing writes and activity independently", async () => {
    const client = new OAuth2Client("fixture-client")
    Object.defineProperty(client, "getAccessToken", { value: async () => ({ token: "fixture-access" }) })
    const info = vi.fn(async () => ({ scopes: [READ_SCOPE] }))
    Object.defineProperty(client, "getTokenInfo", { value: info })
    await checkAuthorization(client)
    await expect(checkAuthorization(client, WRITE_SCOPE)).rejects.toThrow("required permission")
    info.mockResolvedValue({ scopes: [WRITE_SCOPE] })
    await checkAuthorization(client)
    await checkAuthorization(client, WRITE_SCOPE)
    await expect(checkAuthorization(client, ACTIVITY_SCOPE)).rejects.toThrow("required permission")
    info.mockResolvedValue({ scopes: [ACTIVITY_SCOPE] })
    await checkAuthorization(client, ACTIVITY_SCOPE)
  })
})
