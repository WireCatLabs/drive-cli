import { Socket } from "node:net"
import { OAuth2Client } from "google-auth-library"
import { afterEach, describe, expect, it, vi } from "vitest"
import { googleApi, googleDownload } from "./google-api.js"

const bearer = "SYNTHETIC-AUDIT-BEARER-NOT-A-CREDENTIAL"
const content = "SYNTHETIC-PRIVATE-CONTENT"
const budget = 50 * 1024 * 1024
const fixture = (respond: (attempt: number) => Response = () => Response.json({ id: "synthetic-file" })) => {
  const network = vi.spyOn(Socket.prototype, "connect").mockImplementation(() => {
    throw new Error("audit test forbids network sockets")
  })
  const requests: { url: URL; options: RequestInit & { size?: number; retry?: boolean } }[] = []
  const auth = new OAuth2Client({
    transporterOptions: {
      fetchImplementation: async (input, options) => {
        requests.push({ url: new URL(String(input)), options: options ?? {} })
        return respond(requests.length)
      },
      retryConfig: { retryBackoff: async () => {} },
    },
  })
  auth.setCredentials({ access_token: bearer, expiry_date: Date.now() + 3600000 })
  return { api: googleApi(auth), auth, requests, network }
}

afterEach(() => vi.restoreAllMocks())

describe("actual Google SDK security boundary", () => {
  it.each([undefined, "application/pdf"])("downloads bounded binary media through the SDK (%s)", async (mime) => {
    const bytes = Uint8Array.of(0, 255, 128, 10)
    const { auth, requests, network } = fixture(
      () => new Response(bytes, { headers: { "content-type": "application/octet-stream" } }),
    )
    expect(await googleDownload(auth)("synthetic-file", mime)).toEqual(bytes)
    expect(requests).toHaveLength(1)
    expect(requests[0]?.url.pathname).toBe(
      mime ? "/drive/v3/files/synthetic-file/export" : "/drive/v3/files/synthetic-file",
    )
    expect(requests[0]?.options.size).toBe(budget)
    expect(requests[0]?.url.searchParams.get(mime ? "mimeType" : "alt")).toBe(mime ?? "media")
    expect(network).not.toHaveBeenCalled()
  })
  it.each(["drive.files.get", "docs.documents.batchUpdate"])(
    "refreshes once after a definite auth refusal for %s",
    async (method) => {
      const { api, auth, requests } = fixture((attempt) => {
        if (attempt === 1) return Response.json({ error: "invalid_token" }, { status: 401 })
        if (attempt === 2)
          return Response.json({ access_token: "SYNTHETIC-REFRESHED-BEARER", token_type: "Bearer", expires_in: 3600 })
        return Response.json({ id: "synthetic-file" })
      })
      auth.setCredentials({ access_token: bearer, refresh_token: "SYNTHETIC-REFRESH-TOKEN" })
      await api.call(
        method,
        method === "drive.files.get" ? { fileId: "synthetic-file" } : { documentId: "synthetic-file" },
        method === "drive.files.get" ? undefined : { requests: [] },
      )
      expect(requests).toHaveLength(3)
      expect(requests[1]?.url.origin).toBe("https://oauth2.googleapis.com")
      expect(requests[2]?.url.toString()).toBe(requests[0]?.url.toString())
      expect(new Headers(requests[2]?.options.headers).get("authorization")).toBe("Bearer SYNTHETIC-REFRESHED-BEARER")
    },
  )
  it("does not refresh or replay an uncertain write even when a refresh token is available", async () => {
    const { api, auth, requests } = fixture(() => Response.json({ error: content }, { status: 503 }))
    auth.setCredentials({ access_token: bearer, refresh_token: "SYNTHETIC-REFRESH-TOKEN" })
    await expect(
      api.call("docs.documents.batchUpdate", { documentId: "synthetic-file" }, { requests: [] }),
    ).rejects.toMatchObject({ code: "outcome_unknown" })
    expect(requests).toHaveLength(1)
  })
  it("runs the pinned SDK and auth transporter without real network access", async () => {
    const { api, requests, network } = fixture()
    expect(await api.call("drive.files.get", { fileId: "synthetic-file" })).toEqual({ id: "synthetic-file" })
    expect(requests).toHaveLength(1)
    expect(requests[0]?.url.origin).toBe("https://www.googleapis.com")
    expect(new Headers(requests[0]?.options.headers).get("authorization")).toBe(`Bearer ${bearer}`)
    expect(requests[0]?.options.size).toBe(budget)
    expect(network).not.toHaveBeenCalled()
    expect(() => new Socket().connect(1, "127.0.0.1")).toThrow("forbids network")
  })
  it.each(["auth", "key", "access_token", "oauth_token", "rootUrl", "baseURL", "url", "headers", "options", "context"])(
    "refuses %s before authenticated dispatch",
    async (key) => {
      const { api, requests } = fixture()
      await expect(
        api.call("drive.files.get", { fileId: "synthetic-file", [key]: "https://invalid.example" }),
      ).rejects.toThrow("override")
      expect(requests).toHaveLength(0)
    },
  )
  it("keeps URL-shaped IDs and query text within their respective fields", async () => {
    const { api, requests } = fixture()
    const id = "https://invalid.example/a?access_token=synthetic#fragment"
    await api.call("drive.files.get", { fileId: id })
    const url = requests[0]?.url as URL
    expect(url.origin).toBe("https://www.googleapis.com")
    expect(decodeURIComponent(url.pathname.split("/files/")[1] as string)).toBe(id)
    expect(url.searchParams.has("access_token")).toBe(false)
    expect(url.hash).toBe("")
    const query = "name = 'synthetic&access_token=not-a-token#fragment'"
    await api.call("drive.files.list", { q: query })
    expect(requests[1]?.url.searchParams.get("q")).toBe(query)
    expect(requests[1]?.url.searchParams.has("access_token")).toBe(false)
  })
  it.each([
    [401, "authentication_error"],
    [403, "permission_error"],
    [404, "not_found"],
    [429, "rate_limited"],
    [500, "provider_error"],
  ] as const)("sanitizes actual SDK HTTP %i failures", async (status, code) => {
    const { api, requests } = fixture(() => Response.json({ error: { message: `${bearer} ${content}` } }, { status }))
    const error = await api.call("drive.files.get", { fileId: "synthetic-file" }).catch((error: unknown) => error)
    expect(error).toBeInstanceOf(Error)
    expect(error).toMatchObject({ code })
    expect(requests.length).toBeGreaterThan(0)
    expect(requests.length).toBeLessThanOrEqual(4)
    const serialized = `${String(error)} ${JSON.stringify(error)}`
    expect(serialized).not.toContain(bearer)
    expect(serialized).not.toContain(content)
  })
  it("does not retry a mutation after an uncertain server response", async () => {
    const { api, requests } = fixture(() => Response.json({ error: content }, { status: 503 }))
    await expect(
      api.call("docs.documents.batchUpdate", { documentId: "synthetic-file" }, { requests: [] }),
    ).rejects.toMatchObject({ code: "outcome_unknown", details: { retryable: false } })
    expect(requests).toHaveLength(1)
    expect(requests[0]?.options.retry).toBe(false)
  })
  it("bounds read retries while sanitizing transport failures", async () => {
    const { api, requests } = fixture(() => {
      throw new Error(`${bearer} ${content}`)
    })
    const error = await api.call("drive.files.get", { fileId: "synthetic-file" }).catch((error: unknown) => error)
    expect(error).toMatchObject({ code: "provider_unavailable" })
    expect(`${String(error)} ${JSON.stringify(error)}`).not.toContain(bearer)
    expect(`${String(error)} ${JSON.stringify(error)}`).not.toContain(content)
    expect(requests.length).toBeGreaterThan(0)
    expect(requests.length).toBeLessThanOrEqual(4)
  })
  it("rejects an oversized declared response before consuming its body", async () => {
    const response = new Response(content, { headers: { "content-length": String(budget + 1) } })
    const consume = vi.spyOn(response, "text")
    const { api, requests } = fixture(() => response)
    await expect(api.call("drive.files.get", { fileId: "synthetic-file" })).rejects.toBeInstanceOf(Error)
    expect(consume).not.toHaveBeenCalled()
    expect(requests).toHaveLength(1)
  })
})
