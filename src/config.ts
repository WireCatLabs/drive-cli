import { readFileSync } from "node:fs"
import { join } from "node:path"
import { CliError, loadConfigFile, resolvePaths, saveConfigFile } from "@wirecat/cli-core"
import { AI_ENTRIES, usableProfileName } from "@wirecat/cli-messaging/cli"
import { LEVELS } from "@wirecat/cli-messaging/sends"
import * as v from "valibot"

const Common = {
  ...AI_ENTRIES,
  readOnly: v.optional(v.boolean()),
  permissions: v.optional(v.record(v.string(), v.picklist(LEVELS))),
}
const Profile = v.strictObject({
  principal: v.string(),
  roots: v.array(v.pipe(v.string(), v.regex(/^[A-Za-z0-9_-]{1,200}$/))),
  storage: v.picklist(["keyring", "file"]),
  ...Common,
})
export const ConfigSchema = v.strictObject({
  profiles: v.record(v.string(), Profile),
  defaults: v.optional(v.strictObject(Common)),
  defaultProfile: v.optional(v.string()),
})
export type Config = v.InferOutput<typeof ConfigSchema>
export const paths = (env: NodeJS.ProcessEnv) => resolvePaths({ appName: "drive-cli", prefix: "DRIVE", env })
export const readConfig = (env: NodeJS.ProcessEnv): Config => {
  try {
    return loadConfigFile(join(paths(env).config, "config.json"), ConfigSchema, () => ({ profiles: {} }))
  } catch {
    throw new CliError("configuration_error", "drive configuration is invalid; no configuration values were logged")
  }
}
export const writeConfig = (env: NodeJS.ProcessEnv, config: Config) => {
  const checked = v.safeParse(ConfigSchema, config)
  if (!checked.success) throw new CliError("configuration_error", "drive settings are invalid; no values were logged")
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
  const profile = readConfig(env).profiles[profileName(name)]
  if (!profile)
    throw new CliError("authentication_error", `profile ${name} is not signed in — drive ${name} session start`)
  return profile
}
export interface OAuthApplication {
  clientId: string
  clientSecret?: string
}
export const application = (env: NodeJS.ProcessEnv, file?: string): OAuthApplication => {
  if (!file) {
    if (!env.DRIVE_GOOGLE_CLIENT_ID)
      throw new CliError(
        "configuration_error",
        "provide a Desktop OAuth client with --client-file, or set DRIVE_GOOGLE_CLIENT_ID",
      )
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
