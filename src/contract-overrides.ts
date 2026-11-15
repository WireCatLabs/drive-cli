import { createHash } from "node:crypto"
import { type SharedContractOverride, sharedContracts } from "@wirecat/cli-base/commands"
import type { Command } from "commander"

/** A reviewed difference from Core: `before` is the fingerprint of Core's value, not its text. */
type Reviewed = Omit<SharedContractOverride, "before"> & { before: string }

const canonical = (value: unknown): unknown =>
  Array.isArray(value)
    ? value.map(canonical)
    : value && typeof value === "object"
      ? Object.fromEntries(
          Object.keys(value)
            .sort()
            .map((key) => [key, canonical((value as Record<string, unknown>)[key])]),
        )
      : value
export const fingerprint = (value: unknown): string =>
  createHash("sha256")
    .update(JSON.stringify(canonical(value ?? null)))
    .digest("hex")
    .slice(0, 16)

/**
 * The overrides cli-base checks, with Core's current value where its fingerprint is the reviewed one. A Core value
 * that changed keeps the fingerprint, so the shared check still refuses it and names the new value to review.
 */
export const reviewedOverrides = (reference: Command, reviewed: readonly Reviewed[]): SharedContractOverride[] =>
  reviewed.map((override) => {
    let node = reference
    for (const name of override.command.slice(1)) node = node.commands.find((child) => child.name() === name) ?? node
    const before = (sharedContracts(node)[node.name()] as Record<string, unknown> | undefined)?.[override.field] ?? null
    return { ...override, before: fingerprint(before) === override.before ? before : override.before }
  })

// Reviewed differences from Core. A changed default requires reviewing this declaration.
export const SHELL_OVERRIDES: Readonly<{ commands: readonly Reviewed[] }> = {
  commands: [
    {
      command: ["commands"],
      field: "arguments",
      before: "2a309b1318d3ae57",
      after: [{ name: "path", required: false, variadic: true, description: "only this command or group, as words" }],
      reason:
        "Drive binds discovery to its profile-aware usage renderer while retaining the shared command document and evidence endpoint.",
    },
    {
      command: ["commands"],
      field: "examples",
      before: "74234e98afe7498f",
      after: ["drive commands", "drive commands files copy --json"],
      reason:
        "Drive binds discovery to its profile-aware usage renderer while retaining the shared command document and evidence endpoint.",
    },
    {
      command: ["commands", "info"],
      field: "examples",
      before: "b5111d1de1d39c3d",
      after: ["drive commands info --json"],
      reason:
        "Drive binds discovery to its profile-aware usage renderer while retaining the shared command document and evidence endpoint.",
    },
    {
      command: ["commands", "info"],
      field: "arguments",
      before: "51e2a792c77a31bd",
      after: [
        {
          name: "path",
          required: false,
          variadic: true,
          description: "one command path; without one, schemas, error reasons and explicit overrides",
        },
      ],
      reason:
        "Drive binds discovery to its profile-aware usage renderer while retaining the shared command document and evidence endpoint.",
    },
  ],
}
