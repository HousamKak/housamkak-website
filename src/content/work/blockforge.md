---
title: "BlockForge"
tier: 1
order: 1
hook: "A programmable voxel world engine where a script becomes a world, and a world becomes a film."
summary: "BlockForge is a world compiler: an agent or a person writes a world as source (build plans, a structure language, generators, Luau mods), and the engine compiles it into a voxel world, then animates and films it reproducibly. It has a browser client and a native C++17/SDL2 client on one data format, with a CLI and an MCP server so agents can build, inspect and render scenes."
categories: ["graphics-3d", "ai-agents", "media-creative", "games"]
role: "Sole designer and engineer"
period: "Mar 2026 to now"
status: "Active development. Public coming-soon site with a notify form; the engine is not publicly released."
stack: ["JavaScript", "Node.js", "Three.js", "WebGPU/WebGL", "C++17", "SDL2", "CMake", "Luau", "WASM", "JSON Schema", "MCP", "Cloudflare Workers"]
highlights:
  - "Two peer clients (browser and native C++17/SDL2) on one world format, sharing a Luau mod host built for native and WASM"
  - "Seekable rendering: every frame is a pure function of story time, so stills, chunked renders and re-renders of one beat give the same pixels"
  - "World history: content-addressed versions, block-level diffs, three-way merge, branches and pull requests for worlds"
  - "Object compiler derives mass, centre of mass, inertia and fitted colliders from compiled objects"
  - "CLI bridge and an MCP server with snapshot and query so agents see what they build"
  - "Timeline documents that compile a whole film: world, screens, animation groups, camera clips and cues, in seconds"
credits:
  - "Built on open-source libraries including Three.js, SDL2 and Luau, each under its own licence"
  - "Imported and reference assets (some character models and textures) keep their original authorship"
  - "Film music is CC0, CC BY or public domain and credited per film"
links:
  live: "https://blockforge.housamkak.com"
openQuestions:
  - "Is there a target public release date or a waitlist size to mention?"
  - "Which films can be shown publicly? Are the Fikra opening and the Baalbek 1970 (Umm Kulthum) projects personal or client work, and which cuts are music-cleared?"
  - "Which features have native/web parity and which are native-only (the camera system with Record to MP4 is described as native)?"
  - "Will the source or a demo build ever be public?"
  - "Licences of imported character models (fox, robot, seed-san)?"
  - "Confirm the test count (STATUS.md says about 1,040 passing; not rerun) before quoting it anywhere."
  - "Commit count: the local repo shows 952 commits, all by you, 27 Mar 2026 to 5 Nov 2026. OK to cite?"
confidential: false
draft: false
---

## The problem

Making a 3D scene usually means hand-placing things in a heavy editor. The result is an opaque file: you cannot diff it, merge it, rebuild it from a recipe, or hand it to an agent and get something sensible back. I wanted worlds and short films that behave like code. Write the source, compile it, look at the output, change one line, compile again, and get exactly the same thing everywhere it runs.

The other half of the problem was agents. Coding agents are good at writing structured data and bad at working blind. If an agent places ten thousand blocks and cannot see the result, it cannot fix its own mistakes. So BlockForge had to be something an agent could drive, observe and verify, not just something a person clicks around in.

## What I built

BlockForge is what I call a world compiler. A world is a recipe: JSON build plans, a declarative structure language, JavaScript generators, tools with recorded parameters, styles and Luau mods. The engine compiles that source into a voxel world, then animates and films it.

The main pieces:

- **A web engine** (`src/`, ES modules) with a 2D isometric builder and a 3D builder on Three.js, using WebGPU with a WebGL fallback.
- **A native client** (`cpp/`, C++17 and SDL2, built with CMake) that reads the same saves and plans. It adds a camera system with bookmarks, keyframed shots and generated moves (orbit, turntable, dolly, crane, flyby) and can record to MP4.
- **A shared ModHost** (`modhost/`) that runs Luau mods as a native library and as WASM, so a mod produces the same state in both clients.
- **A bridge, CLI and MCP server** (`cli/kc.js`, `cli/mcp*.js`). Everything is reachable from the command line and over MCP, and a coverage test fails if a capability has no MCP path.
- **JSON schemas** in `schemas/`, covering saves, timelines, shots, styles, world history objects and object domains (figure, vehicle, mechanism, plant, furniture, garment and more) on `blockforge-object/1`.
- **The landing site** at blockforge.housamkak.com, a static page on Cloudflare where every picture is a BlockForge render, including a scroll-scrubbed hero in 16:9 and 9:16.

## How it works

The simplest input is a build plan. `examples/structures/watchtower.json` is a list of operations such as `fill` from one corner to another with `cobblestone`, a hollow `oak_planks` shell, then individual `blocks` for windows and doors. `node cli/kc.js build --file ... --origin 10,6,0` sends it through the bridge to whichever client is running. Above plans sits the structure language: a house is a footprint, a floor count, a roof type and pitch, and a window rhythm, and a compiler lowers it to a plan. Generators cover anything the language cannot express.

Agents get eyes through two calls. `snapshot` renders the current view, or any pose, bookmark or shot time, off-screen and returns an image. `query` returns a summary, the blocks in a box, a raycast, the camera, shots, screens, or the changes since a revision. Both work in both clients, through `kc.js snapshot|query` and MCP tools such as `blockforge_snapshot` and `blockforge_changes`.

Films are timeline documents: a world, screens with timed changes, animation groups, camera clips with exact cuts and cues, all measured in seconds. `kc.js timeline lint|compile|render` turns one into frames. Screens are surfaces in the world that show HTML pages, video, images or live processes, and camera shots can frame and sync them.

World history works like git for worlds. After `kc.js world init`, every change (a plan, a tool run, a hand edit) becomes a version with its recipe attached. Objects are named by the SHA-256 of their canonical JSON and stored deflated in pack files. A chunk is a 32 by 32 by 32 region stored as runs along x through a palette. Versions form branches, any two versions diff block by block, and branches merge three ways. The website's world-history film is generated from that version graph.

## The hard parts

**Determinism across two clients.** The promise is that frame `n` shows story time `t = n / fps` and can be computed on its own. That is what makes stills, scrubbing and chunked renders possible. Everything that moves reads one story clock. Content is classed as `seekable`, `simulated` or `interactive`, and before a batch render the client lists everything that is not seekable and refuses, naming each offender (for example a spring-driven motion channel that needs baking). On the native side the build turns off fast-math and FMA contraction (`/fp:precise` on MSVC, `-ffp-contract=off -fno-fast-math` elsewhere) so the C++ client and the WASM mod host do the same IEEE double arithmetic.

**One canonical form.** For history to be useful, the same world saved by the native client and by the web client must hash the same. Before hashing, saves are expanded, regrouped into chunks, numeric ids become keys, keys are sorted at every depth, and view state (camera, timestamps, block counts) is moved off the content. A test round-trips a world through `Blockforge.exe --roundtrip` and checks that both clients produce the same tree id.

**Physics from shape.** `src/object/ObjectPhysics.js` derives physics bodies from a compiled object: one rigid body per cluster, with mass, centre of mass and inertia integrated over the field, using densities by material finish (7,800 kg per cubic metre for metal, 2,500 for glass, 300 for cloth). It fits a box and a capsule to the surface, finding the capsule's long axis by power iteration on the covariance.

**Keeping a large system honest.** The rule I hold the project to is that anything new ships as a schema, with a compiler, a tool, a way to look at it, a test and history. Mods are sandboxed: a broken mod cannot crash the engine, read arbitrary files or reach the network, and a mod that would break determinism is refused in captured output. Recent work has been refactoring the CLI into verb registries to bring down function complexity.

## Where it stands

BlockForge is in active development, with daily commits. The engine is not released. The public site is a coming-soon page with a walkable exhibition and a film gallery (One World, Atom to Bomb, Claymation, Lamplighter, Pixel Tide, SDF Garden and others). Some ambitions are explicitly unfinished and labelled that way in the status file: racing, characters at arbitrary detail, and representations beyond voxels have specs and first slices, not finished systems.
