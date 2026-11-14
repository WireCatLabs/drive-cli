import { join } from "node:path"
import { CliError } from "@wirecat/cli-base"
import { fileMirrorState } from "@wirecat/cli-core/documents"
import { addDocumentMirrorCommands } from "@wirecat/cli-core/documents/cli"
import { newOperationId } from "@wirecat/cli-core/sends"
import type { Command } from "commander"
import { activeProfile, fileId, readConfig, writeConfig } from "../config.js"
import { googleError } from "../errors.js"
import { googleTarget, type MirrorSnapshot, mirrorKind } from "../mirror-target.js"
import { FOLDER } from "../model.js"
import { lockProfile } from "../profile-lock.js"
import { profileDir } from "../state.js"
import { type CommandContext, DRIVE_WORDS } from "./context.js"
import type { RemoteCommands } from "./remote.js"

export const installMirrorCommands = (program: Command, context: CommandContext, { call }: RemoteCommands) => {
  const { env, selected, output, source } = context
  addDocumentMirrorCommands<MirrorSnapshot>(program, {
    words: DRIVE_WORDS,
    output,
    print: (render) => context.print((_renderer, format, streams) => render(format, (text) => streams.data(text))),
    profile: selected,
    mirrors: () => activeProfile(env, selected()).mirrors ?? [],
    save: (mirrors) => {
      const config = readConfig(env)
      const name = selected()
      config.profiles[name] = { ...activeProfile(env, name), mirrors }
      writeConfig(env, config)
    },
    parent: async (input) => {
      const folder = fileId(input)
      const metadata = await (await source()).metadata(folder)
      if (metadata.mime !== FOLDER || metadata.trashed)
        throw new CliError("validation_error", "--parent is not an accessible Google folder")
      return { id: folder, name: metadata.name }
    },
    kindOf: mirrorKind,
    stateOf: (mirror) =>
      fileMirrorState<MirrorSnapshot>(
        join(profileDir(env, selected()), "mirrors"),
        mirror,
        activeProfile(env, selected()).principal,
        ["doc", "sheet"],
      ),
    connect: async () => {
      const name = selected()
      const { principal } = activeProfile(env, name)
      const google = await source()
      return {
        sync: {
          target: googleTarget(call, () => google.identity()),
          principal,
          // `call` already checks policy and journals each Google write it makes.
          guard: <T>(_attempt: unknown, act: () => Promise<T>) => act(),
          operationId: newOperationId,
          errorOf: googleError,
          lock: () => lockProfile(env, name),
          ...(context.signal() ? { signal: context.signal() as AbortSignal } : {}),
        },
        startToken: () => google.startToken(),
        changes: (token) => google.changes(token),
      }
    },
    endsOnStop: () => context.endsOnStop(),
  })
}
