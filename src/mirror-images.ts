import { randomBytes } from "node:crypto"
import { closeSync, openSync, readFileSync, readSync, realpathSync, statSync } from "node:fs"
import { createServer, type Server } from "node:http"
import { dirname, isAbsolute, relative, resolve } from "node:path"
import { CliError } from "@wirecat/cli-base"
import type { LocalDocument } from "@wirecat/cli-core/documents"

/** Where Google fetches a local image from: the owner's tunnel, forwarding to `port` on this computer. */
export interface ImageHost {
  publicUrl: URL
  port: number
}

export interface ImageOptions {
  host?: ImageHost
  warn: (text: string) => void
}

// Google's limits for insertInlineImage: PNG, JPEG or GIF under 50 MB.
const MAX_BYTES = 50 * 1024 * 1024
const TYPES: [string, number[]][] = [
  ["image/png", [0x89, 0x50, 0x4e, 0x47]],
  ["image/jpeg", [0xff, 0xd8, 0xff]],
  ["image/gif", [0x47, 0x49, 0x46, 0x38]],
]

export const isWeb = (url: string) => /^https:\/\//i.test(url)

/** The image file a Markdown link names, or why it cannot go into a Doc. Only files inside the mirrored folder. */
export const localImage = (
  file: LocalDocument,
  url: string,
): { absolute: string; type: string } | { reason: string } => {
  if (/^[a-z][a-z0-9+.-]*:/i.test(url) || isAbsolute(url)) return { reason: "is not a path inside the folder" }
  let path = url
  try {
    path = decodeURI(url)
  } catch {}
  const outside = (root: string, absolute: string) => {
    const inside = relative(root, absolute)
    return !inside || inside.startsWith("..") || isAbsolute(inside)
  }
  const folder = file.absolute.slice(0, file.absolute.length - file.path.length)
  const named = resolve(dirname(file.absolute), path)
  if (outside(folder, named)) return { reason: "is outside the mirrored folder" }
  let absolute: string
  try {
    // Real paths too, so a link inside the folder cannot hand out a file outside it.
    absolute = realpathSync(named)
    if (outside(realpathSync(folder), absolute)) return { reason: "is outside the mirrored folder" }
  } catch {
    return { reason: "does not exist" }
  }
  let size: number
  try {
    const stat = statSync(absolute)
    if (!stat.isFile()) return { reason: "is not a file" }
    size = stat.size
  } catch {
    return { reason: "does not exist" }
  }
  if (size >= MAX_BYTES) return { reason: "is 50 MB or larger" }
  const head = Buffer.alloc(4)
  const fd = openSync(absolute, "r")
  try {
    readSync(fd, head, 0, 4, 0)
  } finally {
    closeSync(fd)
  }
  const type = TYPES.find(([, magic]) => magic.every((byte, index) => head[index] === byte))?.[0]
  return type ? { absolute, type } : { reason: "is not PNG, JPEG or GIF" }
}

const listen = (server: Server, port: number) =>
  new Promise<void>((done, fail) => {
    server.once("error", fail)
    server.listen(port, "127.0.0.1", () => {
      server.off("error", fail)
      done()
    })
  })

const busy = (port: number) =>
  new CliError(
    "configuration_error",
    `port ${port} is in use, perhaps by drive mcp --http; stop it while syncing, or pass --port and point the tunnel there`,
    { reason: "mirror.port-busy" },
  )

/** Refuses before any sync when the port cannot be opened, so a busy port never surfaces mid-push. */
export const checkPort = async (port: number) => {
  const server = createServer()
  try {
    await listen(server, port)
  } catch {
    throw busy(port)
  }
  await new Promise((done) => server.close(done))
}

/**
 * Serves `files` at random one-off addresses while `use` runs, and nothing else: every other path is 404, and
 * the listener closes when `use` settles, so an address is dead once Google has copied the image.
 */
export const serveImages = async <T>(
  host: ImageHost,
  files: { absolute: string; type: string }[],
  use: (urls: string[]) => Promise<T>,
): Promise<T> => {
  const served = new Map<string, { absolute: string; type: string }>()
  const urls = files.map((file) => {
    const path = `/images/${randomBytes(24).toString("base64url")}`
    served.set(path, file)
    return new URL(path, host.publicUrl).href
  })
  const server = createServer((request, response) => {
    const file = served.get(request.url ?? "")
    if (!file || (request.method !== "GET" && request.method !== "HEAD")) {
      response.writeHead(404).end()
      return
    }
    const body = readFileSync(file.absolute)
    response.writeHead(200, { "content-type": file.type, "content-length": body.length, "cache-control": "no-store" })
    response.end(request.method === "HEAD" ? undefined : body)
  })
  try {
    await listen(server, host.port)
  } catch {
    throw busy(host.port)
  }
  try {
    return await use(urls)
  } finally {
    server.closeAllConnections()
    await new Promise((done) => server.close(done))
  }
}
