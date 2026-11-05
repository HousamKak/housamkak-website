---
title: "3modly"
tier: 3
order: 4
hook: "A composable 3D model editor an agent can drive and see through."
summary: "3modly is a browser 3D editor built from composable parts, with an MCP server that lets an agent author, check and look at the models it builds."
categories: ["graphics-3d", "ai-agents"]
role: "Sole designer and engineer"
period: "Jul 2026"
status: "Prototype"
stack: ["TypeScript", "React", "react-three-fiber", "Zustand", "Vite", "MCP"]
highlights:
  - "An MCP server for authoring, snapping, measuring and exporting"
  - "Agent edits and hand edits share one validated path"
  - "Six-view contact sheets so the agent can see its own work"
  - "Parametric parts, socket snapping, collision checks and GLB export"
credits: []
links: {}
openQuestions:
  - "Fold into BlockForge story?"
draft: false
---

Language models can write 3D geometry, but they cannot see it, so they cannot tell when a wheel floats beside its axle. 3modly started as a truck made of selectable, composable parts and grew into an editor built so that an agent could both build models and check them.

The editor is React with react-three-fiber and Zustand. Every part is a small system of sub-meshes described as JSON, including lathe, tube, CSG and implicit geometry, with parameters and expressions so a model can be resized from a few numbers. An MCP server exposes tools for creating and transforming parts, snapping them together through sockets, measuring and aligning, checking collisions, reading mesh stats, undoing and exporting GLB. Hand edits in the UI and agent edits go through the same validated path. The piece I care most about is the six-view contact sheet: the agent asks for screenshots from six angles and checks its own work before moving on.
