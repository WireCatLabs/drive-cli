import { CliError } from "@wirecat/cli-core"
import lockfile from "proper-lockfile"
import { ensureProfileDir, profileDir } from "./state.js"

export const lockProfile = async (env: NodeJS.ProcessEnv, name: string) => {
  ensureProfileDir(env, name)
  let compromised = false
  try {
    const release = await lockfile.lock(profileDir(env, name), {
      stale: 30000,
      retries: 0,
      onCompromised: () => {
        compromised = true
      },
    })
    return {
      release,
      assertHeld: () => {
        if (compromised) throw new CliError("provider_unavailable", "profile lock was lost; retry the operation")
      },
    }
  } catch {
    throw new CliError(
      "provider_unavailable",
      "another sync or knowledge operation holds this profile's lock; retry later",
    )
  }
}
