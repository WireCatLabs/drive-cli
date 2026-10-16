import { once } from "node:events"
import { Agent, createServer, type IncomingMessage, type ServerResponse } from "node:http"
import { createRequire } from "node:module"
import { Socket } from "node:net"
import { Readable } from "node:stream"
import { OAuth2Client } from "google-auth-library"
import { afterEach, describe, expect, it, vi } from "vitest"
import { googleApi } from "./google-api.js"

const req = createRequire(import.meta.url)
const authRequire = createRequire(req.resolve("google-auth-library"))
const fetchPath = createRequire(authRequire.resolve("gaxios")).resolve("node-fetch")
const nodeFetch = (await import(fetchPath)).default as typeof fetch
const bearer = "SYNTHETIC-LOOPBACK-BEARER"
const servers: ReturnType<typeof createServer>[] = []
const agents: Agent[] = []
const allowed = new Set<string>()
const listen = async (host: string, handler: (request: IncomingMessage, response: ServerResponse) => void) => {
  const server = createServer(handler)
  servers.push(server)
  server.listen(0, host)
  await once(server, "listening")
  const address = server.address()
  if (!address || typeof address === "string") throw new Error("fixture listener unavailable")
  allowed.add(`${host}:${address.port}`)
  return `http://${host}:${address.port}`
}
const guard = () => {
  const connect = Socket.prototype.connect
  return vi.spyOn(Socket.prototype, "connect").mockImplementation(function (this: Socket, ...args: unknown[]) {
    const options = (Array.isArray(args[0]) ? args[0][0] : args[0]) as
      | { host?: string; port?: number | string }
      | undefined
    if (!options || typeof options !== "object" || !allowed.has(`${options.host}:${options.port}`))
      throw new Error("transport test forbids non-fixture sockets")
    return Reflect.apply(connect, this, args)
  })
}
const client = (origin: string) => {
  const agent = new Agent({ keepAlive: false })
  agents.push(agent)
  const auth = new OAuth2Client({
    transporterOptions: {
      agent,
      fetchImplementation: (input, options) => nodeFetch(new URL(new URL(String(input)).pathname, origin), options),
      retry: false,
      retryConfig: { retry: 0 },
    },
  })
  auth.setCredentials({ access_token: bearer, expiry_date: Date.now() + 3600000 })
  return googleApi(auth)
}

afterEach(async () => {
  for (const agent of agents.splice(0)) agent.destroy()
  for (const server of servers.splice(0)) {
    server.closeAllConnections()
    await new Promise<void>((resolve) => server.close(() => resolve()))
  }
  allowed.clear()
  vi.restoreAllMocks()
})

describe("pinned Google HTTP transport on confined loopback", () => {
  it("preserves ordinary chunked JSON and refuses non-fixture network access", async () => {
    const origin = await listen("127.0.0.1", (_request, response) => {
      response.writeHead(200, { "content-type": "application/json" })
      response.write('{"fixture":')
      response.end("true}")
    })
    guard()
    expect(() => new Socket().connect(1, "203.0.113.1")).toThrow("non-fixture")
    expect(await client(origin).call("drive.files.get", { fileId: "synthetic-file" })).toEqual({ fixture: true })
  })
  it("stops an oversized chunked body through the real node-fetch size limit", async () => {
    let generated = 0
    const total = 64 * 1024 * 1024
    const origin = await listen("127.0.0.1", (_request, response) => {
      response.writeHead(200, { "content-type": "application/json" })
      const stream = Readable.from(
        (function* () {
          yield '{"payload":"'
          const chunk = Buffer.alloc(64 * 1024, "x")
          while (generated < total) {
            generated += chunk.length
            yield chunk
          }
          yield '"}'
        })(),
      )
      response.on("close", () => stream.destroy())
      stream.pipe(response)
    })
    guard()
    const error = await client(origin)
      .call("drive.files.get", { fileId: "synthetic-file" })
      .catch((error: unknown) => error)
    expect(error).toBeInstanceOf(Error)
    expect(generated).toBeGreaterThanOrEqual(50 * 1024 * 1024)
    expect(generated).toBeLessThan(total)
    expect(`${String(error)} ${JSON.stringify(error)}`).not.toContain(bearer)
  })
  it("preserves a same-origin redirect including its synthetic bearer", async () => {
    const seen: (string | undefined)[] = []
    const origin = await listen("127.0.0.1", (request, response) => {
      seen.push(request.headers.authorization)
      if (request.url !== "/target") response.writeHead(307, { location: "/target" }).end()
      else response.setHeader("content-type", "application/json").end('{"redirected":true}')
    })
    guard()
    expect(await client(origin).call("drive.files.get", { fileId: "synthetic-file" })).toEqual({ redirected: true })
    expect(seen).toEqual([`Bearer ${bearer}`, `Bearer ${bearer}`])
  })
  it("removes the bearer when a redirect changes host", async () => {
    let received: string | undefined
    const target = await listen("127.0.0.2", (request, response) => {
      received = request.headers.authorization
      response.setHeader("content-type", "application/json").end('{"redirected":true}')
    })
    const origin = await listen("127.0.0.1", (_request, response) =>
      response.writeHead(307, { location: target }).end(),
    )
    guard()
    expect(await client(origin).call("drive.files.get", { fileId: "synthetic-file" })).toEqual({ redirected: true })
    expect(received).toBeUndefined()
  })
})
