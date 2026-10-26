import { readFileSync } from "node:fs"
import { join } from "node:path"
import { CliError, resolvePaths, saveConfigFile } from "@wirecat/cli-base"
import { AI_ENTRIES, type ConfigIssue, checkConfigText, issueMessage, usableProfileName } from "@wirecat/cli-core/cli"
import { MAX_TEXT_CHARS } from "@wirecat/cli-core/documents"
import { LEVELS } from "@wirecat/cli-core/sends"
import * as v from "valibot"
import { WIRECAT_APPLICATION } from "./oauth-application.js"

const Common = {
  ...AI_ENTRIES,
  permissions: v.optional(v.record(v.string(), v.picklist(LEVELS))),
  max_text_chars: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(MAX_TEXT_CHARS))),
}
/** Whether and how long runs are kept: one choice for the whole tool, since a failure may come before a profile. */
const RunSettings = {
  record: v.optional(v.boolean()),
  keep_runs_for_days: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1))),
  record_input: v.optional(v.boolean()),
}
export const DEFAULTS_ONLY = new Set(Object.keys(RunSettings))
export const SETTING_NAMES = new Set([...Object.keys(Common), "picture_search", ...DEFAULTS_ONLY])
const Mirror = v.strictObject({
  id: v.pipe(v.string(), v.regex(/^[a-z0-9-]{1,40}$/)),
  path: v.pipe(v.string(), v.minLength(1)),
  folder: v.pipe(v.string(), v.regex(/^[A-Za-z0-9_-]{1,200}$/)),
})
export type Mirror = v.InferOutput<typeof Mirror>
const Profile = v.strictObject({
  principal: v.string(),
  roots: v.optional(v.array(v.pipe(v.string(), v.regex(/^[A-Za-z0-9_-]{1,200}$/))), []),
  mirrors: v.optional(v.array(Mirror)),
  storage: v.picklist(["keyring", "file"]),
  picture_search: v.optional(v.boolean()),
  ...Common,
})
export const ConfigSchema = v.strictObject({
  profiles: v.optional(v.record(v.string(), Profile), {}),
  defaults: v.optional(v.strictObject({ ...Common, ...RunSettings })),
})
export type Config = v.InferOutput<typeof ConfigSchema>
export const paths = (env: NodeJS.ProcessEnv) => resolvePaths({ appName: "drive-cli", prefix: "DRIVE", env })
export const configPath = (env: NodeJS.ProcessEnv) => join(paths(env).config, "config.json")
const TOOL = "drive"

type Node = Record<string, unknown>
const isNode = (value: unknown): value is Node => typeof value === "object" && value !== null && !Array.isArray(value)

/** A profile missing a setting drive cannot work without is left out whole, so the rest of the file still loads. */
const withoutIncomplete = (raw: unknown, issues: readonly ConfigIssue[]): Node | undefined => {
  const incomplete = new Set(
    issues.flatMap((issue) => (issue.kind === "missing_setting" && issue.profile ? [issue.profile] : [])),
  )
  if (!incomplete.size || !isNode(raw) || !isNode(raw.profiles)) return undefined
  return {
    ...raw,
    profiles: Object.fromEntries(Object.entries(raw.profiles).filter(([name]) => !incomplete.has(name))),
  }
}

const examine = (text: string, file: string, knownPermissions?: ReadonlySet<string>) => {
  const check = (body: string) =>
    checkConfigText(body, { file, tool: TOOL, schema: ConfigSchema, ...(knownPermissions ? { knownPermissions } : {}) })
  const first = check(text)
  if (first.issues.some((issue) => issue.kind === "invalid_json"))
    return { raw: {}, config: { profiles: {} }, issues: first.issues }
  const raw: unknown = JSON.parse(text)
  if (first.config) return { raw, config: first.config, issues: first.issues }
  const rest = withoutIncomplete(raw, first.issues)
  const second = rest && check(JSON.stringify(rest))
  return {
    raw,
    config: second?.config ?? { profiles: {} },
    // Saved permissions are checked only in what loads, and the first pass loaded nothing.
    issues: [...first.issues, ...(second?.issues ?? []).filter((issue) => issue.kind === "unknown_permission")],
  }
}

export interface ConfigFile {
  path: string
  found: boolean
  /** The file as written, for `config set` and `unset` to change without dropping what they do not touch. */
  raw: unknown
  config: Config
  issues: ConfigIssue[]
}

/**
 * The file, what of it loads, and every problem in it, for `doctor` and `config`, which must not refuse. With
 * `knownPermissions` (drive's permission names), a saved permission naming no command is a problem too.
 */
export const inspectConfig = (env: NodeJS.ProcessEnv, knownPermissions?: ReadonlySet<string>): ConfigFile => {
  const path = configPath(env)
  let text: string
  try {
    text = readFileSync(path, "utf8")
  } catch {
    return { path, found: false, raw: {}, config: { profiles: {} }, issues: [] }
  }
  return { path, found: true, ...examine(text, path, knownPermissions) }
}

/** The problems `raw` would have as the file, for `config set` to compare before and after a change. */
export const configIssues = (raw: unknown, file: string, knownPermissions?: ReadonlySet<string>) =>
  examine(JSON.stringify(raw), file, knownPermissions).issues

export const refusal = (issues: readonly ConfigIssue[]) => new CliError("configuration_error", issueMessage(issues))

export const readConfig = (env: NodeJS.ProcessEnv, knownPermissions?: ReadonlySet<string>): Config => {
  const { config, issues } = inspectConfig(env, knownPermissions)
  if (issues.length) throw refusal(issues)
  return config
}
export const writeConfig = (env: NodeJS.ProcessEnv, config: Config) => {
  const [issue] = configIssues(config, "drive settings")
  if (issue)
    throw new CliError(
      "configuration_error",
      `drive settings: ${issue.profile === undefined ? "" : `profile ${issue.profile}: `}${issue.what}`,
    )
  saveConfigFile(configPath(env), v.parse(ConfigSchema, config))
}
export const profileName = usableProfileName
export const fileId = (input: string): string => {
  let id = input
  if (input.startsWith("https://")) {
    const url = new URL(input)
    if (url.hostname !== "drive.google.com" && url.hostname !== "docs.google.com")
      throw new CliError("validation_error", "use a Google Drive/Docs URL or file ID")
    id = url.pathname.match(/\/(?:folders|d)\/([^/]+)/)?.[1] ?? ""
  }
  if (!/^[A-Za-z0-9_-]{1,200}$/.test(id)) throw new CliError("validation_error", "invalid Google file ID")
  return id
}
export const unknownProfile = (name: string, profiles: string[]) =>
  new CliError(
    "validation_error",
    profiles.length
      ? `no profile ${name} here — profiles here: ${profiles.join(", ")}; a new one signs in with drive ${name} session start`
      : `no profiles here yet; create one with drive ${name} session start`,
    { reason: "profile.unknown", profiles },
  )
export const activeProfile = (env: NodeJS.ProcessEnv, name: string) => {
  const config = readConfig(env)
  const profile = config.profiles[profileName(name)]
  if (!profile) throw unknownProfile(name, Object.keys(config.profiles).sort())
  return profile
}
export interface OAuthApplication {
  clientId: string
  clientSecret?: string
}
export const checkTextLimit = (value: unknown): number => {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 1)
    throw new CliError("validation_error", "max_text_chars must be a positive whole number of characters")
  if (value > MAX_TEXT_CHARS)
    throw new CliError(
      "validation_error",
      `max_text_chars can be at most ${MAX_TEXT_CHARS}: the document readers return at most that many characters`,
    )
  return value
}
export const textLimit = (env: NodeJS.ProcessEnv, name: string): number =>
  activeProfile(env, name).max_text_chars ?? readConfig(env).defaults?.max_text_chars ?? MAX_TEXT_CHARS
export const pictureSearch = (env: NodeJS.ProcessEnv, name: string): boolean =>
  activeProfile(env, name).picture_search ?? false
export const application = (env: NodeJS.ProcessEnv, file?: string): OAuthApplication => {
  if (!file) {
    if (!env.DRIVE_GOOGLE_CLIENT_ID) {
      if (env.DRIVE_GOOGLE_CLIENT_SECRET)
        throw new CliError("configuration_error", "DRIVE_GOOGLE_CLIENT_SECRET requires DRIVE_GOOGLE_CLIENT_ID")
      return { ...WIRECAT_APPLICATION }
    }
    return {
      clientId: env.DRIVE_GOOGLE_CLIENT_ID,
      ...(env.DRIVE_GOOGLE_CLIENT_SECRET ? { clientSecret: env.DRIVE_GOOGLE_CLIENT_SECRET } : {}),
    }
  }
  try {
    const data = v.parse(
      v.object({
        installed: v.object({ client_id: v.pipe(v.string(), v.minLength(1)), client_secret: v.optional(v.string()) }),
      }),
      JSON.parse(readFileSync(file, "utf8")),
    )
    return {
      clientId: data.installed.client_id,
      ...(data.installed.client_secret ? { clientSecret: data.installed.client_secret } : {}),
    }
  } catch {
    throw new CliError(
      "configuration_error",
      "could not read a valid Desktop OAuth client JSON; file contents were not logged",
    )
  }
}

export const selectedFolders = (env: NodeJS.ProcessEnv, profile: string, filter: { id?: string } = {}) =>
  activeProfile(env, profile).roots.flatMap((id) => (filter.id === undefined || id === filter.id ? [{ id }] : []))
export const configuredMirrors = (env: NodeJS.ProcessEnv, profile: string, filter: Partial<Mirror> = {}) =>
  (activeProfile(env, profile).mirrors ?? []).filter((row) =>
    Object.entries(filter).every(([key, value]) => row[key as keyof Mirror] === value),
  )
export const configuredSessions = (
  env: NodeJS.ProcessEnv,
  filter: { profile?: string; storage?: string },
  knownPermissions: ReadonlySet<string>,
) =>
  Object.entries(readConfig(env, knownPermissions).profiles).flatMap(([name, row]) =>
    (filter.profile === undefined || filter.profile === name) &&
    (filter.storage === undefined || filter.storage === row.storage)
      ? [{ profile: name, selected_folders: row.roots.length, storage: row.storage }]
      : [],
  )
