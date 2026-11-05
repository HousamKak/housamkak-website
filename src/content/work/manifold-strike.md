---
title: "Manifold Strike"
tier: 2
order: 9
hook: "A shooter that ships the recipe for its world, not the world: a 260 KB executable that generates seven levels at load time."
summary: "Manifold Strike is a first person shooter built on werkkzeug3, the open-sourced Farbrausch engine behind kkrieger. The game is a 260 KB executable and a 186 KB data file, and every level, texture, mesh, material and piece of music is generated on the player's machine from short programs."
categories: ["games", "graphics-3d"]
role: "Sole developer of the game, built on the credited werkkzeug3 engine by Farbrausch and .theprodukkt"
period: "2026"
status: "Playable Windows build"
stack: ["C++", "x86 assembly (yasm)", "Direct3D", "werkkzeug3", "MSBuild", "Python", "MCP"]
highlights:
  - "A level grammar: short plan strings expand into rooms, doorways, colonnades, storeys and stairs, plus the walkable volume"
  - "287 bytes of plan produced 2,699,440 bytes of mesh, a ratio of about 9,400 to 1"
  - "Revived a 2012 open-source demoscene engine under a 32-bit Visual Studio 2022 toolchain"
  - "New game logic, weapons, interface and host-authoritative deathmatch netcode"
  - "A TCP API inside the editor and an MCP server over it, so an agent can read and build the operator graph"
credits:
  - "werkkzeug3 engine and editor by Farbrausch and .theprodukkt, released as open source in 2012 and originally written for kkrieger (2004); the engine sources keep their original licences"
links: {}
openQuestions:
  - "Can the playable build be offered as a download (does the werkkzeug3 licence permit redistribution)?"
  - "Is multiplayer working across separate machines?"
  - "What share of the code is new versus engine code?"
  - "When did the project start? Git history has a single import commit on 30 Aug 2026."
  - "The status ledger says some trigger zones were 'authored by us': anyone else involved besides you and AI agents?"
---

## The problem

Games ship gigabytes of textures, meshes and audio. In 2004 the demoscene group Farbrausch showed another way with kkrieger, a complete first person shooter in 96 KB: instead of storing content, it stored the instructions that build it, and generated everything at load time. The tool behind it, werkkzeug3, was released as open source in 2012. It is a remarkable engine, but it is old, hard to build, undocumented in the places that matter, and it was never meant to make a different game.

I wanted to find out whether that approach still holds up for a new game with real levels, multiplayer and an interface, and how far procedural architecture can be pushed.

## What I built

Manifold Strike is my game on top of werkkzeug3. The engine, renderer, operator graph and editor are Farbrausch's, renamed throughout. The game is new: its levels, game logic, weapons, shop, netcode and interface.

The headline is size. The game is a **260 KB executable plus a 186 KB data file**. From those it generates seven levels with their textures, meshes, materials and music on the player's machine. Nothing is stored as a texture or a model. A wall is a recipe.

The centre of the new engine work is a `Building` mesh operator. A level is written as a short plan string, and the operator expands it into rooms, doorways, colonnades, storeys and stairs, together with the walkable volume a player can actually stand in. In one measured case, 287 bytes of plan produced 2,699,440 bytes of mesh, about 9,400 to 1. Across the generative geometry techniques I tried (isosurfaces, distance field expressions, iterated function systems, fitting geometry back into programs), measured ratios ranged from about 1,400 to 1 up to about 42,000 to 1 against the same meshes shipped conventionally.

The game also has a story structure with chapters, a tutorial, objectives, interlocks, a loadout screen, menus, and host-authoritative deathmatch netcode.

## How it works

Everything in the game is an operator graph. To make that graph something I could work with at scale, I added a TCP server inside the editor (text command in, one line of JSON out) and an MCP server that wraps it in 47 tools covering operators, splines, timeline events, animation graphs and binary blobs. Scripts and agents drive the editor over that socket.

The engine had surprises, and I wrote them down in a lessons file because each one cost real debugging time. The most dangerous: there is no wire data in the document. An operator's inputs are whatever sits on the row above it and overlaps its horizontal span. Widening one operator can steal another's input, and an operator left with no input crashes the exporter, with no error on screen.

The second lesson shaped the whole method: in a fully generated engine, a wrong answer looks exactly like a right one. So validation comes first. Generated meshes are checked by open edge counts and by Euler characteristic per shape (a sphere must come out at 2, a torus at 0, a hollow shell at 4), and nearly every bug fell to a log line rather than to reasoning about the code. The player build was even made to dump its composed spawn points once at a fixed frame, so chapter zones were placed along the real route instead of guessed.

## Where it stands

There is a playable Windows build that starts in about 35 seconds and generates its world on load. The source is in a private repository, and the engine sources carry Farbrausch's original licences. Before I offer a download I need to confirm what the engine licence allows.
