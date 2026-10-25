import { join } from "node:path"
import { CliError } from "@wirecat/cli-base"
import type { CommandInfo } from "@wirecat/cli-base/commands"
import { writes } from "@wirecat/cli-base/standards"
import { type AppIdentity, readOnlyLockOf, readOnlyRefusal, setupPermissionCeiling } from "@wirecat/cli-core/cli"
import {
  CEILING_KEY,
  guardedWrite,
  LEVELS,
  type Level,
  layerPermissions,
  levelFor,
  newOperationId,
  RecipientList,
  SendJournal,
  sendGuard,
} from "@wirecat/cli-core/sends"
import { operations } from "./api-contract.js"
import { inspectConfig, paths, refusal } from "./config.js"
import { VERSION } from "./version.js"

export interface PolicyFlags {
  offline?: boolean
  permission?: string[]
  readOnly?: boolean
  yes?: boolean
  allowDangerous?: boolean
  dryRun?: boolean
  /** The keys this program checks (`permissionKeys`); with them, a permission naming no command is refused. */
  permissionKeys?: Set<string>
}
export const DRIVE_APP: AppIdentity = {
  command: "drive",
  appName: "drive-cli",
  envPrefix: "DRIVE",
  description: "Google Drive",
  version: VERSION,
  messenger: false,
}
const ORDER: Record<Level, number> = { deny: 0, readonly: 1, ask: 2, allow: 3 }

const overridesOf = (entries: readonly string[] = []): Record<string, Level> => {
  const levels: Record<string, Level> = {}
  for (const entry of entries) {
    const [key = "", level = "", extra] = entry.split("=")
    if (!/^[a-z][a-z-]*(\.[a-zA-Z][a-zA-Z-]*)*$/.test(key) || !(LEVELS as readonly string[]).includes(level) || extra)
      throw new CliError(
        "validation_error",
        "--permission takes a command path and level, e.g. files.trash=deny (deny, readonly, ask, allow)",
      )
    levels[key] = level as Level
  }
  return levels
}

/**
 * Every key drive checks: each command path, `api.<method>` with its friendly alias, and the Sheets edit kinds a
 * batch update is checked as. A permission names one of these or a group above them.
 */
export const permissionKeys = (paths: readonly (readonly string[])[]): Set<string> => {
  const keys = new Set([
    "mcp.authority",
    "mcp",
    "sheets.create",
    "sheets.rename",
    "sheets.insert",
    "sheets.format",
    "sheets.update",
  ])
  for (const path of paths) keys.add(path.join("."))
  for (const operation of operations) for (const key of methodPolicyKeys(operation.id)) keys.add(key)
  return keys
}
/** A permission names one of the keys or a group above them. */
export const permissionNames = (keys: ReadonlySet<string>): Set<string> => {
  const names = new Set<string>()
  for (const key of keys) {
    const parts = key.split(".")
    for (let end = 1; end <= parts.length; end++) names.add(parts.slice(0, end).join("."))
  }
  return names
}

/**
 * The profile's levels with `--permission` laid over them. A flag only tightens: one that would loosen the
 * profile, a built-in default or a key under it is refused, so an agent cannot add its way past the owner's
 * settings. With `flags.permissionKeys`, a permission that names no drive command is refused, rather than ignored.
 */
export const policySettings = (env: NodeJS.ProcessEnv, profile: string, flags: PolicyFlags = {}) => {
  const keys = flags.permissionKeys
  const names = keys && permissionNames(keys)
  const { config, issues } = inspectConfig(env, names)
  const [first] = issues
  if (first)
    throw first.kind === "unknown_permission"
      ? new CliError("configuration_error", refusal(issues).message, {
          reason: "policy.unknown-key",
          permission: first.key?.slice("permissions.".length),
        })
      : refusal(issues)
  const own = config.profiles[profile]
  const overrides = overridesOf(flags.permission)
  if (names)
    for (const key of Object.keys(overrides))
      if (!names.has(key))
        throw new CliError(
          "validation_error",
          `--permission names ${key}, which is no drive command; see drive commands`,
          {
            reason: "policy.unknown-key",
            permission: key,
          },
        )
  const saved = layerPermissions([
    ["profile", own?.permissions],
    ["defaults", config.defaults?.permissions],
  ]).levels
  for (const [key, level] of Object.entries(overrides)) {
    const under = [...Object.keys(saved), ...Object.keys(defaults)].filter((named) => named.startsWith(`${key}.`))
    const lifted = [key, ...under].find((named) => ORDER[level] > ORDER[levelFor(saved, named, defaults).level])
    if (lifted !== undefined)
      throw new CliError(
        "validation_error",
        `--permission ${key}=${level} would loosen ${lifted} from ${levelFor(saved, lifted, defaults).level}; ` +
          "it only tightens — change the profile's permissions to loosen it",
        { reason: "policy.flag-loosens", permission: lifted },
      )
  }
  const { levels } = layerPermissions([
    ["flags", overrides],
    ["profile", own?.permissions],
    ["defaults", config.defaults?.permissions],
  ])
  const lock = readOnlyLockOf(DRIVE_APP, env)
  // The shared first-run answer: no profile goes above it.
  const ceiling = setupPermissionCeiling(env)
  return {
    levels: ceiling ? { ...levels, [CEILING_KEY]: ceiling } : levels,
    lock,
    readOnly: lock !== undefined || ceiling === "readonly" || flags.readOnly === true,
  }
}
const defaults: Record<string, Level> = {
  "mcp.authority": "deny",
  ...Object.fromEntries(operations.filter((op) => op.effect === "destructive").map((op) => [`api.${op.id}`, "ask"])),
}
export const methodPolicyKeys = (method: string, body?: Record<string, unknown>) => {
  const parts = method.split(".")
  const verb = parts.at(-1)
  const alias = method.startsWith("drive.files.")
    ? `files.${verb}`
    : method.startsWith("docs.documents.")
      ? `documents.${verb === "batchUpdate" ? "update" : verb}`
      : method.startsWith("sheets.spreadsheets.")
        ? `sheets.${method === "sheets.spreadsheets.get" ? "info" : method === "sheets.spreadsheets.values.get" ? "show" : verb === "append" ? "add" : verb}`
        : method === "driveactivity.activity.query"
          ? "documents.history"
          : method.startsWith("drive.")
            ? `${parts[1]}.${verb}`
            : undefined
  const keys = [`api.${method}`, ...(alias ? [alias] : [])]
  if (method === "drive.replies.create" && body)
    keys.push(
      body.action === "resolve" ? "comments.resolve" : body.action === "reopen" ? "comments.reopen" : "comments.reply",
    )
  if (method === "drive.replies.create" && body?.content !== undefined) keys.push("comments.reply")
  if (method === "sheets.spreadsheets.batchUpdate" && Array.isArray(body?.requests)) {
    const object = (value: unknown): value is Record<string, unknown> =>
      !!value && typeof value === "object" && !Array.isArray(value)
    for (const request of body.requests) {
      if (!object(request)) continue
      if (request.addSheet || request.duplicateSheet) keys.push("sheets.create")
      if (object(request.updateSheetProperties)) {
        const update = request.updateSheetProperties
        if (
          (object(update.properties) && update.properties.title !== undefined) ||
          String(update.fields)
            .split(",")
            .some((field) => field.trim() === "title" || field.trim() === "*")
        )
          keys.push("sheets.rename")
        if (object(update.properties) && update.properties.gridProperties) keys.push("sheets.insert")
      }
      if (request.insertDimension || request.appendDimension || request.insertRange) keys.push("sheets.insert")
      if (
        request.repeatCell ||
        request.updateCells ||
        request.appendCells ||
        request.updateBorders ||
        request.addConditionalFormatRule ||
        request.updateConditionalFormatRule ||
        request.deleteConditionalFormatRule ||
        request.addBanding ||
        request.updateBanding ||
        request.deleteBanding
      )
        keys.push("sheets.format")
      if (
        request.updateCells ||
        request.appendCells ||
        request.findReplace ||
        request.pasteData ||
        request.copyPaste ||
        request.cutPaste ||
        request.autoFill
      )
        keys.push("sheets.update")
      if (request.pasteData || request.copyPaste || request.cutPaste || request.autoFill) keys.push("sheets.format")
      if (
        object(request.repeatCell) &&
        (String(request.repeatCell.fields)
          .split(",")
          .some((field) => field.trim() === "*" || field.includes("userEnteredValue")) ||
          (object(request.repeatCell.cell) && request.repeatCell.cell.userEnteredValue !== undefined))
      )
        keys.push("sheets.update")
    }
  }
  return [...new Set(keys)]
}
/** The read-only lock, for a local write that runs no policy check: a setting or other change to later runs. */
export const refuseUnderReadOnly = (env: NodeJS.ProcessEnv, what: string) => {
  const lock = readOnlyLockOf(DRIVE_APP, env)
  if (lock) throw readOnlyRefusal(lock, what)
}
export const checkPolicy = async (
  env: NodeJS.ProcessEnv,
  profile: string,
  key: string,
  mutates: boolean,
  flags: PolicyFlags = {},
  ask?: (key: string) => Promise<boolean>,
) => {
  const { levels, readOnly, lock } = policySettings(env, profile, flags)
  const { level } = levelFor(levels, key, defaults)
  if (mutates && lock) throw readOnlyRefusal(lock, "change local or Google data")
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
  operationId = newOperationId(),
): Promise<T> => {
  const settings = policySettings(env, profile, flags)
  const guard = sendGuard({
    profile,
    command: "drive",
    readOnlyLock: settings.lock ?? (settings.readOnly ? "profile" : undefined),
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
  return guardedWrite(guard, { chatId: null, kind: "edit", key, operationId }, act)
}

export const discoveryAvailability = (
  command: Pick<CommandInfo, "path" | "effects" | "api_operation">,
  settings: ReturnType<typeof policySettings>,
  authority = false,
  mcp = false,
) => {
  if (mcp && authority && !["ask", "allow"].includes(levelFor(settings.levels, "mcp.authority").level))
    return { available: false, reason: "the profile keeps mcp.authority off", permission: "mcp.authority" }
  if (!mcp && command.path.join(" ") === "config set")
    return settings.lock ? { available: false, reason: "the process is read-only" } : { available: true }
  if (writes(command.effects) && settings.readOnly) return { available: false, reason: "the profile is read-only" }
  const keys = command.api_operation ? methodPolicyKeys(command.api_operation) : [command.path.join(".")]
  const denied = keys.find((key) => {
    const level = levelFor(settings.levels, key).level
    return level === "deny" || (writes(command.effects) && level === "readonly")
  })
  return denied
    ? { available: false, reason: `the profile does not allow ${denied}`, permission: denied }
    : { available: true }
}
