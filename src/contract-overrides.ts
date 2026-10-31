import type { SharedContractOverride } from "@wirecat/cli-base/commands"

const NOTES_REASON =
  "Drive notes annotate one explicitly selected imported document; document-bound arguments and receipts replace the generic note scope."

const SEARCH_REASON =
  "Drive searches imported documents and embeddings rather than live messenger messages; its default action and pagination are explicitly provider-specific."

// Reviewed differences from Core. A changed default requires reviewing this declaration.
export const SHELL_OVERRIDES: Readonly<{
  notes: readonly SharedContractOverride[]
  commands: readonly SharedContractOverride[]
  search: readonly SharedContractOverride[]
}> = {
  notes: [
    {
      command: ["notes"],
      field: "description",
      before: "notes kept in the shared store",
      after: "write notes about an imported document",
      reason: NOTES_REASON,
    },
    {
      command: ["notes"],
      field: "effects",
      before: {
        remote: "none",
        local: "none",
      },
      after: {
        remote: "none",
        local: "read",
      },
      reason: NOTES_REASON,
    },
    {
      command: ["notes"],
      field: "children",
      before: ["list", "show", "add", "edit", "remove"],
      after: ["add", "list", "show", "edit", "remove"],
      reason: NOTES_REASON,
    },
    {
      command: ["notes", "add"],
      field: "description",
      before: "write a note",
      after: "write a note about a document",
      reason: NOTES_REASON,
    },
    {
      command: ["notes", "add"],
      field: "arguments",
      before: [
        {
          name: "text",
          required: true,
          variadic: false,
          description: "note text",
        },
      ],
      after: [
        {
          name: "document",
          required: true,
          variadic: false,
          description: "Google file or folder id or URL in the local catalog",
        },
        {
          name: "text",
          required: true,
          variadic: false,
          description: "the note's text",
        },
      ],
      reason: NOTES_REASON,
    },
    {
      command: ["notes", "add"],
      field: "options",
      before: [
        {
          flags: "--subject <ref>",
          description: "stored resource the note describes",
          takes_value: true,
          mandatory: false,
        },
      ],
      after: [
        {
          flags: "--title <title>",
          description: "a title for the note",
          takes_value: true,
          mandatory: false,
        },
      ],
      reason: NOTES_REASON,
    },
    {
      command: ["notes", "add"],
      field: "examples",
      before: null,
      after: ['drive personal notes add DOC_ID "Check the numbers" --title Review'],
      reason: NOTES_REASON,
    },
    {
      command: ["notes", "list"],
      field: "description",
      before: "list stored notes",
      after: "list a document's notes",
      reason: NOTES_REASON,
    },
    {
      command: ["notes", "list"],
      field: "query",
      before: {
        entity: "note",
        backend: "native",
        fields: [
          {
            name: "ref",
            type: "ref",
            operators: ["term", "phrase"],
            example: 'ref:"note:42"',
          },
          {
            name: "kind",
            type: "enum",
            values: ["note", "document"],
            operators: ["term"],
            example: "kind:note",
          },
          {
            name: "provider",
            type: "kw",
            operators: ["term", "phrase", "wildcard"],
            example: "provider:abc",
          },
          {
            name: "account",
            type: "kw",
            operators: ["term", "phrase", "wildcard"],
            example: "account:abc",
          },
          {
            name: "url",
            type: "kw",
            operators: ["term", "phrase", "wildcard"],
            example: "url:abc",
          },
          {
            name: "id",
            type: "kw",
            operators: ["term", "phrase", "wildcard"],
            example: "id:abc",
          },
          {
            name: "source",
            type: "enum",
            values: ["file", "internal"],
            operators: ["term"],
            example: "source:file",
          },
          {
            name: "folder_id",
            type: "kw",
            operators: ["term", "phrase", "wildcard"],
            example: "folder_id:abc",
          },
          {
            name: "path",
            type: "kw",
            operators: ["term", "phrase", "wildcard"],
            example: "path:abc",
          },
          {
            name: "title",
            type: "kw",
            operators: ["term", "phrase", "wildcard"],
            example: "title:abc",
          },
          {
            name: "text",
            type: "kw",
            operators: ["term", "phrase", "wildcard"],
            example: "text:abc",
          },
          {
            name: "revision",
            type: "num",
            operators: ["term", "range"],
            example: "revision>0",
          },
          {
            name: "content_hash",
            type: "kw",
            operators: ["term", "phrase", "wildcard"],
            example: "content_hash:abc",
          },
          {
            name: "export_path",
            type: "kw",
            operators: ["term", "phrase", "wildcard"],
            example: "export_path:abc",
          },
          {
            name: "created_at",
            type: "time",
            operators: ["term", "range"],
            example: "created_at>=7d",
          },
          {
            name: "updated_at",
            type: "time",
            operators: ["term", "range"],
            example: "updated_at>=7d",
          },
          {
            name: "deleted_at",
            type: "time",
            operators: ["term", "range"],
            example: "deleted_at>=7d",
          },
          {
            name: "tags",
            type: "kw",
            operators: ["term", "phrase", "wildcard"],
            example: "tags:abc",
          },
          {
            name: "excerpt",
            type: "kw",
            operators: ["term", "phrase", "wildcard"],
            example: "excerpt:abc",
          },
          {
            name: "found_by",
            type: "enum",
            values: ["title", "words", "meaning"],
            operators: ["term"],
            example: "found_by:title",
          },
        ],
      },
      after: {
        entity: "note",
        backend: "native",
        fields: [
          {
            name: "ref",
            type: "ref",
            operators: ["term", "phrase"],
            example: 'ref:"note:42"',
          },
          {
            name: "kind",
            type: "enum",
            values: ["note", "document"],
            operators: ["term"],
            example: "kind:note",
          },
          {
            name: "provider",
            type: "kw",
            operators: ["term", "phrase", "wildcard"],
            example: "provider:abc",
          },
          {
            name: "account",
            type: "kw",
            operators: ["term", "phrase", "wildcard"],
            example: "account:abc",
          },
          {
            name: "url",
            type: "kw",
            operators: ["term", "phrase", "wildcard"],
            example: "url:abc",
          },
          {
            name: "id",
            type: "kw",
            operators: ["term", "phrase", "wildcard"],
            example: "id:abc",
          },
          {
            name: "source",
            type: "enum",
            values: ["file", "internal"],
            operators: ["term"],
            example: "source:file",
          },
          {
            name: "folder_id",
            type: "kw",
            operators: ["term", "phrase", "wildcard"],
            example: "folder_id:abc",
          },
          {
            name: "path",
            type: "kw",
            operators: ["term", "phrase", "wildcard"],
            example: "path:abc",
          },
          {
            name: "title",
            type: "kw",
            operators: ["term", "phrase", "wildcard"],
            example: "title:abc",
          },
          {
            name: "text",
            type: "kw",
            operators: ["term", "phrase"],
            example: "text:review",
            native: true,
          },
          {
            name: "revision",
            type: "num",
            operators: ["term", "range"],
            example: "revision>0",
          },
          {
            name: "content_hash",
            type: "kw",
            operators: ["term", "phrase", "wildcard"],
            example: "content_hash:abc",
          },
          {
            name: "export_path",
            type: "kw",
            operators: ["term", "phrase", "wildcard"],
            example: "export_path:abc",
          },
          {
            name: "created_at",
            type: "time",
            operators: ["term", "range"],
            example: "created_at>=7d",
          },
          {
            name: "updated_at",
            type: "time",
            operators: ["term", "range"],
            example: "updated_at>=7d",
          },
          {
            name: "deleted_at",
            type: "time",
            operators: ["term", "range"],
            example: "deleted_at>=7d",
          },
          {
            name: "tags",
            type: "kw",
            operators: ["term", "phrase", "wildcard"],
            example: "tags:abc",
          },
          {
            name: "excerpt",
            type: "kw",
            operators: ["term", "phrase", "wildcard"],
            example: "excerpt:abc",
          },
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
      before: [
        {
          name: "query",
          required: false,
          variadic: true,
          description: "field:value terms; this list filters by none yet",
        },
      ],
      after: [
        {
          name: "document",
          required: true,
          variadic: false,
          description: "Google file or folder id or URL in the local catalog",
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
      before: [],
      after: [
        {
          flags: "--limit <n>",
          description: "how many notes to return",
          takes_value: true,
          mandatory: false,
          default: 50,
        },
        {
          flags: "--page <n>",
          description: "which page to return",
          takes_value: true,
          mandatory: false,
          default: 1,
        },
      ],
      reason: NOTES_REASON,
    },
    {
      command: ["notes", "list"],
      field: "examples",
      before: null,
      after: ["drive personal notes list DOC_ID", "drive personal notes list DOC_ID text:review --limit 10"],
      reason: NOTES_REASON,
    },
    {
      command: ["notes", "show"],
      field: "arguments",
      before: [
        {
          name: "note",
          required: true,
          variadic: false,
          description: "stored note reference",
        },
      ],
      after: [
        {
          name: "document",
          required: true,
          variadic: false,
          description: "Google file or folder id or URL in the local catalog",
        },
        {
          name: "note",
          required: true,
          variadic: false,
          description: "note:<id> reference, as notes list prints it",
        },
      ],
      reason: NOTES_REASON,
    },
    {
      command: ["notes", "show"],
      field: "examples",
      before: null,
      after: ["drive personal notes show DOC_ID note:NOTE_ID"],
      reason: NOTES_REASON,
    },
    {
      command: ["notes", "edit"],
      field: "description",
      before: "change a note",
      after: "replace a note's text",
      reason: NOTES_REASON,
    },
    {
      command: ["notes", "edit"],
      field: "arguments",
      before: [
        {
          name: "note",
          required: true,
          variadic: false,
          description: "stored note reference",
        },
        {
          name: "text",
          required: true,
          variadic: false,
          description: "replacement text",
        },
      ],
      after: [
        {
          name: "document",
          required: true,
          variadic: false,
          description: "Google file or folder id or URL in the local catalog",
        },
        {
          name: "note",
          required: true,
          variadic: false,
          description: "note:<id> reference, as notes list prints it",
        },
        {
          name: "text",
          required: true,
          variadic: false,
          description: "the note's new text",
        },
      ],
      reason: NOTES_REASON,
    },
    {
      command: ["notes", "edit"],
      field: "options",
      before: [],
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
      before: null,
      after: ['drive personal notes edit DOC_ID note:NOTE_ID "Numbers checked" --revision 2'],
      reason: NOTES_REASON,
    },
    {
      command: ["notes", "remove"],
      field: "description",
      before: "remove a note",
      after: "delete one note",
      reason: NOTES_REASON,
    },
    {
      command: ["notes", "remove"],
      field: "arguments",
      before: [
        {
          name: "note",
          required: true,
          variadic: false,
          description: "stored note reference",
        },
      ],
      after: [
        {
          name: "document",
          required: true,
          variadic: false,
          description: "Google file or folder id or URL in the local catalog",
        },
        {
          name: "note",
          required: true,
          variadic: false,
          description: "note:<id> reference, as notes list prints it",
        },
      ],
      reason: NOTES_REASON,
    },
    {
      command: ["notes", "remove"],
      field: "examples",
      before: null,
      after: ["drive personal notes remove DOC_ID note:NOTE_ID"],
      reason: NOTES_REASON,
    },
  ],
  commands: [
    {
      command: ["commands"],
      field: "arguments",
      before: [
        {
          name: "path",
          required: false,
          variadic: true,
          description: "one command path, for example: commands info; inspect other groups in separate calls",
        },
      ],
      after: [
        {
          name: "path",
          required: false,
          variadic: true,
          description: "only this command or group, as words",
        },
      ],
      reason:
        "Drive binds discovery to its profile-aware usage renderer while retaining the shared command document and evidence endpoint.",
    },
    {
      command: ["commands"],
      field: "examples",
      before: null,
      after: ["drive commands", "drive commands files copy --json"],
      reason:
        "Drive binds discovery to its profile-aware usage renderer while retaining the shared command document and evidence endpoint.",
    },
    {
      command: ["commands", "info"],
      field: "examples",
      before: ["drive commands info commands"],
      after: ["drive commands info --json"],
      reason:
        "Drive binds discovery to its profile-aware usage renderer while retaining the shared command document and evidence endpoint.",
    },
    {
      command: ["commands", "info"],
      field: "arguments",
      before: [
        {
          name: "path",
          required: false,
          variadic: true,
          description: "one command path; without one, export schemas, error reasons and explicit overrides",
        },
      ],
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
      before: "search the local archive",
      after: null,
      reason: SEARCH_REASON,
    },
    {
      command: ["search"],
      field: "description",
      before:
        "find things by text: one resource when you know it (messages, notes), or search all across messages and notes; for mail, the separate memo CLI: memo search mail",
      after: "search imported documents by words, and by meaning when indexed",
      reason: SEARCH_REASON,
    },
    {
      command: ["search"],
      field: "arguments",
      before: [],
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
      before: [],
      after: [
        {
          flags: "--limit <n>",
          description: "how many results to return",
          takes_value: true,
          mandatory: false,
          default: 20,
        },
        {
          flags: "--page <n>",
          description: "which page to return",
          takes_value: true,
          mandatory: false,
          default: 1,
        },
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
      before: ["all", "messages", "notes", "conversations", "runs"],
      after: [],
      reason: SEARCH_REASON,
    },
    {
      command: ["search"],
      field: "effects",
      before: null,
      after: {
        remote: "none",
        local: "read",
      },
      reason: SEARCH_REASON,
    },
    {
      command: ["search"],
      field: "examples",
      before: null,
      after: ["drive personal search budget", 'drive personal search "quarterly plan" --exact --limit 5'],
      reason: SEARCH_REASON,
    },
  ],
}
