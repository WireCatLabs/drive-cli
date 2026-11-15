import { existsSync } from "node:fs"
import { join, resolve } from "node:path"
import { addDocumentSyncCommands } from "@wirecat/cli-core/documents/cli"
import { storePath } from "@wirecat/cli-core/store"
import type { Command } from "commander"
import { activeProfile, paths } from "../config.js"
import { readState } from "../state.js"
import { MAX_ENTRIES } from "../supported.js"
import { sync } from "../sync.js"
import { type CommandContext, DRIVE_WORDS } from "./context.js"

export const installSyncCommands = (program: Command, context: CommandContext) => {
  const { env, streams, selected, output, source, withIndex } = context
  addDocumentSyncCommands(program, {
    words: DRIVE_WORDS,
    output,
    diagnostic: (text) => streams.diagnostic(text),
    profile: selected,
    maxEntries: MAX_ENTRIES,
    sync: async (args) => {
      const profile = activeProfile(env, selected())
      const remote = profile.roots.length || profile.transcripts === "include" ? await source() : undefined
      return withIndex(async (index) => ({
        ...(await sync(remote, index, env, selected(), args.limit, context.signal(), args.rescan)),
        ...(args.embed ? { embeddings: await index.embed(600) } : {}),
      }))
    },
    status: () => {
      const name = selected()
      const profile = activeProfile(env, name)
      const state = readState(env, name, profile.principal)
      const legacyStore = join(paths(env).state, "drive.db")
      return {
        profile: name,
        store: {
          selected: resolve(storePath(env)),
          checkpoint: state.store ?? (existsSync(legacyStore) ? resolve(legacyStore) : null),
        },
        selected_folders: profile.roots,
        documents: Object.keys(state.documents).length,
        pending: state.pending?.jobs.length ?? 0,
        skipped: state.skipped.map(({ id, reason }) => ({ id, reason })),
        last_sync: state.lastSync ?? null,
        coverage:
          "Google Docs/Sheets, PDF/DOCX/XLSX and Markdown/TXT/CSV/TSV; native export layout, tab fidelity and assets are not verified",
        remote_checked: false,
      }
    },
  })
}
