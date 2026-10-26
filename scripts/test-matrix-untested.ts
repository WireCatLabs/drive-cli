import { createProgram } from "./command-program.ts"

const GENERATED =
  "generated from Google's discovery documents; src/alignment.test.ts checks every operation's flags against them " +
  "and `api call` drives the shared executor"

type Node = { name(): string; commands: readonly Node[]; options: readonly { long?: string }[] }
const api = (createProgram() as unknown as Node).commands.find((command) => command.name() === "api")
const generatedOptions = [
  ...new Set(
    (api?.commands ?? [])
      .filter((command) => !["list", "show", "call"].includes(command.name()))
      .flatMap((command) => command.options.map((option) => option.long ?? "")),
  ),
].filter((name) => name && name !== "--help")

export const UNTESTED: { command: string; option?: string; reason: string }[] = [
  { command: "api *", reason: GENERATED },
  ...generatedOptions.map((option) => ({ command: "api *", option, reason: GENERATED })),
  ...["--client-file", "--no-browser", "--grant"].map((option) => ({
    command: "session start",
    option,
    reason:
      "a finished sign-in goes through Google's consent page and the OS keyring; src/profiles.test.ts drives it " +
      "only to a declined consent",
  })),
  { command: "session end", reason: "revokes the stored Google token and removes it from the OS keyring" },
  {
    command: "sync",
    option: "--embed",
    reason: "needs a downloaded embedding model; the index it feeds is tested through the injected index",
  },
  {
    command: "models download",
    option: "--accept-terms",
    reason: "downloads a model from Hugging Face; cli-core tests the download, src/help.test.ts the --offline refusal",
  },
  {
    command: "images models download",
    reason: "downloads a model from Hugging Face; cli-core's downloadImageModel is tested there",
  },
  {
    command: "guide",
    reason: "cli-core's command, printed to the process's stdout; src/help.test.ts runs checkGuide on every scenario",
  },
  {
    command: "",
    option: "--help-all",
    reason: "Commander answers before any command runs, so the trace never sees it; src/help.test.ts checks it",
  },
  {
    command: "",
    option: "--version",
    reason: "Commander answers before any command runs, so the trace never sees it; `pnpm version:check` checks it",
  },
]
