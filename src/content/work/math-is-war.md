---
title: "Math Is War"
tier: 3
order: 8
hook: "An artillery game where your shot is a math function."
summary: "Math Is War is a browser-first TypeScript reimagining of the Java game Graphwar: you type a function, and its curve becomes your shot across the Cartesian plane. It adds an academy, courses and desktop and mobile shells."
categories: ["games"]
role: "Designer and engineer (authorship to be confirmed)"
period: "Jun 2026 to Jul 2026"
status: "Playable; public repository"
stack: ["TypeScript", "Tauri", "Capacitor"]
highlights:
  - "Fresh implementation of the gameplay math with a new architecture"
  - "Academy, courses and level select for learning functions"
  - "Tauri desktop shell and Android and iOS shells"
credits:
  - "Inspired by Graphwar by catabriga (https://github.com/catabriga/graphwar)"
links:
  repo: "https://github.com/HousamKak/math-is-war"
openQuestions:
  - "Commits are under 'Parabellum Dev'. Is that Housam?"
  - "What is the Graphwar attribution? graphwar/rsc assets may be Graphwar's originals"
draft: false
---

Functions and graphs are hard to make fun to practise. Graphwar, an old Java game, had the right idea: an artillery duel where your projectile is a math function. Math Is War is my browser-first TypeScript reimagining of it, with the aim of turning it into something you can actually learn from, not just play.

You type something like `y = sin(x/4)*6`. The game translates the curve so it passes through your soldier and traces it across the plane, dodging terrain and teammates on its way to the enemy. The gameplay math is a fresh implementation and the architecture is new rather than a port of the original. On top of the duel I added an academy with courses and a level select that introduces function families step by step. The same TypeScript game ships in a Tauri desktop shell and in Android and iOS shells.
