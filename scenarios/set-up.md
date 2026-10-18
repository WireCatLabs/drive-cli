---
title: Import chosen folders and make them searchable
goal: Sign in once, choose the Drive folders to keep, and get their documents into the local store as searchable text.
steps:
  - run: drive session start
    why: signs in to Google in the browser, read-only; drive commands start with your profile, as in drive personal session start
  - run: drive folders add https://drive.google.com/drive/folders/FOLDER_ID
    why: only the folders you add are imported, with everything under them
  - run: drive models text download e5-small
    why: the local model for search by meaning, once per computer; every WireCat CLI shares it
  - run: drive sync --embed
    why: imports what changed in those folders and indexes the text by meaning
  - run: drive status
    why: how many documents were imported, what is pending and what was skipped
look:
  - skipped files and the reason for each, such as an unsupported type or a file over the size limit
  - pending work; run sync again until nothing is pending
  - a later sync reads only what changed
---

Nothing leaves the computer except the Google requests the sync makes; search and reading run offline.
