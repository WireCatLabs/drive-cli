import { parseLucene, type QueryNode, type QueryRegistry, queryError, validateQuery } from "@wirecat/cli-base/query"
import { LIST_QUERY_GUIDE, nativeField, type QueryWords, termField, typedQuery } from "@wirecat/cli-core/cli"
import {
  FACT_STATUSES,
  FACT_TYPES,
  type Fact,
  MEMORY_KINDS,
  MEMORY_SCOPES,
  MEMORY_STATUSES,
  type Memory,
} from "@wirecat/cli-core/store"

export const FACT_QUERY = {
  entity: "fact",
  backend: "native",
  fields: [
    termField("kind", "enum", "kind:decision", { values: FACT_TYPES }),
    termField("status", "enum", "status:proposed", { values: FACT_STATUSES }),
  ],
} as const satisfies QueryRegistry

export const MEMORY_QUERY = {
  entity: "memory",
  backend: "native",
  fields: [
    termField("kind", "enum", "kind:preference", { values: MEMORY_KINDS }),
    termField("status", "enum", "status:proposed", { values: MEMORY_STATUSES }),
    termField("scope", "enum", "scope:work", { values: MEMORY_SCOPES }),
  ],
} as const satisfies QueryRegistry

export const MEMORY_SEARCH_QUERY = {
  entity: "memory",
  backend: "native",
  fields: [
    nativeField({
      name: "text",
      type: "txt",
      operators: ["term", "phrase"],
      example: "text:reviews",
      relation: "words of the memory; a bare word means the same",
    }),
    termField("scope", "enum", "scope:work", { values: MEMORY_SCOPES }),
  ],
} as const satisfies QueryRegistry

/** A fact as cli-core's `fact` entity. */
export const factItem = ({ type, statement, source, confirmedBy, ...fact }: Fact) => ({
  ref: fact.ref,
  id: fact.id,
  kind: type,
  text: statement,
  status: fact.status,
  project: fact.project,
  subject: fact.subject,
  occurred_at: fact.occurredAt,
  supersedes: fact.supersedes,
  author: fact.author,
  model: fact.model,
  confirmed_by: confirmedBy,
  scope: fact.scope,
  origin: source,
  evidence: fact.evidence,
  created_at: fact.createdAt,
  updated_at: fact.updatedAt,
})

/** A memory as cli-core's `memory` entity. */
export const memoryItem = ({ body, ...memory }: Memory) => ({
  ref: memory.ref,
  id: memory.id,
  kind: memory.kind,
  text: body,
  subject: memory.subject,
  author: memory.author,
  model: memory.model,
  confidence: memory.confidence,
  status: memory.status,
  scope: memory.scope,
  supersedes: memory.supersedes,
  evidence: memory.evidence,
  last_verified_at: memory.lastVerifiedAt,
  created_at: memory.createdAt,
  updated_at: memory.updatedAt,
})

/**
 * `memories search`'s words and its `scope:` term: the store searches the words and filters the scope in one
 * query. Bare words are text, so they may repeat; everything is joined by AND.
 */
export const memorySearch = (words: QueryWords): { text: string; scope?: Memory["scope"] } => {
  const command = "memories search"
  const context = { command, guide: LIST_QUERY_GUIDE }
  const ast = validateQuery(
    parseLucene(typedQuery(words), { defaultField: "text", ...context }),
    MEMORY_SEARCH_QUERY,
    context,
  )
  const text: string[] = []
  let scope: Memory["scope"] | undefined
  const add = (node: QueryNode) => {
    if (node.kind === "boolean") {
      for (const clause of node.clauses) {
        if (clause.occur !== "must")
          queryError("query.unsupported-placement", clause.node.span, "this search joins its terms by AND", context)
        add(clause.node)
      }
      return
    }
    if (node.field === "text") text.push(node.value)
    else if (scope !== undefined) queryError("query.unsupported-placement", node.span, "scope only once here", context)
    else scope = node.value.toLowerCase() as Memory["scope"]
  }
  add(ast.root)
  if (text.length === 0)
    queryError("query.missing-value", ast.root.span, "say which words to look for beside scope:", context)
  return { text: text.join(" "), ...(scope === undefined ? {} : { scope }) }
}
