import { randomUUID } from "node:crypto"
import { readFileSync } from "node:fs"
import {
  CliError,
  createDeadline,
  createOutputBuffer,
  createRenderer,
  fieldsOf,
  processStreams,
  projectFields,
  type Renderer,
  type RenderFormat,
  type Streams,
} from "@wirecat/cli-base"
import { annotate, flatten, metaOf } from "@wirecat/cli-base/commands"
import { writes } from "@wirecat/cli-base/standards"
import {
  type Body,
  commandWords,
  itemOf,
  liftJson,
  liftProfile,
  parseDuration,
  refuseCommandName,
  renderAnswer,
} from "@wirecat/cli-core/cli"
import { Command, Help } from "commander"
import { validateRequest } from "./api-contract.js"
import { installCatalogCommands } from "./commands/catalog.js"
import { installConfigCommands, installModelCommands } from "./commands/config.js"
import { type CommandContext, offset, type ProgramOptions, positive } from "./commands/context.js"
import { installCommandsCommand, installCompleteCommand } from "./commands/discovery.js"
import { importedDocument, installDocumentCommands } from "./commands/documents.js"
import { installFolderCommands } from "./commands/folders.js"
import { installKnowledgeCommands } from "./commands/knowledge.js"
import { installMcpCommand } from "./commands/mcp.js"
import { installRemoteCommands } from "./commands/remote.js"
import { installSearchCommand } from "./commands/search.js"
import { installSessionCommands } from "./commands/session.js"
import { installStoreCommands } from "./commands/store.js"
import { installSyncCommands } from "./commands/sync.js"
import { activeProfile, fileId, profileName, readConfig } from "./config.js"
import { googleError } from "./errors.js"
import { memoryModel } from "./extraction.js"
import { googleSource } from "./google.js"
import { apiMethod, googleApi, googleUploadRequest } from "./google-api.js"
import type { DocumentIndex } from "./model.js"
import { snakeKeys } from "./output.js"
import { checkPolicy, guardedGoogleWrite, methodPolicyKeys, type PolicyFlags } from "./policy.js"
import { lockProfile } from "./profile-lock.js"
import { checkProviderJson, checkResultFields, providerJsonFields } from "./provider-json.js"
import { ACCOUNT_FREE_COMMANDS, describeDriveProgram } from "./registry.js"
import { profileDir } from "./state.js"
import { openIndex } from "./store.js"
import { authorizedClient, checkAuthorization } from "./tokens.js"
import { uploadFile } from "./upload.js"
import { VERSION } from "./version.js"

export type { ProgramOptions }

const eachItem = (body: Body, change: (item: unknown) => unknown): Body =>
  "items" in body ? { ...body, items: body.items.map(change) } : { ...body, item: change(body.item) }
const commandIn = (root: Command, words: readonly string[]) => {
  let at: Command | undefined = root
  for (const word of words) {
    if (word.startsWith("-")) continue
    const child: Command | undefined = at?.commands.find((command) => command.name() === word)
    if (child) at = child
  }
  return at === root ? undefined : at
}
class Preview extends Error {}
export const createProgram = (options: ProgramOptions = {}): Command => {
  const startedAt = Date.now()
  const env = options.env ?? process.env
  const streams = options.streams ?? processStreams
  const program = new Command("drive")
    .description("manage Google Drive and Docs, local Markdown, shared knowledge and search")
    .version(VERSION)
    .usage("<profile> [options] <command>")
    .option("--profile <name>", "explicit Google account profile (alternative to the first word)")
    .option("--json", "print machine-readable JSON; --json=id,title keeps only those fields")
    .option("--jsonl", "print machine-readable JSON lines")
    .option("--quiet", "suppress optional diagnostics")
    .option("--debug", "on failure, show the full error record: cause and stack")
    .option("--timeout <duration>", "whole-command deadline, e.g. 30s", (raw: string) =>
      parseDuration(raw, "--timeout"),
    )
    .option("--max-output-bytes <bytes>", "largest result to print, in bytes; 0 for no limit", offset, 4 * 1024 * 1024)
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
  let checkedMethod: string | undefined
  let fields: string | undefined
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
  const runId = randomUUID()
  const print = (render: (renderer: Renderer, format: RenderFormat, streams: Streams) => void) => {
    const format: RenderFormat = program.opts().jsonl
      ? "jsonl"
      : program.opts().json || !process.stdout.isTTY
        ? "json"
        : "pretty"
    const buffer = createOutputBuffer({ maxOutputBytes: program.opts().maxOutputBytes })
    const buffered = { ...streams, data: (text: string) => buffer.data(text) }
    render(
      createRenderer({ format, color: false, streams: buffered, quiet: program.opts().quiet === true }),
      format,
      buffered,
    )
    buffer.flush((text) => streams.data(text))
  }
  const output = (body: Body) => {
    const snaked = eachItem(body, (item) => snakeKeys(item))
    const whole = {
      ...snaked,
      meta: {
        run_id: runId,
        duration_ms: Math.max(0, Math.round(Date.now() - startedAt)),
        complete: true,
        ...body.meta,
      },
    }
    if (fields && currentAction) checkResultFields(currentAction, whole, fields)
    const paths = fields ? fieldsOf(fields) : undefined
    const answer = paths ? (projectFields(whole, paths) as typeof whole) : whole
    print((renderer, format, buffered) =>
      renderAnswer(currentAction ?? program, { renderer, format, streams: buffered }, answer),
    )
  }
  const source = async () => {
    const name = selected()
    if (options.source) return options.source(name)
    const client = authorizedClient(env, name, options.keyring, activeSignal)
    await checkAuthorization(client)
    return googleSource(client)
  }
  const withIndex = async <T>(fn: (index: DocumentIndex) => Promise<T>): Promise<T> => {
    const index = await (options.index?.() ?? openIndex(env, selected(), currentAction?.opts().rescan === true))
    try {
      return await fn(index)
    } finally {
      await index.close()
    }
  }
  const context: CommandContext = {
    env,
    streams,
    options,
    selected,
    signal: () => activeSignal,
    output,
    print,
    source,
    withIndex,
    policyFlags,
  }
  const imported = importedDocument(context)
  installSessionCommands(program, context)
  installFolderCommands(program, context)
  installSyncCommands(program, context)
  installStoreCommands(program, context)
  installDocumentCommands(program, context)
  installSearchCommand(program, context)
  installCatalogCommands(program, { env, selected, output, positive, offset, withIndex })
  installKnowledgeCommands(program, {
    document: imported,
    output,
    positive,
    complete: () => options.complete ?? memoryModel(env, selected(), activeSignal),
    run: async (input, fn) =>
      withIndex(async (index) => {
        const lock = await lockProfile(env, selected())
        try {
          lock.assertHeld()
          if (!index.knowledge) throw new CliError("configuration_error", "index has no shared knowledge adapter")
          const principal = activeProfile(env, selected()).principal
          const found = await index.catalog?.get(principal, fileId(input))
          const ref = found?.ref ?? imported(input).ref
          const result = await fn(index.knowledge, principal, ref)
          lock.assertHeld()
          return result
        } finally {
          await lock.release()
        }
      }),
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
      const alreadyChecked = new Set(method === checkedMethod ? methodPolicyKeys(method) : [])
      for (const key of methodPolicyKeys(method, body))
        if (!alreadyChecked.has(key)) await checkPolicy(env, selected(), key, descriptor.mutates, flags, askOnce)
      if (flags.dryRun) {
        output(
          itemOf({
            dry_run: true,
            method,
            mutates: descriptor.mutates,
            parameters: params,
            body_provided: body !== undefined,
          }),
        )
        throw new Preview()
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
    upload: async (path, args) => {
      const method = "drive.files.create"
      const flags = policyFlags()
      // The hook checked the command's own key (files.upload); creating a file has its own keys.
      for (const key of methodPolicyKeys(method)) await checkPolicy(env, selected(), key, true, flags, askOnce)
      if (flags.dryRun) {
        output(itemOf({ dry_run: true, method, mutates: true, path, ...args }))
        throw new Preview()
      }
      const act = async () => {
        let request = options.uploadRequest
        if (!request) {
          const client = authorizedClient(env, selected(), options.keyring, activeSignal)
          await checkAuthorization(client, apiMethod(method).scope)
          request = googleUploadRequest(client)
        }
        return uploadFile({ path, ...args, stateDir: profileDir(env, selected()), request })
      }
      return guardedGoogleWrite(env, selected(), `api.${method}`, act, flags, askOnce)
    },
  })
  installConfigCommands(program, context)
  installCompleteCommand(program, context)
  installModelCommands(program, context)
  installMcpCommand(program, context, createProgram)
  installCommandsCommand(program, context)
  for (const info of flatten(describeDriveProgram(program))) {
    let command = program
    for (const part of info.path) command = command.commands.find((child) => child.name() === part) ?? command
    annotate(command, { origin: metaOf(command).origin ?? "handwritten", state: "beta" })
  }
  const pathOf = (command: Command) => {
    const path: string[] = []
    for (let at: Command | null = command; at?.parent; at = at.parent) path.unshift(at.name())
    return path
  }
  program.hook("preAction", async (_root, action) => {
    currentAction = action
    checkProviderJson(
      action,
      { json: program.opts().json === true, ...(fields ? { fields } : {}) },
      process.stdout.isTTY,
    )
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
    // The server writes only through its tools, and each tool call runs this same check with these flags.
    if (words === "mcp") return checkPolicy(env, selected(), "mcp", false, flags, askOnce)
    const metadata = metaOf(action)
    const rawMethod = words === "api call" ? action.args[0] : undefined
    const method = metadata.api_operation ?? rawMethod
    if (rawMethod) {
      const descriptor = apiMethod(rawMethod)
      if (descriptor.mutates && !action.opts().allowWrites)
        throw new CliError("permission_error", "this method changes Google data; pass --allow-writes", {
          reason: "write.not-allowed",
        })
      if (descriptor.destructive && !action.opts().allowDelete && !flags.allowDangerous)
        throw new CliError(
          "permission_error",
          "this method deletes Google data; pass --allow-delete or --allow-dangerous",
          { reason: "delete.not-allowed" },
        )
      if (flags.allowDangerous && !action.opts().allowDelete) action.setOptionValue("allowDelete", true)
    }
    const mutates = method ? apiMethod(method).mutates : writes(metadata.effects)
    const key = method ? `api.${method}` : path.join(".")
    for (const permission of method ? methodPolicyKeys(method) : [key])
      await checkPolicy(env, selected(), permission, mutates, flags, askOnce)
    checkedMethod = method
    if (flags.offline && (method || metadata.effects?.remote !== "none"))
      throw new CliError("permission_error", "this command may require network access; --offline was requested", {
        reason: "offline.refused",
      })
    // A command that only calls Google previews the request itself, once its parameters are known.
    const googleOnly = metadata.effects?.local === "none" && metadata.effects.remote !== "none"
    if (flags.dryRun && !googleOnly) {
      output(itemOf({ dry_run: true, command: words, effects: metadata.effects }))
      throw new Preview()
    }
    if (words === "session start") refuseCommandName(selected(), commandWords(program), "drive")
  })
  const parse = program.parseAsync.bind(program)
  program.parseAsync = async (argv = process.argv, settings) => {
    const prefix = settings?.from === "user" ? [] : argv.slice(0, 2)
    const args = settings?.from === "user" ? argv : argv.slice(2)
    const profiled = liftProfile([...args], commandWords(program))
    const requested = liftJson(profiled.rest, (words) => commandIn(program, words), providerJsonFields)
    fields = requested.fields
    const lifted = { ...profiled, rest: requested.argv }
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
