import type { Meta, Missing, NextStep } from "@wirecat/cli-base/standards"
import { defineSteps, type StepDefinition, stepOf } from "@wirecat/cli-base/standards"
import type { SyncState } from "./model.js"

const DAY = 24 * 60 * 60 * 1000
const SYNC = defineSteps([
  { id: "sync.run", command: "sync", args: [], why: "copy the changes Google has made into the local store" },
])[0] as StepDefinition

export interface CopyAge {
  synced_at: string | null
  age_days: number | null
}

export const ageOf = (state: Pick<SyncState, "lastSync">, now = Date.now()): CopyAge => {
  const at = state.lastSync ? Date.parse(state.lastSync) : Number.NaN
  return Number.isNaN(at)
    ? { synced_at: null, age_days: null }
    : { synced_at: state.lastSync ?? null, age_days: Math.max(0, Math.floor((now - at) / DAY)) }
}

// Drive reads only the local copy: when it is older than a day, say so instead of letting it pass for current.
export const staleCopy = (state: Pick<SyncState, "lastSync">, now = Date.now()) => {
  const { synced_at, age_days } = ageOf(state, now)
  const old = synced_at === null || now - Date.parse(synced_at) > DAY
  if (!old) return {}
  const why =
    age_days === null
      ? "the local copy has no sync time; Google may have changed the document since it was copied"
      : `the local copy was synced ${age_days} day${age_days === 1 ? "" : "s"} ago; Google may have changed the document since`
  return {
    missing: [{ field: "synced_at", why, step: SYNC.id }] satisfies Missing[],
    next: [stepOf(SYNC)] satisfies NextStep[],
    meta: { complete: false } satisfies Partial<Meta>,
  }
}

export interface Freshness {
  changed: boolean
  remote_modified_at: string
  local_modified_at: string | null
}

export const freshness = (remote: string, local: string | undefined): Freshness => ({
  changed: local === undefined || Date.parse(remote) !== Date.parse(local),
  remote_modified_at: remote,
  local_modified_at: local ?? null,
})

export const changedCopy = ({ changed, local_modified_at }: Freshness) => {
  if (!changed) return {}
  const why =
    local_modified_at === null
      ? "the local copy has no modified time, so it cannot be compared with Google"
      : `Google changed the document after the local copy was made (${local_modified_at})`
  return {
    missing: [{ field: "modified_at", why, step: SYNC.id }] satisfies Missing[],
    next: [stepOf(SYNC)] satisfies NextStep[],
    meta: { complete: false } satisfies Partial<Meta>,
  }
}
