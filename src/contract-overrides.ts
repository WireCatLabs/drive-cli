import { createHash } from "node:crypto"
import { type SharedContractOverride, sharedContracts } from "@wirecat/cli-base/commands"
import type { Command } from "commander"

const NOTES_REASON =
  "Drive notes annotate one explicitly selected imported document; document-bound arguments and receipts replace the generic note scope."

const SEARCH_REASON =
  "Drive searches imported documents and embeddings rather than live messenger messages; its default action and pagination are explicitly provider-specific."

/** A reviewed difference from Core: `before` is the fingerprint of Core's value, not its text. */
type Reviewed = Omit<SharedContractOverride, "before"> & { before: string }

const canonical = (value: unknown): unknown =>
  Array.isArray(value)
    ? value.map(canonical)
    : value && typeof value === "object"
      ? Object.fromEntries(
          Object.keys(value)
            .sort()
            .map((key) => [key, canonical((value as Record<string, unknown>)[key])]),
        )
      : value
export const fingerprint = (value: unknown): string =>
  createHash("sha256")
    .update(JSON.stringify(canonical(value ?? null)))
    .digest("hex")
    .slice(0, 16)

/**
 * The overrides cli-base checks, with Core's current value where its fingerprint is the reviewed one. A Core value
 * that changed keeps the fingerprint, so the shared check still refuses it and names the new value to review.
 */
export const reviewedOverrides = (reference: Command, reviewed: readonly Reviewed[]): SharedContractOverride[] =>
  reviewed.map((override) => {
    let node = reference
    for (const name of override.command.slice(1)) node = node.commands.find((child) => child.name() === name) ?? node
    const before = (sharedContracts(node)[node.name()] as Record<string, unknown> | undefined)?.[override.field] ?? null
    return { ...override, before: fingerprint(before) === override.before ? before : override.before }
  })

// Reviewed differences from Core. A changed default requires reviewing this declaration.
export const SHELL_OVERRIDES: Readonly<{
  notes: readonly Reviewed[]
  commands: readonly Reviewed[]
  search: readonly Reviewed[]
}> = {
  notes: [
    {
      command: ["notes"],
      field: "description",
      before: "073d38b6d7256579",
      after: "write notes about an imported document",
      reason: NOTES_REASON,
    },
    {
      command: ["notes"],
      field: "effects",
      before: "b98c7b06ed808dfb",
      after: { remote: "none", local: "read" },
      reason: NOTES_REASON,
    },
    {
      command: ["notes"],
      field: "children",
      before: "6cfec8425c19582f",
      after: ["add", "list", "show", "edit", "remove"],
      reason: NOTES_REASON,
    },
    {
      command: ["notes", "add"],
      field: "description",
      before: "98b319044cba6b7f",
      after: "write a note about a document",
      reason: NOTES_REASON,
    },
    {
      command: ["notes", "add"],
      field: "arguments",
      before: "d5010f078464b8d0",
      after: [
        {
          name: "document",
          required: true,
          variadic: false,
          description: "Google file or folder id or URL in the local catalog, or a document:<n> ref",
        },
        { name: "text", required: true, variadic: false, description: "the note's text" },
      ],
      reason: NOTES_REASON,
    },
    {
      command: ["notes", "add"],
      field: "options",
      before: "213adb539c248d7f",
      after: [{ flags: "--title <title>", description: "a title for the note", takes_value: true, mandatory: false }],
      reason: NOTES_REASON,
    },
    {
      command: ["notes", "add"],
      field: "examples",
      before: "74234e98afe7498f",
      after: ['drive personal notes add DOC_ID "Check the numbers" --title Review'],
      reason: NOTES_REASON,
    },
    {
      command: ["notes", "list"],
      field: "description",
      before: "6b866a022b5e84ce",
      after: "list a document's notes",
      reason: NOTES_REASON,
    },
    {
      command: ["notes", "list"],
      field: "query",
      before: "0b0517429a4f9613",
      after: {
        entity: "note",
        backend: "native",
        fields: [
          { name: "ref", type: "ref", operators: ["term", "phrase"], example: 'ref:"note:42"' },
          { name: "kind", type: "enum", values: ["note", "document"], operators: ["term"], example: "kind:note" },
          { name: "provider", type: "kw", operators: ["term", "phrase", "wildcard"], example: "provider:abc" },
          { name: "account", type: "kw", operators: ["term", "phrase", "wildcard"], example: "account:abc" },
          { name: "url", type: "kw", operators: ["term", "phrase", "wildcard"], example: "url:abc" },
          { name: "id", type: "kw", operators: ["term", "phrase", "wildcard"], example: "id:abc" },
          { name: "source", type: "enum", values: ["file", "internal"], operators: ["term"], example: "source:file" },
          { name: "folder_id", type: "kw", operators: ["term", "phrase", "wildcard"], example: "folder_id:abc" },
          { name: "path", type: "kw", operators: ["term", "phrase", "wildcard"], example: "path:abc" },
          { name: "title", type: "kw", operators: ["term", "phrase", "wildcard"], example: "title:abc" },
          { name: "text", type: "kw", operators: ["term", "phrase"], example: "text:review", native: true },
          { name: "revision", type: "num", operators: ["term", "range"], example: "revision>0" },
          { name: "content_hash", type: "kw", operators: ["term", "phrase", "wildcard"], example: "content_hash:abc" },
          { name: "export_path", type: "kw", operators: ["term", "phrase", "wildcard"], example: "export_path:abc" },
          { name: "created_at", type: "time", operators: ["term", "range"], example: "created_at>=7d" },
          { name: "updated_at", type: "time", operators: ["term", "range"], example: "updated_at>=7d" },
          { name: "deleted_at", type: "time", operators: ["term", "range"], example: "deleted_at>=7d" },
          { name: "tags", type: "kw", operators: ["term", "phrase", "wildcard"], example: "tags:abc" },
          { name: "excerpt", type: "kw", operators: ["term", "phrase", "wildcard"], example: "excerpt:abc" },
          {
            name: "found_by",
            type: "enum",
            values: ["title", "words", "meaning"],
            operators: ["term"],
            example: "found_by:title",
          },
        ],
      },
      reason: NOTES_REASON,
    },
    {
      command: ["notes", "list"],
      field: "arguments",
      before: "350998d1fcef909c",
      after: [
        {
          name: "document",
          required: true,
          variadic: false,
          description: "Google file or folder id or URL in the local catalog, or a document:<n> ref",
        },
        {
          name: "query",
          required: false,
          variadic: true,
          description: "field:value terms that narrow the list — the fields are below",
        },
      ],
      reason: NOTES_REASON,
    },
    {
      command: ["notes", "list"],
      field: "options",
      before: "4f53cda18c2baa0c",
      after: [
        {
          flags: "--limit <n>",
          description: "how many notes to return",
          takes_value: true,
          mandatory: false,
          default: 50,
        },
        { flags: "--page <n>", description: "which page to return", takes_value: true, mandatory: false, default: 1 },
      ],
      reason: NOTES_REASON,
    },
    {
      command: ["notes", "list"],
      field: "examples",
      before: "74234e98afe7498f",
      after: ["drive personal notes list DOC_ID", "drive personal notes list DOC_ID text:review --limit 10"],
      reason: NOTES_REASON,
    },
    {
      command: ["notes", "show"],
      field: "arguments",
      before: "ae549d47fb4ad5ab",
      after: [
        {
          name: "document",
          required: true,
          variadic: false,
          description: "Google file or folder id or URL in the local catalog, or a document:<n> ref",
        },
        { name: "note", required: true, variadic: false, description: "note:<id> reference, as notes list prints it" },
      ],
      reason: NOTES_REASON,
    },
    {
      command: ["notes", "show"],
      field: "examples",
      before: "74234e98afe7498f",
      after: ["drive personal notes show DOC_ID note:NOTE_ID"],
      reason: NOTES_REASON,
    },
    {
      command: ["notes", "edit"],
      field: "description",
      before: "e67289f2731a50ff",
      after: "replace a note's text",
      reason: NOTES_REASON,
    },
    {
      command: ["notes", "edit"],
      field: "arguments",
      before: "c7d2686d3041bb14",
      after: [
        {
          name: "document",
          required: true,
          variadic: false,
          description: "Google file or folder id or URL in the local catalog, or a document:<n> ref",
        },
        { name: "note", required: true, variadic: false, description: "note:<id> reference, as notes list prints it" },
        { name: "text", required: true, variadic: false, description: "the note's new text" },
      ],
      reason: NOTES_REASON,
    },
    {
      command: ["notes", "edit"],
      field: "options",
      before: "4f53cda18c2baa0c",
      after: [
        {
          flags: "--revision <n>",
          description: "revision from notes show; a newer note is not overwritten",
          takes_value: true,
          mandatory: true,
        },
      ],
      reason: NOTES_REASON,
    },
    {
      command: ["notes", "edit"],
      field: "examples",
      before: "74234e98afe7498f",
      after: ['drive personal notes edit DOC_ID note:NOTE_ID "Numbers checked" --revision 2'],
      reason: NOTES_REASON,
    },
    {
      command: ["notes", "remove"],
      field: "description",
      before: "aa644f1603858b41",
      after: "delete one note",
      reason: NOTES_REASON,
    },
    {
      command: ["notes", "remove"],
      field: "arguments",
      before: "ae549d47fb4ad5ab",
      after: [
        {
          name: "document",
          required: true,
          variadic: false,
          description: "Google file or folder id or URL in the local catalog, or a document:<n> ref",
        },
        { name: "note", required: true, variadic: false, description: "note:<id> reference, as notes list prints it" },
      ],
      reason: NOTES_REASON,
    },
    {
      command: ["notes", "remove"],
      field: "examples",
      before: "74234e98afe7498f",
      after: ["drive personal notes remove DOC_ID note:NOTE_ID"],
      reason: NOTES_REASON,
    },
  ],
  commands: [
    {
      command: ["commands"],
      field: "arguments",
      before: "2a309b1318d3ae57",
      after: [{ name: "path", required: false, variadic: true, description: "only this command or group, as words" }],
      reason:
        "Drive binds discovery to its profile-aware usage renderer while retaining the shared command document and evidence endpoint.",
    },
    {
      command: ["commands"],
      field: "examples",
      before: "74234e98afe7498f",
      after: ["drive commands", "drive commands files copy --json"],
      reason:
        "Drive binds discovery to its profile-aware usage renderer while retaining the shared command document and evidence endpoint.",
    },
    {
      command: ["commands", "info"],
      field: "examples",
      before: "b5111d1de1d39c3d",
      after: ["drive commands info --json"],
      reason:
        "Drive binds discovery to its profile-aware usage renderer while retaining the shared command document and evidence endpoint.",
    },
    {
      command: ["commands", "info"],
      field: "arguments",
      before: "51e2a792c77a31bd",
      after: [
        {
          name: "path",
          required: false,
          variadic: true,
          description: "one command path; without one, schemas, error reasons and explicit overrides",
        },
      ],
      reason:
        "Drive binds discovery to its profile-aware usage renderer while retaining the shared command document and evidence endpoint.",
    },
  ],
  search: [
    {
      command: ["search"],
      field: "summary",
      before: "d8f6dac5b4fe912b",
      after: null,
      reason: SEARCH_REASON,
    },
    {
      command: ["search"],
      field: "description",
      before: "600ae3fd56e9ef36",
      after: "search imported documents by words, and by meaning when indexed",
      reason: SEARCH_REASON,
    },
    {
      command: ["search"],
      field: "arguments",
      before: "4f53cda18c2baa0c",
      after: [
        {
          name: "query",
          required: true,
          variadic: false,
          description: "words to look for, and fields such as tag: and date: that every hit must match",
        },
      ],
      reason: SEARCH_REASON,
    },
    {
      command: ["search"],
      field: "options",
      before: "4f53cda18c2baa0c",
      after: [
        {
          flags: "--limit <n>",
          description: "how many results to return",
          takes_value: true,
          mandatory: false,
          default: 20,
        },
        { flags: "--page <n>", description: "which page to return", takes_value: true, mandatory: false, default: 1 },
        {
          flags: "--exact",
          description: "match the words exactly: no word forms, no meaning",
          takes_value: false,
          mandatory: false,
        },
      ],
      reason: SEARCH_REASON,
    },
    {
      command: ["search"],
      field: "children",
      before: "595cc576273270f2",
      after: [],
      reason: SEARCH_REASON,
    },
    {
      command: ["search"],
      field: "effects",
      before: "74234e98afe7498f",
      after: { remote: "none", local: "read" },
      reason: SEARCH_REASON,
    },
    {
      command: ["search"],
      field: "examples",
      before: "74234e98afe7498f",
      after: ["drive personal search budget", 'drive personal search "quarterly plan" --exact --limit 5'],
      reason: SEARCH_REASON,
    },
  ],
}
