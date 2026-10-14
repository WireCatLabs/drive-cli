import { readFileSync, writeFileSync } from "node:fs"
import {
  CliError,
  createDeadline,
  createOutputBuffer,
  createRenderer,
  type KeyringStore,
  processStreams,
  type Streams,
  visibleControls,
} from "@wirecat/cli-base"
import { annotate, describeOptions, flatten, metaOf } from "@wirecat/cli-base/commands"
import { formatSuggestions, suggest } from "@wirecat/cli-base/completion"
import { commandWords, liftProfile, parseDuration, refuseCommandName } from "@wirecat/cli-core/cli"
import { Command, Help, InvalidArgumentError, Option } from "commander"
import { validateRequest } from "./api-contract.js"
import { installCatalogCommands } from "./catalog-commands.js"
import {
  activeProfile,
  application,
  checkTextLimit,
  configKey,
  fileId,
  pictureSearch,
  profileName,
  readConfig,
  SETTING_NAMES,
  writeConfig,
} from "./config.js"
import { googleError } from "./errors.js"
import { type Complete, memoryModel } from "./extraction.js"
import { googleSource, MAX_ENTRIES } from "./google.js"
import { apiMethod, type GoogleApi, googleApi } from "./google-api.js"
import { installKnowledgeCommands } from "./knowledge-commands.js"
import { login } from "./login.js"
import { type DocumentIndex, FOLDER, type GoogleSource, metadataJson, skipJson } from "./model.js"
import { answerOf } from "./output.js"
import { checkPolicy, guardedGoogleWrite, methodPolicyKeys, type PolicyFlags } from "./policy.js"
import { lockProfile } from "./profile-lock.js"
import { ACCOUNT_FREE_COMMANDS, commandsDocument, describeDriveProgram, examples } from "./registry.js"
import { installRemoteCommands } from "./remote-commands.js"
import { readSnapshot, readState } from "./state.js"
import { openIndex } from "./store.js"
import { sync } from "./sync.js"
import { authorizedClient, checkAuthorization, credentials } from "./tokens.js"
import { VERSION } from "./version.js"

export interface ProgramOptions {
  env?: NodeJS.ProcessEnv
  streams?: Streams
  keyring?: KeyringStore
  openBrowser?: (url: string) => Promise<void>
  source?: (profile: string) => Promise<GoogleSource>
  index?: () => Promise<DocumentIndex>
  signal?: AbortSignal
  api?: GoogleApi
  complete?: Complete
  ask?: (key: string) => Promise<boolean>
  readBody?: (path: string | number) => string
}
const positive = (input: string) => {
  const n = Number(input)
  if (!Number.isSafeInteger(n) || n < 1) throw new InvalidArgumentError("use a positive integer")
  return n
}
const offset = (input: string) => {
  const n = Number(input)
  if (!Number.isSafeInteger(n) || n < 0) throw new InvalidArgumentError("use a nonnegative integer")
  return n
}
export const createProgram = (options: ProgramOptions = {}): Command => {
  const startedAt = Date.now()
  const env = options.env ?? process.env
  const streams = options.streams ?? processStreams
  const program = new Command("drive")
    .description("manage Google Drive and Docs, local Markdown, shared knowledge and search")
    .version(VERSION)
    .usage("<profile> [options] <command>")
    .option("--profile <name>", "explicit Google account profile (alternative to the first word)")
    .option("--json", "print machine-readable JSON")
    .option("--jsonl", "print machine-readable JSON lines")
    .option("--agent-json", "show control and direction characters visibly in machine output")
    .option("--quiet", "suppress optional diagnostics")
    .option("--debug", "on failure, show the full error record: cause and stack")
    .option("--timeout <duration>", "whole-command deadline, e.g. 30s", (raw: string) =>
      parseDuration(raw, "--timeout"),
    )
    .option("--max-output-bytes <n>", "largest result to print, in bytes; 0 for no limit", offset, 4 * 1024 * 1024)
    .option("--read-only", "refuse local and remote mutations")
    .option("--offline", "answer only operations that use local cached data")
    .option("--dry-run", "validate command/policy and preview without acting")
    .option("--yes", "answer a policy confirmation; cannot override deny or readonly")
    .option("--allow-dangerous", "answer a permanent-deletion confirmation")
    .option(
      "--permission <key=level>",
      "temporary policy override; repeat to add keys",
      (value: string, previous: string[] = []) => [...previous, value],
    )
  program
    .configureOutput({
      writeOut: (text) => streams.data(text),
      writeErr: (text) => streams.diagnostic(text),
      outputError: () => undefined,
    })
    .exitOverride()
  const selected = (): string => {
    const name = program.opts<{ profile?: string }>().profile
    if (!name) {
      const choices = Object.keys(readConfig(env).profiles).sort()
      throw new CliError(
        "validation_error",
        "choose a profile explicitly: drive <profile> <command> or drive --profile <name> <command>; " +
          (choices.length
            ? `configured profiles: ${choices.join(", ")}`
            : "no profiles configured; connect with drive personal session start"),
        { reason: "profile.required", profiles: choices },
      )
    }
    return profileName(name)
  }
  let currentAction: Command | undefined
  let activeSignal = options.signal
  let deadline: ReturnType<typeof createDeadline> | undefined
  const confirmations = new Set<string>()
  const askOnce = async (key: string) => {
    if (confirmations.has(key)) return true
    const answered = (await options.ask?.(key)) ?? false
    if (answered) confirmations.add(key)
    return answered
  }
  const policyFlags = (): PolicyFlags & { offline?: boolean } => ({
    ...program.opts(),
    allowDangerous: program.opts().allowDangerous || currentAction?.opts().allowDelete,
  })
  const safeForAgent = (value: unknown): unknown => {
    if (typeof value === "string") return visibleControls(value)
    if (Array.isArray(value)) return value.map(safeForAgent)
    if (value && typeof value === "object")
      return Object.fromEntries(
        Object.entries(value).map(([key, field]) => [visibleControls(key), safeForAgent(field)]),
      )
    return value
  }
  const output = (value: unknown) => {
    const result =
      currentAction?.name() === "commands" ? value : answerOf(value, { startedAt, limit: currentAction?.opts().limit })
    const buffer = createOutputBuffer({ maxOutputBytes: program.opts().maxOutputBytes })
    createRenderer({
      format: program.opts().jsonl
        ? "jsonl"
        : program.opts().json || program.opts().agentJson || !process.stdout.isTTY
          ? "json"
          : "pretty",
      color: false,
      streams: { ...streams, data: (text) => buffer.data(text) },
      quiet: program.opts().quiet === true,
    }).result(program.opts().agentJson ? safeForAgent(result) : result)
    buffer.flush((text) => streams.data(text))
  }
  const source = async () => {
    const name = selected()
    if (options.source) return options.source(name)
    const client = authorizedClient(env, name, options.keyring, activeSignal)
    await checkAuthorization(client)
    return googleSource(client)
  }
  const withIndex = async <T>(fn: (index: DocumentIndex) => Promise<T>): Promise<T> => {
    const index = await (options.index?.() ?? openIndex(env))
    try {
      return await fn(index)
    } finally {
      await index.close()
    }
  }
  const session = program.command("session").description("sign in to Google and manage local profiles")
  examples(
    session.command("start").description("sign in to Google in the browser; read-only unless you pass --write"),
    ["drive personal session start", "drive work session start --write --activity"],
  )
    .option("--client-file <file>", "path to your own Desktop OAuth client JSON, used instead of WireCat's")
    .option(
      "--credential-storage <storage>",
      "where the sign-in is kept: keyring, or file for a private file",
      "keyring",
    )
    .option("--no-browser", "print the sign-in URL instead of opening a browser")
    .option("--write", "also ask for permission to change Drive files and Docs")
    .option("--activity", "also ask for permission to read Drive Activity history")
    .option("--apps", "also ask for permission to see installed Drive apps")
    .action(
      async (args: {
        clientFile?: string
        credentialStorage: string
        browser: boolean
        write?: boolean
        activity?: boolean
        apps?: boolean
      }) => {
        if (args.credentialStorage !== "keyring" && args.credentialStorage !== "file")
          throw new CliError("validation_error", "credential storage is keyring or file")
        output(
          await login({
            env,
            profile: selected(),
            application: application(env, args.clientFile),
            storage: args.credentialStorage,
            ...(args.write ? { write: true } : {}),
            ...(args.activity ? { activity: true } : {}),
            ...(args.apps ? { apps: true } : {}),
            ...(options.keyring ? { keyring: options.keyring } : {}),
            ...(activeSignal ? { signal: activeSignal } : {}),
            openBrowser: args.browser ? (options.openBrowser ?? (async () => {})) : async () => {},
            showUrl: (url) => streams.diagnostic(`Open Google sign-in: ${url}\n`),
          }),
        )
      },
    )
  examples(session.command("list").description("list the configured profiles; credentials are never printed"), [
    "drive personal session list",
  ]).action(() =>
    output({
      scope: "all-configured-profiles",
      items: Object.entries(readConfig(env).profiles).map(([name, p]) => ({
        profile: name,
        selected_folders: p.roots.length,
        storage: p.storage,
      })),
    }),
  )
  examples(session.command("end").description("sign this profile out; imported documents stay"), [
    "drive personal session end",
  ]).action(() => {
    const name = selected()
    const config = readConfig(env)
    const profile = activeProfile(env, name)
    credentials(env, profile.storage, options.keyring).remove(name)
    // Preserve the principal and roots so reauthorization resumes the same source identities.
    writeConfig(env, config)
    output({ profile: name, signed_out: true, cached_data: "retained" })
  })
  const folders = program.command("folders").description("choose the Google Drive folders that sync imports")
  const folderArgument = "folder id or Google Drive URL"
  examples(
    folders
      .command("add")
      .argument("<folder>", folderArgument)
      .description("import a folder and everything under it on the next sync"),
    ["drive personal folders add FOLDER_ID"],
  ).action(async (input: string) => {
    const id = fileId(input)
    const config = readConfig(env)
    const name = selected()
    const profile = activeProfile(env, name)
    const metadata = await (await source()).metadata(id)
    if (metadata.mime !== FOLDER || metadata.trashed)
      throw new CliError("validation_error", "source is not an accessible Google folder")
    if (!profile.roots.includes(metadata.id)) profile.roots.push(metadata.id)
    config.profiles[name] = profile
    writeConfig(env, config)
    output({ id: metadata.id, name: metadata.name, added: true })
  })
  examples(folders.command("list").description("list the folder ids sync imports"), [
    "drive personal folders list",
  ]).action(() => output({ items: activeProfile(env, selected()).roots.map((id) => ({ id })) }))
  examples(
    folders
      .command("remove")
      .argument("<folder>", folderArgument)
      .description("stop importing a folder; the next sync drops its documents"),
    ["drive personal folders remove FOLDER_ID"],
  ).action((input: string) => {
    const id = fileId(input)
    const config = readConfig(env)
    const name = selected()
    const profile = activeProfile(env, name)
    profile.roots = profile.roots.filter((root) => root !== id)
    config.profiles[name] = profile
    writeConfig(env, config)
    output({ id, removed: true, next: `run drive ${name} sync to reconcile cached sources` })
  })
  examples(
    program
      .command("sync")
      .summary("import what changed in the chosen folders, and finish an unfinished sync")
      .description(
        "import what changed in the chosen folders, and finish an unfinished sync; " +
          `one sync reads at most ${MAX_ENTRIES} entries under the chosen folders, and as many changes`,
      ),
    ["drive personal sync", "drive personal sync --rescan --limit 500"],
  )
    .option("--limit <n>", "how many documents to read from Google in this run", positive, 200)
    .option("--rescan", "read every chosen folder again instead of only what changed")
    .option("--embed", "also index pending text for meaning search, with a model already downloaded")
    .action(async (args: { limit: number; embed?: boolean; rescan?: boolean }) => {
      const remote = activeProfile(env, selected()).roots.length ? await source() : undefined
      const result = await withIndex(async (index) => ({
        ...(await sync(remote, index, env, selected(), args.limit, activeSignal, args.rescan)),
        ...(args.embed ? { embeddings: await index.embed(600) } : {}),
      }))
      output(result)
      if (result.errors.length || result.pending)
        streams.diagnostic(`${result.pending} source operations remain; run drive ${selected()} sync again\n`)
      if (result.errors.length)
        throw new CliError("provider_error", "sync completed partially; failed operations remain pending", {
          reason: "sync.partial",
        })
    })
  examples(program.command("status").description("show the last sync, imported documents and pending work"), [
    "drive personal status",
  ]).action(() => {
    const name = selected()
    const profile = activeProfile(env, name)
    const state = readState(env, name, profile.principal)
    output({
      profile: name,
      selected_folders: profile.roots,
      documents: Object.keys(state.documents).length,
      pending: state.pending?.jobs.length ?? 0,
      skipped: state.skipped.map(skipJson),
      last_sync: state.lastSync ?? null,
      coverage: "Google Docs and Markdown/TXT; native export tab fidelity and assets are not verified",
      remote_checked: false,
    })
  })
  const documents = program.command("documents").description("read imported documents and Google Docs")
  const documentArgument = "document id or Google Docs URL"
  examples(documents.command("list").description("list imported documents with their Google URLs"), [
    "drive personal documents list",
    "drive personal documents list --tag budget",
  ])
    .option("--tag <tag>", "only documents with this tag")
    .option("--person <reference>", "only documents linked to this person:<uid> reference")
    .action(async (args: { tag?: string; person?: string }) => {
      const profile = activeProfile(env, selected())
      const state = readState(env, selected(), profile.principal)
      let docs = Object.values(state.documents)
      if (args.tag || args.person)
        docs = await withIndex(async (index) => {
          if (!index.knowledge) throw new CliError("configuration_error", "index has no shared knowledge adapter")
          const filtered = []
          for (const doc of docs)
            if (await index.knowledge.matches(profile.principal, doc.reference, args)) filtered.push(doc)
          return filtered
        })
      output({
        items: docs.map((doc) => ({
          ...metadataJson(doc.metadata),
          reference: doc.reference,
          tabs: doc.tabs,
        })),
      })
    })
  const imported = (input: string) => {
    const id = fileId(input)
    const profile = activeProfile(env, selected())
    const state = readState(env, selected(), profile.principal)
    if (!state.documents[id])
      throw new CliError("not_found", "this source is not imported in the selected profile", {
        reason: "document.not-imported",
      })
    const doc = state.documents[id]
    return { id, ref: doc.reference, hash: doc.hash, snapshot: readSnapshot(env, selected(), id) }
  }
  examples(
    documents
      .command("show")
      .argument("<document>", documentArgument)
      .description("show an imported document's text, tabs and metadata"),
    ["drive personal documents show DOC_ID"],
  ).action((input: string) => {
    const { snapshot } = imported(input)
    output({
      metadata: metadataJson(snapshot.metadata),
      text: snapshot.text,
      tabs: snapshot.tabs,
      ...(snapshot.notRead ? { not_read: snapshot.notRead } : {}),
    })
  })
  examples(
    documents
      .command("export")
      .argument("<document>", documentArgument)
      .description("write an imported document to a new Markdown file"),
    ["drive personal documents export DOC_ID --out notes.md"],
  )
    .requiredOption("--out <file>", "path of the Markdown file to write; an existing file is refused")
    .action((input: string, args: { out: string }) => {
      const { id, snapshot } = imported(input)
      try {
        writeFileSync(args.out, snapshot.markdown, { flag: "wx", mode: 0o600 })
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "EEXIST")
          throw new CliError("validation_error", "the output file already exists; choose another --out", {
            reason: "export.exists",
            param: "--out",
          })
        throw error
      }
      output({ id, path: args.out, format: "markdown" })
    })
  examples(
    program
      .command("search")
      .argument("<query>", "words to look for")
      .description("search imported documents by words, and by meaning when indexed"),
    ["drive personal search budget", `drive personal search "quarterly plan" --exact --limit 5`],
  )
    .option("--limit <n>", "how many results to return", positive, 20)
    .option("--offset <n>", "how many results to skip", offset, 0)
    .option("--exact", "match the words exactly: no word forms, no meaning")
    .action(async (query: string, args: { limit: number; offset: number; exact?: boolean }) =>
      output(
        await withIndex((index) =>
          index.search(activeProfile(env, selected()).principal, query, {
            ...args,
            exact: args.exact ?? false,
            ...(pictureSearch(env, selected()) ? { pictures: true } : {}),
          }),
        ),
      ),
    )
  installCatalogCommands(program, { env, selected, output, positive, offset, withIndex })
  installKnowledgeCommands(program, {
    document: imported,
    output,
    positive,
    offset,
    complete: () => options.complete ?? memoryModel(env, selected(), activeSignal),
    run: async (input, fn) => {
      const lock = await lockProfile(env, selected())
      try {
        return await withIndex(async (index) => {
          lock.assertHeld()
          if (!index.knowledge) throw new CliError("configuration_error", "index has no shared knowledge adapter")
          const principal = activeProfile(env, selected()).principal
          const found = await index.catalog?.get(principal, fileId(input))
          const ref = found?.ref ?? imported(input).ref
          const result = await fn(index.knowledge, principal, ref)
          lock.assertHeld()
          return result
        })
      } finally {
        await lock.release()
      }
    },
  })
  installRemoteCommands(program, {
    output,
    positive,
    readBody:
      options.readBody ??
      ((path) => {
        try {
          return readFileSync(path, "utf8")
        } catch {
          throw new CliError("validation_error", "the request body file could not be read", {
            reason: "body.unreadable",
            param: "--body-file",
          })
        }
      }),
    call: async (method, params, body) => {
      const descriptor = apiMethod(method)
      validateRequest(method, params, body)
      const flags = policyFlags()
      for (const key of methodPolicyKeys(method))
        await checkPolicy(env, selected(), key, descriptor.mutates, flags, askOnce)
      if (flags.offline)
        throw new CliError("permission_error", "this operation needs Google; --offline was requested", {
          reason: "offline.refused",
        })
      if (flags.dryRun)
        return {
          dry_run: true,
          method,
          mutates: descriptor.mutates,
          parameters: params,
          body_provided: body !== undefined,
        }
      const act = async () => {
        try {
          if (options.api) return await options.api.call(method, params, body)
          const client = authorizedClient(env, selected(), options.keyring, activeSignal)
          await checkAuthorization(client, descriptor.scope)
          return await googleApi(client).call(method, params, body)
        } catch (error) {
          throw googleError(error)
        }
      }
      return descriptor.mutates ? guardedGoogleWrite(env, selected(), `api.${method}`, act, flags, askOnce) : act()
    },
  })
  const config = program.command("config").description("read and change settings; credentials are kept apart")
  examples(config.command("show").description("show the defaults and every profile's settings"), [
    "drive personal config show",
  ]).action(() => output(readConfig(env)))
  examples(config.command("set").description("set one setting of this profile, or of the defaults"), [
    "drive personal config set read_only true",
    `drive personal config set permissions.files '"readonly"' --defaults`,
  ])
    .argument(
      "<key>",
      "read_only, max_text_chars, picture_search, shared AI settings, permissions.<key> or models.<purpose>.<field>",
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
      output({ key, updated: true, scope: args.defaults ? "defaults" : selected() })
    })
  examples(program.command("complete").description("print a shell completion script, or complete words"), [
    "drive complete zsh",
  ])
    .argument("[words...]", "a shell name, or after -- the words typed so far")
    .allowUnknownOption()
    .helpOption(false)
    .action(async (words: string[]) => {
      if (!(program as Command & { rawArgs: string[] }).rawArgs.includes("--")) {
        if (!["bash", "zsh", "fish", "powershell"].includes(words[0] ?? ""))
          throw new CliError("validation_error", "choose a supported shell")
        const { script } = await import("@bomb.sh/tab")
        script(words[0] as "zsh", "drive", "drive")
      } else
        streams.data(
          formatSuggestions(
            suggest({ commands: describeDriveProgram(program), globalOptions: describeOptions(program), words }),
          ),
        )
    })
  examples(
    program
      .command("models")
      .description("choose the model that proposes memories; keys stay out of config")
      .command("set")
      .description("set the provider and model for one use"),
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
      output({ purpose: args.purpose, configured: true })
    })
  const mcp = examples(program.command("mcp").description("serve drive's commands to an agent over MCP on stdio"), [
    "drive personal mcp",
    "drive personal mcp --tools",
  ])
  mcp
    .option("--tools", "list the tools offered instead of starting the server")
    .action(async (args: { tools?: boolean }) => {
      const { mcpTools, serveMcp } = await import("./mcp.js")
      if (args.tools)
        output({
          items: mcpTools({ ...options, env }, selected(), policyFlags()).map(({ name, schema, command }) => ({
            name,
            input_schema: schema,
            mutates: command.mutates,
          })),
        })
      else
        await serveMcp(
          { ...options, env, ...(activeSignal ? { signal: activeSignal } : {}) },
          selected(),
          policyFlags(),
        )
    })
  examples(program.command("commands").description("print the command tree and its options as data"), [
    "drive commands --json",
    "drive commands files copy --json",
  ])
    .argument("[path...]", "only this command or group, as words")
    .action((path: string[]) => output(commandsDocument(program, path)))
  for (const info of flatten(describeDriveProgram(program))) {
    let command = program
    for (const part of info.path) command = command.commands.find((child) => child.name() === part) ?? command
    const localWrites = [
      "session start",
      "session end",
      "folders add",
      "folders remove",
      "sync",
      "documents export",
      "tags add",
      "tags remove",
      "relationships add",
      "relationships remove",
      "notes add",
      "notes edit",
      "notes remove",
      "memories add",
      "memories confirm",
      "memories stale",
      "memories extract",
      "facts add",
      "facts confirm",
      "identities link",
      "models set",
      "config set",
    ]
    const remoteWrites = [
      "api call",
      "files copy",
      "files move",
      "files update",
      "files trash",
      "files restore",
      "files mkdir",
      "documents create",
      "documents update",
    ]
    const name = info.path.join(" ")
    annotate(command, {
      origin: metaOf(command).origin ?? "handwritten",
      mutates: metaOf(command).mutates ?? (localWrites.includes(name) || remoteWrites.includes(name)),
      local:
        metaOf(command).local ??
        (localWrites.includes(name) && name !== "session start" && name !== "memories extract"),
      state: "beta",
    })
  }
  class Preview extends Error {}
  const pathOf = (command: Command) => {
    const path: string[] = []
    for (let at: Command | null = command; at?.parent; at = at.parent) path.unshift(at.name())
    return path
  }
  program.hook("preAction", async (_root, action) => {
    currentAction = action
    if (program.opts().timeout !== undefined && !deadline) {
      deadline = createDeadline({
        timeoutMs: program.opts().timeout,
        ...(options.signal ? { signal: options.signal } : {}),
      })
      activeSignal = deadline.signal
    }
    const path = pathOf(action)
    const words = path.join(" ")
    // Discovery is account-independent and must not load config, credentials or the store.
    if (ACCOUNT_FREE_COMMANDS.has(words)) return
    selected()
    if (["commands", "complete", "config show", "config set", "session list"].includes(words)) return
    const flags = policyFlags()
    const metadata = metaOf(action)
    const rawMethod = words === "api call" ? action.args[0] : undefined
    const method = metadata.operation_id ?? rawMethod
    if (rawMethod) {
      const descriptor = apiMethod(rawMethod)
      if (descriptor.mutates && !action.opts().allowWrite)
        throw new CliError("permission_error", "this method changes Google data; pass --allow-write", {
          reason: "write.not-allowed",
        })
      if (descriptor.destructive && !action.opts().allowDelete && !flags.allowDangerous)
        throw new CliError(
          "permission_error",
          "this method deletes Google data; pass --allow-delete or --allow-dangerous",
          { reason: "delete.not-allowed" },
        )
      if (flags.allowDangerous) action.setOptionValue("allowDelete", true)
    }
    const mutates = method ? apiMethod(method).mutates : metadata.mutates === true
    const key = method ? `api.${method}` : path.join(".")
    for (const permission of method ? methodPolicyKeys(method) : [key])
      await checkPolicy(env, selected(), permission, mutates, flags, askOnce)
    if (
      flags.offline &&
      (method ||
        ["files", "comments", "permissions", "revisions", "shared-drives"].includes(path[0] ?? "") ||
        [
          "session start",
          "folders add",
          "documents get",
          "documents history",
          "documents create",
          "documents update",
          "memories extract",
          "sync",
        ].includes(words))
    )
      throw new CliError("permission_error", "this command may require network access; --offline was requested", {
        reason: "offline.refused",
      })
    if (
      flags.dryRun &&
      path[0] !== "api" &&
      !["files", "comments", "permissions", "revisions", "shared-drives"].includes(path[0] ?? "") &&
      !["documents get", "documents create", "documents update", "documents history"].includes(words)
    ) {
      output({ dry_run: true, command: words, mutates, local: metadata.local === true })
      throw new Preview()
    }
    if (words === "session start") refuseCommandName(selected(), commandWords(program), "drive")
  })
  const parse = program.parseAsync.bind(program)
  program.parseAsync = async (argv = process.argv, settings) => {
    const prefix = settings?.from === "user" ? [] : argv.slice(0, 2)
    const args = settings?.from === "user" ? argv : argv.slice(2)
    const lifted = liftProfile([...args], commandWords(program))
    // Refuse conflicting/repeated selectors rather than letting Commander pick the last one.
    const flags = lifted.rest.slice(0, lifted.rest.indexOf("--") < 0 ? lifted.rest.length : lifted.rest.indexOf("--"))
    const selectors = flags.filter((arg) => arg === "--profile" || arg.startsWith("--profile="))
    if (selectors.length > 1 || (lifted.profile && selectors.length))
      throw new CliError("validation_error", "select a profile once: use the first word or --profile")
    const rest = lifted.profile ? ["--profile", profileName(lifted.profile), ...lifted.rest] : lifted.rest
    try {
      const running = parse([...prefix, ...rest], settings)
      return deadline ? await deadline.race(async () => running) : await running
    } catch (error) {
      if (error instanceof Preview) return program
      throw error
    } finally {
      deadline?.dispose()
    }
  }
  // Imported generated children have their own Commander exit/output configuration.
  for (const info of flatten(describeDriveProgram(program))) {
    let command = program
    for (const part of info.path) command = command.commands.find((child) => child.name() === part) ?? command
    command.configureHelp({
      commandUsage: (target) => {
        const usage = new Help().commandUsage(target)
        return ACCOUNT_FREE_COMMANDS.has(pathOf(target).join(" "))
          ? usage
          : usage.replace(/^drive /, "drive <profile> ")
      },
    })
    command.exitOverride().configureOutput({
      writeOut: (text) => streams.data(text),
      writeErr: (text) => streams.diagnostic(text),
      outputError: () => {},
    })
  }
  return program
}
