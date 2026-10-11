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
import { commandWords, liftProfile, parseDuration, refuseCommandName } from "@wirecat/cli-messaging/cli"
import { Command, Help, InvalidArgumentError, Option } from "commander"
import { operationOf, validateRequest } from "./api-contract.js"
import { activeProfile, application, fileId, profileName, readConfig, writeConfig } from "./config.js"
import { googleError } from "./errors.js"
import { type Complete, memoryModel } from "./extraction.js"
import { googleSource } from "./google.js"
import { apiMethod, type GoogleApi, googleApi } from "./google-api.js"
import { installKnowledgeCommands } from "./knowledge-commands.js"
import { login } from "./login.js"
import { type DocumentIndex, FOLDER, type GoogleSource } from "./model.js"
import { checkPolicy, guardedGoogleWrite, methodPolicyKeys, type PolicyFlags } from "./policy.js"
import { lockProfile } from "./profile-lock.js"
import { ACCOUNT_FREE_COMMANDS, describeDriveProgram } from "./registry.js"
import { installRemoteCommands } from "./remote-commands.js"
import { requestSchema } from "./schema.js"
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
  const env = options.env ?? process.env
  const streams = options.streams ?? processStreams
  const program = new Command("drive")
    .description("Manage Google Drive and Docs, local Markdown, shared knowledge and search")
    .version(VERSION)
    .usage("<profile> [options] <command>")
    .option("--profile <name>", "explicit Google account profile (alternative to the first word)")
    .option("--json", "print machine-readable JSON")
    .option("--jsonl", "print machine-readable JSON lines")
    .option("--agent-json", "show control and direction characters visibly in machine output")
    .option("--quiet", "suppress optional diagnostics")
    .option("--timeout <duration>", "whole-command deadline, e.g. 30s", (raw: string) =>
      parseDuration(raw, "--timeout"),
    )
    .option("--max-output-bytes <n>", "bound buffered result output", offset, 4 * 1024 * 1024)
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
        { profiles: choices },
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
    }).result(program.opts().agentJson ? safeForAgent(value) : value)
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
  const session = program.command("session").description("Google browser sign-in and local account profiles")
  session
    .command("start")
    .description("Approve Google access in your browser; read-only unless --write is requested")
    .option("--client-file <file>", "use your own Desktop OAuth application JSON instead of WireCat's app")
    .option("--credential-storage <storage>", "keyring or explicit private-file storage", "keyring")
    .option("--no-browser", "print the sign-in URL without opening a browser")
    .option("--write", "request remote Drive/Docs mutation permissions")
    .option("--activity", "also request Drive Activity history permissions")
    .option("--apps", "also request the installed Drive applications permission")
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
  session
    .command("list")
    .description("Configured account profiles; no credentials are printed")
    .action(() =>
      output({
        scope: "all-configured-profiles",
        items: Object.entries(readConfig(env).profiles).map(([name, p]) => ({
          profile: name,
          selectedFolders: p.roots.length,
          storage: p.storage,
        })),
      }),
    )
  session
    .command("end")
    .description("Remove this profile's local sign-in; cached data is retained")
    .action(() => {
      const name = selected()
      const config = readConfig(env)
      const profile = activeProfile(env, name)
      credentials(env, profile.storage, options.keyring).remove(name)
      // Preserve the principal and roots so reauthorization resumes the same source identities.
      writeConfig(env, config)
      output({ profile: name, signedOut: true, cachedData: "retained" })
    })
  const folders = program.command("folders").description("Select Google folders for local ingestion")
  folders
    .command("add")
    .argument("<url-or-id>")
    .description("Include a folder and its descendants")
    .action(async (input: string) => {
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
  folders
    .command("list")
    .description("Selected folder IDs")
    .action(() => output({ items: activeProfile(env, selected()).roots.map((id) => ({ id })) }))
  folders
    .command("remove")
    .argument("<url-or-id>")
    .description("Stop importing a folder; sync removes sources outside the remaining scope")
    .action((input: string) => {
      const id = fileId(input)
      const config = readConfig(env)
      const name = selected()
      const profile = activeProfile(env, name)
      profile.roots = profile.roots.filter((root) => root !== id)
      config.profiles[name] = profile
      writeConfig(env, config)
      output({ id, removed: true, next: `run drive ${name} sync to reconcile cached sources` })
    })
  program
    .command("sync")
    .description("Fetch selected sources and resume a durable pending batch")
    .option("--max <n>", "maximum source operations this run", positive, 200)
    .option("--rescan", "reconcile selected folders from a fresh change token")
    .option("--embed", "embed pending shared note chunks using an already-downloaded model")
    .action(async (args: { max: number; embed?: boolean; rescan?: boolean }) => {
      const remote = activeProfile(env, selected()).roots.length ? await source() : undefined
      const result = await withIndex(async (index) => ({
        ...(await sync(remote, index, env, selected(), args.max, activeSignal, args.rescan)),
        ...(args.embed ? { embeddings: await index.embed(600) } : {}),
      }))
      output(result)
      if (result.errors.length || result.pending)
        streams.diagnostic(`${result.pending} source operations remain; run drive ${selected()} sync again\n`)
      if (result.errors.length)
        throw new CliError("provider_error", "sync completed partially; failed operations remain pending")
    })
  program
    .command("status")
    .description("Local sync checkpoint, cached sources and pending work")
    .action(() => {
      const name = selected()
      const profile = activeProfile(env, name)
      const state = readState(env, name, profile.principal)
      output({
        profile: name,
        selectedFolders: profile.roots,
        documents: Object.keys(state.documents).length,
        pending: state.pending?.jobs.length ?? 0,
        skipped: state.skipped,
        lastSync: state.lastSync ?? null,
        coverage: "Google Docs and Markdown/TXT; native export tab fidelity and assets are not verified",
        remoteChecked: false,
      })
    })
  const documents = program.command("documents").description("Locally imported sources and exports")
  documents
    .command("list")
    .description("Imported sources with original Google URLs")
    .option("--tag <tag>", "filter by a local shared tag")
    .option("--person <reference>", "filter by a linked shared person reference")
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
          ...doc.metadata,
          reference: doc.reference,
          tabs: doc.tabs,
        })),
      })
    })
  const imported = (input: string) => {
    const id = fileId(input)
    const profile = activeProfile(env, selected())
    const state = readState(env, selected(), profile.principal)
    if (!state.documents[id]) throw new CliError("not_found", "this source is not imported in the selected profile")
    const doc = state.documents[id]
    return { id, ref: doc.reference, hash: doc.hash, snapshot: readSnapshot(env, selected(), id) }
  }
  documents
    .command("show")
    .argument("<url-or-id>")
    .description("Imported text with tab and source metadata")
    .action((input: string) => {
      const { snapshot } = imported(input)
      output({ metadata: snapshot.metadata, text: snapshot.text, tabs: snapshot.tabs })
    })
  documents
    .command("export")
    .argument("<url-or-id>")
    .requiredOption("--out <file>", "destination Markdown file")
    .description("Write the native Markdown snapshot; existing files are refused")
    .action((input: string, args: { out: string }) => {
      const { id, snapshot } = imported(input)
      writeFileSync(args.out, snapshot.markdown, { flag: "wx", mode: 0o600 })
      output({ id, path: args.out, format: "markdown" })
    })
  program
    .command("search")
    .argument("<query>")
    .description("Shared keyword and optional semantic search over imported Google sources")
    .option("--limit <n>", "maximum results", positive, 20)
    .option("--offset <n>", "results to skip", offset, 0)
    .option("--exact", "keyword search only, without stemming or meaning")
    .action(async (query: string, args: { limit: number; offset: number; exact?: boolean }) =>
      output(
        await withIndex((index) =>
          index.search(activeProfile(env, selected()).principal, query, { ...args, exact: args.exact ?? false }),
        ),
      ),
    )
  installKnowledgeCommands(program, {
    document: imported,
    output,
    positive,
    offset,
    complete: () => options.complete ?? memoryModel(env, selected(), activeSignal),
    run: async (input, fn) => {
      const lock = await lockProfile(env, selected())
      try {
        const { ref } = imported(input)
        return await withIndex(async (index) => {
          lock.assertHeld()
          if (!index.knowledge) throw new CliError("configuration_error", "index has no shared knowledge adapter")
          const result = await fn(index.knowledge, activeProfile(env, selected()).principal, ref)
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
    readBody: options.readBody ?? ((path) => readFileSync(path, "utf8")),
    call: async (method, params, body) => {
      const descriptor = apiMethod(method)
      validateRequest(method, params, body)
      const flags = policyFlags()
      for (const key of methodPolicyKeys(method))
        await checkPolicy(env, selected(), key, descriptor.mutates, flags, askOnce)
      if (flags.offline) throw new CliError("permission_error", "this operation needs Google; --offline was requested")
      if (flags.dryRun)
        return {
          dryRun: true,
          method,
          mutates: descriptor.mutates,
          parameters: params,
          bodyProvided: body !== undefined,
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
  const config = program
    .command("config")
    .description("Shared-style defaults/profile settings; credentials are separate")
  config.command("show").action(() => output(readConfig(env)))
  config
    .command("set")
    .argument("<key>")
    .argument("<json-value>")
    .option("--defaults", "change defaults rather than the selected profile")
    .action((key: string, raw: string, args: { defaults?: boolean }) => {
      const value = readConfig(env)
      if (args.defaults) value.defaults ??= {}
      const target = args.defaults
        ? (value.defaults as NonNullable<typeof value.defaults>)
        : activeProfile(env, selected())
      if (!args.defaults) value.profiles[selected()] = target as (typeof value.profiles)[string]
      const [head, ...parts] = key.split(".")
      if (
        !["readOnly", "permissions", "models"].includes(head ?? "") ||
        parts.some((part) => ["__proto__", "prototype", "constructor"].includes(part))
      )
        throw new CliError("validation_error", "config set accepts readOnly, permissions or models")
      let parsed: unknown
      try {
        parsed = JSON.parse(raw)
      } catch {
        throw new CliError("validation_error", "setting value must be JSON")
      }
      if (!parts.length) Object.assign(target, { [key]: parsed })
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
  program
    .command("complete")
    .description("Shell completion from the shared command registry")
    .argument("[words...]")
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
  program
    .command("schema")
    .argument("<method>")
    .description("Generated request schema and operation contract without Google access")
    .action((method: string) => {
      const operation = operationOf(method)
      output({
        operation,
        requestSchema: requestSchema(method),
      })
    })
  program
    .command("models")
    .description("Configure the shared model gateway; keys stay outside config")
    .command("configure")
    .option("--purpose <purpose>", "shared model purpose", "memories")
    .addOption(new Option("--provider <provider>").choices(["openai", "anthropic", "off"]).makeOptionMandatory())
    .option("--model <model>", "model identifier for the selected provider")
    .option("--base-url <url>", "optional HTTP/S model endpoint without URL credentials")
    .action((args) => {
      const config = readConfig(env)
      config.defaults ??= {}
      config.defaults.models ??= {}
      config.defaults.models[args.purpose] = {
        provider: args.provider,
        ...(args.model ? { model: args.model } : {}),
        ...(args.baseUrl ? { baseUrl: args.baseUrl } : {}),
      }
      writeConfig(env, config)
      output({ purpose: args.purpose, configured: true })
    })
  const mcp = program.command("mcp").description("Expose guarded commands over MCP stdio")
  mcp.option("--tools", "list offered tools without starting a server").action(async (args: { tools?: boolean }) => {
    const { mcpTools, serveMcp } = await import("./mcp.js")
    if (args.tools)
      output({
        items: mcpTools({ ...options, env }, selected(), policyFlags()).map(({ name, schema, command }) => ({
          name,
          inputSchema: schema,
          mutates: command.mutates,
        })),
      })
    else
      await serveMcp({ ...options, env, ...(activeSignal ? { signal: activeSignal } : {}) }, selected(), policyFlags())
  })
  program
    .command("commands")
    .argument("[path...]")
    .description("Discover the command tree and options as shared registry data")
    .action((path: string[]) => {
      const commands = describeDriveProgram(program)
      const found = path.length ? flatten(commands).filter((item) => item.path.join(" ") === path.join(" ")) : commands
      if (path.length && !found.length) throw new CliError("not_found", "command path was not found")
      output({
        items: found,
        ...(path.length ? {} : { cli: "drive", commands, globalOptions: describeOptions(program) }),
      })
    })
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
      "links add",
      "links remove",
      "notes add",
      "notes edit",
      "notes remove",
      "memories add",
      "memories confirm",
      "memories stale",
      "memories extract",
      "people link",
      "models configure",
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
      local: localWrites.includes(name) && name !== "session start" && name !== "memories extract",
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
    if (["commands", "complete", "schema", "config show", "config set", "session list"].includes(words)) return
    const flags = policyFlags()
    const metadata = metaOf(action)
    const rawMethod = words === "api call" ? action.args[0] : undefined
    const method = metadata.operationId ?? rawMethod
    if (rawMethod) {
      const descriptor = apiMethod(rawMethod)
      if (descriptor.mutates && !action.opts().allowWrite)
        throw new CliError("permission_error", "this method changes Google data; pass --allow-write")
      if (descriptor.destructive && !action.opts().allowDelete && !flags.allowDangerous)
        throw new CliError(
          "permission_error",
          "this method deletes Google data; pass --allow-delete or --allow-dangerous",
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
      throw new CliError("permission_error", "this command may require network access; --offline was requested")
    if (
      flags.dryRun &&
      path[0] !== "api" &&
      !["files", "comments", "permissions", "revisions", "shared-drives"].includes(path[0] ?? "") &&
      !["documents get", "documents create", "documents update", "documents history"].includes(words)
    ) {
      output({ dryRun: true, command: words, mutates, local: metadata.local === true })
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
