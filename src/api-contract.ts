import { CliError } from "@wirecat/cli-core"
import type { ManifestOperation } from "@wirecat/cli-core/codegen"
import { apiJson, checkApiBody, checkApiParameter } from "@wirecat/cli-messaging/cli"
import { operations } from "./generated/manifest.js"
import { schemas } from "./generated/schemas.js"

export { operations, schemas }
export const operationOf = (name: string): ManifestOperation => {
  const operation = operations.find((item) => item.id === name)
  if (!operation) throw new CliError("validation_error", "unknown Google method; run drive api methods")
  return operation
}
export const validateRequest = (name: string, params: Record<string, unknown>, body?: Record<string, unknown>) => {
  const operation = operationOf(name)
  const allowed = new Map(operation.parameters.map((parameter) => [parameter.name, parameter]))
  for (const key of Object.keys(params))
    if (!allowed.has(key))
      throw new CliError("validation_error", "unknown or unsupported API parameter; inspect the generated method help")
  for (const parameter of operation.parameters) {
    const value = params[parameter.name]
    if (value === undefined || value === null) {
      if (parameter.required) throw new CliError("validation_error", `required API parameter: ${parameter.name}`)
      continue
    }
    const node = parameter.schema
    const raw = Array.isArray(value) ? value.join(",") : String(value)
    const problem = checkApiParameter(parameter.name, node, raw, schemas)
    if (problem) throw new CliError("validation_error", problem)
    if (
      node.type === "string" &&
      ((node.pattern && !new RegExp(node.pattern).test(raw)) ||
        (node.minLength !== undefined && raw.length < node.minLength) ||
        (node.maxLength !== undefined && raw.length > node.maxLength))
    )
      throw new CliError("validation_error", `API parameter ${parameter.name} violates its declared constraints`)
  }
  if (body !== undefined && !operation.request)
    throw new CliError("validation_error", "this Google method does not accept a JSON body")
  checkApiBody(operation, body === undefined ? undefined : apiJson(body), schemas)
  if (params.alt === "media")
    throw new CliError("validation_error", "this API surface supports JSON; use document export for content")
}
