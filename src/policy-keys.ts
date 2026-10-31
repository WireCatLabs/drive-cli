import type { Level } from "@wirecat/cli-core/sends"
import { operations } from "./generated/manifest.js"

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

/** drive's own levels under the owner's: permanent deletion asks, an agent changes no authority. */
export const DEFAULT_LEVELS: Record<string, Level> = {
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
