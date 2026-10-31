import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { captureStreams } from "@wirecat/cli-base"
import { findRun, listRuns, providerEvent, readEvents, recordRuns, runsDirFor } from "@wirecat/cli-core/cli"
import { Command } from "commander"
import { OAuth2Client } from "google-auth-library"
import { describe, expect, it } from "vitest"
import { googleApi, googleDownload } from "./google-api.js"
import { DRIVE_APP } from "./policy.js"
import type { ProgramOptions } from "./program.js"
import { commandResult, testProgram as createProgram, fixture } from "./testing.js"
import { observeRequests, operationOf } from "./tokens.js"

const runsOf = (env: NodeJS.ProcessEnv): string[] => {
  const root = join(env.DRIVE_STATE_DIR as string, "runs")
  try {
    return readdirSync(root)
      .filter((day) => !day.startsWith("."))
      .flatMap((day) =>
        readdirSync(join(root, day))
          .filter((id) => !id.includes("."))
          .map((id) => join(root, day, id)),
      )
  } catch {
    return []
  }
}

const drive = async (env: NodeJS.ProcessEnv, args: string[], api?: ProgramOptions["api"]) => {
  const streams = captureStreams()
  const failure = await createProgram({ env, streams, ...(api ? { api } : {}) })
    .parseAsync(args, { from: "user" })
    .then(
      () => undefined,
      (error: unknown) => error,
    )
  return { failure, stdout: streams.stdout.join("") }
}

describe("run records", () => {
  it("keeps a failed command, without being asked", async () => {
    const { env } = fixture()
    const { failure } = await drive(env, ["missing", "documents", "list", "--json"])
    expect(failure).toBeDefined()
    const [run] = runsOf(env)
    const metadata = JSON.parse(readFileSync(join(run as string, "run.json"), "utf8"))
    expect(metadata).toMatchObject({ command: "documents list", status: "failed" })
  })

  it("keeps a usage error that never reached a command", async () => {
    const { env } = fixture()
    await drive(env, ["default", "documents", "list", "--no-such-flag"])
    expect(runsOf(env)).toHaveLength(1)
  })

  it("keeps every command, successes too, and only failures under record false", async () => {
    const { env } = fixture()
    const kept = () => listRuns(runsDirFor(DRIVE_APP, env)).map((run) => `${run.command} ${run.status}`)
    await drive(env, ["default", "config", "show", "--json"])
    expect(kept()).toEqual(["config show success"])
    await drive(env, ["default", "config", "set", "record", "false", "--defaults", "--json"])
    const before = kept().length
    await drive(env, ["default", "config", "show", "--json"])
    await drive(env, ["missing", "documents", "list", "--json"])
    expect(kept().slice(0, kept().length - before)).toEqual(["documents list failed"])
  })

  it("keeps nothing with --no-record, even a failure", async () => {
    const { env } = fixture()
    await drive(env, ["missing", "documents", "list", "--json", "--no-record"])
    expect(listRuns(runsDirFor(DRIVE_APP, env))).toEqual([])
  })

  const typed = ["default", "search", "documents", "Kai Sample +34612345678", "--api-key", "fake-key-123", "--nonsense"]
  const argvOf = (env: NodeJS.ProcessEnv): string[] => {
    const [run] = runsOf(env)
    return JSON.parse(readFileSync(join(run as string, "run.json"), "utf8")).argv
  }

  it("keeps the command as typed, with a secret and a phone number hidden", async () => {
    const { env } = fixture()
    await drive(env, typed)
    const argv = argvOf(env)
    expect(argv).toContain("--nonsense")
    expect(argv.join(" ")).toContain("Kai Sample")
    expect(argv.join(" ")).not.toContain("612345678")
    expect(argv.join(" ")).not.toContain("fake-key-123")
  })

  it("leaves the typed words out under record_input false", async () => {
    const { env } = fixture()
    const { failure } = await drive(env, ["default", "config", "set", "record_input", "false", "--defaults", "--json"])
    expect(failure).toBeUndefined()
    await drive(env, typed)
    const argv = argvOf(env)
    expect(argv).toContain("search")
    expect(argv.join(" ")).not.toContain("Kai Sample")
    expect(argv.join(" ")).not.toContain("fake-key-123")
  })

  it("takes record_input failed and the success retention and size limit as defaults", async () => {
    const { env } = fixture()
    for (const [key, value] of [
      ["record_input", '"failed"'],
      ["keep_successful_runs_for_days", "3"],
      ["runs_size_limit_mb", "50"],
    ] as const)
      expect(
        (await drive(env, ["default", "config", "set", key, value, "--defaults", "--json"])).failure,
      ).toBeUndefined()
    await drive(env, typed)
    expect(argvOf(env).join(" ")).toContain("Kai Sample")
  })

  it("refuses record for one profile: it is one choice for the whole tool", async () => {
    const { env } = fixture()
    const { failure } = await drive(env, ["default", "config", "set", "record", "true", "--json"])
    expect(String(failure)).toMatch(/--defaults/)
  })

  it("lists, shows and locates runs with or without a profile, and never records itself", async () => {
    const { env } = fixture()
    await drive(env, ["missing", "documents", "list", "--json"])
    const bare = commandResult((await drive(env, ["runs", "list", "--json"])).stdout)
    const named = commandResult(
      (await drive(env, ["default", "runs", "list", "--limit", "5", "--page", "1", "--json"])).stdout,
    )
    expect(bare.items).toHaveLength(1)
    expect(named.items).toEqual(bare.items)
    const id = bare.items[0].run_id
    expect(commandResult((await drive(env, ["runs", "show", id, "--problems", "--json"])).stdout).command).toBe(
      "documents list",
    )
    expect(commandResult((await drive(env, ["runs", "path", id, "--json"])).stdout).path).toContain(id)
    expect(runsOf(env)).toHaveLength(1)
  })

  it("writes the provider's requests and answers into the run", async () => {
    const { env } = fixture()
    const api = {
      call: async () => {
        providerEvent({ event: "request", operation: "GET /drive/v3/files/:id" })
        providerEvent({ event: "response", operation: "GET /drive/v3/files/:id", status: 200, outcome: "ok" })
        return { id: "synthetic" }
      },
    }
    await drive(
      env,
      ["default", "api", "call", "drive.files.get", "--params", '{"fileId":"synthetic"}', "--json", "--record"],
      api,
    )
    const [run] = runsOf(env)
    const events = readFileSync(join(run as string, "events.jsonl"), "utf8")
      .trim()
      .split("\n")
      .map((line) => JSON.parse(line))
    expect(events.map((line) => [line.body ?? line.attributes?.event, line.attributes?.operation])).toEqual([
      ["provider.request", "GET /drive/v3/files/:id"],
      ["provider.response", "GET /drive/v3/files/:id"],
    ])
  })
})

describe("Google request events", () => {
  it("names the method and path shape, never an id, a name, the host or the query", () => {
    expect(operationOf("get", "https://www.googleapis.com/drive/v3/files/1AbC-xyz_09?fields=*&q=secret")).toBe(
      "GET /drive/v3/files/:id",
    )
    expect(operationOf("POST", "https://docs.googleapis.com/v1/documents/1AbC:batchUpdate")).toBe(
      "POST /v1/documents/:id:batchUpdate",
    )
    expect(operationOf("GET", "https://www.googleapis.com/drive/v3/files/Budget%20Plan.docx/export")).toBe(
      "GET /drive/v3/files/:id/export",
    )
    expect(operationOf("GET", "https://www.googleapis.com/drive/v3/files/x:Not%20a%20verb")).toBe(
      "GET /drive/v3/files/:id",
    )
    expect(operationOf(undefined, "not a url")).toBe("GET /")
  })

  it("sees every call a signed-in client makes: the SDK's methods and downloads alike", async () => {
    const statuses = [200, 200, 404]
    const client = observeRequests(
      new OAuth2Client({
        transporterOptions: {
          retry: false,
          fetchImplementation: async () =>
            new Response(JSON.stringify({ id: "synthetic" }), {
              status: statuses.shift() ?? 200,
              headers: { "content-type": "application/json" },
            }),
        },
      }),
    )
    client.setCredentials({ access_token: "SYNTHETIC", expiry_date: Date.now() + 3600000 })
    const { env } = fixture()
    const program = new Command("drive").exitOverride()
    program.command("probe").action(async () => {
      await googleApi(client).call("drive.files.get", { fileId: "1AbCsynthetic" })
      await googleDownload(client)("1AbCsynthetic")
      await googleApi(client)
        .call("drive.files.get", { fileId: "1AbCsynthetic" })
        .catch(() => undefined)
    })
    recordRuns(program, {
      app: DRIVE_APP,
      settings: () => ({}),
      env,
      streams: captureStreams(),
    })
    await program.parseAsync(["probe", "--record"], { from: "user" })
    const dir = runsDirFor(DRIVE_APP, env)
    const run = findRun(dir, listRuns(dir)[0]?.runId ?? "")
    const events = readEvents(run?.dir ?? "")
    expect(events.map(({ event, operation, status, outcome }) => [event, operation, status, outcome])).toEqual([
      ["provider.request", "GET /drive/v3/files/:id", undefined, undefined],
      ["provider.response", "GET /drive/v3/files/:id", 200, "ok"],
      ["provider.request", "GET /drive/v3/files/:id", undefined, undefined],
      ["provider.response", "GET /drive/v3/files/:id", 200, "ok"],
      ["provider.request", "GET /drive/v3/files/:id", undefined, undefined],
      ["provider.response", "GET /drive/v3/files/:id", 404, "error"],
    ])
    expect(JSON.stringify(events)).not.toContain("synthetic")
  })

  it("writes each retry as its own line: the 429 with Google's reason, then attempt 2 with the wait", async () => {
    const answers = [
      {
        status: 429,
        body: { error: { code: 429, errors: [{ reason: "rateLimitExceeded" }], message: "Kai's quota" } },
      },
      { status: 200, body: { id: "synthetic" } },
    ]
    const client = observeRequests(
      new OAuth2Client({
        transporterOptions: {
          retryConfig: { retry: 1, retryDelay: 5 },
          fetchImplementation: async () => {
            const { status, body } = answers.shift() ?? { status: 200, body: {} }
            return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } })
          },
        },
      }),
    )
    client.setCredentials({ access_token: "SYNTHETIC", expiry_date: Date.now() + 3600000 })
    const { env } = fixture()
    const program = new Command("drive").exitOverride()
    program.command("probe").action(async () => {
      await googleApi(client).call("drive.files.get", { fileId: "1AbCsynthetic", fields: "name" })
    })
    recordRuns(program, { app: DRIVE_APP, settings: () => ({}), env, streams: captureStreams() })
    await program.parseAsync(["probe"], { from: "user" })
    const dir = runsDirFor(DRIVE_APP, env)
    const events = readEvents(findRun(dir, listRuns(dir)[0]?.runId ?? "")?.dir ?? "")
    expect(
      events.map(({ event, attempt, status, outcome, provider_error }) => [
        event,
        attempt,
        status,
        outcome,
        provider_error,
      ]),
    ).toEqual([
      ["provider.request", 1, undefined, undefined, undefined],
      ["provider.response", 1, 429, "error", "rateLimitExceeded"],
      ["provider.request", 2, undefined, undefined, undefined],
      ["provider.response", 2, 200, "ok", undefined],
    ])
    expect(events[2]).toMatchObject({
      level: "wire",
      method: "GET",
      endpoint_template: "/drive/v3/files/:id",
      transport: "http",
    })
    expect(events[2]?.wait_ms).toBeGreaterThanOrEqual(0)
    expect(JSON.stringify(events)).not.toMatch(/synthetic|fields|Kai|SYNTHETIC/)
  })
})
