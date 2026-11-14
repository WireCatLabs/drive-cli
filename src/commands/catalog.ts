import { addDocumentCatalogCommands } from "@wirecat/cli-core/documents/cli"
import type { Command } from "commander"
import { catalogFiles } from "../catalog.js"
import { activeProfile, fileId } from "../config.js"
import type { DocumentIndex } from "../model.js"
import { lockProfile } from "../profile-lock.js"
import { readState } from "../state.js"
import { type CommandContext, DRIVE_WORDS } from "./context.js"

type Helpers = Pick<CommandContext, "env" | "selected" | "output"> & {
  withIndex<T>(fn: (index: DocumentIndex) => Promise<T>): Promise<T>
}

export const installCatalogCommands = (program: Command, helpers: Helpers) => {
  const { env, selected, output, withIndex } = helpers
  addDocumentCatalogCommands(program, {
    words: DRIVE_WORDS,
    output,
    run: async (fn, write) => {
      const profile = activeProfile(env, selected())
      return withIndex(async (index) => {
        const lock = write ? await lockProfile(env, selected()) : undefined
        try {
          lock?.assertHeld()
          const { catalog } = index
          const value = await fn(
            {
              ...(catalog
                ? {
                    catalog: {
                      import: (principal) =>
                        catalog.import(
                          principal,
                          catalogFiles(readState(env, selected(), principal), activeProfile(env, selected()).roots),
                        ),
                      get: (principal, id) => catalog.get(principal, id),
                      list: (principal, query) => catalog.list(principal, query),
                    },
                  }
                : {}),
              ...(index.knowledge ? { knowledge: index.knowledge } : {}),
            },
            profile.principal,
          )
          lock?.assertHeld()
          return value
        } finally {
          await lock?.release()
        }
      })
    },
    id: fileId,
    roots: () => activeProfile(env, selected()).roots,
  })
}
