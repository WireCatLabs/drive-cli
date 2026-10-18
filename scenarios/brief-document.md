---
title: Brief yourself on a document before a meeting
goal: Know what a document says, what was already noted about it and what facts it holds, with a quote for each.
steps:
  - run: drive sync
    why: brings in the latest version before you read it
  - run: drive documents context DOC_ID
    why: the document with its tags, notes, memories and editors in one answer
  - run: drive memories extract DOC_ID --scope work
    why: sends the text to your configured model and shows the memories it proposes, each with an exact quote; --yes saves them
  - run: drive notes add DOC_ID "ask about the Q3 numbers"
    why: a note of your own, kept with the document across syncs
  - run: drive documents export DOC_ID --output brief.md
    why: the document as Markdown in a new file; an existing file is never overwritten
look:
  - proposed memories whose quote does not support them; do not save those
  - notes and memories that a newer version of the document made stale
---

memories extract sends the document's text to the model you chose with models set; nothing else does.
