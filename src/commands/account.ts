import { join } from "node:path"
import { annotate } from "@wirecat/cli-base/commands"
import { type AccountRemoval, accountRemoveCommand, LOCAL_READ } from "@wirecat/cli-core/cli"
import type { Command } from "commander"
import { application, configuration, paths, readConfig } from "../config.js"
import { DRIVE_APP } from "../identity.js"
import { profileLocked } from "../profile-lock.js"
import { profileDir } from "../state.js"
import type { CommandContext } from "./context.js"

const removal: AccountRemoval = {
  signOut: async (profile, { env, keyring, mayRevoke }) => {
    const storage = readConfig(env).profiles[profile]?.storage ?? "keyring"
    const { sessionKeeper } = await import("../tokens.js")
    const { revoked } = await sessionKeeper({
      env,
      name: profile,
      storage,
      client: application(env, { profile }),
      ...(keyring ? { keyring } : {}),
    }).signOut({ revoke: mayRevoke })
    return { revoked, removed: ["the Google sign-in"] }
  },
  account: (profile, { env }) => {
    const principal = readConfig(env).profiles[profile]?.principal
    return principal ? { provider: "google-drive", account: principal } : undefined
  },
  dataFiles: (profile, { env }) => [profileDir(env, profile), join(paths(env).cache, "exports", profile)],
  busy: (profile, { env }) => (profileLocked(env, profile) ? "a sync or knowledge operation" : undefined),
}

export const installAccountCommands = (program: Command, _context: CommandContext) => {
  annotate(program.command("account"), { effects: LOCAL_READ })
    .description("remove this profile from this computer")
    .addCommand(accountRemoveCommand(DRIVE_APP, removal, { resolveSettings: configuration.resolveSettings }))
}
