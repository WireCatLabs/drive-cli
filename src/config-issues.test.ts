import { readFileSync, writeFileSync } from "node:fs"
import { captureStreams } from "@wirecat/cli-base"
import { describe, expect, it } from "vitest"
import { configPath, readConfig, writeConfig } from "./config.js"
import { createProgram } from "./program.js"
import { commandResult, fixture } from "./testing.js"

const PROFILE = { principal: "synthetic-principal", roots: ["root"], storage: "keyring" }

const setup = (config: unknown) => {
  const f = fixture()
  const path = configPath(f.env)
  writeFileSync(path, typeof config === "string" ? config : JSON.stringify(config))
  return { env: f.env, path }
}

const run = async (env: NodeJS.ProcessEnv, args: readonly string[]) => {
  const streams = captureStreams()
  await createProgram({ env, streams }).parseAsync(["--json", ...args], { from: "user" })
  return { result: commandResult(streams.stdout.join("")), diagnostics: streams.stderr.join("\n") }
}

const doctorIssues = async (env: NodeJS.ProcessEnv) => (await run(env, ["doctor"])).result.config.issues

const errorOf = (action: () => unknown) => {
  try {
    action()
  } catch (error) {
    return error instanceof Error ? error.message : String(error)
  }
  throw new Error("expected an error")
}

describe("doctor reports every problem in the config file", () => {
  it("says where invalid JSON stops, with no fix and no value", async () => {
    const { env, path } = setup(
      '{\n  "profiles": {},\n  "defaults": { "max_text_chars": "fixture-hidden-value-42", }\n}',
    )
    const { result } = await run(env, ["doctor"])
    expect(result.config).toEqual({
      path,
      found: true,
      issues: [
        {
          kind: "invalid_json",
          file: path,
          line: 3,
          column: 62,
          what: "the file is not valid JSON at line 3, column 62",
        },
      ],
    })
    expect(result.profiles).toEqual([])
    expect(JSON.stringify(result)).not.toContain("fixture-hidden-value-42")
  })

  it("gives each problem a fix that runs as written, and none is left after running them", async () => {
    const { env, path } = setup({
      colour: "work",
      defaults: {
        theme: "fixture-hidden-value-42",
        permissions: { "files.no-such": "deny", files: "readonly" },
      },
      profiles: {
        work: { ...PROFILE, font: 1000, max_text_chars: "fixture-hidden-value-43" },
        broken: { roots: [], storage: "keyring" },
      },
    })
    const issues = await doctorIssues(env)
    expect(issues).toEqual(
      expect.arrayContaining([
        {
          kind: "unknown_setting",
          file: path,
          key: "colour",
          what: "setting colour is not a setting of drive",
          fix: "drive config unset colour",
        },
        {
          kind: "unknown_setting",
          file: path,
          key: "theme",
          what: "setting theme is not a setting of drive",
          fix: "drive config unset --defaults theme",
        },
        {
          kind: "unknown_setting",
          file: path,
          profile: "work",
          key: "font",
          what: "setting font is not a setting of drive",
          fix: "drive work config unset font",
        },
        {
          kind: "invalid_value",
          file: path,
          profile: "work",
          key: "max_text_chars",
          what: "setting max_text_chars has to be of type number",
          fix: "drive work config unset max_text_chars",
        },
        {
          kind: "unknown_permission",
          file: path,
          key: "permissions.files.no-such",
          what: "permissions.files.no-such names no command",
          fix: "drive config unset --defaults permissions.files.no-such",
        },
        {
          kind: "missing_setting",
          file: path,
          profile: "broken",
          key: "principal",
          what: "setting principal is missing",
        },
      ]),
    )
    expect(issues).toHaveLength(6)
    expect(JSON.stringify(issues)).not.toContain("fixture-hidden-value")
    expect(errorOf(() => readConfig(env))).toBe(
      `${path}: setting max_text_chars has to be of type number — remove it with \`drive work config unset max_text_chars\`` +
        " (and 4 more problems — `doctor` lists them all)",
    )

    for (const { fix } of issues.filter((issue: { fix?: string }) => issue.fix))
      await run(env, (fix as string).split(" ").slice(1))
    expect(await doctorIssues(env)).toEqual([
      {
        kind: "missing_setting",
        file: path,
        profile: "broken",
        key: "principal",
        what: "setting principal is missing",
      },
    ])
    expect(JSON.parse(readFileSync(path, "utf8"))).toEqual({
      defaults: { permissions: { files: "readonly" } },
      profiles: { work: PROFILE, broken: { roots: [], storage: "keyring" } },
    })
  })
})

describe("config runs on a file with problems", () => {
  it("shows what loads and names each problem with its fix", async () => {
    const { env } = setup({
      colour: "work",
      defaults: { permissions: { files: "readonly", "files.no-such": "deny" } },
      profiles: { work: PROFILE },
    })
    const { result, diagnostics } = await run(env, ["config", "show"])
    expect(result).toEqual({ defaults: { permissions: { files: "readonly" } }, profiles: { work: PROFILE } })
    expect(diagnostics).toContain(
      "setting colour is not a setting of drive, so it is left out — `drive config unset colour` removes it",
    )
  })

  it("sets a setting, keeping the other problems, and refuses one that adds a problem", async () => {
    const { env, path } = setup({ colour: "work", profiles: { work: PROFILE } })
    await run(env, ["work", "config", "set", "max_text_chars", "1000"])
    expect(JSON.parse(readFileSync(path, "utf8"))).toEqual({
      colour: "work",
      profiles: { work: { ...PROFILE, max_text_chars: 1000 } },
    })
    await expect(run(env, ["work", "config", "set", "permissions.files.no-such", '"deny"'])).rejects.toThrow(
      "permissions.files.no-such names no command — remove it with `drive work config unset permissions.files.no-such`",
    )
    await expect(run(env, ["work", "config", "set", "embedding_dims", '"fixture-hidden-value-42"'])).rejects.toThrow(
      "setting embedding_dims has to be of type number",
    )
    expect(JSON.parse(readFileSync(path, "utf8")).profiles.work).toEqual({ ...PROFILE, max_text_chars: 1000 })
  })

  it("does not reach the defaults or the top of the file from a locked process", async () => {
    const { env } = setup({ colour: "work", profiles: { work: PROFILE } })
    const locked = { ...env, DRIVE_PROFILE_LOCK: "work" }
    await expect(run(locked, ["config", "unset", "--defaults", "max_text_chars"])).rejects.toMatchObject({
      code: "permission_error",
    })
  })

  it("refuses every other command on the file, naming the first problem and its fix", async () => {
    const { env, path } = setup({ colour: "work", profiles: { work: PROFILE } })
    await expect(run(env, ["work", "folders", "list"])).rejects.toMatchObject({
      code: "configuration_error",
      message: `${path}: setting colour is not a setting of drive — remove it with \`drive config unset colour\``,
    })
  })
})

it("names the profile and the rule when saving a setting of the wrong type, never the value", () => {
  const f = fixture()
  const config = { profiles: { work: { ...PROFILE, max_text_chars: "fixture-hidden-value-42" } } }
  expect(errorOf(() => writeConfig(f.env, config as never))).toBe(
    "drive settings: profile work: setting max_text_chars has to be of type number",
  )
})
