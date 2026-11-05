---
title: "H"
tier: 1
order: 2
hook: "A canvas operating environment where AI agents, terminals and live applets are wired together like a circuit."
summary: "H is my local operating environment for running many AI coding agents at once. Its main surface is a canvas of tiles (Claude Code and Codex terminals, chats, generated applets, processes, datastores) joined by typed wires, on top of an event-sourced TypeScript backend. Agents can discover what they are wired to and drive those applets directly."
categories: ["ai-agents", "dev-tools"]
role: "Sole designer and engineer"
period: "Apr 2026 to now"
status: "Daily-use personal system, run as a supervised alpha. External adoption not measured."
stack: ["TypeScript", "Node.js", "React", "Vite", "SQLite", "Event sourcing", "Tauri", "MCP", "Claude Agent SDK", "Three.js", "C#", "Telegram Bot API"]
highlights:
  - "Canvas of live applets joined by typed wires (text, number, boolean, json, image, array, any) with a shared compatibility and coercion table"
  - "Agent links: wire a terminal running Claude Code into an applet and that session can find it (h_my_links) and read, patch or rewrite it"
  - "Turn tracker that reads structured transcripts, so completion and needs-input are separate signals and silence is never treated as done"
  - "Process applets: generated backend programs with typed pins, speaking NDJSON over stdio, supervised with tree-kill and restart policies"
  - "Shared MCP hub that replaced per-terminal MCP fleets after a measured CPU saturation incident"
  - "Several operator surfaces: React/Vite web, Tauri desktop, Telegram, an Android handset and the Woopy desktop companion"
credits:
  - "The Colony interface ports the three.js engine of Bot Crossing by Jarren Rocks (MIT licence), re-keyed to H's data model"
  - "Colony art uses the CC0 KayKit pack by Kay Lousberg"
links: {}
openQuestions:
  - "Is H meant to become a product, or stay a personal system shown as a case study?"
  - "How many projects and agents does it coordinate on a typical day?"
  - "Any measured time saved or reliability numbers to add?"
  - "Which front ends are mature enough to show (web, Tauri desktop, Telegram, Android handset, Woopy)?"
  - "Colony borrows game rules (not code or assets) from Command and Conquer: Generals per docs/colony-overview.md. Should that be mentioned or left out of public material?"
  - "packages/types/src/wiring.ts says the port and wire model was inspired by 'Mishkat'. Is that your own earlier project, or someone to credit?"
  - "OK to cite the June 2026 readiness figures from your local database (35 applets, 50 wires, 1,714 persisted wire emissions, 39 dynamic UIs)?"
  - "Should the public woodr-docs repo be linked from this page?"
confidential: false
draft: false
---

## The problem

By spring 2026 I was running several Claude Code sessions at once across many projects. The work was fine. The coordination was not. Terminals piled up, I lost track of which agent was finished and which was waiting on me, context lived in scrollback, and every small tool I wanted (a to-do list, a port watcher, a cost meter) was either another browser tab or nothing.

Terminal multiplexers and agent dashboards help with layout, but they treat an agent as a box of text. I wanted the agents, the small tools they make, and the data between them on one surface, connected in a way I could see and they could use.

## What I built

H is a pnpm TypeScript monorepo that I started on 1 April 2026. Every commit in it is mine.

- **An orchestrator** (`packages/orchestrator`) that coordinates projects, agents, memory, task graphs, sessions, terminals, costs and MCP tools over an event bus, with an SQLite store where every change is an event.
- **The canvas** in the React/Vite web app, also packaged as a Tauri desktop app. Tiles are terminals running Claude Code or Codex, chats with docked agents, generated applets, processes, datastores and transforms.
- **An MCP server** (`packages/mcp`) that gives agents tools across the whole system, including canvas tools such as `h_canvas_create_wire`, `h_my_links`, `h_applet_state_patch` and `h_applet_html_write`.
- **Services around it**: a per-project knowledge engine, a secrets vault, a supervisor that restarts the backend, a health monitor, cost tracking, and an exchange that routes anything needing a person to wherever I am (Telegram, the handset, the desktop).
- **The Colony**, a second interface next to the canvas that shows everything alive in H as a real-time strategy map. Projects are bases, sessions are yards, agents are units, CPU and RAM are the power grid. Every order goes through the same APIs the canvas uses.
- **Woodr**, a relational drawing language behind the Woopy applet, with its own core, CLI and PNG, SVG and web renderers.

## How it works

The backend is event-driven. Services publish typed events on the bus and persist them, so the canvas, the Colony and the messaging front ends are all views of the same stream.

Generated applets come out of chat. An agent answers with an `<interactive>` block for a frontend applet or a `<process>` block for a backend program, each with a pin manifest, and an optional trailing `<wires>` list that connects the new pieces in the same turn. Applets are versioned. A dynamic UI keeps its data in a persisted state blob with a revision number, separate from its HTML, so changing the data never means regenerating the code.

Process applets are the backend mirror of dynamic UIs. A process is a supervised child process (Node, Python or shell) with declared input and output pins, plus reserved `status`, `exit_code` and `log` outputs. The contract is NDJSON over stdio. The program writes `{"port":"ports","value":[...]}` to stdout to emit, and H writes one JSON line to its stdin when an input pin receives a value. Any other stdout line becomes a log line.

## The canvas

The canvas is a circuit. Each tile is a component with typed pins, and a wire is pure metadata: a source applet and port, a target applet and port, and a creation time. Port types are `text`, `number`, `boolean`, `json`, `image`, `array` and `any`. One compatibility table (in `@h/wires`, mirrored in the database layer and the browser) decides which outputs may feed which inputs, and a coercion rule makes sure a `text` input always receives a string even when fed from an `any` output. Values that travel are persisted as wire emissions, so a reopened workspace shows definitions and recent values.

Built-in applets have fixed manifests. A terminal outputs `stdout` lines, the full `scrollback`, `exit_code` and `status`, and takes `stdin`. A terminal running Claude Code or Codex also gets structured transcript outputs (`messages`, `user_msg`, `assistant_msg`), because the backend tails the session's JSONL transcript instead of scraping a TUI.

Those agent terminals get one more output: **Agent link**. Every dynamic UI has a reserved **Agent** input. Dragging a wire from a terminal's Agent link to an applet's Agent input declares that the session in that terminal drives that applet. The wire carries no data. Terminals never emit on it. It is identification made visible. Inside the session, `h_my_links` finds the session's own tile, lists every wired peer with its type and title, and includes each dynamic UI's id and current state. From there the agent calls `h_applet_state_read` and `h_applet_state_patch` (a shallow merge of top-level keys, arrays replaced whole, `null` deletes a key) to change data. The tile re-renders live and the wire pulses. For code changes it reads the HTML with `h_applet_html_read` and commits a full new version with `h_applet_html_write`. The tile hot-reloads, the old version stays restorable, and declared ports re-register.

My own to-do list is one of these applets. Any Claude session I wire to it can add or tick items mid-conversation, in milliseconds and without spending tokens on regeneration.

## The hard parts

**Knowing when an agent is done.** A terminal going quiet means nothing. The agent could be finished, waiting for permission, or thinking. The turn tracker follows each session's transcript through a turn state machine and keeps completion and attention as separate signals. A completed turn is information, not proof of success, and PTY activity never sets or clears attention.

**Running out of machine.** In July 2026 the backend kept respawning and the health display flapped. I measured before changing anything: CPU at 100 percent, RAM at 13.5 of 15.7 GB. Four concurrent Claude Code sessions had each spawned a private copy of every MCP server, about 20 extra Node processes. The supervisor's watchdog was also respawning the backend into a port the dead process still held, which caused `EADDRINUSE` crash loops. The fixes: free the port before a respawn, a crash-loop breaker, more tolerant health probes, an orphan reaper, and a shared MCP hub that runs one upstream child per server and multiplexes it to every terminal over HTTP.

**Killing what you start.** Generated processes and terminals left orphans because `kill()` only reached the direct child. Process handles now kill the whole tree (`taskkill /T /F` on Windows, process groups on POSIX) with a SIGTERM to SIGKILL escalation, and runs are recorded so orphans can be reconciled after a backend restart.

## Where it stands

H is the environment I work in every day, and my own to-do list lives on its canvas. A readiness review I wrote in June 2026 called it a supervised alpha: the canvas, generated UIs and processes, wires, datastores and chats were the exercised core, while several multi-agent subsystems were dormant or partial. Work since then has added the Colony, the handset, the shared MCP hub and later versions of the knowledge engine. It has no public release and no external users I can point to.
