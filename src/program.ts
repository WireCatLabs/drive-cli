import { randomUUID } from "node:crypto"
import { mkdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { CliError, isCliError, processStreams, type Streams } from "@wirecat/cli-base"
import { annotate, flatten, metaOf } from "@wirecat/cli-base/commands"
import { timezoneOf } from "@wirecat/cli-base/query"
import { type Effects, writes } from "@wirecat/cli-base/standards"
import {
  addContractInfo,
  appDoctorCommand,
  appMcpCommand,
  type BaseEnvironment,
  type Body,
  type CommandAvailability,
  type CommandRuns,
  changesAuthority,
  commandRuns,
  commandWords,
  createProgram as createSharedProgram,
  type EventSink,
  environmentOf,
  hasSharedContract,
  inRun,
  itemOf,
  LOCAL_READ,
  outputFor,
  overrideSharedContract,
  type ProgramDefinition,
  parseDuration,
  readOnlyRefusal,
  refuseCommandName,
  renderAnswer,
  rootOf,
  run as runShared,
  runsCommand,
  skillCommand,
} from "@wirecat/cli-core/cli"
import { levelFor, newOperationId } from "@wirecat/cli-core/sends"
import type { Command } from "commander"
import { validateRequest } from "./api-contract.js"
import { apiMethod } from "./api-methods.js"
import { installCatalogCommands } from "./commands/catalog.js"
import { installConfigCommands, installModelCommands } from "./commands/config.js"
import { type CommandContext, type DriveEnvironment, offset, positive } from "./commands/context.js"
import { installCommandsCommand, installCompleteCommand } from "./commands/discovery.js"
import { importedDocument, installDocumentCommands, storedDocument } from "./commands/documents.js"
import { installFolderCommands } from "./commands/folders.js"
import { installKnowledgeCommands } from "./commands/knowledge.js"
import { installMirrorCommands } from "./commands/mirrors.js"
import { installRemoteCommands, type RemoteCommands } from "./commands/remote.js"
import { installSearchCommand } from "./commands/search.js"
import { installSessionCommands } from "./commands/session.js"
import { installStoreCommands } from "./commands/store.js"
import { installSyncCommands } from "./commands/sync.js"
import { installUpgradeCommand } from "./commands/upgrade.js"
import { activeProfile, application, configuration, fileId, paths, profileName, readConfig } from "./config.js"
import { googleError } from "./errors.js"
import { memoryModel } from "./extraction.js"
import { FIRST_SCREEN, guide, placeInSections } from "./first-screen.js"
import type { DocumentIndex } from "./model.js"
import { snakeKeys } from "./output.js"
import {
  checkPolicy,
  DRIVE_APP,
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
import { REASONS } from "./reasons.js"
import {
  ACCOUNT_FREE_COMMANDS,
  ANY_PROFILE_COMMANDS,
  describeDriveProgram,
  markProfileFree,
  PROFILE_SET_COMMANDS,
} from "./registry.js"
import { profileDir } from "./state.js"
import { openIndex } from "./store.js"
import { localTimes } from "./time.js"
import { uploadFile } from "./upload.js"

export type ProgramOptions = DriveEnvironment

const SKILL = new URL("../skills/drive-cli/SKILL.md", import.meta.url)

const eachItem = (body: Body, change: (item: unknown) => unknown): Body =>
  "items" in body ? { ...body, items: body.items.map(change) } : { ...body, item: change(body.item) }

class Preview extends Error {}

// An agent names only a file, which lands in the profile's export folder, never a path of its choosing.
const EXPORTS = new Set(["documents export", "files download", "files export"])

const googleOnly = (effects: Effects | undefined) => effects?.local === "none" && effects.remote !== "none"

/**
 * The commands are built inside `createProgram`, before `run` hands the program its environment, so what they read
 * from it is looked up when they run.
 */
const lateEnv = (environment: () => DriveEnvironment): NodeJS.ProcessEnv => {
  const current = () => environment().env ?? process.env
  return new Proxy({} as NodeJS.ProcessEnv, {
    get: (_, key) => Reflect.get(current(), key),
    has: (_, key) => Reflect.has(current(), key),
    ownKeys: () => Reflect.ownKeys(current()),
    getOwnPropertyDescriptor: (_, key) => Reflect.getOwnPropertyDescriptor(current(), key),
  })
}

const lateStreams = (environment: () => DriveEnvironment): Streams => ({
  data: (text) => (environment().streams ?? processStreams).data(text),
  diagnostic: (text) => (environment().streams ?? processStreams).diagnostic(text),
})

const runsOf = new WeakMap<Command, CommandRuns>()

const installDrive = (program: Command) => {
  const startedAt = Date.now()
  const environment = () => environmentOf<DriveEnvironment>(program)
  const env = lateEnv(environment)
  const streams = lateStreams(environment)
  program
    .option("--read-only", "refuse local and remote mutations")
    .option("--allow-dangerous", "answer a permanent-deletion confirmation")
    .option(
      "--permission <key=level>",
      "make a permission stricter for this run only; repeat to add keys",
      (value: string, previous: string[] = []) => [...previous, value],
    )
  const profileWord = (): string | undefined => {
    const word = program.opts<{ profile?: string }>().profile
    return word === undefined ? undefined : profileName(word)
  }
  /**
   * The profile is the first word, or DRIVE_PROFILE; nothing picks one. DRIVE_PROFILE_LOCK pins the process: a
   * word or variable naming another profile is refused, so an agent cannot reach a profile with fewer guards.
   */
  const selected = (): string => {
    const lock = env.DRIVE_PROFILE_LOCK || undefined
    const named = profileWord() ?? (env.DRIVE_PROFILE || undefined)
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
  let stopSignal: AbortSignal | undefined
  let previewsRequest = false
  const agent = () => environment().agent !== undefined
  const confirmations = new Set<string>()
  const askOnce = async (key: string) => {
    // Nobody is at a terminal over MCP, and the profile's levels already allowed `ask` (WC-MCP-7).
    if (agent()) return true
    if (confirmations.has(key)) return true
    const answered = (await environment().ask?.(key)) ?? false
    if (answered) confirmations.add(key)
    return answered
  }
  let knownKeys: Set<string> | undefined
  const policyFlags = (): PolicyFlags & { offline?: boolean } => {
    knownKeys ??= permissionKeys(flatten(describeDriveProgram(program)).map((info) => info.path))
    const flags = program.opts()
    return {
      ...flags,
      permission: [...(environment().agent?.overrides ?? []), ...(flags.permission ?? [])],
      allowDangerous: flags.allowDangerous || currentAction?.opts().allowDelete,
      dryRun: flags.dryRun || previewsRequest,
      permissionKeys: knownKeys,
    }
  }
  const runId = randomUUID()
  const shown = () => outputFor(currentAction ?? program)
  const print: CommandContext["print"] = (render) => {
    const { renderer, format, streams: out } = shown()
    render(renderer, format, out)
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
    const fields = program.opts<{ fields?: string }>().fields
    if (fields && currentAction) checkResultFields(currentAction, whole, fields)
    const command = currentAction ?? program
    const out = shown()
    if (out.format !== "pretty") return renderAnswer(command, out, whole)
    const zone = timezoneOf()
    const local = localTimes(whole, zone)
    renderAnswer(command, out, local.value as typeof whole)
    if (local.changed || whole.meta.timezone) out.streams.data(`times in ${whole.meta.timezone ?? zone}`)
  }
  const signal = () => environment().signal
  // Google's client libraries are about 80 ms of a start; only a command that reaches Google loads them.
  const signedIn = async (name: string, scope?: string) => {
    const { authorizedClient, checkAuthorization } = await import("./tokens.js")
    const client = authorizedClient(env, name, environment().keyring, signal())
    await checkAuthorization(client, scope)
    return client
  }
  const source = async () => {
    const name = selected()
    const fake = environment().source
    if (fake) return fake(name)
    const [{ googleSource }, client] = await Promise.all([import("./google.js"), signedIn(name)])
    return googleSource(client)
  }
  const withIndex = async <T>(fn: (index: DocumentIndex) => Promise<T>): Promise<T> => {
    const index = await (environment().index?.() ?? openIndex(env, selected(), currentAction?.opts().rescan === true))
    try {
      return await fn(index)
    } finally {
      await index.close()
    }
  }
  const options = {
    get keyring() {
      return environment().keyring
    },
    get openBrowser() {
      return environment().openBrowser
    },
    get update() {
      return environment().update
    },
    get mcp() {
      return agent()
    },
  }
  const context: CommandContext = {
    env,
    streams,
    options,
    selected,
    signal,
    output,
    print,
    source,
    withIndex,
    policyFlags,
    profileWord,
    endsOnStop: () => {
      // cli-core bounds a persistent command by nothing, so its --timeout is drive's to keep.
      const timeout = program.opts<{ timeout?: string }>().timeout
      stopSignal = AbortSignal.any(
        [
          environment().untilStopped?.(),
          signal(),
          timeout === undefined ? undefined : AbortSignal.timeout(parseDuration(timeout, "--timeout")),
        ].filter((one): one is AbortSignal => one !== undefined),
      )
      return stopSignal
    },
  }
  const runs = commandRuns({
    app: DRIVE_APP,
    profile: () => profileWord() ?? (env.DRIVE_PROFILE_LOCK || env.DRIVE_PROFILE || undefined),
    settings: () => {
      const defaults = readConfig(env).defaults
      return {
        record: defaults?.record,
        keepRunsForDays: defaults?.keep_runs_for_days,
        keepSuccessfulRunsForDays: defaults?.keep_successful_runs_for_days,
        runsSizeLimitMb: defaults?.runs_size_limit_mb,
        recordInput: defaults?.record_input,
      }
    },
    env,
    streams,
  })
  runsOf.set(program, runs)
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
    complete: () => environment().complete ?? memoryModel(env, selected(), signal()),
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
    get mcp() {
      return agent()
    },
    stored: storedDocument(context),
    output,
    positive,
    readBody: (path) => {
      const fake = environment().readBody
      if (fake) return fake(path)
      try {
        return readFileSync(path, "utf8")
      } catch {
        throw new CliError("validation_error", "the request body file could not be read", {
          reason: "body.unreadable",
          param: "--body-file",
        })
      }
    },
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
          const fake = environment().api
          if (fake) return await fake.call(method, params, body)
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
      const fake = environment().download
      if (fake) return fake(id, mime)
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
        let request = environment().uploadRequest
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
  installCommandsCommand(program, context)
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
  program.addCommand(guide())
  markProfileFree(program)
  for (const info of flatten(describeDriveProgram(program))) {
    let command = program
    for (const part of info.path) command = command.commands.find((child) => child.name() === part) ?? command
    if (!info.commands.length)
      command.addHelpText("after", () => {
        const availability = environment().discoveryAvailability?.(info)
        return availability?.available === false ? `\nAvailability: unavailable — ${availability.reason}\n` : ""
      })
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
  placeInSections(program)
  const pathOf = (command: Command) => {
    const path: string[] = []
    for (let at: Command | null = command; at?.parent; at = at.parent) path.unshift(at.name())
    return path
  }
  program.hook("preAction", async (_root, action) => {
    currentAction = action
    runs.start(action)
    const fields = program.opts<{ fields?: string }>().fields
    checkProviderJson(
      action,
      { json: program.opts().json === true, ...(fields ? { fields } : {}) },
      environment().tty ?? process.stdout.isTTY,
    )
    const path = pathOf(action)
    const words = path.join(" ")
    const metadata = metaOf(action)
    // cli-core's own preview runs after this hook, for every command this one lets through.
    const preview = (): never => {
      output(itemOf({ dry_run: true, command: words, effects: metadata.effects, action_invoked: false }))
      throw new Preview()
    }
    // Every return below skips the dry-run check at the end, so a command that writes previews here first.
    const previewWrite = () => {
      if (program.opts().dryRun === true && (writes(metadata.effects) || changesAuthority(action))) preview()
    }
    // Discovery is account-independent and must not load config, credentials or the store.
    if (ACCOUNT_FREE_COMMANDS.has(words) && !agent()) return previewWrite()
    if (ANY_PROFILE_COMMANDS.has(words)) {
      if (profileWord() ?? env.DRIVE_PROFILE ?? env.DRIVE_PROFILE_LOCK) selected()
      return
    }
    // The action picks the profile, the defaults or the top of the file, so a broken file can still be repaired.
    if (words === "config unset" && !agent() && !profileWord()) {
      refuseUnderReadOnly(env, "change a setting")
      return previewWrite()
    }
    if (words === "mcp serve" && program.opts().readOnly) {
      // The server's tools are runs of their own, which read the lock from the environment and not this flag.
      const served = environment().env ?? process.env
      served.DRIVE_READ_ONLY = "1"
    }
    if (words === "mcp revoke" && program.opts().readOnly)
      throw readOnlyRefusal("--read-only", "forget the browser logins")
    // The shared `mcp` names its profiles or refuses; each tool call runs this hook for its own profile.
    if (PROFILE_SET_COMMANDS.has(words) || path[0] === "mcp") {
      const named = profileWord() ?? env.DRIVE_PROFILE ?? env.DRIVE_PROFILE_LOCK
      if (words === "mcp serve" && named && action.opts().profiles === undefined)
        await checkPolicy(env, selected(), "mcp", false, policyFlags(), askOnce)
      return
    }
    selected()
    if ((words === "config set" || words === "config unset") && !agent()) {
      refuseUnderReadOnly(env, "change a setting")
      return previewWrite()
    }
    if (agent() && EXPORTS.has(words)) {
      const name = action.opts().output
      if (typeof name !== "string" || !/^[A-Za-z0-9][A-Za-z0-9._-]{0,199}$/.test(name))
        throw new CliError("validation_error", "MCP exports take a filename inside the profile export folder")
      const directory = join(paths(env).cache, "exports", selected())
      mkdirSync(directory, { recursive: true, mode: 0o700 })
      action.setOptionValue("output", join(directory, name))
    }
    if (agent() && changesAuthority(action)) {
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
    if (flags.dryRun && !googleOnly(metadata.effects)) preview()
    // A command that only calls Google previews the request itself, once its parameters are known; cli-core, whose
    // hook runs after this one, would preview the bare command instead.
    if (flags.dryRun) {
      previewsRequest = true
      program.setOptionValue("dryRun", false)
    }
    if (words === "session start") refuseCommandName(selected(), commandWords(program), "drive")
  })
  program.hook("postAction", () => runs.succeed())
  const parse = program.parseAsync.bind(program)
  // Google's clients report each request with `providerEvent`, which lands in the run this scope names.
  const scope = {
    get runId() {
      return runs.runId() ?? runId
    },
    command: "",
    startedAt,
    events: ((event) => {
      if (event.event === "request" || event.event === "response") runs.events(event)
    }) satisfies EventSink,
  }
  program.parseAsync = async (argv, settings) => {
    try {
      return await inRun(scope, () => parse(argv, settings))
    } catch (error) {
      const stopped = stopSignal?.aborted && (!isCliError(error) || error.code !== "outcome_unknown")
      if (!(error instanceof Preview) && !stopped) throw error
      await runs.succeed()
      return program
    }
  }
  addContractInfo(program, (value) => streams.data(JSON.stringify(value)), {
    fields: providerJsonFields,
    errors: { reasons: REASONS },
  })
}

// cli-core reports a missing OAuth client only by throwing, so a broken one is the owner's own.
const oauthClient = (env: NodeJS.ProcessEnv) => {
  application(env)
  return { client: env.DRIVE_GOOGLE_CLIENT_ID ? ("own" as const) : ("wirecat" as const) }
}

const mcpCommand = () => {
  // Read when the server starts: the run's keyring and Google fakes are its, and the availability hook takes no command.
  let availability: ((path: readonly string[], profile: string) => CommandAvailability | undefined) | undefined
  const mcp = appMcpCommand(DRIVE_APP, configuration, {
    name: "Google Drive",
    untrusted: ["document text", "file names", "comments", "author and editor names", "folder names"],
    permissionExample: "files.trash=deny",
    skill: SKILL,
    availability: (path, profile) => availability?.(path, profile),
    // A profile enters the file only when its sign-in succeeds; the keyring is never opened here.
    signedIn: (profile, env) => {
      try {
        return Object.hasOwn(readConfig(env).profiles, profile)
      } catch {
        return false
      }
    },
  })
  return mcp.hook("preAction", async (root, action) => {
    const environment = environmentOf<DriveEnvironment>(action)
    // An injected API never asks Google for a token, so there is no grant to read, as at call time.
    if (environment.api) return
    const { grantAvailability } = await import("./grants.js")
    availability = grantAvailability(rootOf(root), environment.env ?? process.env, environment.keyring)
  })
}

export const definition = (): ProgramDefinition => ({
  app: DRIVE_APP,
  configuration,
  firstScreen: FIRST_SCREEN,
  commands: () => [
    appDoctorCommand(DRIVE_APP, configuration, { oauthClient }),
    skillCommand(DRIVE_APP, SKILL),
    mcpCommand(),
  ],
  configure: installDrive,
  onFailure: (error, program) => runsOf.get(program)?.fail(error),
})

/** The command tree, for discovery and the contract checks; a command runs through `run`. */
export const createProgram = (): Command => createSharedProgram(definition())

export const run = (argv: string[], options: ProgramOptions = {}): Promise<number> =>
  runShared(argv, definition(), options as BaseEnvironment & Record<string, unknown>)
