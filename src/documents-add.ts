import { CliError, isCliError } from "@wirecat/cli-base"
import type { AddedSource, AddedSourceInput } from "@wirecat/cli-core/store"
import { activeProfile, fileId, maxAddProfiles, profileName, readConfig } from "./config.js"
import type { DocumentContent, GoogleSource } from "./model.js"

/** Access a profile may lack while another has it; anything else stops the run. */
const PASSES_ON = new Set(["not_found", "permission_error", "authentication_error"])

/**
 * The profiles `documents add` tries, in the order the owner named them: `--profiles a,b|all`, else the profile
 * word or DRIVE_PROFILE. None is picked for him, and a process locked to one profile reaches only that one.
 */
export const profilesToAdd = (
  env: NodeJS.ProcessEnv,
  { option, named, lock }: { option?: string; named?: string; lock?: string },
): string[] => {
  const choices = Object.keys(readConfig(env).profiles).sort()
  const listed =
    option === undefined
      ? named === undefined
        ? undefined
        : [named]
      : option.trim() === "all"
        ? choices
        : option.split(",").map((one) => one.trim())
  const names = listed ?? (lock === undefined ? undefined : [lock])
  if (!names)
    throw new CliError(
      "validation_error",
      choices.length
        ? `name the profiles to try: drive documents add <url> --profiles <a,b|all> — profiles here: ${choices.join(", ")}`
        : "no profiles here yet; create one with drive personal session start (any name in place of personal)",
      { reason: "profile.required", profiles: choices },
    )
  const unique = [...new Set(names.map(profileName))]
  if (unique.length === 0)
    throw new CliError("validation_error", "--profiles names no profile", {
      reason: "profile.required",
      profiles: choices,
    })
  const most = maxAddProfiles(env)
  if (unique.length > most)
    throw new CliError(
      "validation_error",
      `documents add tries at most ${most} profiles (max_add_profiles); name fewer with --profiles — profiles here: ${choices.join(", ")}`,
      { reason: "profile.too-many", profiles: choices, max_add_profiles: most },
    )
  for (const name of unique) {
    activeProfile(env, name)
    if (lock !== undefined && name !== profileName(lock))
      throw new CliError(
        "permission_error",
        `this process is locked to profile ${lock} (DRIVE_PROFILE_LOCK) — profile ${name} is refused`,
        { reason: "profile.locked" },
      )
  }
  return unique
}

export interface DocumentAddInput {
  url: string
  profiles: readonly string[]
  source: (profile: string) => Promise<GoogleSource>
  maxChars: (profile: string) => number
  save: (input: AddedSourceInput) => Promise<AddedSource>
  title?: string
  subjects?: readonly string[]
  by: AddedSourceInput["by"]
}

export interface MissedProfile {
  profile: string
  code: string
  reason: string | null
}

const missOf = (profile: string, error: unknown): MissedProfile | undefined => {
  if (!isCliError(error) || !PASSES_ON.has(error.code)) return undefined
  return { profile, code: error.code, reason: error.details.reason ?? null }
}

/**
 * Reads a Google Doc with the first profile that opens it and keeps its text as a source added by hand, named by
 * the address as given, or Google's own for a bare id. The profiles before it are listed with what refused them.
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
      if (!missed) throw error
      tried.push(missed)
      continue
    }
    const url = input.url.startsWith("https://") ? input.url : content.metadata.url
    const added = await input.save({
      kind: "page",
      text: content.text,
      read: content.text.trim() ? "extracted" : "no-text",
      title: input.title ?? content.metadata.name,
      url,
      mime: content.metadata.mime,
      size: content.metadata.size ?? null,
      ...(input.subjects?.length ? { subjects: input.subjects } : {}),
      by: input.by,
    })
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
  throw new CliError(
    "not_found",
    `no profile opened this document: ${tried.map((one) => `${one.profile} (${one.reason ?? one.code})`).join(", ")}`,
    { reason: "document.not-opened", profiles: tried.map((one) => one.profile), tried },
  )
}
