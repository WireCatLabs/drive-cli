import { createHash } from "node:crypto"
import { statSync } from "node:fs"
import { resolve } from "node:path"
import { CliError } from "@wirecat/cli-base"
import { annotate } from "@wirecat/cli-base/commands"
import { FETCH, itemOf, LOCAL_READ, LOCAL_WRITE, REMOTE_WRITE } from "@wirecat/cli-core/cli"
import { type Keep, type PushConflict, planPush, pushDocuments, scanLocal } from "@wirecat/cli-core/documents"
import { newOperationId } from "@wirecat/cli-core/sends"
import { type Command, Option } from "commander"
import { activeProfile, fileId, type Mirror, readConfig, writeConfig } from "../config.js"
import { googleError } from "../errors.js"
import { mirrorState } from "../mirror-state.js"
import { googleTarget, mirrorKind } from "../mirror-target.js"
import { FOLDER } from "../model.js"
import { allOf } from "../output.js"
import { lockProfile } from "../profile-lock.js"
import { examples } from "../registry.js"
import type { CommandContext } from "./context.js"
import type { RemoteCommands } from "./remote.js"

const conflictOf = (conflict: PushConflict) => ({
  path: conflict.path,
  url: conflict.url,
  reason: conflict.reason,
  ...(conflict.parts
    ? { parts: conflict.parts.map((part) => ({ last_sync: part.base, local: part.local, google: part.remote })) }
    : {}),
  ...(conflict.localChangedAt ? { local_changed_at: conflict.localChangedAt } : {}),
  ...(conflict.remoteChangedAt ? { google_changed_at: conflict.remoteChangedAt } : {}),
  ...(conflict.remoteChangedBy ? { google_changed_by: conflict.remoteChangedBy } : {}),
})

export const installMirrorCommands = (program: Command, context: CommandContext, { call }: RemoteCommands) => {
  const { env, selected, output, source } = context
  const mirrors = annotate(program.command("mirrors"), { effects: LOCAL_READ }).description(
    "keep local folders mirrored into Google Docs and Sheets",
  )
  const mirrorsOf = () => activeProfile(env, selected()).mirrors ?? []
  const find = (id: string): Mirror => {
    const mirror = mirrorsOf().find((item) => item.id === id)
    if (!mirror)
      throw new CliError(
        "not_found",
        `no mirror ${id} in profile ${selected()}; see drive ${selected()} mirrors list`,
        {
          reason: "mirror.not-found",
        },
      )
    return mirror
  }

  examples(
    annotate(mirrors.command("add"), { effects: FETCH })
      .argument("<path>", "local folder to mirror")
      .requiredOption("--parent <id>", "the Google Drive folder to write into, by id or URL")
      .description("mirror a local folder: Markdown to Google Docs, CSV/TSV/XLSX to Sheets"),
    ["drive personal mirrors add ./notes --parent FOLDER_ID"],
  ).action(async (path: string, args: { parent: string }) => {
    const root = resolve(path)
    let directory = false
    try {
      directory = statSync(root).isDirectory()
    } catch {}
    if (!directory)
      throw new CliError("validation_error", "the path to mirror is not a folder", { reason: "mirror.not-folder" })
    const folder = fileId(args.parent)
    const metadata = await (await source()).metadata(folder)
    if (metadata.mime !== FOLDER || metadata.trashed)
      throw new CliError("validation_error", "--parent is not an accessible Google folder")
    const config = readConfig(env)
    const name = selected()
    const profile = activeProfile(env, name)
    const id = createHash("sha256")
      .update(JSON.stringify([root, folder]))
      .digest("hex")
      .slice(0, 8)
    const list = profile.mirrors ?? []
    if (!list.some((mirror) => mirror.id === id)) list.push({ id, path: root, folder })
    config.profiles[name] = { ...profile, mirrors: list }
    writeConfig(env, config)
    output(itemOf({ id, path: root, folder, folder_name: metadata.name, added: true }))
  })

  examples(annotate(mirrors.command("list"), { effects: LOCAL_READ }).description("list this profile's mirrors"), [
    "drive personal mirrors list",
  ]).action(() => output(allOf(mirrorsOf())))

  examples(
    annotate(mirrors.command("remove"), { effects: LOCAL_WRITE })
      .argument("<id>", "mirror id from mirrors list")
      .description("stop mirroring a folder; nothing in Google Drive is changed or deleted"),
    ["drive personal mirrors remove 1a2b3c4d"],
  ).action((id: string) => {
    find(id)
    const config = readConfig(env)
    const name = selected()
    const profile = activeProfile(env, name)
    config.profiles[name] = { ...profile, mirrors: (profile.mirrors ?? []).filter((mirror) => mirror.id !== id) }
    writeConfig(env, config)
    output(itemOf({ id, removed: true }))
  })

  examples(
    annotate(mirrors.command("status"), { effects: LOCAL_READ })
      .argument("[id]", "mirror id; every mirror of the profile when omitted")
      .description("show which local files the next sync would create or send; Google is not asked"),
    ["drive personal mirrors status"],
  ).action(async (id?: string) => {
    const name = selected()
    const profile = activeProfile(env, name)
    const items = []
    for (const mirror of id ? [find(id)] : mirrorsOf()) {
      const state = mirrorState(env, name, mirror, profile.principal).read()
      const { files, unsupported } = await scanLocal(mirror.path, mirrorKind)
      const plan = planPush(files, state)
      items.push({
        id: mirror.id,
        path: mirror.path,
        folder: mirror.folder,
        create: plan.create.map((file) => file.path),
        update: plan.update.map((file) => file.path),
        unchanged: plan.unchanged.length,
        orphans: plan.orphans,
        unsupported,
        remote_checked: false,
      })
    }
    output(allOf(items))
  })

  examples(
    annotate(mirrors.command("sync"), { effects: REMOTE_WRITE })
      .argument("[id]", "mirror id; every mirror of the profile when omitted")
      .addOption(
        new Option("--keep <side>", "where a part changed on both sides, keep this side").choices([
          "local",
          "google",
          "both",
        ]),
      )
      .option("--replace", "same as --keep local, and create again files deleted in Google")
      .description("sync both ways with Docs and Sheets; a part changed on both sides is reported"),
    [
      "drive personal mirrors sync",
      "drive personal mirrors sync 1a2b3c4d --keep google",
      "drive personal mirrors sync 1a2b3c4d --replace",
    ],
  ).action(async (id: string | undefined, args: { keep?: "local" | "google" | "both"; replace?: boolean }) => {
    const name = selected()
    const profile = activeProfile(env, name)
    const chosen = id ? [find(id)] : mirrorsOf()
    if (!chosen.length)
      throw new CliError("not_found", `profile ${name} has no mirrors; add one with drive ${name} mirrors add`, {
        reason: "mirror.none",
      })
    if (args.replace && args.keep && args.keep !== "local")
      throw new CliError(
        "validation_error",
        "--replace keeps the local side; it cannot be combined with --keep google or both",
      )
    const keep: Keep | undefined = args.replace ? "local" : args.keep === "google" ? "remote" : args.keep
    const google = await source()
    const target = googleTarget(call, () => google.identity())
    const lock = await lockProfile(env, name)
    const results = []
    try {
      for (const mirror of chosen)
        results.push({
          id: mirror.id,
          path: mirror.path,
          ...(await pushDocuments({
            root: mirror.path,
            folder: mirror.folder,
            target,
            state: mirrorState(env, name, mirror, profile.principal),
            principal: profile.principal,
            ...(keep ? { keep } : {}),
            recreate: args.replace === true,
            // `call` already checks policy and journals each Google write it makes.
            guard: (_attempt, act) => act(),
            operationId: newOperationId,
            errorOf: googleError,
            assertHeld: () => lock.assertHeld(),
            ...(context.signal() ? { signal: context.signal() as AbortSignal } : {}),
          })),
        })
    } finally {
      await lock.release()
    }
    output(allOf(results.map(({ conflicts, ...result }) => ({ ...result, conflicts: conflicts.map(conflictOf) }))))
    const failed = results.some((result) => result.errors.length || result.conflicts.length || result.missing.length)
    if (failed)
      throw new CliError(
        "provider_error",
        `some files were not synced; see conflicts, missing and errors, then rerun with --keep local, google or both`,
        { reason: "mirror.partial" },
      )
  })
}
