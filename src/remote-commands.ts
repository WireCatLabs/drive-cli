import { CliError } from "@wirecat/cli-base"
import type { QueryRegistry } from "@wirecat/cli-base/query"
import {
  apiPlainJson,
  type Body,
  checkApiBody,
  checkApiParameter,
  generatedApiCommand,
  itemOf,
  type ListBody,
  listOf,
  parseApiJson,
  queryTerms,
  readApiBody,
  termField,
  withQuery,
} from "@wirecat/cli-core/cli"
import type { Command } from "commander"
import { operationOf, operations, schemas, validateRequest } from "./api-contract.js"
import { fileId } from "./config.js"
import { apiMethod, apiMethods, validateApiParams } from "./google-api.js"
import { allOf } from "./output.js"
import { examples } from "./registry.js"
import { requestSchema } from "./schema.js"

const API_METHOD_QUERY = {
  entity: "api_method",
  backend: "native",
  fields: [termField("service", "enum", "service:docs", { values: ["drive", "docs", "driveactivity"] })],
} as const satisfies QueryRegistry

export const jsonObject = (value: string): Record<string, unknown> => {
  const parsed = apiPlainJson(parseApiJson(value))
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
    throw new CliError("validation_error", "use a JSON object")
  return parsed as Record<string, unknown>
}
/** One page of a Google list, which names its rows `key` and the next page `nextPageToken`. */
const pageOf = (
  command: string,
  data: unknown,
  key: string,
  limit: number,
  args: Record<string, unknown>,
): ListBody<unknown> => {
  const page = data as Record<string, unknown> & { nextPageToken?: string; incompleteSearch?: boolean }
  const cursor = page.nextPageToken || undefined
  return listOf(command, {
    items: (page[key] as unknown[] | undefined) ?? [],
    limit,
    has_more: cursor !== undefined,
    paging: "cursor",
    ...(cursor ? { cursor } : {}),
    args,
    ...(page.incompleteSearch
      ? { missing: [{ field: key, why: "Google searched only some of the drives; narrow the query to search all" }] }
      : {}),
  })
}
export interface RemoteCommands {
  call(method: string, params: Record<string, unknown>, body?: Record<string, unknown>): Promise<unknown>
  output(body: Body): void
  positive(input: string): number
  readBody?: (path: string | number) => string
}
export const installRemoteCommands = (program: Command, helpers: RemoteCommands) => {
  const { call, output, positive } = helpers
  const page = (command: Command) =>
    command
      .option("--limit <n>", "how many items one page holds", positive, 100)
      .option("--cursor <cursor>", "continue from page.next_cursor of the previous answer")
  const fileArgument = "file id or Google Drive URL"
  const api = program.command("api").description("discover and call the official Drive, Docs and Activity API methods")
  withQuery(
    examples(api.command("list").description("list the Google API methods drive can call"), [
      "drive api list",
      "drive api list service:docs",
    ]),
    API_METHOD_QUERY,
  ).action((words: string[]) =>
    output(allOf(apiMethods(queryTerms(words, API_METHOD_QUERY, "api list").get("service")))),
  )
  examples(
    api
      .command("show")
      .description("show one method's request schema and contract, without calling Google")
      .argument("<method>", "Google method name, as api list prints it"),
    ["drive api show docs.documents.batchUpdate --json"],
  ).action((method: string) =>
    output(itemOf({ operation: operationOf(method), request_schema: requestSchema(method) })),
  )
  examples(
    api
      .command("call")
      .description("call one Google API method by name with JSON parameters")
      .argument("<method>", "Google method name, as api list prints it"),
    [
      `drive personal api call drive.files.get --params '{"fileId":"FILE_ID"}'`,
      `drive personal api call drive.files.update --params '{"fileId":"FILE_ID"}' --body '{"name":"New"}' --allow-writes`,
    ],
  )
    .option("--params <json>", "query and path parameters as a JSON object", jsonObject, {})
    .option("--body <json>", "request body as a JSON object", jsonObject)
    .option("--allow-writes", "allow a method that changes Google data")
    .option("--allow-delete", "allow a method that deletes for good or empties the trash")
    .action(async (name: string, args) => {
      const method = apiMethod(name)
      validateApiParams(args.params)
      if (method.mutates && !args.allowWrites)
        throw new CliError("permission_error", "this method changes Google data; pass --allow-writes", {
          reason: "write.not-allowed",
        })
      if (method.destructive && !args.allowDelete)
        throw new CliError("permission_error", "this method permanently deletes Google data; pass --allow-delete", {
          reason: "delete.not-allowed",
        })
      validateRequest(name, args.params, args.body)
      output(itemOf(await call(name, args.params, args.body)))
    })
  const generated = generatedApiCommand({
    operations,
    checkParameter: (name, schema, raw) => checkApiParameter(name, schema, raw, schemas),
    checkBody: (operation, text) => checkApiBody(operation, text, schemas),
    readBody: (_command, opts) => readApiBody(opts, helpers.readBody),
    execute: async (_command, operation, input) =>
      output(
        itemOf(
          await call(
            operation.id,
            { ...input.path, ...input.query },
            input.body === undefined ? undefined : jsonObject(input.body),
          ),
        ),
      ),
  })
  for (const child of generated.commands) api.addCommand(child)
  const files = program.command("files").description("read and change files in Google Drive; nothing is imported")
  page(
    examples(files.command("list").description("list files in Google Drive, one page at a time"), [
      "drive personal files list --parent FOLDER_ID",
      `drive personal files list "name contains 'plan'" --limit 20`,
    ]),
  )
    .argument("[query...]", "Google Drive query the files match; trashed = false when omitted")
    .option("--parent <id>", "only the files directly inside this folder id")
    .action(async (words: string[], args) => {
      const query = words.length ? words.join(" ") : "trashed = false"
      return output(
        pageOf(
          "files list",
          await call("drive.files.list", {
            q: args.parent ? `'${fileId(args.parent)}' in parents and (${query})` : query,
            pageSize: args.limit,
            ...(args.cursor ? { pageToken: args.cursor } : {}),
            supportsAllDrives: true,
            includeItemsFromAllDrives: true,
            fields: "nextPageToken,incompleteSearch,files(*)",
          }),
          "files",
          args.limit,
          { query, parent: args.parent },
        ),
      )
    })
  examples(files.command("get").description("show one file's Google Drive metadata").argument("<file>", fileArgument), [
    "drive personal files get FILE_ID",
  ]).action(async (id: string) =>
    output(itemOf(await call("drive.files.get", { fileId: fileId(id), fields: "*", supportsAllDrives: true }))),
  )
  examples(files.command("copy").description("copy a file in Google Drive").argument("<file>", fileArgument), [
    `drive personal files copy FILE_ID --name "Plan copy" --parent FOLDER_ID`,
  ])
    .option("--name <name>", "name of the copy; Google's default when omitted")
    .option("--parent <id>", "folder id to put the copy in")
    .action(async (id: string, args) =>
      output(
        itemOf(
          await call(
            "drive.files.copy",
            { fileId: fileId(id), supportsAllDrives: true },
            {
              ...(args.name ? { name: args.name } : {}),
              ...(args.parent ? { parents: [fileId(args.parent)] } : {}),
            },
          ),
        ),
      ),
    )
  examples(
    files.command("move").description("move a file to another Google Drive folder").argument("<file>", fileArgument),
    ["drive personal files move FILE_ID --parent NEW_FOLDER_ID --old-parent OLD_FOLDER_ID"],
  )
    .requiredOption("--parent <id>", "folder id to move the file into")
    .option("--old-parent <id>", "folder id to take the file out of")
    .action(async (id: string, args) =>
      output(
        itemOf(
          await call(
            "drive.files.update",
            {
              fileId: fileId(id),
              addParents: fileId(args.parent),
              ...(args.oldParent ? { removeParents: fileId(args.oldParent) } : {}),
              supportsAllDrives: true,
            },
            {},
          ),
        ),
      ),
    )
  examples(
    files.command("update").description("change a file's Google Drive metadata").argument("<file>", fileArgument),
    [`drive personal files update FILE_ID --body '{"name":"Renamed"}'`],
  )
    .requiredOption("--body <json>", "the metadata fields to change, as a JSON object", jsonObject)
    .action(async (id: string, args) =>
      output(itemOf(await call("drive.files.update", { fileId: fileId(id), supportsAllDrives: true }, args.body))),
    )
  for (const name of ["trash", "restore"] as const)
    examples(
      files
        .command(name)
        .description(name === "trash" ? "move a file to the Google Drive trash" : "take a file out of the trash")
        .argument("<file>", fileArgument),
      [`drive personal files ${name} FILE_ID`],
    ).action(async (id: string) =>
      output(
        itemOf(
          await call(
            "drive.files.update",
            { fileId: fileId(id), supportsAllDrives: true },
            { trashed: name === "trash" },
          ),
        ),
      ),
    )
  examples(
    files.command("mkdir").description("create an empty folder in Google Drive").argument("<name>", "folder name"),
    ["drive personal files mkdir Reports --parent FOLDER_ID"],
  )
    .option("--parent <id>", "folder id to create it in; My Drive when omitted")
    .action(async (name: string, args) =>
      output(
        itemOf(
          await call(
            "drive.files.create",
            { supportsAllDrives: true },
            {
              name,
              mimeType: "application/vnd.google-apps.folder",
              ...(args.parent ? { parents: [fileId(args.parent)] } : {}),
            },
          ),
        ),
      ),
    )
  const documents = program.commands.find((command) => command.name() === "documents") as Command
  const documentArgument = "document id or Google Docs URL"
  examples(
    documents
      .command("get")
      .argument("<document>", documentArgument)
      .description("read a document live from Google Docs, as JSON with every tab"),
    ["drive personal documents get DOC_ID --json"],
  ).action(async (id: string) =>
    output(itemOf(await call("docs.documents.get", { documentId: fileId(id), includeTabsContent: true }))),
  )
  examples(documents.command("create").description("create an empty Google Doc"), [
    `drive personal documents create --title "Meeting notes"`,
  ])
    .requiredOption("--title <title>", "title of the new document")
    .action(async (args) => output(itemOf(await call("docs.documents.create", {}, { title: args.title }))))
  examples(
    documents
      .command("update")
      .description("change a Google Doc with a Docs batchUpdate request")
      .argument("<document>", documentArgument),
    [`drive personal documents update DOC_ID --body '{"requests":[]}'`],
  )
    .requiredOption("--body <json>", "Docs batchUpdate body: requests and an optional writeControl", jsonObject)
    .action(async (id: string, args) =>
      output(itemOf(await call("docs.documents.batchUpdate", { documentId: fileId(id) }, args.body))),
    )
  page(
    examples(
      documents
        .command("history")
        .description("list the revisions Google kept, or who did what with --activity")
        .argument("<document>", documentArgument),
      ["drive personal documents history DOC_ID", "drive personal documents history DOC_ID --activity"],
    ),
  )
    .option("--activity", "list activity events instead of revisions; needs session start --grant activity")
    .action(async (id: string, args) => {
      const file = fileId(id)
      const data = args.activity
        ? await call(
            "driveactivity.activity.query",
            {},
            {
              itemName: `items/${file}`,
              pageSize: args.limit,
              ...(args.cursor ? { pageToken: args.cursor } : {}),
            },
          )
        : await call("drive.revisions.list", {
            fileId: file,
            pageSize: args.limit,
            ...(args.cursor ? { pageToken: args.cursor } : {}),
            fields:
              "nextPageToken,revisions(id,mimeType,modifiedTime,lastModifyingUser(permissionId,displayName,emailAddress),size)",
          })
      output(
        pageOf("documents history", data, args.activity ? "activities" : "revisions", args.limit, {
          document: id,
          activity: args.activity,
        }),
      )
    })
  for (const resource of ["comments", "permissions", "revisions"] as const) {
    const one = resource.slice(0, -1)
    const group = program.command(resource).description(`read the ${resource} of a file in Google Drive`)
    page(
      examples(group.command("list").description(`list a file's ${resource}`).argument("<file>", fileArgument), [
        `drive personal ${resource} list FILE_ID`,
      ]),
    ).action(async (id: string, args) =>
      output(
        pageOf(
          `${resource} list`,
          await call(`drive.${resource}.list`, {
            fileId: fileId(id),
            pageSize: args.limit,
            ...(args.cursor ? { pageToken: args.cursor } : {}),
            fields: "*",
            ...(resource === "permissions" ? { supportsAllDrives: true } : {}),
          }),
          resource,
          args.limit,
          { file: id },
        ),
      ),
    )
    examples(
      group
        .command("get")
        .description(`show one ${one} of a file`)
        .argument("<file>", fileArgument)
        .argument(`<${one}-id>`, `${one} id, as ${resource} list prints it`),
      [`drive personal ${resource} get FILE_ID ${one.toUpperCase()}_ID`],
    ).action(async (file: string, id: string) =>
      output(
        itemOf(
          await call(`drive.${resource}.get`, {
            fileId: fileId(file),
            [`${one}Id`]: id,
            fields: "*",
            ...(resource === "permissions" ? { supportsAllDrives: true } : {}),
          }),
        ),
      ),
    )
  }
  page(
    examples(program.command("shared-drives").description("list the shared drives this account can open"), [
      "drive personal shared-drives",
    ]),
  ).action(async (args) =>
    output(
      pageOf(
        "shared-drives",
        await call("drive.drives.list", {
          pageSize: args.limit,
          ...(args.cursor ? { pageToken: args.cursor } : {}),
          fields: "*",
        }),
        "drives",
        args.limit,
        {},
      ),
    ),
  )
}
