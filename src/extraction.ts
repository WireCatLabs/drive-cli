import type { Complete } from "@wirecat/cli-core/documents"

export { type Complete, extractMemories } from "@wirecat/cli-core/documents"

import { resolveAISettings } from "@wirecat/cli-core/cli"
import { modelGateway, modelTarget } from "@wirecat/cli-core/models"
import { readConfig } from "./config.js"

export const memoryModel = (env: NodeJS.ProcessEnv, profile: string, signal?: AbortSignal): Complete => {
  const config = readConfig(env)
  const { values } = resolveAISettings(
    "DRIVE",
    [
      ["profile", config.profiles[profile]],
      ["defaults", config.defaults],
    ],
    env,
  )
  const gateway = modelGateway({
    resolve: (purpose) => modelTarget(values, purpose),
    consent: () => true, // Called only by the explicitly invoked memories extract command.
    key: (provider) => env[`DRIVE_${provider.toUpperCase()}_API_KEY`] ?? env[`${provider.toUpperCase()}_API_KEY`],
    signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(120000)]) : AbortSignal.timeout(120000),
  })
  return gateway.complete
}
