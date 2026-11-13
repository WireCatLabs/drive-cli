import { defineReasons, type ErrorReason } from "@wirecat/cli-base/standards"

type Entry = [reason: string, code: ErrorReason["code"], message: string, details?: string[], step?: string]

const ENTRIES: Entry[] = [
  ["catalog.unavailable", "configuration_error", "the index has no shared catalog adapter"],
  ["catalog.not-found", "not_found", "the file or folder is not in the local catalog; run catalog import or sync"],
  ["catalog.depth-invalid", "validation_error", "tree depth must be between 0 and 50"],
  ["catalog.cycle", "invalid_response", "local folder ancestry contains a cycle"],
  ["catalog.tree-limit", "validation_error", "tree output exceeds 10000 nodes; choose a smaller folder"],
  ["mirror.none", "not_found", "the profile has no mirrors; add one with drive <profile> mirrors add"],
  ["mirror.not-folder", "validation_error", "the path to mirror is not a folder"],
  ["mirror.not-found", "not_found", "no such mirror in this profile; see drive <profile> mirrors list"],
  ["mirror.too-many-cells", "validation_error", "a mirrored spreadsheet is over its cell limit"],
  ["body.unreadable", "validation_error", "the request body file could not be read"],
  ["delete.not-allowed", "permission_error", "this method permanently deletes Google data; pass --allow-delete"],
  [
    "document.too-long",
    "validation_error",
    "the text is over {text_limit} characters; it was not imported",
    ["text_limit"],
  ],
  [
    "document.not-opened",
    "not_found",
    "no profile named opened this document; each one is listed with what refused it",
    ["profiles", "tried"],
  ],
  [
    "document.signed-out",
    "authentication_error",
    "every profile named is signed out; sign in again with drive <profile> session start",
    ["profiles", "tried"],
  ],
  [
    "document.no-access",
    "permission_error",
    "Google denied every profile named access to this document",
    ["profiles", "tried"],
  ],
  ["ref.bare-number", "validation_error", "a bare number names no document; give its document:<n> ref"],
  ["download.exists", "validation_error", "the output file already exists; pass --overwrite to replace it"],
  ["export.exists", "validation_error", "the output file already exists"],
  ["export.too-large", "validation_error", "Google exports at most 10 MB of a native file"],
  ["file.unreadable", "validation_error", "the file to upload could not be read"],
  ["listing.too-large", "provider_error", "the listing is over its bound; the checkpoint was kept"],
  ["policy.confirm", "confirmation_required", "the profile policy asks to confirm {permission}", ["permission"]],
  ["policy.denied", "permission_error", "the profile policy refuses {permission}", ["permission"]],
  [
    "policy.flag-loosens",
    "validation_error",
    "--permission only tightens; {permission} stays as saved",
    ["permission"],
  ],
  ["policy.unknown-key", "configuration_error", "permission {permission} names no drive command", ["permission"]],
  ["profile.busy", "provider_unavailable", "another drive command holds this profile; retry later"],
  ["profile.conflict", "validation_error", "name the profiles once: a profile word or --profiles, not both"],
  ["profile.required", "validation_error", "choose a profile: drive <profile> <command>", ["profiles"]],
  [
    "profile.too-many",
    "validation_error",
    "name at most {max_add_profiles} profiles to try",
    ["profiles", "max_add_profiles"],
  ],
  ["source.changed", "provider_error", "the document changed during export; retry the sync"],
  [
    "store.annotations-present",
    "configuration_error",
    "old annotations remain (at least {annotation_counts}); use drive <profile> store check SOURCE_DB",
    ["annotation_counts"],
  ],
  [
    "store.override-retired",
    "configuration_error",
    "DRIVE_STORE has been retired; use MESSAGING_STORE to select the shared database",
  ],
  ["state.snapshot-missing", "not_found", "the imported copy is missing; run drive <profile> sync --rescan"],
  [
    "upload.checksum-mismatch",
    "provider_error",
    "the uploaded file differs from the local file (MD5); upload it again",
    ["file_id"],
  ],
  ["upload.interrupted", "provider_error", "the upload kept failing; run it again to continue where it stopped"],
  ["upload.refused", "provider_error", "Google refused part of the upload"],
  ["upload.session-expired", "provider_error", "Google expired the upload session; run the upload again"],
  ["upload.start-refused", "provider_error", "Google refused to start the upload"],
  ["write.not-allowed", "permission_error", "this method changes Google data; pass --allow-writes"],
]

/** drive's own reasons; cli-base's base reasons and cli-core's shared ones are known to the handler already. */
export const REASONS: ErrorReason[] = defineReasons(
  ENTRIES.map(([reason, code, message, details = [], step]) => ({
    reason,
    code,
    message,
    details,
    ...(step ? { step } : {}),
  })),
)
