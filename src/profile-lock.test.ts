import lockfile from "proper-lockfile"
import { describe, expect, it, vi } from "vitest"
import { lockProfile } from "./profile-lock.js"
import { fixture } from "./testing.js"

describe("shared profile coordination", () => {
  it("prevents knowledge operations racing sync and releases for subsequent work", async () => {
    const f = fixture()
    const lock = await lockProfile(f.env, "default")
    try {
      await expect(lockProfile(f.env, "default")).rejects.toThrow("holds")
    } finally {
      await lock.release()
    }
    const next = await lockProfile(f.env, "default")
    next.assertHeld()
    await next.release()
  })
  it("detects lost lock ownership without uncaught timer errors", async () => {
    const spy = vi.spyOn(lockfile, "lock").mockImplementation(async (_path, options) => {
      options?.onCompromised?.(new Error("synthetic compromise"))
      return async () => {}
    })
    try {
      const lock = await lockProfile(fixture().env, "default")
      expect(() => lock.assertHeld()).toThrow("lock was lost")
      await lock.release()
    } finally {
      spy.mockRestore()
    }
  })
})
