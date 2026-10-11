import { CliError } from "@wirecat/cli-core"
import { apiPlainJson, parseApiJson } from "@wirecat/cli-messaging/cli"
import type { Command } from "commander"
import { fileId } from "./config.js"
import { apiMethod, apiMethods, validateApiParams } from "./google-api.js"

export const jsonObject = (value: string): Record<string, unknown> => {
  const parsed = apiPlainJson(parseApiJson(value))
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
    throw new CliError("validation_error", "use a JSON object")
  return parsed as Record<string, unknown>
}
export interface RemoteCommands {
  call(method: string, params: Record<string, unknown>, body?: Record<string, unknown>): Promise<unknown>
  output(value: unknown): void
  positive(input: string): number
}
export const installRemoteCommands = (program: Command, helpers: RemoteCommands) => {
  const { call, output, positive } = helpers
  const page = (command: Command) =>
    command
      .option("--limit <n>", "maximum items in this page", positive, 100)
      .option("--page-token <token>", "next page token returned by Google")
  const api = program.command("api").description("Discover and call the official Drive, Docs and Activity SDK methods")
  api
    .command("methods")
    .option("--service <name>", "drive, docs or driveactivity")
    .action((args: { service?: string }) =>
      output({ items: apiMethods().filter((m) => !args.service || m.name.startsWith(`${args.service}.`)) }),
    )
  api
    .command("call")
    .argument("<method>")
    .option("--params <json>", "JSON query/path parameters", jsonObject, {})
    .option("--body <json>", "JSON request body", jsonObject)
    .option("--allow-write", "explicitly permit a mutating generic method")
    .option("--allow-delete", "explicitly permit permanent deletion or emptying trash")
    .action(async (name: string, args) => {
      const method = apiMethod(name)
      validateApiParams(args.params)
      if (method.mutates && !args.allowWrite)
        throw new CliError("permission_error", "this method changes Google data; pass --allow-write")
      if (method.destructive && !args.allowDelete)
        throw new CliError("permission_error", "this method permanently deletes Google data; pass --allow-delete")
      output(await call(name, args.params, args.body))
    })
  const files = program
    .command("files")
    .description("Remote Google Drive files; results are not automatically imported")
  page(files.command("list"))
    .option("--query <q>", "Google Drive query syntax", "trashed = false")
    .option("--parent <folder>", "list immediate children of this folder")
    .action(async (args) =>
      output(
        await call("drive.files.list", {
          q: args.parent ? `'${fileId(args.parent)}' in parents and (${args.query})` : args.query,
          pageSize: args.limit,
          ...(args.pageToken ? { pageToken: args.pageToken } : {}),
          supportsAllDrives: true,
          includeItemsFromAllDrives: true,
          fields: "nextPageToken,incompleteSearch,files(*)",
        }),
      ),
    )
  files
    .command("get")
    .argument("<file>")
    .action(async (id: string) =>
      output(await call("drive.files.get", { fileId: fileId(id), fields: "*", supportsAllDrives: true })),
    )
  files
    .command("copy")
    .argument("<file>")
    .option("--name <name>")
    .option("--parent <folder>")
    .action(async (id: string, args) =>
      output(
        await call(
          "drive.files.copy",
          { fileId: fileId(id), supportsAllDrives: true },
          {
            ...(args.name ? { name: args.name } : {}),
            ...(args.parent ? { parents: [fileId(args.parent)] } : {}),
          },
        ),
      ),
    )
  files
    .command("move")
    .argument("<file>")
    .requiredOption("--to <folder>")
    .option("--from <folder>", "remove this previous parent explicitly")
    .action(async (id: string, args) =>
      output(
        await call(
          "drive.files.update",
          {
            fileId: fileId(id),
            addParents: fileId(args.to),
            ...(args.from ? { removeParents: fileId(args.from) } : {}),
            supportsAllDrives: true,
          },
          {},
        ),
      ),
    )
  files
    .command("update")
    .argument("<file>")
    .requiredOption("--body <json>", "Google File metadata patch", jsonObject)
    .action(async (id: string, args) =>
      output(await call("drive.files.update", { fileId: fileId(id), supportsAllDrives: true }, args.body)),
    )
  for (const name of ["trash", "restore"] as const)
    files
      .command(name)
      .argument("<file>")
      .action(async (id: string) =>
        output(
          await call(
            "drive.files.update",
            { fileId: fileId(id), supportsAllDrives: true },
            { trashed: name === "trash" },
          ),
        ),
      )
  files
    .command("mkdir")
    .argument("<name>")
    .option("--parent <folder>")
    .action(async (name: string, args) =>
      output(
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
    )
  const documents = program.commands.find((command) => command.name() === "documents") as Command
  documents
    .command("get")
    .argument("<document>")
    .description("Live Docs JSON with every tab")
    .action(async (id: string) =>
      output(await call("docs.documents.get", { documentId: fileId(id), includeTabsContent: true })),
    )
  documents
    .command("create")
    .requiredOption("--title <title>")
    .action(async (args) => output(await call("docs.documents.create", {}, { title: args.title })))
  documents
    .command("update")
    .argument("<document>")
    .requiredOption("--body <json>", "Docs batchUpdate body, including requests and optional writeControl", jsonObject)
    .action(async (id: string, args) =>
      output(await call("docs.documents.batchUpdate", { documentId: fileId(id) }, args.body)),
    )
  page(documents.command("history").argument("<document>"))
    .option("--activity", "read actor/activity events instead of revisions; requires session start --activity")
    .action(async (id: string, args) => {
      const file = fileId(id)
      const data = args.activity
        ? await call(
            "driveactivity.activity.query",
            {},
            {
              itemName: `items/${file}`,
              pageSize: args.limit,
              ...(args.pageToken ? { pageToken: args.pageToken } : {}),
            },
          )
        : await call("drive.revisions.list", {
            fileId: file,
            pageSize: args.limit,
            ...(args.pageToken ? { pageToken: args.pageToken } : {}),
            fields:
              "nextPageToken,revisions(id,mimeType,modifiedTime,lastModifyingUser(permissionId,displayName,emailAddress),size)",
          })
      output({
        fileId: file,
        source: args.activity ? "activity" : "revisions",
        data,
        coverage: "Google-visible events/revisions; may be incomplete, not a character-level edit history",
      })
    })
  for (const resource of ["comments", "permissions", "revisions"] as const) {
    const group = program.command(resource).description(`Remote file ${resource}; pagination tokens are returned`)
    page(group.command("list").argument("<file>")).action(async (id: string, args) =>
      output(
        await call(`drive.${resource}.list`, {
          fileId: fileId(id),
          pageSize: args.limit,
          ...(args.pageToken ? { pageToken: args.pageToken } : {}),
          fields: "*",
          ...(resource === "permissions" ? { supportsAllDrives: true } : {}),
        }),
      ),
    )
    group
      .command("get")
      .argument("<file>")
      .argument("<id>")
      .action(async (file: string, id: string) =>
        output(
          await call(`drive.${resource}.get`, {
            fileId: fileId(file),
            [`${resource.slice(0, -1)}Id`]: id,
            fields: "*",
            ...(resource === "permissions" ? { supportsAllDrives: true } : {}),
          }),
        ),
      )
  }
  page(program.command("shared-drives").description("List accessible Google Shared Drives")).action(async (args) =>
    output(
      await call("drive.drives.list", {
        pageSize: args.limit,
        ...(args.pageToken ? { pageToken: args.pageToken } : {}),
        fields: "*",
      }),
    ),
  )
}
