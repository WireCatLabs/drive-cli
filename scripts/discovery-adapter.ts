import type { ApiModel, ApiOperation, ApiSchema, Effect, HttpMethod, SchemaNode } from "@wirecat/cli-core/codegen"

type Json = Record<string, unknown>
const object = (value: unknown): value is Json => !!value && typeof value === "object" && !Array.isArray(value)
const descriptive = new Set([
  "id",
  "description",
  "format",
  "enumDescriptions",
  "enumDeprecated",
  "readOnly",
  "deprecated",
  "annotations",
  "location",
  "required",
  "repeated",
  "parameterName",
])
const constraints = new Set([
  "type",
  "$ref",
  "properties",
  "items",
  "additionalProperties",
  "enum",
  "default",
  "minimum",
  "maximum",
  "pattern",
  "minLength",
  "maxLength",
  "minItems",
  "maxItems",
  "nullable",
])
const formats = new Set([
  "int32",
  "int64",
  "float",
  "double",
  "byte",
  "date",
  "date-time",
  "google-datetime",
  "google-fieldmask",
])
export interface DiscoveryMetadata {
  scopes: Record<string, string[]>
  omissions: string[]
}
export const adaptDiscovery = (
  documents: Record<string, unknown>,
): { model: ApiModel; metadata: DiscoveryMetadata } => {
  const schemas: ApiSchema[] = []
  const operations: ApiOperation[] = []
  const metadata: DiscoveryMetadata = { scopes: {}, omissions: [] }
  const node = (value: unknown, service: string, where: string): SchemaNode => {
    if (!object(value)) throw new Error(`${where}: expected a Discovery schema object`)
    for (const key of Object.keys(value))
      if (!descriptive.has(key) && !constraints.has(key)) throw new Error(`${where}: unsupported schema keyword ${key}`)
    if (value.format !== undefined && !formats.has(String(value.format)))
      throw new Error(`${where}: unsupported format`)
    const common = {
      ...(typeof value.description === "string" ? { description: value.description } : {}),
      ...(value.nullable === true ? { nullable: true } : {}),
      ...(value.deprecated === true ? { deprecated: true } : {}),
      ...(value.default !== undefined ? { default: value.default } : {}),
    }
    if (typeof value.$ref === "string") return { ...common, type: "ref", ref: `${service}_${value.$ref}` }
    const bound = (key: string) => {
      if (value[key] === undefined) return {}
      const n = Number(value[key])
      if (!Number.isFinite(n)) throw new Error(`${where}: invalid numeric bound`)
      return { [key]: n }
    }
    switch (value.type) {
      case "any":
        return { ...common, type: "unknown" }
      case "string":
        return {
          ...common,
          type: "string",
          ...(Array.isArray(value.enum) ? { enum: value.enum.map(String) } : {}),
          ...(typeof value.pattern === "string"
            ? { pattern: value.pattern }
            : value.format === "int64"
              ? { pattern: "^-?\\d+$" }
              : {}),
          ...bound("minLength"),
          ...bound("maxLength"),
        }
      case "integer":
        return {
          ...common,
          type: "integer",
          ...(value.format === "int64" ? { format: "int64" as const } : { format: "int32" as const }),
          ...bound("minimum"),
          ...bound("maximum"),
          ...(Array.isArray(value.enum) ? { enum: value.enum.map(Number) } : {}),
        }
      case "number":
        return { ...common, type: "number", ...bound("minimum"), ...bound("maximum") }
      case "boolean":
        return { ...common, type: "boolean" }
      case "array":
        return {
          ...common,
          type: "array",
          items: node(value.items, service, `${where}/items`),
          ...bound("minItems"),
          ...bound("maxItems"),
        }
      case "object": {
        const properties = object(value.properties) ? value.properties : {}
        return {
          ...common,
          type: "object",
          properties: Object.fromEntries(
            Object.entries(properties).map(([key, item]) => [key, node(item, service, `${where}/properties/${key}`)]),
          ),
          required: Array.isArray(value.required) ? value.required.map(String) : [],
          ...(object(value.additionalProperties)
            ? { additionalProperties: node(value.additionalProperties, service, `${where}/additionalProperties`) }
            : {}),
        }
      }
      default:
        throw new Error(`${where}: unsupported schema type`)
    }
  }
  for (const [service, source] of Object.entries(documents)) {
    if (!object(source) || source.name !== service || !object(source.schemas) || !object(source.resources))
      throw new Error(`invalid Discovery document: ${service}`)
    for (const [id, value] of Object.entries(source.schemas))
      schemas.push({ id: `${service}_${id}`, schema: node(value, service, `/schemas/${id}`) })
    const walk = (resources: Json, path: string) => {
      for (const [resource, value] of Object.entries(resources)) {
        if (!object(value)) throw new Error(`invalid resource: ${resource}`)
        const location = `${path}/${resource}`
        if (object(value.methods))
          for (const [name, raw] of Object.entries(value.methods)) {
            if (!object(raw) || typeof raw.id !== "string" || typeof raw.path !== "string")
              throw new Error(`invalid method at ${location}`)
            const method = String(raw.httpMethod) as HttpMethod
            if (!["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD"].includes(method))
              throw new Error(`unsupported HTTP method: ${raw.id}`)
            let effect: Effect =
              method === "GET" || method === "HEAD" ? "read" : method === "DELETE" ? "destructive" : "write"
            if (raw.id === "driveactivity.activity.query" || raw.id === "drive.files.download") effect = "read"
            if (raw.id === "drive.files.emptyTrash") effect = "destructive"
            metadata.scopes[raw.id] = Array.isArray(raw.scopes) ? raw.scopes.map(String) : []
            const common = object(source.parameters) ? source.parameters : {}
            const parameters = { ...common, ...(object(raw.parameters) ? raw.parameters : {}) }
            const safe = Object.entries(parameters).filter(
              ([key]) => !["key", "oauth_token", "access_token", "upload_protocol", "uploadType"].includes(key),
            )
            const operation: ApiOperation = {
              id: raw.id,
              binding: { kind: "http", method, path: raw.path },
              effect,
              summary: String(raw.description ?? raw.id).split("\n")[0],
              description: String(raw.description ?? ""),
              tags: [service],
              parameters: safe.map(([key, value]) => {
                if (!object(value) || !["path", "query"].includes(String(value.location)))
                  throw new Error(`unsupported parameter: ${raw.id}/${key}`)
                const schema = node(value, service, `${location}/methods/${name}/parameters/${key}`)
                return {
                  name: key,
                  in: value.location as "path" | "query",
                  required: value.required === true,
                  ...(typeof value.description === "string" ? { description: value.description } : {}),
                  schema: value.repeated === true ? { type: "array" as const, items: schema } : schema,
                }
              }),
              source: { location: `${service}${location}/methods/${name}` },
              ...(raw.deprecated === true ? { deprecated: true } : {}),
            }
            if (object(raw.request))
              operation.requestBody = {
                confidence: "contract",
                required: raw.request.required === true,
                schema: node(raw.request, service, `${location}/methods/${name}/request`),
              }
            if (object(raw.response))
              operation.response = {
                confidence: "contract",
                schema: node(raw.response, service, `${location}/methods/${name}/response`),
                required: false,
              }
            if (raw.supportsMediaUpload || raw.supportsMediaDownload)
              metadata.omissions.push(`${raw.id}: JSON endpoint only; media transport is not generated`)
            operations.push(operation)
          }
        if (object(value.resources)) walk(value.resources, `${location}/resources`)
      }
    }
    walk(source.resources, "/resources")
  }
  return {
    model: {
      source: {
        kind: "other",
        sourceUrl: "https://developers.google.com/discovery",
        sourceRevision: "spec/google/provenance.json",
      },
      operations: operations.sort((a, b) => a.id.localeCompare(b.id)),
      schemas,
    },
    metadata,
  }
}
