### Fixed

- **A document's owner and last editor get a reason in words, not the raw Drive record.** Memory showed their JSON
  (file id, version, Google user) as the reason. It now reads "Google Drive lists this person as the document's owner,
  version 68, changed 2026-11-02". With the cli-core release after 0.620.0 (cli-core#2788) the store also keeps these
  links as what Google Drive reports, so they leave the review list; `drive <profile> catalog import --offline` then
  rewrites the ones already stored.
