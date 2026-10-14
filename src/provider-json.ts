import { CliError } from "@wirecat/cli-base"
import { metaOf } from "@wirecat/cli-base/commands"
import type { ItemEnvelope, ListEnvelope } from "@wirecat/cli-base/standards"
import { writes } from "@wirecat/cli-base/standards"
import { answerFields, checkJson } from "@wirecat/cli-core/cli"
import type { Command } from "commander"
import { CATALOG_FIELDS } from "./catalog.js"

export const providerJsonFields = (command: Command | undefined): string[] | undefined =>
  command?.parent?.name() === "catalog" && ["list", "search", "show"].includes(command.name())
    ? CATALOG_FIELDS
    : undefined

export const checkProviderJson = (command: Command, request: { json: boolean; fields?: string }, terminal: boolean) => {
  checkJson(command, request, terminal, providerJsonFields)
  if (request.fields && writes(metaOf(command).effects) && !answerFields(command, providerJsonFields))
    throw new CliError("validation_error", "this write has no declared result fields; use --json without selection", {
      param: "--json",
    })
}

/** Unregistered provider answers still reject an unknown top-level field before projection. */
export const checkResultFields = (
  command: Command,
  answer: ItemEnvelope<unknown> | ListEnvelope<unknown>,
  fields: string,
) => {
  const rows = "items" in answer ? answer.items : [answer.item]
  if (!rows.length) return
  const available = [...new Set(rows.flatMap((row) => (row && typeof row === "object" ? Object.keys(row) : [])))]
  checkJson(command, { json: true, fields }, false, () => available)
}
