---
title: "Universal Source Control"
tier: 3
order: 12
hook: "Git versions representations; this versions evolution."
summary: "Universal Source Control is a research series, a spec and an early implementation of a domain-agnostic versioning core that records operations on state, so content like game assets can diff and merge meaningfully."
categories: ["research-simulation", "dev-tools"]
role: "Sole author and engineer"
period: "Sep 2026"
status: "Research; early implementation"
stack: ["Markdown", "TypeScript"]
highlights:
  - "Eight-part essay series, from why games are not open source to architecture and experiments"
  - "Spec for a state and operation versioning core"
  - "Semantic diff and spatial canonical form as core ideas"
credits: []
links: {}
openQuestions: []
draft: false
---

Git is brilliant at text and close to useless for things like game levels, 3D scenes and other structured content, where two people's changes do not merge line by line. My argument is that Git versions representations, the bytes in a file, when what we really want to version is evolution: the operations that changed a piece of state. Universal Source Control is where I work that argument out, starting from the question of why games are so rarely open source.

It is mostly research for now: an eight-part essay series covering semantic diffs, a spatial canonical form so equivalent scenes compare as equal, the idea of versioning evolution, prior art, the hard problems, an architecture and a set of experiments. Alongside it sit a spec and an early TypeScript implementation of a domain-agnostic core where each domain plugs in its own state and operations, and the core handles history, diff and merge.
