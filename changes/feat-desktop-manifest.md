### Added

- **WireCat Desktop reads the MCP port and the sign-in from this tool.** The manifest names the MCP server's port,
  8769, and one sign-in method, `Browser`: `{profile} session start --json`, with `--client-file` for the person's own
  Google client file. Desktop keeps its own list only as a fallback.
- **Built on cli-base 1.2.0** (was 1.1.0), which writes the port and the sign-in methods into the manifest.
