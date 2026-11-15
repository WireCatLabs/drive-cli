import type { Meta, Missing, NextStep } from "@wirecat/cli-base/standards"
import { defineSteps, type StepDefinition, stepOf } from "@wirecat/cli-base/standards"

const SYNC = defineSteps([
  { id: "sync.run", command: "sync", args: [], why: "copy the changes Google has made into the local store" },
])[0] as StepDefinition

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
