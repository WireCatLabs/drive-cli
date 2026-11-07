import { CliError } from "@wirecat/cli-base"
import type { ListBody } from "@wirecat/cli-core/cli"
import { listOf } from "@wirecat/cli-core/cli"
import * as v from "valibot"
import { FOLDER } from "./model.js"
import { MAX_ENTRIES } from "./supported.js"

/** Not a Google id: Drive has no folder for the files others shared, so browse names that root itself. */
export const SHARED_WITH_ME = "shared-with-me"

export type Call = (method: string, params: Record<string, unknown>) => Promise<unknown>

export const browseRow = v.strictObject({
  id: v.string(),
  name: v.string(),
  kind: v.picklist(["my_drive", "shared_with_me", "shared_drive", "folder"]),
  parent: v.nullable(v.string()),
  location: v.picklist(["my_drive", "shared_with_me", "shared_drive"]),
  drive_id: v.nullable(v.string()),
  child_folders: v.nullable(v.number()),
  added: v.boolean(),
})
export type BrowseRow = v.InferOutput<typeof browseRow>

export const BROWSE_HELP = `
Each item, one level of the tree (--json prints them under "items"):
  id             folder id to pass to --parent or to folders add; shared-with-me at the top level
  name           folder name as Google shows it
  kind           my_drive, shared_with_me or shared_drive (the top level), folder (below it)
  parent         the --parent given, or null at the top level
  location       where the folder lives: my_drive, shared_with_me or shared_drive
  drive_id       the shared drive's id, or null
  child_folders  folders directly inside it, or null when not counted (Shared with me, a level of over 1000 folders)
  added          whether sync already imports this folder (folders add)
Folders are listed by name. Only folders are listed; files inside them are not.
Failures carry error.reason: oauth.missing (not signed in), oauth.expired (sign in again),
provider.rate-limited (retry later), not_found code (no such folder).`

const PAGE_BOUND = 1000
const COUNTED_LEVEL = 1000
const COUNT_CHUNK = 50
const SAFE_ID = /^[A-Za-z0-9_-]{1,200}$/
const NOT_TRASHED_FOLDER = `mimeType = '${FOLDER}' and trashed = false`
const ACROSS_DRIVES = { supportsAllDrives: true, includeItemsFromAllDrives: true }

interface Page<T> {
  nextPageToken?: string | null
  incompleteSearch?: boolean | null
  [key: string]: T[] | string | boolean | null | undefined
}

/** Every page of one Google list, bounded like sync's folder listing. */
const everyPage = async <T>(call: Call, method: string, params: Record<string, unknown>, key: string) => {
  const rows: T[] = []
  const seen = new Set<string>()
  let incomplete = false
  let pageToken: string | undefined
  for (let page = 0; page < PAGE_BOUND; page++) {
    const data = ((await call(method, { ...params, ...(pageToken ? { pageToken } : {}) })) ?? {}) as Page<T>
    for (const row of (data[key] as T[] | undefined) ?? []) rows.push(row)
    if (data.incompleteSearch) incomplete = true
    if (rows.length > MAX_ENTRIES)
      throw new CliError(
        "provider_error",
        `this level holds more than ${MAX_ENTRIES} folders; drive lists at most that`,
        {
          reason: "listing.too-large",
        },
      )
    if (!data.nextPageToken) return { rows, incomplete }
    if (seen.has(data.nextPageToken)) throw new CliError("invalid_response", "Google repeated a folder page token")
    seen.add(data.nextPageToken)
    pageToken = data.nextPageToken
  }
  throw new CliError("provider_error", "folder pagination exceeded its bound", { reason: "listing.too-large" })
}

interface DriveFolder {
  id?: string | null
  name?: string | null
  driveId?: string | null
  ownedByMe?: boolean | null
  parents?: string[] | null
}

/** One batched query per 50 folders instead of one per folder; null when the level is too big to count. */
const childCounts = async (call: Call, ids: string[]): Promise<Map<string, number> | undefined> => {
  const counted = ids.filter((id) => SAFE_ID.test(id))
  if (counted.length > COUNTED_LEVEL) return undefined
  const counts = new Map(counted.map((id) => [id, 0]))
  for (let start = 0; start < counted.length; start += COUNT_CHUNK) {
    const chunk = counted.slice(start, start + COUNT_CHUNK)
    const { rows, incomplete } = await everyPage<DriveFolder>(
      call,
      "drive.files.list",
      {
        q: `${NOT_TRASHED_FOLDER} and (${chunk.map((id) => `'${id}' in parents`).join(" or ")})`,
        fields: "nextPageToken,incompleteSearch,files(parents)",
        pageSize: 1000,
        ...ACROSS_DRIVES,
      },
      "files",
    )
    if (incomplete) return undefined
    for (const row of rows)
      for (const parent of row.parents ?? []) {
        const count = counts.get(parent)
        if (count !== undefined) counts.set(parent, count + 1)
      }
  }
  return counts
}

const byName = (a: BrowseRow, b: BrowseRow) =>
  a.name.localeCompare(b.name, undefined, { sensitivity: "base", numeric: true }) || a.id.localeCompare(b.id)

const listed = (items: BrowseRow[], incomplete: boolean): ListBody<BrowseRow> =>
  listOf("", {
    items,
    limit: Math.max(1, items.length),
    has_more: false,
    ...(incomplete
      ? { missing: [{ field: "items", why: "Google searched only some of the drives; some folders may be missing" }] }
      : {}),
  })

const roots = async (call: Call, added: (id: string) => boolean): Promise<ListBody<BrowseRow>> => {
  const myDrive = ((await call("drive.files.get", { fileId: "root", fields: "id" })) ?? {}) as DriveFolder
  if (!myDrive.id) throw new CliError("invalid_response", "Google did not return the My Drive folder")
  const { rows: drives } = await everyPage<{ id?: string | null; name?: string | null }>(
    call,
    "drive.drives.list",
    { pageSize: 100, fields: "nextPageToken,drives(id,name)" },
    "drives",
  )
  const shared = drives.flatMap((drive) => (drive.id ? [{ id: drive.id, name: drive.name ?? "" }] : []))
  const counts = await childCounts(call, [myDrive.id, ...shared.map((drive) => drive.id)])
  const top = (id: string, name: string, kind: "my_drive" | "shared_with_me" | "shared_drive"): BrowseRow => ({
    id,
    name,
    kind,
    parent: null,
    location: kind,
    drive_id: kind === "shared_drive" ? id : null,
    child_folders: kind === "shared_with_me" ? null : (counts?.get(id) ?? null),
    added: added(id) || (kind === "my_drive" && added("root")),
  })
  return listed(
    [
      top(myDrive.id, "My Drive", "my_drive"),
      top(SHARED_WITH_ME, "Shared with me", "shared_with_me"),
      ...shared.map((drive) => top(drive.id, drive.name, "shared_drive")).sort(byName),
    ],
    false,
  )
}

/** One level of the owner's remote folders, read-only: the top level, or the folders directly inside `parent`. */
export const browseFolders = async (
  call: Call,
  parent: string | undefined,
  selected: readonly string[],
): Promise<ListBody<BrowseRow>> => {
  const added = (id: string) => selected.includes(id)
  if (parent === undefined) return roots(call, added)
  const { rows, incomplete } = await everyPage<DriveFolder>(
    call,
    "drive.files.list",
    {
      q:
        parent === SHARED_WITH_ME
          ? `sharedWithMe = true and ${NOT_TRASHED_FOLDER}`
          : `'${parent}' in parents and ${NOT_TRASHED_FOLDER}`,
      fields: "nextPageToken,incompleteSearch,files(id,name,driveId,ownedByMe)",
      pageSize: 1000,
      ...ACROSS_DRIVES,
    },
    "files",
  )
  const folders = rows.filter((row): row is DriveFolder & { id: string } => Boolean(row.id))
  const counts = await childCounts(
    call,
    folders.map((folder) => folder.id),
  )
  const items = folders.map(
    (folder): BrowseRow => ({
      id: folder.id,
      name: folder.name ?? "",
      kind: "folder",
      parent,
      location: folder.driveId ? "shared_drive" : folder.ownedByMe === false ? "shared_with_me" : "my_drive",
      drive_id: folder.driveId ?? null,
      child_folders: counts?.get(folder.id) ?? null,
      added: added(folder.id),
    }),
  )
  return listed(items.sort(byName), incomplete)
}
