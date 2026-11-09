import { CliError, isCliError } from "@wirecat/cli-base"
import type { AddedSource, AddedSourceInput } from "@wirecat/cli-core/store"
import {
  activeProfile,
  fileId,
  maxAddProfiles,
  profileLocked,
  profileName,
  profileRequired,
  readConfig,
} from "./config.js"
import type { DocumentContent, GoogleSource } from "./model.js"

/** Access a profile may lack while another has it; anything else stops the run. */
const PASSES_ON = new Set(["not_found", "permission_error", "authentication_error"])

const HOW = "drive <profile> documents add <url>, or --profiles <a,b|all>"

/**
 * The profiles `documents add` tries, in the order the owner named them: `--profiles a,b|all`, else the profile
 * word or DRIVE_PROFILE. None is picked for him. A process locked to one profile reaches that one only, and its
 * refusals name no other profile.
 */
export const profilesToAdd = (
  env: NodeJS.ProcessEnv,
  { option, word, chosen, lock }: { option?: string; word?: string; chosen?: string; lock?: string },
): string[] => {
  if (option !== undefined && word !== undefined)
    throw new CliError("validation_error", "name the profiles once: a profile word or --profiles, not both", {
      reason: "profile.conflict",
      param: "--profiles",
    })
  const listed =
    option === undefined
      ? undefined
      : option.trim() === "all"
        ? ("all" as const)
        : option
            .split(",")
            .map((one) => one.trim())
            .filter(Boolean)
  if (lock !== undefined) {
    const locked = profileName(lock)
    if (listed === "all") throw profileLocked(locked, "every profile (all)")
    for (const name of listed ?? [word ?? chosen ?? locked])
      if (name !== locked) throw profileLocked(locked, "any other profile")
    return [locked]
  }
  const choices = Object.keys(readConfig(env).profiles).sort()
  const single = word ?? chosen
  const names = listed === "all" ? choices : (listed ?? (single === undefined ? [] : [single]))
  if (names.length === 0) throw profileRequired(choices, HOW)
  const unique = [...new Set(names.map(profileName))]
  const most = maxAddProfiles(env)
  if (unique.length > most)
    throw new CliError(
      "validation_error",
      `documents add tries at most ${most} profiles (max_add_profiles); name fewer with --profiles — ` +
        `profiles here: ${choices.join(", ")}`,
      { reason: "profile.too-many", profiles: choices, max_add_profiles: most },
    )
  for (const name of unique) activeProfile(env, name)
  return unique
}

export interface DocumentAddInput {
  url: string
  profiles: readonly string[]
  source: (profile: string) => Promise<GoogleSource>
  maxChars: (profile: string) => number
  /** Keeps the text, unless a live document of the same Google file or content is stored already. */
  save: (input: AddedSourceInput, driveFileId: string) => Promise<AddedSource>
  title?: string
  subjects?: readonly string[]
  by: AddedSourceInput["by"]
}

export interface MissedProfile {
  profile: string
  code: string
  reason: string | null
  google_reason?: string
}

const missOf = (profile: string, error: unknown): MissedProfile | undefined => {
  if (!isCliError(error) || !PASSES_ON.has(error.code)) return undefined
  const told = error.details.google_reason
  return {
    profile,
    code: error.code,
    reason: error.details.reason ?? null,
    ...(typeof told === "string" ? { google_reason: told } : {}),
  }
}

const stoppedAt = (error: unknown, profile: string, tried: MissedProfile[]) =>
  isCliError(error) ? new CliError(error.code, error.message, { ...error.details, profile, tried }) : error

/** One code for one kind of refusal, so a caller tells "sign in again" from "no one has access". */
const notOpened = (tried: MissedProfile[]) => {
  const codes = new Set(tried.map((one) => one.code))
  const [only] = codes.size === 1 ? codes : []
  const [code, reason] =
    only === "authentication_error"
      ? (["authentication_error", "document.signed-out"] as const)
      : only === "permission_error"
        ? (["permission_error", "document.no-access"] as const)
        : (["not_found", "document.not-opened"] as const)
  const signIn = codes.has("authentication_error") ? "; sign in again with drive <profile> session start" : ""
  return new CliError(
    code,
    `no profile opened this document: ${tried.map((one) => `${one.profile} (${one.reason ?? one.code})`).join(", ")}${signIn}`,
    { reason, profiles: tried.map((one) => one.profile), tried },
  )
}

/**
 * Reads a Drive document with the first profile that opens it and keeps its text as a source added by hand, under
 * Google's own address for it. The profiles before it are listed with what refused them.
 */
export const addDocument = async (input: DocumentAddInput) => {
  const id = fileId(input.url)
  const tried: MissedProfile[] = []
  for (const profile of input.profiles) {
    let content: DocumentContent
    try {
      content = await (await input.source(profile)).content(id, input.maxChars(profile))
    } catch (error) {
      const missed = missOf(profile, error)
      if (!missed) throw stoppedAt(error, profile, tried)
      tried.push(missed)
      continue
    }
    // The typed link may carry ?usp=, authuser= or resourcekey=; Google's own address names the file alone.
    const url = content.metadata.url
    const added = await input.save(
      {
        kind: "page",
        text: content.text,
        read: content.text.trim() ? "extracted" : "no-text",
        title: input.title ?? content.metadata.name,
        url,
        mime: content.metadata.mime,
        size: content.metadata.size ?? null,
        metadata: { source: "google-drive", google_file_id: id },
        ...(input.subjects?.length ? { subjects: input.subjects } : {}),
        by: input.by,
      },
      id,
    )
    return {
      ref: added.note.ref,
      created: added.created,
      duplicate_of: added.duplicateOf,
      title: added.note.title,
      url,
      file_id: id,
      mime: content.metadata.mime,
      chars: content.text.length,
      kept: added.kept,
      subjects: added.subjects,
      profile,
      tried,
    }
  }
  throw notOpened(tried)
}
