import { existsSync } from "node:fs"
import { join, resolve } from "node:path"
import { CliError } from "@wirecat/cli-base"
import { annotate, customizeSharedCommand } from "@wirecat/cli-base/commands"
import { itemOf, LOCAL_READ, sharedCommandTemplate } from "@wirecat/cli-core/cli"
import { storePath } from "@wirecat/cli-core/store"
import type { Command } from "commander"
import { application, paths, readConfig } from "../config.js"
import { SHELL_OVERRIDES } from "../contract-overrides.js"
import { DRIVE_APP } from "../policy.js"
import { examples } from "../registry.js"
import { VERSION } from "../version.js"
import type { CommandContext } from "./context.js"

const failure = (error: unknown) => {
  if (error instanceof CliError) return error.message
  throw error
}

/**
 * Answers when everything else is broken, since that is when it is run: an unreadable config or OAuth setting is a
 * field, never an exception. It reads no keyring and opens no database, because either can hang or prompt.
 */
export const doctorReport = (env: NodeJS.ProcessEnv) => {
  const where = paths(env)
  const configPath = join(where.config, "config.json")
  let config: { readable: boolean; path: string; error?: string }
  let profiles: { profile: string; selected_folders: number; storage: string }[] | null = null
  try {
    profiles = Object.entries(readConfig(env).profiles).map(([name, profile]) => ({
      profile: name,
      selected_folders: profile.roots.length,
      storage: profile.storage,
    }))
    config = { readable: true, path: configPath }
  } catch (error) {
    config = { readable: false, path: configPath, error: failure(error) }
  }
  let oauth: { client: "wirecat" | "own"; error?: string }
  try {
    application(env)
    oauth = { client: env.DRIVE_GOOGLE_CLIENT_ID ? "own" : "wirecat" }
  } catch (error) {
    oauth = { client: "own", error: failure(error) }
  }
  const store = resolve(storePath(env))
  return {
    version: VERSION,
    runtime: { node: process.versions.node, platform: process.platform },
    paths: { config: where.config, state: where.state, cache: where.cache },
    config,
    profiles,
    oauth_application: oauth,
    store: { path: store, exists: existsSync(store) },
    read_only: env.DRIVE_READ_ONLY && env.DRIVE_READ_ONLY !== "0" ? "DRIVE_READ_ONLY" : null,
    profile_lock: env.DRIVE_PROFILE_LOCK || null,
    login: "not checked",
  }
}

const installDoctorCommandDefinition = (program: Command, { env, output }: CommandContext) => {
  examples(
    annotate(program.command("doctor"), { effects: LOCAL_READ }).description(
      "check this installation: config, profiles, paths; no keyring, store or network",
    ),
    ["drive doctor", "drive doctor --json"],
  ).action(() => output(itemOf(doctorReport(env))))
}

export const installDoctorCommand = (...args: Parameters<typeof installDoctorCommandDefinition>) => {
  customizeSharedCommand(
    sharedCommandTemplate(DRIVE_APP, "doctor"),
    "Drive diagnoses public OAuth configuration and local paths without opening a keyring, database or Google connection.",
    () => {
      installDoctorCommandDefinition(...args)
      const command = args[0].commands.find((command) => command.name() === "doctor")
      if (!command) throw new Error("doctor builder did not install its command")
      return command
    },
    SHELL_OVERRIDES.doctor,
  )
}
