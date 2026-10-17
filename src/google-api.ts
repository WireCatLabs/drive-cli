import { docs } from "@googleapis/docs"
import { drive } from "@googleapis/drive"
import { driveactivity } from "@googleapis/driveactivity"
import { sheets } from "@googleapis/sheets"
import { CliError } from "@wirecat/cli-base"
import type { OAuth2Client } from "google-auth-library"
import { operations, validateRequest } from "./api-contract.js"
import { googleError } from "./errors.js"
import { metadata } from "./generated/metadata.js"
import { ACTIVITY_SCOPE, APPS_SCOPE, READ_SCOPE, WRITE_SCOPE } from "./tokens.js"
import type { UploadRequest } from "./upload.js"

export interface ApiMethod {
  name: string
  mutates: boolean
  destructive: boolean
  scope: string
}
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
/** The methods drive can call; `service` keeps those of one Google service, as `api list service:docs` asks. */
export const apiMethods = (service?: string): ApiMethod[] => {
  const chosen = service === undefined ? operations : operations.filter(({ id }) => id.startsWith(`${service}.`))
  return chosen.map((operation) => {
    const scopes = (metadata.scopes as Record<string, readonly string[]>)[operation.id] ?? []
    const preference =
      operation.effect === "read"
        ? [READ_SCOPE, ACTIVITY_SCOPE, APPS_SCOPE, WRITE_SCOPE]
        : [WRITE_SCOPE, READ_SCOPE, ACTIVITY_SCOPE, APPS_SCOPE]
    const scope = preference.find((candidate) => scopes.includes(candidate))
    if (!scope) throw new CliError("configuration_error", "generated method has no supported OAuth scope")
    return {
      name: operation.id,
      mutates: operation.effect !== "read",
      destructive: operation.effect === "destructive",
      scope,
    }
  })
}
export const apiMethod = (name: string): ApiMethod => {
  const found = apiMethods().find((method) => method.name === name)
  if (!found)
    throw new CliError("validation_error", "unknown Google SDK method; run drive api list", {
      reason: "api.unknown-method",
    })
  return found
}
const forbidden = new Set([
  "auth",
  "key",
  "access_token",
  "oauth_token",
  "context",
  "options",
  "rootUrl",
  "baseURL",
  "url",
  "headers",
  "requestBody",
  "__proto__",
  "prototype",
  "constructor",
])
export const validateApiParams = (params: Record<string, unknown>): void => {
  if (
    !params ||
    typeof params !== "object" ||
    Array.isArray(params) ||
    Object.entries(params).some(
      ([key, value]) =>
        forbidden.has(key) ||
        (Array.isArray(value)
          ? value.some((item) => item !== null && typeof item === "object")
          : value !== null && typeof value === "object"),
    )
  )
    throw new CliError(
      "validation_error",
      "API parameters must be scalar values or scalar arrays and cannot override authentication or transport",
    )
}
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
