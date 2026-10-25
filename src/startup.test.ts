import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { describe, expect, it } from "vitest"

const IMPORT = /^(?:import|export)(?!\s+type\b)[^;]*?\sfrom\s+"([^"]+)"/gm

/** What loading `file` loads before any command runs: its static imports, transitively, never `import type`. */
const loadedBy = (file: string, seen = new Set<string>(), packages = new Set<string>()) => {
  if (seen.has(file)) return packages
  seen.add(file)
  for (const [, from] of readFileSync(file, "utf8").matchAll(IMPORT)) {
    if (!from) continue
    if (from.startsWith(".")) loadedBy(join(dirname(file), from.replace(/\.js$/, ".ts")), seen, packages)
    else packages.add(from)
  }
  return packages
}

describe("starting drive", () => {
  it("**loads Google's client libraries only when a command reaches Google**: ~80 ms of every call", () => {
    const packages = [...loadedBy(join(import.meta.dirname, "program.ts"))]
    expect(packages.filter((name) => /^(@googleapis\/|google-auth-library|googleapis)/.test(name))).toEqual([])
  })
})
