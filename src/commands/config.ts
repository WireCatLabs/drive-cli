import { join } from "node:path"
import { CliError, saveConfigFile } from "@wirecat/cli-base"
import { annotate } from "@wirecat/cli-base/commands"
import { FETCH, grantsAuthority, itemOf, LOCAL_READ, LOCAL_WRITE, modelCatalogueCommand } from "@wirecat/cli-core/cli"
import { type Command, Option } from "commander"
import {
  type ConfigFile,
  ConfigSchema,
  checkTextLimit,
  DEFAULTS_ONLY,
  inspectConfig,
  readConfig,
  refusal,
  SETTING_NAMES,
  unknownProfile,
  writeConfig,
} from "../config.js"
import { schemaIssues, withoutIssues } from "../config-issues.js"
import { DRIVE_APP, fileIssues } from "../policy.js"
import { examples } from "../registry.js"
import type { CommandContext } from "./context.js"

type Node = Record<string, unknown>
const isNode = (value: unknown): value is Node => typeof value === "object" && value !== null && !Array.isArray(value)
const sameAt = (one: readonly string[], other: readonly string[]) =>
  one.length === other.length && one.every((part, index) => part === other[index])
const startsWith = (at: readonly string[], prefix: readonly string[]) => sameAt(at.slice(0, prefix.length), prefix)

/** The path `config set` and `unset` change in a profile or the defaults: one permission key, one model field, or one setting. */
const settingAt = (key: string): string[] => {
  const [head = "", ...parts] = key.split(".")
  if (head === "permissions" && parts.length) return [head, parts.join(".")]
  return [head, ...parts]
}

const refuseUnsafe = (at: readonly string[]) => {
  if (at.some((part) => ["__proto__", "prototype", "constructor", ""].includes(part)))
    throw new CliError("validation_error", "unknown setting path")
}

export const installConfigCommands = (
  program: Command,
  { env, selected, output, streams, policyFlags, profileWord }: CommandContext,
) => {
  const keys = () => policyFlags().permissionKeys ?? new Set<string>()
  /** The file as written; one that is not JSON cannot be changed by a command, only by hand. */
  const editable = () => {
    const file = inspectConfig(env)
    const broken = file.issues.filter((issue) => issue.kind === "invalid_json")
    if (broken.length) throw refusal(broken)
    return file
  }
  const scopeOf = (file: ConfigFile, defaults: boolean | undefined): { at: string[]; scope: string } => {
    if (defaults) return { at: ["defaults"], scope: "defaults" }
    const name = selected()
    const profiles = isNode(file.raw) && isNode(file.raw.profiles) ? file.raw.profiles : {}
    if (!isNode(profiles[name])) throw unknownProfile(name, Object.keys(profiles).sort())
    return { at: ["profiles", name], scope: name }
  }

  const config = annotate(program.command("config"), { effects: LOCAL_READ }).description(
    "read and change settings; credentials are kept apart",
  )
  examples(
    annotate(config.command("show"), { effects: LOCAL_READ }).description(
      "show the defaults and every profile's settings",
    ),
    ["drive config show"],
  ).action(() => {
    const file = inspectConfig(env)
    const issues = fileIssues(file, keys())
    output(itemOf(withoutIssues(file.config, issues) as Node))
    for (const issue of issues)
      streams.diagnostic(`${issue.what}, so it is left out${issue.fix ? ` — \`${issue.fix}\` removes it` : ""}`)
  })
  examples(
    annotate(grantsAuthority(config.command("set")), { effects: LOCAL_WRITE }).description(
      "set one setting of this profile, or of the defaults",
    ),
    [
      "drive personal config set max_text_chars 100000",
      `drive personal config set permissions.files '"readonly"' --defaults`,
      "drive personal config set record true --defaults",
    ],
  )
    .argument(
      "<key>",
      "max_text_chars, picture_search, record, keep_runs_for_days, shared AI settings, permissions.<key> or models.<purpose>.<field>",
    )
    .argument("<json-value>", "the new value, as JSON")
    .option("--defaults", "change the defaults instead of this profile")
    .action((key: string, raw: string, args: { defaults?: boolean }) => {
      const file = editable()
      const { at: scope, scope: name } = scopeOf(file, args.defaults)
      const setting = settingAt(key)
      refuseUnsafe(setting)
      const [head = "", ...parts] = setting
      if (!SETTING_NAMES.has(head))
        throw new CliError("validation_error", "config set accepts profile settings and shared AI settings")
      if (parts.length && head !== "permissions" && !(head === "models" && parts.length === 2))
        throw new CliError("validation_error", "unknown setting path")
      let parsed: unknown
      try {
        parsed = JSON.parse(raw)
      } catch {
        throw new CliError("validation_error", "setting value must be JSON")
      }
      if (DEFAULTS_ONLY.has(head) && !args.defaults)
        throw new CliError("validation_error", `${head} is set for every profile at once: add --defaults`)
      if (head === "picture_search" && (args.defaults || typeof parsed !== "boolean"))
        throw new CliError("validation_error", "picture_search is true or false, set per profile")
      if (head === "max_text_chars") parsed = checkTextLimit(parsed)
      const at = [...scope, ...setting]
      const next: Node = isNode(file.raw) ? structuredClone(file.raw) : {}
      let node = next
      for (const part of at.slice(0, -1)) {
        if (!isNode(node[part])) node[part] = {}
        node = node[part] as Node
      }
      node[at.at(-1) as string] = parsed
      const before = new Set(fileIssues(file, keys()).map((issue) => issue.at.join("\u0000")))
      const after = fileIssues(
        { ...file, raw: next, issues: schemaIssues(next, ConfigSchema, { file: file.path, tool: "drive" }) },
        keys(),
      )
      const added = after.filter((issue) => !before.has(issue.at.join("\u0000")) || startsWith(issue.at, at))
      if (added.length) throw refusal(added)
      saveConfigFile(file.path, next)
      output(itemOf({ key, updated: true, scope: name }))
    })
  examples(
    annotate(grantsAuthority(config.command("unset")), { effects: LOCAL_WRITE }).description(
      "remove one setting from this profile, the defaults or the top of the file",
    ),
    ["drive personal config unset max_text_chars", "drive personal config unset permissions.files --defaults"],
  )
    .argument("<key>", "the setting, permissions.<key> or models.<purpose>.<field>; any key, known or not")
    .option("--defaults", "change the defaults instead of this profile")
    .action((key: string, args: { defaults?: boolean }) => {
      const file = editable()
      // The unset `doctor` gives for a problem outside any profile: reached with no profile typed.
      const root =
        !args.defaults &&
        profileWord() === undefined &&
        fileIssues(file, keys()).some((issue) => issue.fix === `drive config unset ${key}`)
      if ((root || args.defaults) && env.DRIVE_PROFILE_LOCK)
        throw new CliError(
          "permission_error",
          `this process is locked to profile ${env.DRIVE_PROFILE_LOCK} (DRIVE_PROFILE_LOCK) — ${root ? key : "--defaults"} changes other profiles`,
        )
      const { at: scope, scope: name } = root ? { at: [], scope: "file" } : scopeOf(file, args.defaults)
      const at = [...scope, ...(root ? key.split(".") : settingAt(key))]
      refuseUnsafe(at)
      const next: Node = isNode(file.raw) ? structuredClone(file.raw) : {}
      const chain: Node[] = [next]
      for (const part of at.slice(0, -1)) {
        const child = chain.at(-1)?.[part]
        if (!isNode(child)) break
        chain.push(child)
      }
      const parent = chain.length === at.length ? chain.at(-1) : undefined
      const last = at.at(-1) as string
      const removed = parent !== undefined && Object.hasOwn(parent, last)
      if (parent && removed) {
        delete parent[last]
        // A section the unset leaves empty goes too, so the file keeps no `{}` for a setting that is gone.
        for (let depth = chain.length - 1; depth > 0; depth--) {
          const holder = chain[depth - 1] as Node
          const section = at[depth - 1] as string
          if (Object.keys(chain[depth] as Node).length) break
          delete holder[section]
        }
        saveConfigFile(file.path, next)
      }
      output(itemOf({ key, removed, scope: name }))
    })
}

export const installModelCommands = (program: Command, { env, output, streams, policyFlags }: CommandContext) => {
  const models = annotate(program.command("models"), { effects: LOCAL_READ }).description(
    "choose the memory model and download the search model",
  )
  examples(
    annotate(grantsAuthority(models.command("set")), { effects: LOCAL_WRITE }).description(
      "set the provider and model for one use",
    ),
    ["drive personal models set --provider openai --model MODEL_ID", "drive personal models set --provider off"],
  )
    .option("--purpose <purpose>", "what the model is used for", "memories")
    .addOption(
      new Option("--provider <provider>", "who runs the model, or off to use none")
        .choices(["openai", "anthropic", "off"])
        .makeOptionMandatory(),
    )
    .option("--model <model>", "model id at the provider")
    .option("--base-url <url>", "HTTP or HTTPS address of the model API, without credentials in it")
    .action((args) => {
      const config = readConfig(env)
      config.defaults ??= {}
      config.defaults.models ??= {}
      config.defaults.models[args.purpose] = {
        provider: args.provider,
        ...(args.model ? { model: args.model } : {}),
        ...(args.baseUrl ? { base_url: args.baseUrl } : {}),
      }
      writeConfig(env, config)
      output(itemOf({ purpose: args.purpose, configured: true }))
    })
  const download = async (kind: "text" | "image", id: string, acceptTerms: boolean) => {
    if (policyFlags().offline)
      throw new CliError("permission_error", "downloading a model needs the network; --offline was requested", {
        reason: "offline.refused",
      })
    const { downloadImageModel, downloadTextModel } = await import("@wirecat/cli-core/services")
    const progress = (line: string) => {
      if (!program.opts().quiet) streams.diagnostic(line)
    }
    const { model, directory } =
      kind === "text"
        ? await downloadTextModel(id, { env, acceptTerms, progress })
        : await downloadImageModel(id, { env, progress })
    output(
      itemOf({
        id: model.id,
        kind,
        title: model.title,
        languages: model.languages,
        licence: model.licence,
        size_bytes: model.files.reduce((sum, file) => sum + file.bytes, 0),
        downloaded: true,
        path: join(directory, model.id),
      }),
    )
  }
  const sharedModels = modelCatalogueCommand(DRIVE_APP, {
    kinds: ["text"],
    env: () => env,
    output,
    diagnostic: (line) => streams.diagnostic(line),
    offline: () => policyFlags().offline === true,
  })
  for (const command of sharedModels.commands) models.addCommand(command)
  const images = annotate(program.command("images"), { effects: LOCAL_READ }).description(
    "the local model that picture search uses",
  )
  const imageModels = annotate(images.command("models"), { effects: LOCAL_READ }).description(
    "models that read pictures, for picture search",
  )
  examples(
    annotate(imageModels.command("download"), { effects: FETCH, output: { entity: "model" } }).description(
      "download a picture model once into the folder every WireCat CLI shares",
    ),
    ["drive images models download clip-b32"],
  )
    .argument("<model>", "model id, such as clip-b32")
    .action((id: string) => download("image", id, false))
}
