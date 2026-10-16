import { join } from "node:path"
import { CliError } from "@wirecat/cli-base"
import {
  guardedWrite,
  type Level,
  layerPermissions,
  levelFor,
  newOperationId,
  permissionOverrides,
  RecipientList,
  SendJournal,
  sendGuard,
} from "@wirecat/cli-core/sends"
import { operations } from "./api-contract.js"
import { paths, readConfig } from "./config.js"
import { VERSION } from "./version.js"

export interface PolicyFlags {
  offline?: boolean
  permission?: string[]
  readOnly?: boolean
  yes?: boolean
  allowDangerous?: boolean
  dryRun?: boolean
}
export const policySettings = (env: NodeJS.ProcessEnv, profile: string, flags: PolicyFlags = {}) => {
  const config = readConfig(env)
  const own = config.profiles[profile]
  const { levels } = layerPermissions([
    ["flags", permissionOverrides(flags.permission)],
    ["profile", own?.permissions],
    ["defaults", config.defaults?.permissions],
  ])
  return { levels, readOnly: flags.readOnly === true || (own?.read_only ?? config.defaults?.read_only ?? false) }
}
const defaults = Object.fromEntries(
  operations.filter((op) => op.effect === "destructive").map((op) => [`api.${op.id}`, "ask"]),
) as Record<string, Level>
export const methodPolicyKeys = (method: string) => {
  const parts = method.split(".")
  const verb = parts.at(-1)
  const alias = method.startsWith("drive.files.")
    ? `files.${verb}`
    : method.startsWith("docs.documents.")
      ? `documents.${verb === "batchUpdate" ? "update" : verb}`
      : method === "driveactivity.activity.query"
        ? "documents.history"
        : method.startsWith("drive.")
          ? `${parts[1]}.${verb}`
          : undefined
  return [`api.${method}`, ...(alias ? [alias] : [])]
}
export const checkPolicy = async (
  env: NodeJS.ProcessEnv,
  profile: string,
  key: string,
  mutates: boolean,
  flags: PolicyFlags = {},
  ask?: (key: string) => Promise<boolean>,
) => {
  const { levels, readOnly } = policySettings(env, profile, flags)
  const { level } = levelFor(levels, key, defaults)
  if (level === "deny" || (mutates && (readOnly || level === "readonly")))
    throw new CliError("permission_error", "profile policy refuses this operation", {
      reason: "policy.denied",
      permission: key,
    })
  if (mutates && level === "ask" && !flags.dryRun) {
    const destructive = defaults[key] === "ask"
    if (destructive ? flags.allowDangerous : flags.yes) return
    if (ask && (await ask(key))) return
    throw new CliError(
      "confirmation_required",
      destructive
        ? "this deletion requires --allow-dangerous or an explicit permission"
        : "profile policy requires --yes or confirmation",
      { reason: "policy.confirm", permission: key },
    )
  }
}
export const guardedGoogleWrite = async <T>(
  env: NodeJS.ProcessEnv,
  profile: string,
  key: string,
  act: () => Promise<T>,
  flags: PolicyFlags = {},
  ask?: (key: string) => Promise<boolean>,
): Promise<T> => {
  const settings = policySettings(env, profile, flags)
  const guard = sendGuard({
    profile,
    command: "drive",
    readOnlyLock: settings.readOnly ? "profile" : undefined,
    permissions: settings.levels,
    permissionDefaults: defaults,
    ask: async (permission) => checkPolicy(env, profile, permission, true, flags, ask),
    sendsPerHour: Number.MAX_SAFE_INTEGER,
    journal: new SendJournal(join(paths(env).state, "sends", `${profile}.jsonl`), {
      service: "drive",
      version: VERSION,
    }),
    recipients: new RecipientList(join(paths(env).state, "recipients", `${profile}.json`), "drive"),
    warn: () => {},
  })
  return guardedWrite(guard, { chatId: null, kind: "edit", key, operationId: newOperationId() }, act)
}
