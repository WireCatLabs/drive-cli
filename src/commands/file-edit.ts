import { annotate, hasSharedContract, metaOf, overrideSharedContract } from "@wirecat/cli-base/commands"
import type { Body } from "@wirecat/cli-core/cli"
import { addFileEditCommands, type FileUpdatePort } from "@wirecat/cli-core/documents/cli"
import type { Command } from "commander"
import { DELETE_KEY, fileId } from "../config.js"
import { DRIVE_WORDS } from "./context.js"

export interface FileEdits {
  /** The target and version store of the selected profile; `plainText` refuses PDF, Word and Excel files. */
  port(plainText: boolean): FileUpdatePort
  /** Asks the profile's levels for each key, as a write. */
  check(keys: readonly string[]): Promise<void>
  /** `drive <profile>`. */
  prefix(): string
  stdin(): NodeJS.ReadableStream | undefined
}

/** `files update` takes a whole text; the Office commands and `restore` write the bytes they were given. */
const plainText = (command: Command) => command.name() === "update" && command.parent?.name() === "files"

/**
 * cli-core's file edits over files stored in Google Drive: `files update`, `files sheets`, `files documents`,
 * `files history` and `files restore`, which with no version takes the file out of the trash, as before.
 */
export const installFileEditCommands = (
  files: Command,
  edits: FileEdits,
  output: (body: Body) => void,
  untrash: (id: string) => Promise<object>,
) => {
  addFileEditCommands(files, {
    words: DRIVE_WORDS,
    output: (body) => output(body),
    path: fileId,
    reread: (input) => `${edits.prefix()} files download ${input} --json`,
    stdin: () => edits.stdin(),
    write: async (extra, act, command) => {
      await edits.check(extra)
      return act(edits.port(plainText(command)))
    },
    read: (act) => act(edits.port(false)),
    restoreFromTrash: (input) => untrash(fileId(input)),
    deleteKey: DELETE_KEY,
    creates: false,
  })
  for (const command of files.commands.flatMap((one) => [one, ...one.commands]))
    if (hasSharedContract(command) && metaOf(command).examples?.length)
      overrideSharedContract(
        command,
        "Google Drive names a file by its id, not a path, and files update writes only over a file already there.",
        (one) => {
          const lines = (metaOf(one).examples ?? [])
            .filter((line) => !line.endsWith('update /notes.md --text "# Notes"'))
            .map((line) => line.replace(/\/(notes\.md|budget\.xlsx|report\.docx)/u, "FILE_ID"))
          annotate(one, { examples: lines })
          if (one.name() === "update" && one.parent === files)
            one
              .summary(one.summary().replace(", or create a text file", ""))
              .description(one.description().replace(", or create a text file", ""))
        },
      )
}
