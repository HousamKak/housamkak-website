---
title: "RealityForge"
tier: 3
order: 1
hook: "An engine for constructing, testing and executing mathematical worlds, with BlockForge as its host."
summary: "RealityForge is a research engine that derives families of admissible physical laws from declared structures and principles, then runs them as executable theories. BlockForge imports the resulting physics package and gives it geometry and presentation."
categories: ["research-simulation", "graphics-3d"]
role: "Sole designer and engineer"
period: "Oct 2026 to now"
status: "Research prototype (v0.3.0)"
stack: ["TypeScript", "C++", "CMake"]
highlights:
  - "Construction compiler over finite groups and graphs, checked by an independent verifier"
  - "Exact energy and stability classification before a world runs"
  - "C++ core with checkpoint and replay"
  - "Physics packages that BlockForge can import"
credits: []
links: {}
openQuestions:
  - "Better as a blog essay than a project card?"
draft: false
---

Game physics is usually a pile of hand-written special cases. I wanted to flip that: describe the structures, actions and principles a world should respect, and let the engine work out which laws are allowed. RealityForge is that engine. Its product is not a simulation but a theory with executable semantics and the evidence behind it, which a host like BlockForge can then bring to life.

A construction compiler works over finite groups and graphs and derives a bounded family of admissible laws. An independent verifier checks what the compiler claims. I pick members of that family and they become executable graph field theories, with exact energy accounting and a stability classification computed before anything runs, so an unstable world is rejected up front rather than discovered by watching it explode. The core is C++ with checkpoint and replay, and the TypeScript side handles authoring and packaging. The output is a physics package that BlockForge imports, supplying geometry, interaction and presentation on top.
