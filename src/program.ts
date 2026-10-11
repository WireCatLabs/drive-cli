import { writeFileSync } from "node:fs"
import { CliError, createRenderer, type KeyringStore, processStreams, type Streams } from "@wirecat/cli-core"
import { annotate, describeProgram, flatten } from "@wirecat/cli-core/commands"
import { Command, InvalidArgumentError, Option } from "commander"
import { activeProfile, application, fileId, profileName, readConfig, writeConfig } from "./config.js"
import { type Complete, memoryModel } from "./extraction.js"
import { googleSource } from "./google.js"
import { apiMethod, type GoogleApi, googleApi } from "./google-api.js"
import { installKnowledgeCommands } from "./knowledge-commands.js"
import { login } from "./login.js"
import { type DocumentIndex, FOLDER, type GoogleSource } from "./model.js"
import { lockProfile } from "./profile-lock.js"
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
    .option("--profile <name>", "Google account profile", "default")
    .option("--json", "print machine-readable JSON")
  program
    .configureOutput({
      writeOut: (text) => streams.data(text),
      writeErr: (text) => streams.diagnostic(text),
      outputError: () => undefined,
    })
    .exitOverride()
  const selected = () => profileName(program.opts<{ profile: string }>().profile)
  const output = (value: unknown) =>
    createRenderer({
      format: program.opts<{ json?: boolean }>().json || !process.stdout.isTTY ? "json" : "pretty",
      color: false,
      streams,
    }).result(value)
  const source = async () => {
    const name = selected()
    if (options.source) return options.source(name)
    const client = authorizedClient(env, name, options.keyring, options.signal)
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
    .option("--client-file <file>", "Desktop OAuth application JSON")
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
            ...(options.signal ? { signal: options.signal } : {}),
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
      output({ id, removed: true, next: "run drive sync to reconcile cached sources" })
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
        ...(await sync(remote, index, env, selected(), args.max, options.signal, args.rescan)),
        ...(args.embed ? { embeddings: await index.embed(600) } : {}),
      }))
      output(result)
      if (result.errors.length || result.pending)
        streams.diagnostic(`${result.pending} source operations remain; run drive sync again\n`)
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
    complete: () => options.complete ?? memoryModel(env, selected(), options.signal),
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
    call: async (method, params, body) => {
      const descriptor = apiMethod(method)
      if (options.api) return options.api.call(method, params, body)
      const client = authorizedClient(env, selected(), options.keyring, options.signal)
      await checkAuthorization(client, descriptor.scope)
      return googleApi(client).call(method, params, body)
    },
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
  program
    .command("commands")
    .argument("[path...]")
    .description("Discover the command tree and options as shared registry data")
    .action((path: string[]) => {
      const commands = describeProgram(program)
      const found = path.length ? flatten(commands).filter((item) => item.path.join(" ") === path.join(" ")) : commands
      if (path.length && !found.length) throw new CliError("not_found", "command path was not found")
      output({ items: found })
    })
  for (const info of flatten(describeProgram(program))) {
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
      origin: "handwritten",
      mutates: localWrites.includes(name) || remoteWrites.includes(name),
      local: localWrites.includes(name) && name !== "session start" && name !== "memories extract",
      state: "beta",
    })
  }
  return program
}
