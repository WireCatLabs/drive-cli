import { CliError } from "@wirecat/cli-base"
import { operations } from "./api-contract.js"
import { metadata } from "./generated/metadata.js"
import { ACTIVITY_SCOPE, APPS_SCOPE, READ_SCOPE, WRITE_SCOPE } from "./scopes.js"

export interface ApiMethod {
  name: string
  mutates: boolean
  destructive: boolean
  scope: string
}
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
