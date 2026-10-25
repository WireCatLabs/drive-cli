---
title: Import chosen folders and make them searchable
goal: Sign in once, choose the Drive folders to keep, and get their documents into the local store as searchable text.
steps:
  - run: drive personal session start
    why: signs in to Google in the browser, read-only; personal is the profile, any name you choose, and starts every account command
  - run: drive personal folders add https://drive.google.com/drive/folders/FOLDER_ID
    why: only the folders you add are imported, with everything under them
  - run: drive models download e5-small
    why: the local model for search by meaning, once per computer; every WireCat CLI shares it
  - run: drive personal sync --embed
    why: imports what changed in those folders and indexes the text by meaning
  - run: drive personal status
    why: how many documents were imported, what is pending and what was skipped
look:
  - skipped files and the reason for each, such as an unsupported type or a file over the size limit
  - pending work; run sync again until nothing is pending
  - a later sync reads only what changed
---

Nothing leaves the computer except the Google requests the sync makes; search and reading run offline.
