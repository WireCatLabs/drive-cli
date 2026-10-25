---
title: Find where something was decided
goal: Find the document that records a decision, read the passage and see who changed it.
steps:
  - run: drive personal search "budget decision"
    why: every imported document, by words and by meaning, each hit with its Google URL
  - run: drive personal documents show DOC_ID
    why: the document's text with its tabs, to read the passage in full
  - run: drive personal documents context DOC_ID
    why: its tags, notes, memories and editors, kept in the local store
  - run: drive personal documents history DOC_ID --activity
    why: who did what to it, from Drive Activity; needs a sign-in with --grant activity
look:
  - the hit's Google URL, to cite it
  - the last editors and when they changed it
  - an empty result means no match in the imported folders, not that Drive has no such document
---

Search reads only the imported folders of the selected profile. Run sync first if the document is new.
