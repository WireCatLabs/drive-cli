import { readFileSync, statSync } from "node:fs"
import { resolve } from "node:path"
import { CliError } from "@wirecat/cli-base"
import { applyDocumentTransfer, openStore, previewDocumentTransfer, storePath } from "@wirecat/cli-core/store"
import { activeProfile } from "./config.js"
import { lockProfile } from "./profile-lock.js"
import { readSnapshot, readState, saveState } from "./state.js"

export const transferBindings = (path?: string): Record<string, string> => {
  if (path === undefined) return {}
  let parsed: unknown
  try {
    const stat = statSync(path)
    if (!stat.isFile() || stat.size > 256 * 1024) throw new Error("bounds")
    parsed = JSON.parse(readFileSync(path, "utf8"))
  } catch {
    throw new CliError("validation_error", "bindings must be a readable JSON object file no larger than 256 KiB")
  }
  if (
    !parsed ||
    typeof parsed !== "object" ||
    Array.isArray(parsed) ||
    Object.entries(parsed).some(([key, value]) => !key.trim() || typeof value !== "string" || !value.trim())
  )
    throw new CliError("validation_error", "bindings must map source references to destination reference strings")
  return parsed as Record<string, string>
}

const selection = (env: NodeJS.ProcessEnv, name: string, source: string) => {
  const profile = activeProfile(env, name)
  const state = readState(env, name, profile.principal)
  const destination = resolve(storePath(env))
  for (const [id] of Object.entries(state.documents)) {
    const snapshot = readSnapshot(env, name, id)
    if (snapshot.metadata.id !== id)
      throw new CliError("configuration_error", "source snapshot identity does not match its checkpoint", {
        reason: "state.invalid",
      })
  }
  return { profile, state, options: { source, destination, collection: `google-drive:${profile.principal}`, env } }
}

export const checkStoreImport = async (
  env: NodeJS.ProcessEnv,
  name: string,
  source: string,
  bindings: Record<string, string>,
) => {
  const { ensureSqlite } = await import("@wirecat/cli-core/sqlite-runtime")
  await ensureSqlite()
  const { state, options } = selection(env, name, source)
  const preview = await previewDocumentTransfer({ ...options, bindings })
  for (const [id, document] of Object.entries(state.documents)) {
    const stored = preview.source_documents.find((item) => item.external_id === `${id}.md`)
    if (!stored || stored.content_hash !== document.hash)
      throw new CliError(
        "configuration_error",
        "source content does not match the cached profile checkpoint; the original checkpoint was kept",
      )
  }
  if (resolve(state.store ?? "") === options.destination && !preview.already_transferred)
    throw new CliError(
      "configuration_error",
      "this profile already uses the selected store; only an existing transfer can be retried",
    )
  return preview
}

export const importStore = async (
  env: NodeJS.ProcessEnv,
  name: string,
  source: string,
  fingerprint: string,
  bindings: Record<string, string>,
) => {
  await checkStoreImport(env, name, source, bindings)
  const lock = await lockProfile(env, name)
  try {
    const { profile, state, options } = selection(env, name, source)
    lock.assertHeld()
    await checkStoreImport(env, name, source, bindings)
    const receipt = await applyDocumentTransfer({ ...options, bindings, expected_fingerprint: fingerprint })
    for (const [id, document] of Object.entries(state.documents)) {
      const reference = receipt.documents[`${id}.md`]
      if (!reference)
        throw new CliError(
          "configuration_error",
          "the source store is missing a checkpointed document; the original checkpoint was kept",
        )
      state.documents[id] = { ...document, reference, picture: undefined }
    }
    lock.assertHeld()
    const store = await openStore({ path: options.destination, env, command: "drive" })
    try {
      await store.accounts.saveProfile("drive", name, {
        provider: "folder",
        account: `google-drive:${profile.principal}`,
      })
    } finally {
      await store.close()
    }
    lock.assertHeld()
    state.store = options.destination
    delete state.linkedThrough
    saveState(env, name, state)
    return {
      ...receipt,
      documents: Object.entries(receipt.documents).map(([external_id, reference]) => ({ external_id, reference })),
      profile: name,
      checkpoint_updated: true,
      source_retained: true,
    }
  } finally {
    await lock.release()
  }
}
