import { defineConfig } from "vitest/config"
export default defineConfig({
  test: {
    include: ["src/**/*.test.ts", "scripts/**/*.test.ts"],
    maxWorkers: 4,
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      exclude: ["src/**/*.test.ts", "src/testing.ts", "src/bin/drive.ts"],
      // The installed-bin guard is a separate acceptance check; this is the first unit baseline.
      thresholds: { lines: 80, functions: 75, statements: 78, branches: 65 },
    },
  },
})
