# Settings

Choose the account, storage and allowed actions for the way you use Drive. Defaults keep its
database separate from your messenger archive; sharing data is an explicit choice.

```sh
drive config show --json
drive --profile work config show --json
drive config set readOnly true --defaults
```

| Setting | Purpose |
| --- | --- |
| `--profile NAME` | Select the account profile for this invocation. |
| `DRIVE_CONFIG_DIR`, `DRIVE_STATE_DIR`, `DRIVE_CACHE_DIR` | Override configuration, snapshot/state and tool-cache locations. |
| `CLI_COMMON_CACHE_DIR` | Override the shared local search-model cache; use the same setting when downloading and embedding. |
| `DRIVE_STORE` | Explicit database path. Back up an existing store and use compatible shared package versions before opening it with another tool. |
| `--read-only` | Block local and remote mutations for this invocation. |
| `--offline` | Use cached reads; refuse sync, Google requests and AI extraction. |
| `--json`, `--agent-json` | Structured output; agent mode displays control characters visibly. |

To share existing people/projects/messages, point Drive at the deliberately chosen compatible
store. It does not discover and open another tool's database automatically. A shared database does
not combine logins, Google permissions or selected folders.

## Optional AI extraction

The shared AI settings select the provider and model used for memory extraction:

```sh
drive config set models.memories.provider '"openai"' --defaults
drive config set models.memories.model '"YOUR_MODEL_ID"' --defaults
drive config show --json
```

Replace `YOUR_MODEL_ID` with your provider's identifier. Supply the provider key through its
documented environment setting, such as `DRIVE_OPENAI_API_KEY`; do not save keys in ordinary
configuration or paste them into agent chat. Anthropic and OpenAI-compatible endpoints use the
shared gateway. Exact settings are in the [AI setup reference](dev/KNOWLEDGE_AND_API.md#memories-and-ai-extraction)
and [command reference](commands.md). Continue with [memory extraction](recipes.md#remember-a-source-backed-decision).
