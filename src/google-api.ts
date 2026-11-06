import { PassThrough, Readable } from "node:stream"
import { docs } from "@googleapis/docs"
import { drive } from "@googleapis/drive"
import { driveactivity } from "@googleapis/driveactivity"
import { sheets } from "@googleapis/sheets"
import { CliError } from "@wirecat/cli-base"
import type { OAuth2Client } from "google-auth-library"
import { operations, validateRequest } from "./api-contract.js"
import { apiMethod, validateApiParams } from "./api-methods.js"
import { googleError } from "./errors.js"
import type { UploadRequest } from "./upload.js"

export { type ApiMethod, apiMethod, apiMethods, validateApiParams } from "./api-methods.js"

export interface GoogleApi {
  call(method: string, params?: Record<string, unknown>, body?: Record<string, unknown>): Promise<unknown>
}
const roots = (auth?: OAuth2Client) => ({
  drive: drive({ version: "v3", ...(auth ? { auth } : {}) }),
  docs: docs({ version: "v1", ...(auth ? { auth } : {}) }),
  sheets: sheets({ version: "v4", ...(auth ? { auth } : {}) }),
  driveactivity: driveactivity({ version: "v2", ...(auth ? { auth } : {}) }),
})
type Resource = Record<string, unknown>
export const googleApi = (auth: OAuth2Client): GoogleApi => {
  const api = roots(auth)
  return {
    call: async (name, params = {}, body) => {
      apiMethod(name)
      validateApiParams(params)
      if (body !== undefined && (!body || typeof body !== "object" || Array.isArray(body)))
        throw new CliError("validation_error", "API request body must be a JSON object")
      validateRequest(name, params, body)
      const arrayParameters = new Set(
        operations
          .find((operation) => operation.id === name)
          ?.parameters.filter((parameter) => parameter.schema.type === "array")
          .map((parameter) => parameter.name),
      )
      const sdkParams = Object.fromEntries(
        Object.entries(params).map(([key, value]) => [
          key,
          arrayParameters.has(key) && typeof value === "string" ? value.split(",").map((item) => item.trim()) : value,
        ]),
      )
      const parts = name.split(".")
      let resource: Resource = api as unknown as Resource
      for (const part of parts.slice(0, -1)) resource = resource[part] as Resource
      const method = resource[parts.at(-1) as string] as (
        params: Record<string, unknown>,
        options: object,
      ) => Promise<{ data: unknown }>
      try {
        const response = await method.call(
          resource,
          { ...sdkParams, ...(body ? { requestBody: body } : {}) },
          {
            timeout: 30000,
            maxContentLength: 50 * 1024 * 1024,
            ...(apiMethod(name).mutates ? { retry: false } : {}),
          },
        )
        if (Buffer.byteLength(JSON.stringify(response.data ?? null), "utf8") > 50 * 1024 * 1024)
          throw new CliError("provider_error", "Google response exceeded the output bound")
        return response.data ?? null
      } catch (error) {
        const value = error as { status?: number; response?: { status?: number } }
        const status = value?.status ?? value?.response?.status
        if (apiMethod(name).mutates && (status === undefined || status >= 500))
          throw new CliError(
            "outcome_unknown",
            "Google write has no certain outcome; check Google before repeating it",
            { retryable: false },
          )
        throw googleError(error)
      }
    },
  }
}

/** Sends the upload's requests through the signed-in client; every status comes back, 308 included. */
export const googleUploadRequest =
  (client: OAuth2Client): UploadRequest =>
  async ({ url, method, headers, body }) => {
    const response = await client.request<string>({
      url,
      method,
      headers,
      ...(body === undefined ? {} : { data: body }),
      responseType: "text",
      validateStatus: () => true,
      retry: false,
      timeout: 120000,
    })
    const raw = response.headers as unknown
    const header = (name: string) =>
      typeof (raw as Headers)?.get === "function"
        ? ((raw as Headers).get(name) ?? undefined)
        : (raw as Record<string, string> | undefined)?.[name.toLowerCase()]
    let data: unknown = response.data
    if (typeof data === "string" && data.trim()) {
      try {
        data = JSON.parse(data)
      } catch {}
    }
    return { status: response.status, header, data }
  }

const DOWNLOAD_IDLE_MS = 60000

/** Streams the file so size is bounded by the disk; only a stall with no bytes for a minute ends it. */
export const googleDownload =
  (auth: OAuth2Client, idleMs = DOWNLOAD_IDLE_MS) =>
  async (id: string, mime?: string): Promise<Readable> => {
    const api = drive({ version: "v3", auth })
    const method = mime ? "drive.files.export" : "drive.files.get"
    const params = mime ? { fileId: id, mimeType: mime } : { fileId: id, supportsAllDrives: true }
    validateRequest(method, params)
    const controller = new AbortController()
    let stalled = false
    let timer: NodeJS.Timeout | undefined
    const arm = () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        stalled = true
        controller.abort()
      }, idleMs)
    }
    const stallError = () =>
      new CliError("provider_unavailable", "Google sent no data for a minute; the download stopped")
    arm()
    try {
      const options = { responseType: "stream" as const, signal: controller.signal }
      const response = mime
        ? await api.files.export({ fileId: id, mimeType: mime }, options)
        : await api.files.get({ fileId: id, alt: "media", supportsAllDrives: true }, options)
      const body = response.data as unknown as Readable | import("node:stream/web").ReadableStream
      const source = "pipe" in body ? body : Readable.fromWeb(body)
      const out = new PassThrough()
      source.on("data", arm)
      source.on("error", (error) => out.destroy(stalled ? stallError() : error))
      out.on("close", () => clearTimeout(timer))
      source.pipe(out)
      return out
    } catch (error) {
      clearTimeout(timer)
      throw stalled ? stallError() : googleError(error)
    }
  }
