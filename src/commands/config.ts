import { join } from "node:path"
import { CliError } from "@wirecat/cli-base"
import { annotate } from "@wirecat/cli-base/commands"
import { FETCH, grantsAuthority, itemOf, LOCAL_READ, LOCAL_WRITE, modelCatalogueCommand } from "@wirecat/cli-core/cli"
import { type Command, Option } from "commander"
import { activeProfile, checkTextLimit, configKey, readConfig, SETTING_NAMES, writeConfig } from "../config.js"
import { DRIVE_APP } from "../policy.js"
import { examples } from "../registry.js"
import type { CommandContext } from "./context.js"

export const installConfigCommands = (program: Command, { env, selected, output }: CommandContext) => {
  const config = annotate(program.command("config"), { effects: LOCAL_READ }).description(
    "read and change settings; credentials are kept apart",
  )
  examples(
    annotate(config.command("show"), { effects: LOCAL_READ }).description(
      "show the defaults and every profile's settings",
    ),
    ["drive personal config show"],
  ).action(() => output(itemOf(readConfig(env))))
  examples(
    annotate(grantsAuthority(config.command("set")), { effects: LOCAL_WRITE }).description(
      "set one setting of this profile, or of the defaults",
    ),
    [
      "drive personal config set max_text_chars 100000",
      `drive personal config set permissions.files '"readonly"' --defaults`,
    ],
  )
    .argument(
      "<key>",
      "max_text_chars, picture_search, shared AI settings, permissions.<key> or models.<purpose>.<field>",
    )
    .argument("<json-value>", "the new value, as JSON")
    .option("--defaults", "change the defaults instead of this profile")
    .action((rawKey: string, raw: string, args: { defaults?: boolean }) => {
      const key = configKey(rawKey)
      const value = readConfig(env)
      if (args.defaults) value.defaults ??= {}
      const target = args.defaults
        ? (value.defaults as NonNullable<typeof value.defaults>)
        : activeProfile(env, selected())
      if (!args.defaults) value.profiles[selected()] = target as (typeof value.profiles)[string]
      const [head, ...parts] = key.split(".")
      if (
        !SETTING_NAMES.has(head ?? "") ||
        parts.some((part) => ["__proto__", "prototype", "constructor"].includes(part))
      )
        throw new CliError("validation_error", "config set accepts profile settings and shared AI settings")
      let parsed: unknown
      try {
        parsed = JSON.parse(raw)
      } catch {
        throw new CliError("validation_error", "setting value must be JSON")
      }
      if (head === "picture_search") {
        if (args.defaults || parts.length || typeof parsed !== "boolean")
          throw new CliError("validation_error", "picture_search is true or false, set per profile")
        ;(target as { picture_search?: boolean }).picture_search = parsed
      } else if (head === "max_text_chars" && !parts.length) target.max_text_chars = checkTextLimit(parsed)
      else if (!parts.length) Object.assign(target, { [key]: parsed })
      else if (head === "permissions") {
        target.permissions ??= {}
        Object.assign(target.permissions, { [parts.join(".")]: parsed })
      } else if (head === "models" && parts.length === 2 && parts[0] && parts[1]) {
        target.models ??= {}
        target.models[parts[0]] ??= {}
        Object.assign(target.models[parts[0]] as object, { [parts[1]]: parsed })
      } else throw new CliError("validation_error", "unknown setting path")
      writeConfig(env, value)
      output(itemOf({ key, updated: true, scope: args.defaults ? "defaults" : selected() }))
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
