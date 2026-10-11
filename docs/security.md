# Data and permissions

Understand what Drive reads, what stays on your computer and which operations change Google data.
Choose only the access and selected folders needed for your task.

The default Google grant is account-wide `drive.readonly`. Selected folders limit ingestion;
they are not a Google-enforced permission boundary. Sync reads source files and saves local
Markdown, document metadata/raw responses, indexed text and optional embeddings.

Tokens use the operating-system keyring unless you explicitly choose private-file storage.
Local snapshots and configuration use private file permissions. Tags, notes and memories are
local records; adding them does not edit a Google document or notify its editors.

Memory extraction sends chosen cached text to the configured AI provider. It is an explicit
operation, with preview before saving proposed memories. A terminal or MCP agent may also send
tool results to its own provider; consider that agent's settings separately.

Remote edits require reconnecting with `session start --write`. Permanent deletion has additional
confirmation controls. Use `--read-only` when the task is to inspect existing data. Google roles
and organization policies still apply; a local guard does not control actions outside this tool.

`drive personal session end` removes local sign-in but retains cached documents and settings. Revoke the
application in your Google Account to remove its Google access. To remove cached data, first
identify this tool's directories and database; do not delete a database shared with other tools.
Read [settings](configuration.md) before changing storage.
