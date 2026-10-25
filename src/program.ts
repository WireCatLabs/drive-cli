import { randomUUID } from "node:crypto"
import { readFileSync } from "node:fs"
import {
  CliError,
  createDeadline,
  createOutputBuffer,
  createRenderer,
  fieldsOf,
  isCliError,
  processStreams,
  projectFields,
  type Renderer,
  type RenderFormat,
  type Streams,
} from "@wirecat/cli-base"
import { annotate, flatten, metaOf } from "@wirecat/cli-base/commands"
import { timezoneOf } from "@wirecat/cli-base/query"
import { writes } from "@wirecat/cli-base/standards"
import {
  addContractInfo,
  assertSharedContracts,
  type Body,
  changesAuthority,
  commandWords,
  environmentOf,
  hasSharedContract,
  itemOf,
  LOCAL_READ,
  liftJson,
  liftProfile,
  overrideSharedContract,
  parseDuration,
  provide,
  recordRuns,
  refuseCommandName,
  renderAnswer,
  runsCommand,
  takesProfile,
} from "@wirecat/cli-core/cli"
import { levelFor, newOperationId } from "@wirecat/cli-core/sends"
import { Command, Help } from "commander"
import { validateRequest } from "./api-contract.js"
import { apiMethod } from "./api-methods.js"
import { installCatalogCommands } from "./commands/catalog.js"
import { installConfigCommands, installModelCommands } from "./commands/config.js"
import { type CommandContext, offset, type ProgramOptions, positive } from "./commands/context.js"
import { installCommandsCommand, installCompleteCommand } from "./commands/discovery.js"
import { installDoctorCommand } from "./commands/doctor.js"
import { importedDocument, installDocumentCommands } from "./commands/documents.js"
import { installFolderCommands } from "./commands/folders.js"
import { installKnowledgeCommands } from "./commands/knowledge.js"
import { installMcpCommand } from "./commands/mcp.js"
import { installMirrorCommands } from "./commands/mirrors.js"
import { installRemoteCommands, type RemoteCommands } from "./commands/remote.js"
import { installSearchCommand } from "./commands/search.js"
import { installSessionCommands } from "./commands/session.js"
import { installSkillCommand } from "./commands/skill.js"
import { installStoreCommands } from "./commands/store.js"
import { installSyncCommands } from "./commands/sync.js"
import { installUpgradeCommand } from "./commands/upgrade.js"
import { activeProfile, fileId, profileName, readConfig } from "./config.js"
import { googleError } from "./errors.js"
import { memoryModel } from "./extraction.js"
import { REASONS as CONTRACT_REASONS } from "./failure.js"
import { guide, installFirstScreen } from "./first-screen.js"
import type { DocumentIndex } from "./model.js"
import { snakeKeys } from "./output.js"
import {
  checkPolicy,
  DRIVE_APP,
  discoveryAvailability,
  guardedGoogleWrite,
  methodPolicyKeys,
  type PolicyFlags,
  permissionKeys,
  permissionNames,
  policySettings,
  refuseUnderReadOnly,
} from "./policy.js"
import { lockProfile } from "./profile-lock.js"
import { checkProviderJson, checkResultFields, providerJsonFields } from "./provider-json.js"
import { ACCOUNT_FREE_COMMANDS, ANY_PROFILE_COMMANDS, describeDriveProgram, markProfileFree } from "./registry.js"
import { profileDir } from "./state.js"
import { openIndex } from "./store.js"
import { localTimes } from "./time.js"
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
    .option("--json", "print machine-readable JSON; --json=id,name keeps only those fields")
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
      writeOut: (text) => streams.data(text.replace(/\n$/, "")),
      writeErr: (text) => streams.diagnostic(text.replace(/\n$/, "")),
      outputError: () => undefined,
    })
    .exitOverride()
  let profileWord: string | undefined
  /**
   * The profile is the first word, or DRIVE_PROFILE; nothing picks one. DRIVE_PROFILE_LOCK pins the process: a
   * word or variable naming another profile is refused, so an agent cannot reach a profile with fewer guards.
   */
  const selected = (): string => {
    const lock = env.DRIVE_PROFILE_LOCK || undefined
    const named = profileWord ?? (env.DRIVE_PROFILE || undefined)
    if (lock !== undefined) {
      profileName(lock)
      if (named !== undefined && profileName(named) !== lock)
        throw new CliError(
          "permission_error",
          `this process is locked to profile ${lock} (DRIVE_PROFILE_LOCK) — profile ${named} is refused`,
          { reason: "profile.lock-refused" },
        )
      return lock
    }
    if (named) return profileName(named)
    const config = readConfig(env, permissionNames(policyFlags().permissionKeys ?? new Set()))
    const choices = Object.keys(config.profiles).sort()
    throw new CliError(
      "validation_error",
      choices.length
        ? `name a profile: drive <profile> … — profiles here: ${choices.join(", ")} (or set DRIVE_PROFILE)`
        : "no profiles here yet; create one with drive personal session start (any name in place of personal)",
      { reason: "profile.required", profiles: choices },
    )
  }
  let currentAction: Command | undefined
  let checkedMethod: string | undefined
  let fields: string | undefined
  let activeSignal = options.signal
  let deadline: ReturnType<typeof createDeadline> | undefined
  let stopEnds = false
  const confirmations = new Set<string>()
  const askOnce = async (key: string) => {
    if (confirmations.has(key)) return true
    const answered = (await options.ask?.(key)) ?? false
    if (answered) confirmations.add(key)
    return answered
  }
  let knownKeys: Set<string> | undefined
  const policyFlags = (): PolicyFlags & { offline?: boolean } => {
    knownKeys ??= permissionKeys(flatten(describeDriveProgram(program)).map((info) => info.path))
    return {
      ...program.opts(),
      allowDangerous: program.opts().allowDangerous || currentAction?.opts().allowDelete,
      permissionKeys: knownKeys,
    }
  }
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
    print((renderer, format, buffered) => {
      const command = currentAction ?? program
      if (format !== "pretty") return renderAnswer(command, { renderer, format, streams: buffered }, answer)
      const zone = timezoneOf()
      const shown = localTimes(answer, zone)
      renderAnswer(command, { renderer, format, streams: buffered }, shown.value as typeof answer)
      if (shown.changed || answer.meta.timezone) buffered.data(`times in ${answer.meta.timezone ?? zone}`)
    })
  }
  // Google's client libraries are about 80 ms of a start; only a command that reaches Google loads them.
  const signedIn = async (name: string, scope?: string) => {
    const { authorizedClient, checkAuthorization } = await import("./tokens.js")
    const client = authorizedClient(env, name, options.keyring, activeSignal)
    await checkAuthorization(client, scope)
    return client
  }
  const source = async () => {
    const name = selected()
    if (options.source) return options.source(name)
    const [{ googleSource }, client] = await Promise.all([import("./google.js"), signedIn(name)])
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
    profileWord: () => profileWord,
    endsOnStop: () => {
      stopEnds = true
    },
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
  const remote: RemoteCommands = {
    mcp: options.mcp,
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
            action_invoked: false,
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
          const [{ googleApi }, client] = await Promise.all([
            import("./google-api.js"),
            signedIn(selected(), descriptor.scope),
          ])
          return await googleApi(client).call(method, params, body)
        } catch (error) {
          throw googleError(error)
        }
      }
      if (!descriptor.mutates) return act()
      const operationId = newOperationId()
      const result = await guardedGoogleWrite(env, selected(), `api.${method}`, act, flags, askOnce, operationId)
      return {
        ...(result && typeof result === "object" && !Array.isArray(result) ? result : { data: result }),
        operation_id: operationId,
      }
    },
    download: async (id, mime) => {
      const method = mime ? "drive.files.export" : "drive.files.get"
      const flags = policyFlags()
      for (const key of methodPolicyKeys(method)) await checkPolicy(env, selected(), key, false, flags, askOnce)
      if (options.download) return options.download(id, mime)
      const [{ googleDownload }, client] = await Promise.all([
        import("./google-api.js"),
        signedIn(selected(), apiMethod(method).scope),
      ])
      return googleDownload(client)(id, mime)
    },
    upload: async (path, args) => {
      const method = "drive.files.create"
      const flags = policyFlags()
      // The hook checked the command's own key (files.upload); creating a file has its own keys.
      for (const key of methodPolicyKeys(method)) await checkPolicy(env, selected(), key, true, flags, askOnce)
      if (flags.dryRun) {
        output(itemOf({ dry_run: true, action_invoked: false, method, mutates: true, path, ...args }))
        throw new Preview()
      }
      const act = async () => {
        let request = options.uploadRequest
        if (!request) {
          const [{ googleUploadRequest }, client] = await Promise.all([
            import("./google-api.js"),
            signedIn(selected(), apiMethod(method).scope),
          ])
          request = googleUploadRequest(client)
        }
        return uploadFile({ path, ...args, stateDir: profileDir(env, selected()), request })
      }
      const operationId = newOperationId()
      const result = await guardedGoogleWrite(env, selected(), `api.${method}`, act, flags, askOnce, operationId)
      return {
        ...(result && typeof result === "object" && !Array.isArray(result) ? result : { data: result }),
        operation_id: operationId,
      }
    },
  }
  installRemoteCommands(program, remote)
  installMirrorCommands(program, context, remote)
  installConfigCommands(program, context)
  installCompleteCommand(program, context)
  installModelCommands(program, context)
  installMcpCommand(program, context, createProgram)
  installCommandsCommand(program, context)
  installSkillCommand(program, context)
  installDoctorCommand(program, context)
  installUpgradeCommand(program, context)
  program.addCommand(
    overrideSharedContract(
      runsCommand(DRIVE_APP),
      "Every drive command declares its effects, groups included; the shared runs group reads only local files.",
      (runs) => {
        annotate(runs, { effects: LOCAL_READ })
      },
    ),
  )
  markProfileFree(program)
  provide(program, {
    env,
    streams,
    discoveryAvailability: (info) => {
      if (!(profileWord ?? env.DRIVE_PROFILE ?? env.DRIVE_PROFILE_LOCK)) return undefined
      try {
        const command = flatten(describeDriveProgram(program)).find((one) => one.path.join(" ") === info.path.join(" "))
        return command ? discoveryAvailability(command, policySettings(env, selected(), policyFlags())) : undefined
      } catch {
        return undefined
      }
    },
  })
  for (const info of flatten(describeDriveProgram(program))) {
    if (info.commands.length) continue
    let command = program
    for (const word of info.path) command = command.commands.find((one) => one.name() === word) ?? command
    command.addHelpText("after", () => {
      const availability = environmentOf(program).discoveryAvailability?.(info)
      return availability?.available === false ? `\nAvailability: unavailable — ${availability.reason}\n` : ""
    })
  }
  program.addCommand(guide())
  for (const info of flatten(describeDriveProgram(program))) {
    let command = program
    for (const part of info.path) command = command.commands.find((child) => child.name() === part) ?? command
    const metadata = { origin: metaOf(command).origin ?? "handwritten", state: "beta" as const }
    if (hasSharedContract(command))
      overrideSharedContract(
        command,
        "Drive explicitly labels its public CLI commands beta while its provider integration is reviewed.",
        (one) => {
          annotate(one, metadata)
        },
      )
    else annotate(command, metadata)
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
    const metadata = metaOf(action)
    const preview = (): never => {
      output(itemOf({ dry_run: true, command: words, effects: metadata.effects, action_invoked: false }))
      throw new Preview()
    }
    // Every return below skips the dry-run check at the end, so a command that writes previews here first.
    const previewWrite = () => {
      if (program.opts().dryRun === true && (writes(metadata.effects) || changesAuthority(action))) preview()
    }
    // Discovery is account-independent and must not load config, credentials or the store.
    if (ACCOUNT_FREE_COMMANDS.has(words) && !options.mcp) return previewWrite()
    await options.atStart?.(action)
    if (ANY_PROFILE_COMMANDS.has(words)) {
      if (profileWord ?? env.DRIVE_PROFILE ?? env.DRIVE_PROFILE_LOCK) selected()
      return
    }
    // The action picks the profile, the defaults or the top of the file, so a broken file can still be repaired.
    if (words === "config unset" && !options.mcp && !profileWord) {
      refuseUnderReadOnly(env, "change a setting")
      return previewWrite()
    }
    selected()
    if ((words === "config set" || words === "config unset") && !options.mcp) {
      refuseUnderReadOnly(env, "change a setting")
      return previewWrite()
    }
    if (options.mcp && changesAuthority(action)) {
      const authority = policySettings(env, selected(), policyFlags())
      if (!["ask", "allow"].includes(levelFor(authority.levels, "mcp.authority").level))
        throw new CliError("permission_error", "MCP authority changes require the owner's mcp.authority permission")
      if (words === "config set" || words === "config unset") {
        const key = action.args[0] ?? ""
        if (key === "permissions" || key.startsWith("permissions.mcp"))
          throw new CliError("permission_error", "an agent cannot change its own authority or read-only settings")
      }
    }
    const flags = policyFlags()
    // The server writes only through its tools, and each tool call runs this same check with these flags.
    if (words === "mcp") return checkPolicy(env, selected(), "mcp", false, flags, askOnce)
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
    if (flags.dryRun && !googleOnly) preview()
    if (words === "session start") refuseCommandName(selected(), commandWords(program), "drive")
  })
  const parse = program.parseAsync.bind(program)
  program.parseAsync = async (argv = process.argv, settings) => {
    const prefix = settings?.from === "user" ? [] : argv.slice(0, 2)
    const args = settings?.from === "user" ? argv : argv.slice(2)
    const valued = new Set(
      program.options
        .filter((option) => option.required)
        .flatMap((option) => [option.long, option.short].filter((flag) => flag !== undefined)),
    )
    const profiled = liftProfile([...args], commandWords(program), valued)
    const requested = liftJson(profiled.rest, (words) => commandIn(program, words), providerJsonFields)
    fields = requested.fields
    const lifted = { ...profiled, rest: requested.argv }
    const flags = lifted.rest.slice(0, lifted.rest.indexOf("--") < 0 ? lifted.rest.length : lifted.rest.indexOf("--"))
    if (flags.some((arg) => arg === "--profile" || arg.startsWith("--profile=")))
      throw new CliError(
        "validation_error",
        "the profile is the first word: drive <profile> <command>; there is no --profile",
      )
    profileWord = lifted.profile ? profileName(lifted.profile) : undefined
    const rest = lifted.rest
    try {
      const running = parse([...prefix, ...rest], settings)
      return deadline ? await deadline.race(async () => running) : await running
    } catch (error) {
      if (error instanceof Preview) return program
      if (stopEnds && activeSignal?.aborted && (!isCliError(error) || error.code !== "outcome_unknown")) return program
      throw error
    } finally {
      deadline?.dispose()
    }
  }
  recordRuns(program, {
    app: DRIVE_APP,
    content: "document content",
    agent: options.mcp === true,
    profile: selected,
    settings: () => {
      const defaults = readConfig(env).defaults
      return { record: defaults?.record, keepRunsForDays: defaults?.keep_runs_for_days }
    },
    env,
    streams,
  })
  // Imported generated children have their own Commander exit/output configuration.
  for (const info of flatten(describeDriveProgram(program))) {
    let command = program
    for (const part of info.path) command = command.commands.find((child) => child.name() === part) ?? command
    command.configureHelp({
      commandUsage: (target) => {
        const usage = new Help().commandUsage(target)
        return takesProfile(target) ? usage.replace(/^drive /, "drive <profile> ") : usage
      },
    })
    command.exitOverride().configureOutput({
      writeOut: (text) => streams.data(text.replace(/\n$/, "")),
      writeErr: (text) => streams.diagnostic(text.replace(/\n$/, "")),
      outputError: () => {},
    })
  }
  installFirstScreen(program)
  addContractInfo(program, (value) => streams.data(JSON.stringify(value)), {
    fields: providerJsonFields,
    errors: { reasons: CONTRACT_REASONS },
  })
  assertSharedContracts(program)
  return program
}
