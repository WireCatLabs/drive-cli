import { addDocumentSearchCommand } from "@wirecat/cli-core/documents/cli"
import type { Command } from "commander"
import { activeProfile, pictureSearch, transcriptsOf } from "../config.js"
import { readState } from "../state.js"
import { type CommandContext, DRIVE_WORDS } from "./context.js"

export const installSearchCommand = (program: Command, { env, selected, output, withIndex }: CommandContext) =>
  addDocumentSearchCommand(program, {
    words: DRIVE_WORDS,
    output,
    search: async (query, options) => {
      const name = selected()
      const profile = activeProfile(env, name)
      return withIndex(
        async (index) =>
          (await index.search(profile.principal, query, {
            ...options,
            ...(pictureSearch(env, name) ? { pictures: true } : {}),
          })) as object,
      )
    },
    imported: () => {
      const name = selected()
      const profile = activeProfile(env, name)
      return {
        profile: name,
        chosen: profile.roots.length > 0 || transcriptsOf(env, name).mode === "include",
        documents: Object.keys(readState(env, name, profile.principal).documents).length,
      }
    },
  })
