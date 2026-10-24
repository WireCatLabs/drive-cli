import { annotate } from "@wirecat/cli-base/commands"
import type { QueryRegistry } from "@wirecat/cli-base/query"
import {
  answerEntity,
  type Body,
  checkApiBody,
  checkApiParameter,
  FETCH,
  generatedApiCommand,
  itemOf,
  type ListBody,
  LOCAL_READ,
  listOf,
  NO_EFFECTS,
  queryTerms,
  readApiBody,
  termField,
  withQuery,
} from "@wirecat/cli-core/cli"
import { type Command, Option } from "commander"
import * as v from "valibot"
import { jsonObject, operationOf, operations, schemas } from "../api-contract.js"
import { fileId } from "../config.js"
import { type Download, EXPORT_FORMATS, saveDownload } from "../download.js"
import { apiMethods, validateApiParams } from "../google-api.js"
import { allOf } from "../output.js"
import { examples, GOOGLE_READ, GOOGLE_WRITE } from "../registry.js"
import { requestSchema } from "../schema.js"
import { utcDriveQuery } from "../time.js"
import { installSheetsCommands } from "./sheets.js"

const API_METHOD_QUERY = {
  entity: "api_method",
  backend: "native",
  fields: [termField("service", "enum", "service:docs", { values: ["drive", "docs", "driveactivity", "sheets"] })],
} as const satisfies QueryRegistry

export { jsonObject } from "../api-contract.js"

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
const sentParams = (method: string, params: Record<string, unknown>) => {
  if (method !== "drive.files.list" || typeof params.q !== "string") return { params }
  const { query, timezone } = utcDriveQuery(params.q)
  return { params: { ...params, q: query }, meta: timezone ? { timezone } : undefined }
}
const zoneMeta = (meta: { timezone: string } | undefined) => (meta ? { meta } : {})

export interface RemoteCommands {
  mcp?: boolean
  call(method: string, params: Record<string, unknown>, body?: Record<string, unknown>): Promise<unknown>
  output(body: Body): void
  positive(input: string): number
  readBody?: (path: string | number) => string
  download: Download
  upload(path: string, options: { name?: string; parent?: string }): Promise<unknown>
}
export const installRemoteCommands = (program: Command, helpers: RemoteCommands) => {
  const { call, output, positive } = helpers
  const page = (command: Command) =>
    command
      .option("--limit <n>", "how many items one page holds", positive, 100)
      .option("--cursor <cursor>", "continue from page.next_cursor of the previous answer")
  const fileArgument = "file id or Google Drive URL"
  const api = annotate(program.command("api"), { effects: LOCAL_READ }).description(
    "discover and call the official Drive, Docs, Sheets and Activity API methods",
  )
  withQuery(
    examples(
      answerEntity(
        annotate(api.command("list"), { effects: NO_EFFECTS }).description(
          "list the Google API methods drive can call",
        ),
        "api_method",
        v.strictObject({ name: v.string(), mutates: v.boolean(), destructive: v.boolean(), scope: v.string() }),
      ),
      ["drive api list", "drive api list service:docs"],
    ),
    API_METHOD_QUERY,
  ).action((words: string[]) =>
    output(allOf(apiMethods(queryTerms(words, API_METHOD_QUERY, "api list").get("service")))),
  )
  examples(
    annotate(api.command("show"), { effects: NO_EFFECTS })
      .description("show one method's request schema and contract, without calling Google")
      .argument("<method>", "Google method name, as api list prints it"),
    ["drive api show docs.documents.batchUpdate --json"],
  ).action((method: string) =>
    output(itemOf({ operation: operationOf(method), request_schema: requestSchema(method) })),
  )
  examples(
    annotate(api.command("call"), { mcp: false, effects: GOOGLE_WRITE })
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
      validateApiParams(args.params)
      const { params, meta } = sentParams(name, args.params)
      output(itemOf(await call(name, params, args.body), zoneMeta(meta)))
    })
  const generated = generatedApiCommand({
    operations,
    checkParameter: (name, schema, raw) => checkApiParameter(name, schema, raw, schemas),
    checkBody: (operation, text) => checkApiBody(operation, text, schemas),
    readBody: (_command, opts) => readApiBody(opts, helpers.readBody),
    execute: async (_command, operation, input) => {
      const { params, meta } = sentParams(operation.id, { ...input.path, ...input.query })
      output(
        itemOf(
          await call(operation.id, params, input.body === undefined ? undefined : jsonObject(input.body)),
          zoneMeta(meta),
        ),
      )
    },
  })
  for (const child of generated.commands) api.addCommand(child)
  installSheetsCommands(program, helpers)
  const files = annotate(program.command("files"), { effects: GOOGLE_READ }).description(
    "read and change files in Google Drive; nothing is imported",
  )
  for (const exporting of [false, true]) {
    const command = examples(
      annotate(files.command(exporting ? "export" : "download"), { effects: FETCH })
        .argument("<file>", fileArgument)
        .description(exporting ? "export a Google document to a local file" : "download a stored file to a local file"),
      [
        exporting
          ? "drive personal files export DOC_ID --format pdf --output document.pdf"
          : "drive personal files download FILE_ID --output download.bin",
      ],
    )
      .requiredOption("--output <file>", "local file to write")
      .option("--overwrite", "replace an existing output file")
    if (exporting)
      command.addOption(
        new Option("--format <format>", "format Google should export")
          .choices(Object.keys(EXPORT_FORMATS))
          .makeOptionMandatory(),
      )
    command.action(
      async (input: string, args: { output: string; overwrite?: boolean; format?: keyof typeof EXPORT_FORMATS }) => {
        const id = fileId(input)
        const mime = args.format ? EXPORT_FORMATS[args.format] : undefined
        const bytes = await saveDownload(
          args.output,
          args.overwrite === true,
          () => helpers.download(id, mime),
          helpers.mcp === true,
        )
        output(itemOf({ id, bytes, ...(args.format ? { format: args.format } : {}) }))
      },
    )
  }
  page(
    examples(
      annotate(files.command("list"), { effects: GOOGLE_READ }).description(
        "list files in Google Drive, one page at a time",
      ),
      ["drive personal files list --parent FOLDER_ID", `drive personal files list "name contains 'plan'" --limit 20`],
    ),
  )
    .argument(
      "[query...]",
      "Google Drive query the files match; trashed = false when omitted. A time without a zone is read in this computer's zone and sent as UTC",
    )
    .option("--parent <id>", "only the files directly inside this folder id")
    .action(async (words: string[], args) => {
      const typed = words.length ? words.join(" ") : "trashed = false"
      const { query, timezone } = utcDriveQuery(typed)
      return output({
        ...pageOf(
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
          { query: typed, parent: args.parent },
        ),
        ...(timezone ? { meta: { timezone } } : {}),
      })
    })
  examples(
    annotate(files.command("get"), { effects: GOOGLE_READ })
      .description("show one file's Google Drive metadata")
      .argument("<file>", fileArgument),
    ["drive personal files get FILE_ID"],
  ).action(async (id: string) =>
    output(itemOf(await call("drive.files.get", { fileId: fileId(id), fields: "*", supportsAllDrives: true }))),
  )
  examples(
    annotate(files.command("copy"), { effects: GOOGLE_WRITE })
      .description("copy a file in Google Drive")
      .argument("<file>", fileArgument),
    [`drive personal files copy FILE_ID --name "Plan copy" --parent FOLDER_ID`],
  )
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
    annotate(files.command("move"), { effects: GOOGLE_WRITE })
      .description("move a file to another Google Drive folder")
      .argument("<file>", fileArgument),
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
    annotate(files.command("update"), { effects: GOOGLE_WRITE })
      .description("change a file's Google Drive metadata")
      .argument("<file>", fileArgument),
    [`drive personal files update FILE_ID --body '{"name":"Renamed"}'`],
  )
    .requiredOption("--body <json>", "the metadata fields to change, as a JSON object", jsonObject)
    .action(async (id: string, args) =>
      output(itemOf(await call("drive.files.update", { fileId: fileId(id), supportsAllDrives: true }, args.body))),
    )
  for (const name of ["trash", "restore"] as const)
    examples(
      annotate(files.command(name), { effects: GOOGLE_WRITE })
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
    annotate(files.command("mkdir"), { effects: GOOGLE_WRITE })
      .description("create an empty folder in Google Drive")
      .argument("<name>", "folder name"),
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
  examples(
    annotate(files.command("upload"), { effects: GOOGLE_WRITE })
      .description("upload a local file to Google Drive; an interrupted upload resumes")
      .argument("<path>", "local file to upload"),
    ["drive personal files upload ./backup.db.zst --parent FOLDER_ID"],
  )
    .option("--parent <id>", "folder id to put it in; My Drive when omitted")
    .option("--name <name>", "name in Google Drive; the local file name when omitted")
    .action(async (path: string, args) =>
      output(
        itemOf(
          await helpers.upload(path, {
            ...(args.name ? { name: args.name } : {}),
            ...(args.parent ? { parent: fileId(args.parent) } : {}),
          }),
        ),
      ),
    )
  const documents = program.commands.find((command) => command.name() === "documents") as Command
  const documentArgument = "document id or Google Docs URL"
  examples(
    annotate(documents.command("get"), { effects: GOOGLE_READ })
      .argument("<document>", documentArgument)
      .description("read a document live from Google Docs, as JSON with every tab"),
    ["drive personal documents get DOC_ID --json"],
  ).action(async (id: string) =>
    output(itemOf(await call("docs.documents.get", { documentId: fileId(id), includeTabsContent: true }))),
  )
  examples(annotate(documents.command("create"), { effects: GOOGLE_WRITE }).description("create an empty Google Doc"), [
    `drive personal documents create --title "Meeting notes"`,
  ])
    .requiredOption("--title <title>", "title of the new document")
    .action(async (args) => output(itemOf(await call("docs.documents.create", {}, { title: args.title }))))
  examples(
    annotate(documents.command("update"), { effects: GOOGLE_WRITE })
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
      annotate(documents.command("history"), { effects: GOOGLE_READ })
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
    const group = annotate(program.command(resource), { effects: GOOGLE_READ }).description(
      `read the ${resource} of a file in Google Drive`,
    )
    if (resource === "comments") {
      for (const action of ["reply", "resolve", "reopen"] as const) {
        const command = examples(
          annotate(group.command(action), { effects: GOOGLE_WRITE })
            .argument("<file>", fileArgument)
            .argument("<comment-id>", "comment id from comments list")
            .description(action === "reply" ? "reply to a Google Drive comment" : `${action} a Google Drive comment`),
          [`drive personal comments ${action} FILE_ID COMMENT_ID${action === "reply" ? ' "Reply text"' : ""}`],
        )
        if (action === "reply") command.argument("<text>", "reply text")
        command.action(async (file: string, comment: string, text?: string) => {
          output(
            itemOf(
              await call(
                "drive.replies.create",
                { fileId: fileId(file), commentId: comment, fields: "*" },
                action === "reply" ? { content: text } : { action },
              ),
            ),
          )
        })
      }
    }
    page(
      examples(
        annotate(group.command("list"), { effects: GOOGLE_READ })
          .description(`list a file's ${resource}`)
          .argument("<file>", fileArgument),
        [`drive personal ${resource} list FILE_ID`],
      ),
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
      annotate(group.command("get"), { effects: GOOGLE_READ })
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
    examples(
      annotate(program.command("shared-drives"), { effects: GOOGLE_READ }).description(
        "list the shared drives this account can open",
      ),
      ["drive personal shared-drives"],
    ),
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
