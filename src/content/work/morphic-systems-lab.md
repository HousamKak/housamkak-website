---
title: "Morphic Systems Lab"
tier: 3
order: 6
hook: "A systems-modelling kernel that refuses to render claims the model has not earned."
summary: "Morphic Systems Lab is a semantic kernel for system-dynamics models, with a studio UI that is a projection of the model. Diagrams, equations and results are only shown when the model can back them."
categories: ["research-simulation"]
role: "Sole designer and engineer"
period: "2026"
status: "Prototype"
stack: ["TypeScript", "Vite"]
highlights:
  - "Headless semantic kernel with 144 tests"
  - "Dimensional, scale-operation and index-conformance checking"
  - "The declared equation is the equation that runs"
  - "Studio UI built as a projection of the kernel"
credits: []
links: {}
openQuestions:
  - "reference/millennium-institute holds third-party material: keep out of public assets"
draft: false
---

System-dynamics diagrams often show equations that are not quite what the simulator actually runs, and the reader has no way to tell. I built Morphic Systems Lab around the opposite premise: the model is primary, and diagrams, text, simulation and analysis are projections of it. A model states not just what it asserts but what warrant it has for it, and the interface will not render a claim the model has not earned.

The core is a headless TypeScript kernel with 144 tests. It checks dimensions, scale operations and index conformance, so a stock measured in people cannot quietly be added to a flow measured in dollars per year, and the equation you declare is exactly the equation that executes. Outputs are gated on that conformance. The studio is a separate UI with its own test suite that reads from the kernel rather than holding its own copy of the model, so what you see on screen cannot drift from what the model says.
