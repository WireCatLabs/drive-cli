import { mkdirSync, readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { CliError, writeSecurely } from "@wirecat/cli-base"
import type { PushState, PushStatePort } from "@wirecat/cli-core/documents"
import * as v from "valibot"
import type { MirrorSnapshot } from "./mirror-target.js"
import { profileDir } from "./state.js"

const ID = v.pipe(v.string(), v.regex(/^[A-Za-z0-9_-]{1,200}$/))
// Snapshots are checked by their kind only: the block lists inside are Google's own read-back.
const Snapshot = v.looseObject({ kind: v.picklist(["doc", "sheet"]) })
const State = v.object({
  version: v.literal(1),
  principal: v.string(),
  root: v.string(),
  target: ID,
  folders: v.record(v.string(), ID),
  entries: v.record(
    v.string(),
    v.object({ id: ID, url: v.string(), kind: v.string(), hash: v.string(), snapshot: Snapshot, pushedAt: v.string() }),
  ),
  pending: v.record(v.string(), v.object({ origin: v.string(), operationId: v.string() })),
})

const statePath = (env: NodeJS.ProcessEnv, profile: string, mirror: string) =>
  join(profileDir(env, profile), "mirrors", `${mirror}.json`)

export const mirrorState = (
  env: NodeJS.ProcessEnv,
  profile: string,
  mirror: { id: string; path: string; folder: string },
  principal: string,
): PushStatePort<MirrorSnapshot> => ({
  read: () => {
    let value: unknown
    try {
      value = JSON.parse(readFileSync(statePath(env, profile, mirror.id), "utf8"))
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT")
        return {
          version: 1,
          principal,
          root: mirror.path,
          target: mirror.folder,
          folders: {},
          entries: {},
          pending: {},
        }
      throw new CliError("configuration_error", "mirror state is unreadable; refusing to reset it", {
        reason: "state.invalid",
      })
    }
    const parsed = v.safeParse(State, value)
    if (!parsed.success)
      throw new CliError("configuration_error", "mirror state is invalid; refusing to reset it", {
        reason: "state.invalid",
      })
    return parsed.output as unknown as PushState<MirrorSnapshot>
  },
  save: (state) => {
    const path = statePath(env, profile, mirror.id)
    mkdirSync(dirname(path), { recursive: true, mode: 0o700 })
    writeSecurely(path, `${JSON.stringify(state)}\n`, 0o600)
  },
})
