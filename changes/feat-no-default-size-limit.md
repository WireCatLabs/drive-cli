### Fixed

- **A sync and `files read` read a file up to 10 GiB, not 50 MB and 64 MiB.** A larger PDF, Word or Excel file was
  kept by name only ("file exceeds the ingestion bound"). The limit is cli-core's shared file budget:
  `MESSAGING_ATTACHMENT_MAX_MIB` sets another one, in MiB ([usage](../docs/usage.md)). A file kept by name for its
  size is checked again on the next sync. Google's own 10 MB limit on exporting a native Doc or Sheet stays. A file
  is read whole into memory, so a large one needs that much free memory.
