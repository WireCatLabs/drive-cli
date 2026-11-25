#!/usr/bin/env bash
# The release's live check against real Google Drive (WC-TEST-18, WC-REL-17). The owner runs bin/live <profile>,
# which prints the `# Needs:` lines below, shows the account the profile is signed in to, asks first, runs this script
# and records the pass.
#   scripts/live.sh <profile>
# It uses the profile's own sign-in, which stays in the keyring entry `service drive-cli account <profile>`; this
# script never reads it. Everything it writes in Google lives in a new folder drive-live-<time> in My Drive, which goes
# to the trash at the end, also after a failure. On this computer it adds only the profile's kept versions
# (<state>/profiles/<profile>/files.versions), the write journal <state>/sends/<profile>.jsonl, the recipients list
# <state>/recipients/<profile>.json and, while an upload runs, its checkpoint under <state>/uploads/.
# The edits: Google's sha256Checksum against the sha256 of the downloaded bytes, after an upload and after an update;
# files update at a wrong and the right sha256, keeping the id, name and MIME type; history and restore of a version;
# sheets update of a small .xlsx and documents update of a small .docx (src/testing/fixtures); a Google Doc refused;
# files restore with no version taking a file out of the trash.
# Needs: a profile signed in to a test Google account, never one that matters, with
# Needs: `drive <profile> session start --grant write` (scopes drive.readonly and drive, the full Drive scope)
# Needs: room in that account's My Drive for a folder of four small files and one empty Google Doc
set -euo pipefail
profile=${1:?usage: scripts/live.sh <profile>}
root=$(cd -- "$(dirname -- "$0")/.." && pwd)
work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT
cli=(node "$root/dist/bin/drive.js" "$profile")

pnpm --dir "$root" -s build >/dev/null

# One field of a JSON answer: field <file> <path.to.field>; empty when it is absent.
field() {
  node -e '
    const value = process.argv[2].split(".").reduce((at, key) => at?.[key], JSON.parse(require("fs").readFileSync(process.argv[1], "utf8")))
    console.log(value ?? "")' "$1" "$2"
}
fail() {
  echo "live check failed: $*" >&2
  exit 1
}
hash_of() { sha256sum "$1" | cut -d" " -f1; }
zeros=$(printf '0%.0s' $(seq 64))

"${cli[@]}" files list --limit 1 --json >/dev/null

stamp=$(date +%s)
"${cli[@]}" files mkdir "drive-live-$stamp" --json >"$work/folder.json"
folder=$(field "$work/folder.json" item.id)
[ -n "$folder" ] || fail "files mkdir answered no id"
echo "test folder: drive-live-$stamp ($folder)"
trap '"${cli[@]}" files trash "$folder" --yes --json >/dev/null 2>&1 &&
  echo "test folder $folder is in the trash" || echo "trash the test folder $folder by hand" >&2
  rm -rf "$work"' EXIT

# Google fills sha256Checksum "if available": wait for it, and when it comes it must be the hash of the bytes.
checksum() {
  "${cli[@]}" files get "$1" --json >"$work/get.json"
  field "$work/get.json" item.sha256_checksum
}
wait_checksum() {
  for _ in $(seq 30); do
    now=$(checksum "$1")
    if [ -n "$now" ]; then
      [ "$now" = "$2" ] || fail "Google's sha256Checksum of $1 is $now, the bytes' sha256 is $2"
      return 0
    fi
    sleep 2
  done
  echo "note: Google gave $1 no sha256Checksum within a minute; the edits fall back to the bytes" >&2
}
upload() {
  "${cli[@]}" files upload "$1" --parent "$folder" --json >"$work/upload.json"
  field "$work/upload.json" item.id
}

printf '# Notes %s\n\nthe first draft\n' "$stamp" >"$work/notes.md"
printf '# Notes %s\n\nthe second draft\n' "$stamp" >"$work/notes-2.md"
old=$(hash_of "$work/notes.md")
new=$(hash_of "$work/notes-2.md")
notes=$(upload "$work/notes.md")
[ -n "$notes" ] || fail "files upload answered no id"
echo "notes.md: $notes"
"${cli[@]}" files download "$notes" --json >"$work/read.json"
[ "$(field "$work/read.json" item.sha256)" = "$old" ] || fail "files download answered another sha256 for notes.md"
wait_checksum "$notes" "$old"
"${cli[@]}" files get "$notes" --json >"$work/before.json"

"${cli[@]}" files update "$notes" --expected-fingerprint "$zeros" --yes --json <"$work/notes-2.md" \
  >"$work/e-wrong.json" 2>&1 || true
[ "$(field "$work/e-wrong.json" error.code)" = conflict ] || fail "an update at a wrong sha256 was not a conflict"
"${cli[@]}" files download "$notes" --json >"$work/read.json"
[ "$(field "$work/read.json" item.sha256)" = "$old" ] || fail "an update at a wrong sha256 changed the file"

"${cli[@]}" files update "$notes" --expected-fingerprint "$old" --yes --json <"$work/notes-2.md" >"$work/e-right.json"
[ "$(field "$work/e-right.json" item.replaced.sha256)" = "$old" ] || fail "files update answered another replaced sha256"
"${cli[@]}" files download "$notes" --json >"$work/read.json"
[ "$(field "$work/read.json" item.sha256)" = "$new" ] || fail "files update did not land"
wait_checksum "$notes" "$new"
"${cli[@]}" files get "$notes" --json >"$work/after.json"
for key in id name mime_type; do
  [ "$(field "$work/before.json" "item.$key")" = "$(field "$work/after.json" "item.$key")" ] ||
    fail "files update changed the file's $key"
done
# Two edits in a row: the second runs while Google's checksum may still lag the first.
"${cli[@]}" files update "$notes" --expected-fingerprint "$new" --yes --json <"$work/notes.md" >/dev/null
"${cli[@]}" files update "$notes" --expected-fingerprint "$old" --yes --json <"$work/notes-2.md" >/dev/null

"${cli[@]}" files history "$notes" --json >"$work/history.json"
node -e '
  const versions = JSON.parse(require("fs").readFileSync(process.argv[1], "utf8")).item.versions
  if (!versions.some((one) => one.version === process.argv[2] && one.available))
    throw new Error("files history does not list the first version")' "$work/history.json" "$old"
"${cli[@]}" files restore "$notes" "$old" --expected-fingerprint "$new" --yes --json >"$work/restore.json"
[ "$(field "$work/restore.json" item.restored)" = "$old" ] || fail "files restore answered another version"
"${cli[@]}" files download "$notes" --json >"$work/read.json"
[ "$(field "$work/read.json" item.sha256)" = "$old" ] || fail "files restore did not put the first version back"

fixtures="$root/src/testing/fixtures"
budget=$(upload "$fixtures/budget.xlsx")
[ -n "$budget" ] || fail "files upload answered no id"
wait_checksum "$budget" "$(hash_of "$fixtures/budget.xlsx")"
"${cli[@]}" files sheets show "$budget" "Synthetic Budget!A1:C4" --json >"$work/s-show.json"
fingerprint=$(field "$work/s-show.json" item.sha256)
[ "$fingerprint" = "$(hash_of "$fixtures/budget.xlsx")" ] || fail "sheets show answered another sha256"
"${cli[@]}" files sheets update "$budget" "B2:C2" --values '[[1300, "paid"]]' --expected-fingerprint "$fingerprint" \
  --yes --json >/dev/null
"${cli[@]}" files sheets show "$budget" "Synthetic Budget!B2:C2" --json >"$work/s-after.json"
node -e '
  const cells = JSON.parse(require("fs").readFileSync(process.argv[1], "utf8")).item.sheets[0].cells
  const value = (address) => cells.find((cell) => cell.address === address)?.value
  if (value("B2") !== 1300 || value("C2") !== "paid") throw new Error(`sheets update did not land: ${JSON.stringify(cells)}`)' \
  "$work/s-after.json"
"${cli[@]}" files get "$budget" --json >"$work/budget.json"
[ "$(field "$work/budget.json" item.mime_type)" = application/vnd.openxmlformats-officedocument.spreadsheetml.sheet ] ||
  fail "sheets update changed the workbook's MIME type"

letter=$(upload "$fixtures/letter.docx")
[ -n "$letter" ] || fail "files upload answered no id"
"${cli[@]}" files documents show "$letter" --json >"$work/d-show.json"
fingerprint=$(field "$work/d-show.json" item.sha256)
"${cli[@]}" files documents update "$letter" --payload "[{\"index\": 2, \"text\": \"Edited live $stamp.\"}]" \
  --expected-fingerprint "$fingerprint" --yes --json >/dev/null
"${cli[@]}" files documents show "$letter" --json >"$work/d-after.json"
node -e '
  const paragraphs = JSON.parse(require("fs").readFileSync(process.argv[1], "utf8")).item.paragraphs
  if (paragraphs[2]?.text !== `Edited live ${process.argv[2]}.`) throw new Error("documents update did not land")
  if (paragraphs[1]?.text !== "Dear heron, the pond is ready.") throw new Error("documents update changed another paragraph")' \
  "$work/d-after.json" "$stamp"

"${cli[@]}" api drive-files-create \
  --body "{\"name\":\"live doc $stamp\",\"mimeType\":\"application/vnd.google-apps.document\",\"parents\":[\"$folder\"]}" \
  --yes --json >"$work/doc.json"
doc=$(field "$work/doc.json" item.id)
[ -n "$doc" ] || fail "api drive-files-create answered no id"
"${cli[@]}" files update "$doc" --text x --expected-fingerprint "$zeros" --yes --json >"$work/native.json" 2>&1 || true
[ "$(field "$work/native.json" error.reason)" = file.native-google ] || fail "files update did not refuse a Google Doc"

printf 'trash me %s\n' "$stamp" >"$work/trash.txt"
trashed=$(upload "$work/trash.txt")
[ -n "$trashed" ] || fail "files upload answered no id"
"${cli[@]}" files trash "$trashed" --yes --json >/dev/null
"${cli[@]}" files restore "$trashed" --yes --json >/dev/null
"${cli[@]}" files get "$trashed" --json >"$work/untrashed.json"
[ "$(field "$work/untrashed.json" item.trashed)" = false ] || fail "files restore with no version did not untrash"

echo "files: notes.md $notes, budget.xlsx $budget, letter.docx $letter, Google Doc $doc, trash.txt $trashed"
echo "live check passed: Google's sha256Checksum against the bytes, files update at a wrong and the right sha256 keeping id, name and MIME type, two edits in a row, history and restore, sheets update, documents update, a Google Doc refused, restore from the trash"
