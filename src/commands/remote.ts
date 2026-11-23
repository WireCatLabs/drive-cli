import { createHash } from "node:crypto"
import { CliError } from "@wirecat/cli-base"
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
  snakeKeys,
  termField,
  typedQuery,
  unfilteredQuery,
  withQuery,
} from "@wirecat/cli-core/cli"
import { fileText } from "@wirecat/cli-core/documents"
import { type Command, Option } from "commander"
import * as v from "valibot"
import { changedCopy, freshness } from "../age.js"
import { jsonObject, operationOf, operations, schemas } from "../api-contract.js"
import { apiMethods, validateApiParams } from "../api-methods.js"
import { fileId } from "../config.js"
import { type Download, EXPORT_FORMATS, saveDownload } from "../download.js"
import { bytesOf } from "../drive-files.js"
import { bindQuery, driveFileQuery, FILES_QUERY, fileRow } from "../list-queries.js"
import { allOf } from "../output.js"
import { examples, GOOGLE_READ, GOOGLE_WRITE } from "../registry.js"
import { requestSchema } from "../schema.js"
import { utcDriveQuery } from "../time.js"
import type { UploadedFile } from "../upload.js"
import { type FileEdits, installFileEditCommands } from "./file-edit.js"
import { installSheetsCommands } from "./sheets.js"

/** The most of a file's text one answer holds, and the most bytes read to find it. */
const TEXT_LIMIT = 200_000
const MAX_TEXT_BYTES = 64 * 1024 * 1024

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
  stored(input: string): { id: string; doc: { metadata: { modifiedAt?: string } } }
  download: Download
  upload(path: string, options: { name?: string; parent?: string }): Promise<unknown>
  replace(id: string, from: string, mime: string | undefined): Promise<UploadedFile>
  edits: FileEdits
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
        .summary(exporting ? "export a Google document to a local file" : "download a stored file, or answer its text")
        .description(
          exporting
            ? "export a Google document to a local file"
            : "download a stored file to a local file, or answer its text and sha256 without --output. A text " +
                `longer than ${TEXT_LIMIT.toLocaleString("en")} characters is cut there with truncated: true and no ` +
                "sha256: never write a cut text back over the file, it would lose the rest",
        ),
      exporting
        ? ["drive personal files export DOC_ID --format pdf --output document.pdf"]
        : [
            "drive personal files download FILE_ID --output download.bin",
            "drive personal files download FILE_ID --json",
          ],
    )
    if (exporting)
      command
        .requiredOption("--output <file>", "local file to write")
        .addOption(
          new Option("--format <format>", "format Google should export")
            .choices(Object.keys(EXPORT_FORMATS))
            .makeOptionMandatory(),
        )
    else command.option("--output <file>", "local file to write, instead of answering the text")
    command.option("--overwrite", "replace an existing output file")
    command.action(
      async (input: string, args: { output?: string; overwrite?: boolean; format?: keyof typeof EXPORT_FORMATS }) => {
        const id = fileId(input)
        if (args.output === undefined) return output(itemOf(await textOf(id)))
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
  /** The whole text of a stored file and the sha256 of the bytes it came from, to write back with files update. */
  const textOf = async (id: string) => {
    const file = (await call("drive.files.get", {
      fileId: id,
      fields: "id,name,mimeType,size",
      supportsAllDrives: true,
    })) as { name?: string; mimeType?: string; size?: string }
    const mime = file.mimeType ?? "application/octet-stream"
    if (mime.startsWith("application/vnd.google-apps."))
      throw new CliError(
        "validation_error",
        `${id} is a Google ${mime.slice("application/vnd.google-apps.".length)} file with no stored content; ` +
          "read a Google Doc with documents get, or save any native file with files export",
        { reason: "file.native-google" },
      )
    const bytes = await bytesOf(await helpers.download(id), MAX_TEXT_BYTES)
    const name = file.name ?? id
    const text = await fileText(bytes, { name, mime }, "drive")
    const truncated = text.length > TEXT_LIMIT
    // The sha256 promises the whole file: a cut text, or one read out of a PDF, docx or xlsx, written back with
    // files update would replace the file with less.
    const whole = !truncated && Buffer.from(bytes).toString("utf8") === text
    return {
      id,
      name,
      mime_type: mime,
      size: bytes.byteLength,
      sha256: whole ? createHash("sha256").update(bytes).digest("hex") : null,
      text: text.slice(0, TEXT_LIMIT),
      truncated,
    }
  }
  bindQuery(
    page(
      examples(
        annotate(files.command("list"), { effects: GOOGLE_READ }).description(
          "list files in Google Drive, one page at a time",
        ),
        ["drive personal files list --parent FOLDER_ID", `drive personal files list 'name:"Example plan"' --limit 20`],
      ),
    ),
    FILES_QUERY,
    fileRow,
  )
    .option("--parent <id>", "only the files directly inside this folder id")
    .option("--timezone <zone>", "zone for query dates without an offset")
    .action(async (words: string[], args) => {
      const { query, timezone } = driveFileQuery(words, args.timezone)
      const typed = typedQuery(words)
      const found = pageOf(
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
        { query: typed, parent: args.parent, timezone: args.timezone },
      )
      return output({ ...found, items: found.items.map(snakeKeys), meta: { timezone } })
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
  const trashed = (id: string, trashed: boolean) =>
    call("drive.files.update", { fileId: id, supportsAllDrives: true }, { trashed }) as Promise<object>
  examples(
    annotate(files.command("trash"), { effects: GOOGLE_WRITE })
      .description("move a file to the Google Drive trash")
      .argument("<file>", fileArgument),
    ["drive personal files trash FILE_ID"],
  ).action(async (id: string) => output(itemOf(await trashed(fileId(id), true))))
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
  installFileEditCommands(files, helpers.edits, output, (id) => trashed(id, false))
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
  examples(
    annotate(documents.command("check"), { effects: GOOGLE_READ, partial: true })
      .argument("<document>", documentArgument)
      .description("ask Google whether an imported document changed since its local copy was made"),
    ["drive personal documents check DOC_ID"],
  ).action(async (input: string) => {
    const { id, doc } = helpers.stored(input)
    const live = (await call("drive.files.get", {
      fileId: id,
      fields: "modifiedTime",
      supportsAllDrives: true,
    })) as { modifiedTime?: string }
    if (!live.modifiedTime) throw new CliError("provider_error", "Google returned no modified time for this document")
    const found = freshness(live.modifiedTime, doc.metadata.modifiedAt)
    output(itemOf({ id, ...found }, changedCopy(found)))
  })
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
  const activities = annotate(program.command("activities"), { effects: GOOGLE_READ }).description(
    "read who did what with a file in Google Drive",
  )
  const activityRow = v.looseObject({ timestamp: v.optional(v.string()) })
  const activityQuery = unfilteredQuery("drive_remote_activity", activityRow)
  bindQuery(
    page(
      examples(
        annotate(activities.command("list"), { effects: GOOGLE_READ })
          .description("list who did what with a file (needs session start --grant activity)")
          .argument("<file>", fileArgument),
        ["drive personal activities list FILE_ID"],
      ),
    ),
    activityQuery,
    activityRow,
  ).action(async (id: string, words: string[], args) => {
    queryTerms(words, activityQuery, "activities list")
    return output(
      pageOf(
        "activities list",
        await call(
          "driveactivity.activity.query",
          {},
          { itemName: `items/${fileId(id)}`, pageSize: args.limit, ...(args.cursor ? { pageToken: args.cursor } : {}) },
        ),
        "activities",
        args.limit,
        { file: id },
      ),
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
    const rowSchema = v.looseObject({ id: v.optional(v.string()) })
    const query = unfilteredQuery(`drive_remote_${one}`, rowSchema)
    bindQuery(
      page(
        examples(
          annotate(group.command("list"), { effects: GOOGLE_READ })
            .description(`list a file's ${resource}`)
            .argument("<file>", fileArgument),
          [`drive personal ${resource} list FILE_ID`],
        ),
      ),
      query,
      rowSchema,
    ).action(async (id: string, words: string[], args) => {
      queryTerms(words, query, `${resource} list`)
      return output(
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
      )
    })
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
