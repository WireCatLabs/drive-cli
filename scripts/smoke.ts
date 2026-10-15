import assert from "node:assert/strict"
import { execFileSync } from "node:child_process"
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"

const root = resolve(import.meta.dirname, "..")
const temp = mkdtempSync(join(tmpdir(), "drive-package-"))
const userConfig = join(temp, "npm-user-config")
writeFileSync(userConfig, "")
const packed = JSON.parse(
  execFileSync("npm", ["pack", "--json", "--ignore-scripts", "--pack-destination", temp], {
    cwd: root,
    encoding: "utf8",
    env: { ...process.env, NPM_CONFIG_USERCONFIG: userConfig },
  }),
)
assert.equal(packed.length, 1)
const installed = join(temp, "installed")
mkdirSync(installed)
execFileSync(
  "npm",
  ["install", "--prefix", installed, "--ignore-scripts", "--no-audit", "--no-fund", join(temp, packed[0].filename)],
  { encoding: "utf8", env: { ...process.env, NPM_CONFIG_USERCONFIG: userConfig }, stdio: "pipe" },
)
const guard = join(temp, "guard.mjs")
writeFileSync(
  guard,
  `import { createRequire, syncBuiltinESMExports } from 'node:module';
const require = createRequire(import.meta.url);
const deny = () => { throw new Error('Unexpected network or browser access in package smoke'); };
globalThis.fetch = deny;
for (const name of ['node:http','node:https']) { const module = require(name); module.request = deny; module.get = deny; }
for (const name of ['exec','execFile','spawn','fork']) require('node:child_process')[name] = deny;
syncBuiltinESMExports();
const Module = require('node:module'); const load = Module._load;
Module._load = function(name, ...args) { if (name.includes('@napi-rs/keyring')) deny(); return load.call(this, name, ...args); };
`,
)
const config = join(temp, "config")
mkdirSync(config)
writeFileSync(join(config, "config.json"), "invalid fixture JSON")
const env = {
  ...process.env,
  NODE_OPTIONS: "",
  HOME: temp,
  DRIVE_CONFIG_DIR: config,
  DRIVE_STATE_DIR: join(temp, "state"),
  DRIVE_CACHE_DIR: join(temp, "cache"),
  DRIVE_STORE: join(temp, "store.db"),
  WIRECAT_STATE_DIR: join(temp, "wirecat"),
  MESSAGING_STORE: join(temp, "never-owner.db"),
}
const bin = join(installed, "node_modules/@wirecat/drive-cli/dist/bin/drive.js")
const run = (args: string[]) =>
  execFileSync(process.execPath, ["--import", guard, bin, ...args], {
    cwd: temp,
    env,
    encoding: "utf8",
    timeout: 10000,
  })
assert.match(run(["--help"]), /Google Drive/)
assert.equal(run(["--version"]).trim(), JSON.parse(readFileSync(join(root, "package.json"), "utf8")).version)
assert.match(run(["session", "start", "--help"]), /client-file/)
const registry = JSON.parse(run(["commands", "sync", "--json"]))
assert.equal(registry.contract, 3)
assert.equal(registry.commands[0].name, "sync")
assert.deepEqual(registry.commands[0].effects, { remote: "read", local: "write" })
for (const [command, operation, remote] of [
  ["drive-files-get", "drive.files.get", "read"],
  ["drive-files-create", "drive.files.create", "write"],
] as const) {
  const generated = JSON.parse(run(["commands", "api", command, "--json"]))
  assert.equal(generated.commands.length, 1)
  assert.equal(generated.commands[0].origin, "generated")
  assert.equal(generated.commands[0].api_operation, operation)
  assert.deepEqual(generated.commands[0].effects, { remote, local: "none" })
}
let failed = false
try {
  run(["synthetic", "status", "--json"])
} catch (error) {
  failed = true
  assert.equal(JSON.parse(String((error as { stderr?: unknown }).stderr).trim()).error.code, "configuration_error")
}
assert.ok(failed)
console.log(
  `Installed ${JSON.parse(readFileSync(join(root, "package.json"), "utf8")).name}: offline help/version/registry/error checks passed (${temp})`,
)
