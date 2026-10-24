import {
  dateRange,
  type QueryNode,
  type QueryRegistry,
  queryError,
  queryFieldsOf,
  timezoneOf,
} from "@wirecat/cli-base/query"
import { isoTime } from "@wirecat/cli-base/standards"
import { answerEntity, listQuery, queryTerms, typedQuery, withQuery } from "@wirecat/cli-core/cli"
import { note } from "@wirecat/cli-core/store"
import type { Command } from "commander"
import * as v from "valibot"

const registry = (
  entity: string,
  schema: v.GenericSchema,
  native: string[],
  examples: Record<string, string>,
): QueryRegistry => ({
  entity,
  backend: "native",
  fields: queryFieldsOf(schema, { native, examples }).map((field) =>
    field.native ? { ...field, operators: ["term", "phrase"] } : field,
  ),
})
export const folderRow = v.strictObject({ id: v.string() })
export const mirrorRow = v.strictObject({ id: v.string(), path: v.string(), folder: v.string() })
export const sessionRow = v.strictObject({
  profile: v.string(),
  selected_folders: v.number(),
  storage: v.picklist(["keyring", "file"]),
})
export const tagRow = v.strictObject({ tag: v.string() })
export const linkRow = v.looseObject({
  id: v.string(),
  from: v.string(),
  to: v.nullable(v.string()),
  kind: v.string(),
  role: v.nullable(v.string()),
  confirmed: v.boolean(),
  origin: v.picklist(["file", "owner", "suggested", "message"]),
})
export const identityRow = v.looseObject({
  google_id: v.nullable(v.string()),
  role: v.picklist(["owner", "last-editor"]),
  person: v.nullable(v.record(v.string(), v.unknown())),
})
export const fileRow = v.looseObject({
  id: v.optional(v.string()),
  name: v.optional(v.string()),
  trashed: v.optional(v.boolean()),
  modified_time: v.optional(isoTime),
  created_time: v.optional(isoTime),
  viewed_by_me_time: v.optional(isoTime),
})
export const FOLDERS_QUERY = registry("drive_selected_folder", folderRow, ["id"], { id: "id:FOLDER_ID" })
export const MIRRORS_QUERY = registry("drive_mirror", mirrorRow, ["id", "path", "folder"], {
  id: "id:example",
  path: 'path:"/example/notes"',
  folder: "folder:FOLDER_ID",
})
export const SESSIONS_QUERY = registry("drive_session", sessionRow, ["profile", "storage"], {
  profile: "profile:personal",
  storage: "storage:keyring",
})
export const TAGS_QUERY = registry("drive_document_tag", tagRow, ["tag"], { tag: "tag:budget" })
export const NOTES_QUERY = registry("note", note, ["text"], { text: "text:review" })
export const LINKS_QUERY = registry("drive_document_relationship", linkRow, ["id", "role", "origin", "confirmed"], {
  id: "id:1",
  role: "role:reviewer",
  origin: "origin:owner",
  confirmed: "confirmed:true",
})
export const IDENTITIES_QUERY = registry("drive_document_identity", identityRow, ["google_id", "role"], {
  google_id: "google_id:example",
  role: "role:owner",
})
export const FILES_QUERY: QueryRegistry = {
  entity: "drive_remote_file",
  backend: "native",
  fields: queryFieldsOf(fileRow, {
    native: ["name", "trashed", "modified_time", "created_time", "viewed_by_me_time"],
    examples: {
      name: 'name:"Example plan"',
      trashed: "trashed:false",
      modified_time: "modified_time>=2026-01-01",
      created_time: "created_time>=2026-01-01",
      viewed_by_me_time: "viewed_by_me_time>=2026-01-01",
    },
  }).map((field) =>
    field.native ? { ...field, operators: field.type === "time" ? ["term", "range"] : ["term", "phrase"] } : field,
  ),
  defaults: ["trashed:false"],
}
export const bindQuery = (command: Command, query: QueryRegistry, schema: v.GenericSchema) =>
  answerEntity(withQuery(command, query), query.entity, schema)
export const termsOf = (words: string[], query: QueryRegistry, command: string) =>
  Object.fromEntries(queryTerms(words, query, command))
export const driveFileQuery = (words: string[], timezone?: string) => {
  const ast = listQuery(typedQuery(words), FILES_QUERY, "files list")
  const quote = (value: string) => `'${value.replaceAll("\\", "\\\\").replaceAll("'", "\\'")}'`
  const zone = timezoneOf(timezone)
  const column: Record<string, string> = {
    modified_time: "modifiedTime",
    created_time: "createdTime",
    viewed_by_me_time: "viewedByMeTime",
  }
  const render = (node: QueryNode): string => {
    if (node.kind === "boolean") {
      if (node.clauses.some((clause) => clause.occur !== "must"))
        queryError("query.unsupported-operator", node.span, "files list accepts AND terms only")
      return node.clauses.map((clause) => render(clause.node)).join(" and ")
    }
    if (node.field === "name") return `name = ${quote(node.value)}`
    if (node.field === "trashed") return `trashed = ${node.value.toLowerCase()}`
    const range = dateRange(
      node.value,
      node.operator === "range" ? (node.upper ?? "*") : node.value,
      node.lower_inclusive ?? true,
      node.upper_inclusive ?? true,
      zone,
      node.span,
    )
    return [
      range.lower === undefined
        ? undefined
        : `${column[node.field]} ${range.lower_inclusive ? ">=" : ">"} ${quote(new Date(range.lower).toISOString())}`,
      range.upper === undefined
        ? undefined
        : `${column[node.field]} ${range.upper_inclusive ? "<=" : "<"} ${quote(new Date(range.upper).toISOString())}`,
    ]
      .filter(Boolean)
      .join(" and ")
  }
  return { query: ast ? render(ast.root) : "trashed = false", timezone: zone }
}
