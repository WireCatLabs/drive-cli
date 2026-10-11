import { docs } from "@googleapis/docs"
import { drive } from "@googleapis/drive"
import { driveactivity } from "@googleapis/driveactivity"
import { CliError } from "@wirecat/cli-core"
import type { OAuth2Client } from "google-auth-library"
import { googleError } from "./errors.js"
import { ACTIVITY_SCOPE, APPS_SCOPE, READ_SCOPE, WRITE_SCOPE } from "./tokens.js"

export interface ApiMethod {
  name: string
  mutates: boolean
  destructive: boolean
  scope: string
}
export interface GoogleApi {
  call(method: string, params?: Record<string, unknown>, body?: Record<string, unknown>): Promise<unknown>
}
const reads = new Set(["get", "list", "getStartPageToken", "listLabels", "generateIds", "download", "query"])
const roots = (auth?: OAuth2Client) => ({
  drive: drive({ version: "v3", ...(auth ? { auth } : {}) }),
  docs: docs({ version: "v1", ...(auth ? { auth } : {}) }),
  driveactivity: driveactivity({ version: "v2", ...(auth ? { auth } : {}) }),
})
type Resource = Record<string, unknown>
const collect = (root: object, prefix: string, found: ApiMethod[]) => {
  for (const [name, value] of Object.entries(root)) {
    if (name === "context" || !value || typeof value !== "object") continue
    const path = `${prefix}.${name}`
    for (const method of Object.getOwnPropertyNames(Object.getPrototypeOf(value))) {
      if (method === "constructor" || typeof (value as Resource)[method] !== "function") continue
      const mutates = !reads.has(method)
      found.push({
        name: `${path}.${method}`,
        mutates,
        destructive: method === "delete" || method === "emptyTrash",
        scope:
          prefix === "driveactivity"
            ? ACTIVITY_SCOPE
            : path === "drive.apps"
              ? APPS_SCOPE
              : mutates || method === "generateIds"
                ? WRITE_SCOPE
                : READ_SCOPE,
      })
    }
    collect(value, path, found)
  }
}
export const apiMethods = (): ApiMethod[] => {
  const methods: ApiMethod[] = []
  for (const [name, root] of Object.entries(roots())) collect(root, name, methods)
  return methods.sort((a, b) => a.name.localeCompare(b.name))
}
export const apiMethod = (name: string): ApiMethod => {
  const found = apiMethods().find((method) => method.name === name)
  if (!found) throw new CliError("validation_error", "unknown Google SDK method; run drive api methods")
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
    Object.entries(params).some(([key, value]) => forbidden.has(key) || (value !== null && typeof value === "object"))
  )
    throw new CliError(
      "validation_error",
      "API parameters must be scalar values and cannot override authentication or transport",
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
          { ...params, ...(body ? { requestBody: body } : {}) },
          {
            timeout: 30000,
            maxContentLength: 50 * 1024 * 1024,
          },
        )
        if (Buffer.byteLength(JSON.stringify(response.data ?? null), "utf8") > 50 * 1024 * 1024)
          throw new CliError("provider_error", "Google response exceeded the output bound")
        return response.data ?? null
      } catch (error) {
        throw googleError(error)
      }
    },
  }
}
