import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { captureStreams } from "@wirecat/cli-base"
import type { RequestEvent } from "@wirecat/cli-core/cli"
import { OAuth2Client } from "google-auth-library"
import { describe, expect, it } from "vitest"
import { googleApi, googleDownload } from "./google-api.js"
import { createProgram, type ProgramOptions } from "./program.js"
import { providerEvent, withProviderEvents } from "./run-recording.js"
import { commandResult, fixture } from "./testing.js"
import { observeRequests, operationOf } from "./tokens.js"

const runsOf = (env: NodeJS.ProcessEnv): string[] => {
  const root = join(env.DRIVE_STATE_DIR as string, "runs")
  try {
    return readdirSync(root).flatMap((day) =>
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
    expect(metadata).toMatchObject({ command: "documents list", status: "failed", kept_because_failed: true })
  })

  it("keeps a usage error that never reached a command", async () => {
    const { env } = fixture()
    await drive(env, ["default", "documents", "list", "--no-such-flag"])
    expect(runsOf(env)).toHaveLength(1)
  })

  it("keeps a successful command only with --record", async () => {
    const { env } = fixture()
    await drive(env, ["default", "config", "show", "--json"])
    expect(runsOf(env)).toHaveLength(0)
    await drive(env, ["default", "config", "show", "--json", "--record"])
    const [run] = runsOf(env)
    expect(JSON.parse(readFileSync(join(run as string, "run.json"), "utf8"))).toMatchObject({
      command: "config show",
      profile: "default",
      status: "success",
    })
  })

  it("keeps every command when the defaults say record, and nothing with --no-record", async () => {
    const { env } = fixture()
    await drive(env, ["default", "config", "set", "record", "true", "--defaults", "--json"])
    await drive(env, ["default", "config", "show", "--json"])
    expect(runsOf(env)).toHaveLength(1)
    await drive(env, ["missing", "documents", "list", "--json", "--no-record"])
    expect(runsOf(env)).toHaveLength(1)
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
    const events: RequestEvent[] = []
    await withProviderEvents(
      (event) => events.push(event),
      async () => {
        await googleApi(client).call("drive.files.get", { fileId: "1AbCsynthetic" })
        await googleDownload(client)("1AbCsynthetic")
        await googleApi(client)
          .call("drive.files.get", { fileId: "1AbCsynthetic" })
          .catch(() => undefined)
      },
    )
    expect(events.map(({ event, operation, status, outcome }) => [event, operation, status, outcome])).toEqual([
      ["request", "GET /drive/v3/files/:id", undefined, undefined],
      ["response", "GET /drive/v3/files/:id", 200, "ok"],
      ["request", "GET /drive/v3/files/:id", undefined, undefined],
      ["response", "GET /drive/v3/files/:id", 200, "ok"],
      ["request", "GET /drive/v3/files/:id", undefined, undefined],
      ["response", "GET /drive/v3/files/:id", 404, "error"],
    ])
    expect(JSON.stringify(events)).not.toContain("synthetic")
  })
})
