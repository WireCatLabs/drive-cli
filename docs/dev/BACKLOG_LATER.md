# Backlog — later

P3: nice to have, research, someday. Same ids and format as [BACKLOG.md](BACKLOG.md); an item moves there when it
becomes P2.

## Features

- **DRV-21 · P3 · Larger annotation transfers.** `store import` refuses above 1,000 records / 16 MiB; design a
  resumable transfer that keeps reviewed bindings and refuses changed sources. cli-core + `src/store-import.ts`.
- **DRV-22 · P3 · Comment writes:** reply, resolve, reopen, optionally poll. The API methods exist
  (`api drive-comments-*`, `drive-replies-*`).
- **DRV-23 · P3 · Opt-in deletion across mirrors**, with a local archive. Today nothing is deleted in Google.
- **DRV-24 · P3 · More Docs and Sheets editing helpers** (tables, headers, charts, validation), only on demand.
- **DRV-25 · P3 · Write as Google suggestions** instead of refusing a Doc with pending suggestions.
- **DRV-26 · P3 · Remote HTTP MCP with per-user OAuth** for web and mobile agents; a Web OAuth client of its own.
  cli-core shared transport.
- **DRV-27 · P3 · Service-account or ADC sign-in** for servers and CI.
- **DRV-28 · P3 · Mark fetched document text as untrusted** in MCP and JSON output. cli-core output.
- **DRV-29 · P3 · A shared Google sign-in package** (PKCE loopback login, keyring tokens, grants) out of
  `src/login.ts` and `src/tokens.ts`, so a future Google Meet CLI does not copy it. cli-base or a new package.
- **DRV-30 · P3 · Box and Microsoft document adapters** on cli-core `documents`.

## Standards and maintenance

- **DRV-31 · P3 · Commands declare their entity** (WC-CMD-19): 10 of 96 handwritten leaves do.
- **DRV-32 · P3 · Lower layers stop naming commands and flags** (WC-ARCH-16): `src/config.ts`, `src/tokens.ts`,
  `src/google.ts`, `src/state.ts`, `src/store-transition.ts`, `src/mirror-docs.ts`, `src/mirror-sheets.ts`.
- **DRV-33 · P3 · `status` reports progress in cli-core's shape** (WC-LIFE-14).
- **DRV-34 · P3 · `bin/release --local`** (WC-REL-14).
- **DRV-35 · P3 · A default command deadline** (WC-LIFE-5); today only `--timeout`.
- **DRV-36 · P3 · The upgrade check runs the previous drive release on drive's own config, state and mirrors**
  (WC-TEST-14); today it seeds only the old shared store.
- **DRV-37 · P3 · Raise the coverage floor** (WC-TEST-11): `vitest.config.ts` still has the first commit's values.
- **DRV-38 · P3 · `memories extract` over MCP sends a document to the model without a per-document consent**
  (WC-SECR-12). `src/extraction.ts`.
- **DRV-39 · P3 · Security hygiene:** atomic write of the upload checkpoint (`src/upload.ts`), a gitleaks rule for
  Google refresh tokens, full-history gitleaks on PRs (WC-SECR-10/16/17).
- **DRV-40 · P3 · Loops instead of spreading mirrored rows** (WC-TOOL-12): `src/mirror-docs.ts`,
  `src/mirror-sheets.ts`; split the two files (WC-LAY-7).
- **DRV-41 · P3 · Wording and shape items** from the 2026-10-22 standards audit, "Low impact" list (vocabulary,
  `shared-drives` root, `commands frob` without a list, `--jsonl` end line). cli-private
  `research/2026-10-22-drive-standards-compliance.md`.
- **DRV-42 · P3 · A live check of Shared Drive sync.** cli-testing.
