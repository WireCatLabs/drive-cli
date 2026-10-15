import { CliError } from "@wirecat/cli-base"

const record = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value)

// Core now validates current spellings only; Drive still upgrades its previously written files.
export const upgradeConfig = (raw: unknown, settings: Set<string>) => {
  let changed = false
  const rename = (value: unknown, names: Set<string>): unknown => {
    if (!record(value)) return value
    const result: Record<string, unknown> = {}
    for (const [key, one] of Object.entries(value)) {
      const snake = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
      const target = names.has(snake) ? snake : key
      if (target !== key) {
        if (Object.hasOwn(value, target) && JSON.stringify(value[target]) !== JSON.stringify(one))
          throw new CliError("configuration_error", "conflicting legacy settings")
        changed = true
      }
      result[target] = one
    }
    return result
  }
  const scope = (value: unknown) => {
    const result = rename(value, settings)
    if (record(result) && record(result.models))
      result.models = Object.fromEntries(
        Object.entries(result.models).map(([purpose, model]) => [purpose, rename(model, new Set(["base_url"]))]),
      )
    return result
  }
  const config = rename(raw, new Set(["default_profile"]))
  if (record(config)) {
    if (Object.hasOwn(config, "defaults")) config.defaults = scope(config.defaults)
    if (record(config.profiles))
      config.profiles = Object.fromEntries(Object.entries(config.profiles).map(([name, value]) => [name, scope(value)]))
  }
  return { config, changed }
}
