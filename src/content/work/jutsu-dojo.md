---
title: "Jutsu Dojo"
tier: 3
order: 9
hook: "Weave hand seals at your webcam and cast effects into a 3D shrine."
summary: "Jutsu Dojo recognises sequences of hand seals from a webcam, personalised to one person's hands, and triggers Three.js effects in a 3D scene. It grew out of an applet prototype on H."
categories: ["games", "graphics-3d"]
role: "Sole designer and engineer"
period: "Aug 2026"
status: "Prototype"
stack: ["TypeScript", "MediaPipe", "Three.js", "Express"]
highlights:
  - "Recognition personalised with recorded k-NN samples"
  - "Patch classifier plus sequence priors for seal chains"
  - "Deterministic simulation engine with replay hash checks"
  - "Graduated from an H canvas applet prototype"
credits: []
links: {}
openQuestions:
  - "Rename and strip Naruto sound effects before publishing"
draft: false
---

Webcam hand-gesture recognition usually works on an average hand and fails on yours. Jutsu Dojo is a game built on the opposite approach: you weave hand seals at your webcam, it learns your hands specifically, and a correct sequence of seals casts an effect into a 3D night shrine. It started as an applet on H, my canvas of live applets, and after many rounds of experimentation it graduated into its own project.

MediaPipe HandLandmarker tracks both hands on the GPU. Recognition combines a k-NN classifier over samples you record yourself, a patch classifier for hand shapes that landmarks alone confuse, and sequence priors so a likely next seal is favoured. A recognised sequence triggers Three.js effects. Underneath is a deterministic simulation engine that records inputs and checks replay hashes, so a session can be replayed and verified to produce exactly the same result.
