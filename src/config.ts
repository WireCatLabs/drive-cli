import { readFileSync, statSync } from "node:fs"
import { join } from "node:path"
import { CliError, resolvePaths, saveConfigFile, writeSecurely } from "@wirecat/cli-base"
import { AI_ENTRIES, loadSnakeCaseConfig, usableProfileName } from "@wirecat/cli-core/cli"
import { MAX_TEXT_CHARS } from "@wirecat/cli-core/documents"
import { LEVELS } from "@wirecat/cli-core/sends"
import * as v from "valibot"
import { upgradeConfig } from "./config-upgrade.js"
import { WIRECAT_APPLICATION } from "./oauth-application.js"

const Common = {
  ...AI_ENTRIES,
  permissions: v.optional(v.record(v.string(), v.picklist(LEVELS))),
  max_text_chars: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(MAX_TEXT_CHARS))),
}
export const SETTING_NAMES = new Set([...Object.keys(Common), "picture_search"])
const snakeSetting = (name: string) => name.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase()
export const configKey = (key: string) => {
  const [head = "", ...parts] = key.split(".")
  if (head === "models" && parts.length === 2) parts[1] = snakeSetting(parts[1] ?? "")
  return [snakeSetting(head), ...parts].join(".")
}
const Mirror = v.strictObject({
  id: v.pipe(v.string(), v.regex(/^[a-z0-9-]{1,40}$/)),
  path: v.pipe(v.string(), v.minLength(1)),
  folder: v.pipe(v.string(), v.regex(/^[A-Za-z0-9_-]{1,200}$/)),
})
export type Mirror = v.InferOutput<typeof Mirror>
const Profile = v.strictObject({
  principal: v.string(),
  roots: v.array(v.pipe(v.string(), v.regex(/^[A-Za-z0-9_-]{1,200}$/))),
  mirrors: v.optional(v.array(Mirror)),
  storage: v.picklist(["keyring", "file"]),
  picture_search: v.optional(v.boolean()),
  ...Common,
})
export const ConfigSchema = v.strictObject({
  profiles: v.record(v.string(), Profile),
  defaults: v.optional(v.strictObject(Common)),
  default_profile: v.optional(v.string()),
})
export type Config = v.InferOutput<typeof ConfigSchema>
export const paths = (env: NodeJS.ProcessEnv) => resolvePaths({ appName: "drive-cli", prefix: "DRIVE", env })
// Built from the key path and a fixed reason only: valibot's own messages quote the value.
const problem = (where: string, issue: v.BaseIssue<unknown>) => {
  const key = v.getDotPath(issue)
  if (key === null) return `${where} has to be a JSON object`
  if (issue.expected === "never") return `${where}: ${key} is not a known setting`
  if (issue.received === "undefined") return `${where}: ${key} is missing`
  if (issue.path?.at(-1)?.origin === "key") return `${where}: ${key} is not an allowed name`
  return `${where}: ${key} has the wrong type or is out of range`
}
const UNEXPLAINED = "drive configuration is invalid; no configuration values were logged"
// The loader's message embeds valibot's issue messages, so the file is checked again here.
const explain = (path: string, schema: v.GenericSchema): CliError => {
  let raw: unknown
  try {
    raw = JSON.parse(readFileSync(path, "utf8"))
  } catch {
    return new CliError("configuration_error", `${path} is not valid JSON`)
  }
  try {
    const issue = v.safeParse(schema, raw).issues?.[0]
    return new CliError("configuration_error", issue ? problem(path, issue) : UNEXPLAINED)
  } catch (error) {
    return error instanceof CliError ? error : new CliError("configuration_error", UNEXPLAINED)
  }
}
export const readConfig = (env: NodeJS.ProcessEnv): Config => {
  const path = join(paths(env).config, "config.json")
  let changed = false
  const schema = v.pipe(
    v.unknown(),
    v.transform((raw) => {
      const upgraded = upgradeConfig(raw, SETTING_NAMES)
      changed = upgraded.changed
      return upgraded.config
    }),
    ConfigSchema,
  )
  let config: Config
  try {
    config = loadSnakeCaseConfig(path, schema, () => ({ profiles: {} }))
  } catch {
    throw explain(path, schema)
  }
  try {
    if (changed) writeSecurely(path, `${JSON.stringify(config, null, 2)}\n`, statSync(path).mode & 0o777)
  } catch {
    throw new CliError("configuration_error", UNEXPLAINED)
  }
  return config
}
export const writeConfig = (env: NodeJS.ProcessEnv, config: Config) => {
  const checked = v.safeParse(ConfigSchema, config)
  if (!checked.success) throw new CliError("configuration_error", problem("drive settings", checked.issues[0]))
  saveConfigFile(join(paths(env).config, "config.json"), checked.output)
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
export const activeProfile = (env: NodeJS.ProcessEnv, name: string) => {
  const config = readConfig(env)
  const profile = config.profiles[profileName(name)]
  if (!profile) {
    const profiles = Object.keys(config.profiles).sort()
    throw new CliError(
      "validation_error",
      profiles.length
        ? `no profile ${name} here — profiles here: ${profiles.join(", ")}; a new one signs in with drive ${name} session start`
        : `no profiles here yet; create one with drive ${name} session start`,
      { reason: "profile.unknown", profiles },
    )
  }
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
