---
title: "Highlightability"
tier: 3
order: 11
hook: "Persistent, Git-aware code highlights and annotations in VS Code."
summary: "Highlightability is a VS Code extension for highlighting code and attaching comments that persist across sessions and stay attached as files change under Git."
categories: ["dev-tools"]
role: "Sole designer and engineer"
period: "Oct 2025"
status: "Public repository"
stack: ["TypeScript", "VS Code API"]
highlights:
  - "Highlights and comments that persist across sessions"
  - "Git-aware anchoring as files change"
  - "Full light and dark logo set"
credits: []
links:
  repo: "https://github.com/HousamKak/highlightability"
openQuestions:
  - "Published on the VS Code Marketplace?"
draft: false
---

When I read through an unfamiliar codebase I mark it up the way I would mark up a book, and those notes used to disappear the moment I closed the editor or the file changed. Highlightability is a VS Code extension that keeps them: colour highlights on code, with comments attached, that are still there tomorrow.

It is written in TypeScript against the VS Code extension API. Highlights and their notes are stored with the workspace rather than in memory, so they survive restarts. The harder part is keeping them in the right place: the extension is Git-aware, so as lines are added or removed and commits land, highlights follow the code they were attached to instead of staying pinned to stale line numbers. I also designed a full logo set in light and dark variants for the extension.
