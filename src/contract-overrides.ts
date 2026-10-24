import type { SharedContractOverride } from "@wirecat/cli-base/commands"

// Reviewed differences from Core. A changed default requires reviewing this declaration.
export const SHELL_OVERRIDES: Readonly<{
  skill: readonly SharedContractOverride[]
  doctor: readonly SharedContractOverride[]
  mcp: readonly SharedContractOverride[]
  notes: readonly SharedContractOverride[]
  commands: readonly SharedContractOverride[]
  search: readonly SharedContractOverride[]
}> = {
  skill: [
    {
      command: ["skill"],
      field: "effects",
      before: null,
      after: {
        remote: "none",
        local: "none",
      },
      reason: "Drive binds agent installation to its own output renderer and provider skill locations.",
    },
    {
      command: ["skill", "show"],
      field: "summary",
      before: "print the tool's instructions for AI agents",
      after: "print drive's SKILL.md",
      reason: "Drive binds agent installation to its own output renderer and provider skill locations.",
    },
    {
      command: ["skill", "show"],
      field: "effects",
      before: {
        remote: "none",
        local: "read",
      },
      after: {
        remote: "none",
        local: "none",
      },
      reason: "Drive binds agent installation to its own output renderer and provider skill locations.",
    },
    {
      command: ["skill", "show"],
      field: "examples",
      before: ["drive skill show", "drive skill show follow-ups"],
      after: ["drive skill show"],
      reason: "Drive binds agent installation to its own output renderer and provider skill locations.",
    },
    {
      command: ["skill", "show"],
      field: "arguments",
      before: [
        {
          name: "name",
          required: false,
          variadic: false,
          description: "one of the skills shipped for a task: follow-ups, link-conversations",
        },
      ],
      after: [],
      reason: "Drive binds agent installation to its own output renderer and provider skill locations.",
    },
    {
      command: ["skill", "install"],
      field: "summary",
      before: "install the tool's instructions for AI agents",
      after: "put SKILL.md where Claude Code, Codex and Gemini CLI look",
      reason: "Drive binds agent installation to its own output renderer and provider skill locations.",
    },
    {
      command: ["skill", "install"],
      field: "examples",
      before: ["drive skill install --for agents"],
      after: ["drive skill install --for all"],
      reason: "Drive binds agent installation to its own output renderer and provider skill locations.",
    },
  ],
  doctor: [
    {
      command: ["doctor"],
      field: "description",
      before: "the state this installation is in, without connecting unless --online",
      after: "check this installation: config, profiles, paths; no keyring, store or network",
      reason:
        "Drive diagnoses public OAuth configuration and local paths without opening a keyring, database or Google connection.",
    },
    {
      command: ["doctor"],
      field: "effects",
      before: {
        remote: "read",
        local: "read",
      },
      after: {
        remote: "none",
        local: "read",
      },
      reason:
        "Drive diagnoses public OAuth configuration and local paths without opening a keyring, database or Google connection.",
    },
    {
      command: ["doctor"],
      field: "runnable",
      before: true,
      after: null,
      reason:
        "Drive diagnoses public OAuth configuration and local paths without opening a keyring, database or Google connection.",
    },
    {
      command: ["doctor"],
      field: "options",
      before: [
        {
          flags: "--online",
          description: "also connect once and read the account; sends nothing",
          takes_value: false,
          mandatory: false,
        },
      ],
      after: [],
      reason:
        "Drive diagnoses public OAuth configuration and local paths without opening a keyring, database or Google connection.",
    },
    {
      command: ["doctor"],
      field: "children",
      before: ["reports"],
      after: [],
      reason:
        "Drive diagnoses public OAuth configuration and local paths without opening a keyring, database or Google connection.",
    },
    {
      command: ["doctor"],
      field: "examples",
      before: null,
      after: ["drive doctor", "drive doctor --json"],
      reason:
        "Drive diagnoses public OAuth configuration and local paths without opening a keyring, database or Google connection.",
    },
  ],
  mcp: [
    {
      command: ["mcp"],
      field: "summary",
      before: "serve this profile's commands to an AI agent",
      after: null,
      reason:
        "Drive exposes Google document tools over stdio using OAuth grants and its own permission adapter; it has no HTTP transport.",
    },
    {
      command: ["mcp"],
      field: "description",
      before:
        "serve this profile to an agent over MCP, on stdin and stdout — `claude mcp add drive -- drive <profile> mcp`",
      after: "serve drive's commands to an agent over MCP: search, then read or write",
      reason:
        "Drive exposes Google document tools over stdio using OAuth grants and its own permission adapter; it has no HTTP transport.",
    },
    {
      command: ["mcp"],
      field: "runnable",
      before: true,
      after: null,
      reason:
        "Drive exposes Google document tools over stdio using OAuth grants and its own permission adapter; it has no HTTP transport.",
    },
    {
      command: ["mcp"],
      field: "options",
      before: [
        {
          flags: "--permission <key=level>",
          description:
            "make a permission stricter for this server only, like messages.send=deny; it never loosens the profile; repeat for more keys",
          takes_value: true,
          mandatory: false,
        },
        {
          flags: "--http",
          description:
            "serve over HTTP on 127.0.0.1 for ChatGPT and Claude in the browser, behind your tunnel; the profile's permissions decide",
          takes_value: false,
          mandatory: false,
        },
        {
          flags: "--port <port>",
          description: "the local port for --http (default 8765)",
          takes_value: true,
          mandatory: false,
        },
        {
          flags: "--public-url <url>",
          description: "the tunnel's https address the browser apps use, e.g. https://<name>.ts.net",
          takes_value: true,
          mandatory: false,
        },
        {
          flags: "--revoke",
          description: "forget every login given to a browser app; each must log in again",
          takes_value: false,
          mandatory: false,
        },
      ],
      after: [
        {
          flags: "--tools",
          description: "list the commands the server offers instead of starting it",
          takes_value: false,
          mandatory: false,
        },
      ],
      reason:
        "Drive exposes Google document tools over stdio using OAuth grants and its own permission adapter; it has no HTTP transport.",
    },
    {
      command: ["mcp"],
      field: "children",
      before: ["config", "add", "check"],
      after: [],
      reason:
        "Drive exposes Google document tools over stdio using OAuth grants and its own permission adapter; it has no HTTP transport.",
    },
    {
      command: ["mcp"],
      field: "examples",
      before: null,
      after: ["drive personal mcp", "drive personal mcp --tools"],
      reason:
        "Drive exposes Google document tools over stdio using OAuth grants and its own permission adapter; it has no HTTP transport.",
    },
  ],
  notes: [
    {
      command: ["notes"],
      field: "description",
      before: "notes kept in the shared store",
      after: "write notes about an imported document",
      reason:
        "Drive notes annotate one explicitly selected imported document; document-bound arguments and receipts replace the generic note scope.",
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
      reason:
        "Drive notes annotate one explicitly selected imported document; document-bound arguments and receipts replace the generic note scope.",
    },
    {
      command: ["notes"],
      field: "children",
      before: ["list", "show", "add", "edit", "remove"],
      after: ["add", "list", "show", "edit", "remove"],
      reason:
        "Drive notes annotate one explicitly selected imported document; document-bound arguments and receipts replace the generic note scope.",
    },
    {
      command: ["notes", "add"],
      field: "description",
      before: "write a note",
      after: "write a note about a document",
      reason:
        "Drive notes annotate one explicitly selected imported document; document-bound arguments and receipts replace the generic note scope.",
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
      reason:
        "Drive notes annotate one explicitly selected imported document; document-bound arguments and receipts replace the generic note scope.",
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
      reason:
        "Drive notes annotate one explicitly selected imported document; document-bound arguments and receipts replace the generic note scope.",
    },
    {
      command: ["notes", "add"],
      field: "examples",
      before: null,
      after: ['drive personal notes add DOC_ID "Check the numbers" --title Review'],
      reason:
        "Drive notes annotate one explicitly selected imported document; document-bound arguments and receipts replace the generic note scope.",
    },
    {
      command: ["notes", "list"],
      field: "description",
      before: "list stored notes",
      after: "list a document's notes",
      reason:
        "Drive notes annotate one explicitly selected imported document; document-bound arguments and receipts replace the generic note scope.",
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
            name: "text",
            type: "txt",
            operators: ["term", "phrase"],
            example: "text:review",
            native: true,
          },
        ],
      },
      reason:
        "Drive notes annotate one explicitly selected imported document; document-bound arguments and receipts replace the generic note scope.",
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
          description: 'text:word or text:"a phrase" a note must contain',
        },
      ],
      reason:
        "Drive notes annotate one explicitly selected imported document; document-bound arguments and receipts replace the generic note scope.",
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
      reason:
        "Drive notes annotate one explicitly selected imported document; document-bound arguments and receipts replace the generic note scope.",
    },
    {
      command: ["notes", "list"],
      field: "examples",
      before: null,
      after: ["drive personal notes list DOC_ID", "drive personal notes list DOC_ID text:review --limit 10"],
      reason:
        "Drive notes annotate one explicitly selected imported document; document-bound arguments and receipts replace the generic note scope.",
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
      reason:
        "Drive notes annotate one explicitly selected imported document; document-bound arguments and receipts replace the generic note scope.",
    },
    {
      command: ["notes", "show"],
      field: "examples",
      before: null,
      after: ["drive personal notes show DOC_ID note:NOTE_ID"],
      reason:
        "Drive notes annotate one explicitly selected imported document; document-bound arguments and receipts replace the generic note scope.",
    },
    {
      command: ["notes", "edit"],
      field: "description",
      before: "change a note",
      after: "replace a note's text",
      reason:
        "Drive notes annotate one explicitly selected imported document; document-bound arguments and receipts replace the generic note scope.",
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
      reason:
        "Drive notes annotate one explicitly selected imported document; document-bound arguments and receipts replace the generic note scope.",
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
      reason:
        "Drive notes annotate one explicitly selected imported document; document-bound arguments and receipts replace the generic note scope.",
    },
    {
      command: ["notes", "edit"],
      field: "examples",
      before: null,
      after: ['drive personal notes edit DOC_ID note:NOTE_ID "Numbers checked" --revision 2'],
      reason:
        "Drive notes annotate one explicitly selected imported document; document-bound arguments and receipts replace the generic note scope.",
    },
    {
      command: ["notes", "remove"],
      field: "description",
      before: "remove a note",
      after: "delete one note",
      reason:
        "Drive notes annotate one explicitly selected imported document; document-bound arguments and receipts replace the generic note scope.",
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
      reason:
        "Drive notes annotate one explicitly selected imported document; document-bound arguments and receipts replace the generic note scope.",
    },
    {
      command: ["notes", "remove"],
      field: "examples",
      before: null,
      after: ["drive personal notes remove DOC_ID note:NOTE_ID"],
      reason:
        "Drive notes annotate one explicitly selected imported document; document-bound arguments and receipts replace the generic note scope.",
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
          description: "one command path, for example: search messages; inspect other groups in separate calls",
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
      before: ["drive commands info messages list"],
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
      reason:
        "Drive searches imported documents and embeddings rather than live messenger messages; its default action and pagination are explicitly provider-specific.",
    },
    {
      command: ["search"],
      field: "description",
      before:
        "find things by text: one resource when you know it (messages, notes), or search all across messages and notes; for mail, the separate memo CLI: memo search mail",
      after: "search imported documents by words, and by meaning when indexed",
      reason:
        "Drive searches imported documents and embeddings rather than live messenger messages; its default action and pagination are explicitly provider-specific.",
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
          description: "words to look for",
        },
      ],
      reason:
        "Drive searches imported documents and embeddings rather than live messenger messages; its default action and pagination are explicitly provider-specific.",
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
      reason:
        "Drive searches imported documents and embeddings rather than live messenger messages; its default action and pagination are explicitly provider-specific.",
    },
    {
      command: ["search"],
      field: "children",
      before: ["all", "messages", "notes", "conversations", "runs"],
      after: [],
      reason:
        "Drive searches imported documents and embeddings rather than live messenger messages; its default action and pagination are explicitly provider-specific.",
    },
    {
      command: ["search"],
      field: "effects",
      before: null,
      after: {
        remote: "none",
        local: "read",
      },
      reason:
        "Drive searches imported documents and embeddings rather than live messenger messages; its default action and pagination are explicitly provider-specific.",
    },
    {
      command: ["search"],
      field: "examples",
      before: null,
      after: ["drive personal search budget", 'drive personal search "quarterly plan" --exact --limit 5'],
      reason:
        "Drive searches imported documents and embeddings rather than live messenger messages; its default action and pagination are explicitly provider-specific.",
    },
  ],
}
