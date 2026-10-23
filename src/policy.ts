import { join } from "node:path"
import { CliError } from "@wirecat/cli-base"
import { readOnlyLockOf, readOnlyRefusal } from "@wirecat/cli-core/cli"
import {
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
import { paths, readConfig } from "./config.js"
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
const DRIVE_APP = { command: "drive", appName: "drive-cli", envPrefix: "DRIVE", description: "", version: VERSION }
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
  const keys = new Set(["mcp", "sheets.create", "sheets.rename", "sheets.insert", "sheets.format", "sheets.update"])
  for (const path of paths) keys.add(path.join("."))
  for (const operation of operations) for (const key of methodPolicyKeys(operation.id)) keys.add(key)
  return keys
}
const names = (keys: Set<string>, key: string) => keys.has(key) || [...keys].some((one) => one.startsWith(`${key}.`))

/**
 * The profile's levels with `--permission` laid over them. A flag only tightens: one that would loosen the
 * profile, a built-in default or a key under it is refused, so an agent cannot add its way past the owner's
 * settings. With `flags.permissionKeys`, a permission that names no drive command is refused, rather than ignored.
 */
export const policySettings = (env: NodeJS.ProcessEnv, profile: string, flags: PolicyFlags = {}) => {
  const keys = flags.permissionKeys
  const config = readConfig(env)
  const own = config.profiles[profile]
  const overrides = overridesOf(flags.permission)
  if (keys) {
    const layers = [
      ["--permission", overrides],
      [`profile ${profile}`, own?.permissions],
      ["defaults", config.defaults?.permissions],
    ] as const
    for (const [where, layer] of layers)
      for (const key of Object.keys(layer ?? {}))
        if (!names(keys, key))
          throw new CliError(
            where === "--permission" ? "validation_error" : "configuration_error",
            `${where} names ${key}, which is no drive command; see drive commands`,
            { reason: "policy.unknown-key", permission: key },
          )
  }
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
  return {
    levels,
    lock,
    readOnly: lock !== undefined || flags.readOnly === true || (own?.read_only ?? config.defaults?.read_only ?? false),
  }
}
const defaults = Object.fromEntries(
  operations.filter((op) => op.effect === "destructive").map((op) => [`api.${op.id}`, "ask"]),
) as Record<string, Level>
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
  return guardedWrite(guard, { chatId: null, kind: "edit", key, operationId: newOperationId() }, act)
}
