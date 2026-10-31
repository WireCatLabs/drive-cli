import type { KeyringStore } from "@wirecat/cli-base"
import { type CommandInfo, describeProgram, flatten } from "@wirecat/cli-base/commands"
import type { CommandAvailability } from "@wirecat/cli-core/cli"
import type { Command } from "commander"
import { apiMethod } from "./api-methods.js"
import { GOOGLE_WRITE } from "./registry.js"
import { READ_SCOPE, WRITE_SCOPE } from "./scopes.js"
import { covers, grantedScopes } from "./tokens.js"

// REMOTE_WRITE also marks a command that sends a document to the model (memories extract); only GOOGLE_WRITE
// changes Google files.
const requiredScope = (command: CommandInfo) =>
  command.api_operation
    ? apiMethod(command.api_operation).scope
    : command.effects?.remote === GOOGLE_WRITE.remote && command.effects.local === GOOGLE_WRITE.local
      ? WRITE_SCOPE
      : undefined

/**
 * The MCP server's tools a profile's saved sign-in cannot run, read from the keyring the run was given: write,
 * activity and apps stay visible with the grant they need. A sign-in that names no scopes is taken as enough.
 */
export const grantAvailability = (program: Command, env: NodeJS.ProcessEnv, keyring?: KeyringStore) => {
  const commands = new Map(flatten(describeProgram(program)).map((info) => [info.path.join(" "), info]))
  return (path: readonly string[], profile: string): CommandAvailability | undefined => {
    const command = commands.get(path.join(" "))
    const required = command && requiredScope(command)
    if (!required || required === READ_SCOPE) return undefined
    const granted = grantedScopes(env, profile, keyring)
    if (!granted || covers(granted, required)) return undefined
    return { available: false, reason: `the OAuth grant needs ${required}`, permission: "oauth.scope" }
  }
}
