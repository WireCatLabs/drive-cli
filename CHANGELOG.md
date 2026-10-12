# Changelog

## 0.2.0 — 2026-10-12

- **Facts are their own thing, as in the shared store.** `drive facts add|list|show|accept` keep what happened —
  a fact, statement, question, decision or promise — on a document; yours is accepted at once. `memories
  extract --save` saves the facts it finds as proposed facts and the rest as memories. A memory's kind is
  summary, digest or preference (default summary): `--kind fact` is gone, and memories of kind fact saved by
  0.1.0 show under `facts list` after the shared store upgrades. `documents context` lists the facts too.
  Agents over MCP can list and read facts, not add or accept them.
- Built on the shared framework under its new name, `@wirecat/cli-base` 0.21.0, and `@wirecat/cli-messaging`
  0.253.0 (from 0.231.0); an install holds one framework copy.

## 0.1.0 — 2026-10-11

- Import selected Google folders recursively, including native Docs across tabs and uploaded Markdown/TXT.
- Keep searchable text, source identity, selected metadata, Markdown/JSON snapshots and resumable sync checkpoints locally.
- Search by words and local tags, optionally prepare local embeddings, and read imported sources without Google access.
- Attach local tags, notes, editor identities, person/project links and evidence-backed memories to documents.
- Preview optional AI memory extraction through the shared provider setup, validate supporting quotes and mark memories stale after source changes.
- Read and manage Drive files, folders and native Docs through the official clients, with 68 generated API methods and optional activity history.
- Require explicit account profiles, separate OAuth grants from command permissions, and provide structured output, offline/dry-run modes, completion and local MCP.
- Install compiled JavaScript through npm; use the shared WireCat validation, package acceptance and MAX release workflow conventions.
- Sign in with WireCat's included Google Desktop application, or select your own OAuth client with a file or environment settings; keep private user tokens in local credential storage.
