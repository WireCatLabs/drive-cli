import { existsSync } from "node:fs"
import { join, resolve } from "node:path"
import { scanReader } from "@wirecat/cli-core/documents"
import { addDocumentSyncCommands } from "@wirecat/cli-core/documents/cli"
import { storePath } from "@wirecat/cli-core/store"
import type { Command } from "commander"
import { activeProfile, paths, readScans } from "../config.js"
import { DRIVE_APP } from "../identity.js"
import { readState } from "../state.js"
import { MAX_ENTRIES } from "../supported.js"
import { sync } from "../sync.js"
import { type CommandContext, DRIVE_WORDS } from "./context.js"

export const installSyncCommands = (program: Command, context: CommandContext) => {
  const { env, streams, selected, output, source, withIndex, options } = context
  addDocumentSyncCommands(program, {
    words: DRIVE_WORDS,
    output,
    diagnostic: (text) => streams.diagnostic(text),
    profile: selected,
    maxEntries: MAX_ENTRIES,
    sync: async (args) => {
      const profile = activeProfile(env, selected())
      const remote = profile.roots.length || profile.transcripts === "include" ? await source() : undefined
      const signal = context.signal()
      const scans = remote
        ? await scanReader(readScans(env, selected()), {
            app: DRIVE_APP,
            env,
            command: "drive",
            ...(options.keyring ? { keyring: options.keyring } : {}),
            ...(signal ? { signal } : {}),
          })
        : undefined
      return withIndex(async (index) => {
        const result = await sync(remote, index, env, selected(), args.limit, signal, args.rescan, {
          budget: args.budget,
          deadline: args.deadline,
          scans,
        })
        if (!args.embed) return result
        // Embedding has no deadline of its own: started after a stop or past the budget, it would turn the sync's
        // own stop into the run's hard timeout.
        const stopped = result.stopped ?? args.budget?.take()
        if (stopped) return { ...result, embeddings: { skipped: stopped, next: "the next sync --embed goes on" } }
        return { ...result, embeddings: await index.embed(600) }
      })
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
          "Google Docs/Sheets, PDF, Word, Excel, PowerPoint, OpenDocument, RTF, HTML, EPUB and Markdown/TXT/CSV/TSV, with scans and JPEG/PNG/WebP pictures read by OCR (read_scans); native export layout, tab fidelity and assets are not verified",
        remote_checked: false,
      }
    },
  })
}
