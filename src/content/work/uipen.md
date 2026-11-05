---
title: "UIpen"
tier: 1
order: 5
hook: "Point at your app, and Claude fixes the right line of code."
summary: "UIpen is a dev-mode overlay for web apps: you drop pins, regions and arrows on the running page, and each annotation reaches a Claude Code session with the DOM selector, source file, line and component name attached. Claude edits the right file, the dev server hot-reloads, and the pin turns green."
categories: ["ai-agents", "dev-tools"]
role: "Sole designer and engineer"
period: "Apr 2026 to Aug 2026"
status: "Version 0.3.1 with installers, licensing and an activation service. Marketing site at uipen.dev; sales status not published."
stack: ["TypeScript", "Bun", "React", "Next.js", "MCP", "Claude Code Channels", "WebSocket", "SQLite", "Ed25519", "Docker", "AWS ECR", "GitHub Actions"]
highlights:
  - "Source-aware annotations: selector, file, line, column and component name on every pin, region and arrow"
  - "Source walkers for React, Vue, Svelte, Angular, Astro, Qwik and SolidJS dev builds, with a data attribute fallback"
  - "Built on Claude Code Channels for server-to-agent push, with a WebSocket loop that marks annotations resolved, failed or reverted"
  - "Knobs: the agent offers sliders, colour pickers and design-token chips for live CSS preview before applying"
  - "Licensing with Ed25519-signed per-machine licences, a 7-day trial and an activation server wired to Polar.sh webhooks"
  - "Security audit fixes, including path validation so a page cannot point Claude at files outside the project"
credits:
  - "Built on Anthropic's Claude Code Channels (research preview) and the Model Context Protocol"
links:
  live: "https://uipen.dev"
  repo: "https://github.com/HousamKak/uipen-website"
openQuestions:
  - "Is UIpen on sale, free, or waiting for Channels to leave research preview? The site shows one-time prices ($15 and $29); confirm before the page mentions pricing."
  - "Any users or paying customers yet?"
  - "Is the UIpen brand and name cleared for use?"
  - "Will the core ever be open source? FEATURES.md planned AGPL-3.0 for the server and MIT for the overlay."
  - "React source info uses fiber._debugSource, which React 19 removed. Does UIpen support React 19 apps, and should the page say which React versions work?"
  - "The repo link points at the public marketing-site repo only. Confirm that is what you want linked."
confidential: false
draft: false
---

## The problem

When I asked a coding agent to fix something on a page, most of the effort went into describing where it was. "The label under the second chart, the grey one" is slow to write and easy to misread. Screenshots and pixel coordinates are worse: the agent sees a picture, guesses a component, and often edits the wrong file. The browser already knows exactly which element I mean, and in a dev build it often knows which source file and line rendered it. That information just never reached the agent.

## What I built

UIpen is two pieces plus the product around them. I built it alone between April and August 2026.

- **The overlay** (`overlay.ts`, bundled to `public/overlay.js`). Included in dev mode with a single script tag, it draws a toolbar inside a shadow root so the host app's CSS cannot leak in. Its tools are Pin (click a point and comment), Region (drag a rectangle), Arrow (click A, click B, explain what should change between them), Select (snap to an element's bounds) and Cursor (pass through).
- **The server** (`server.ts`, Bun on port 8787). It receives annotations over HTTP, talks to the overlay over WebSocket, and acts as an MCP server that Claude Code loads as a Channel.
- **The product around it.** A CLI (`uipen init` injects the bootstrap script into a project and `uipen clear` removes it), installers, a licensing system and activation server, release docs, and the marketing site at uipen.dev, whose hero runs the real toolbar.

## How it works

You annotate the page and press **Send N**. The overlay posts the batch to the Bun server. The server pushes a `<channel source="uipen">` event into the Claude Code session. Claude calls `get_annotations(session_id)` to fetch the full batch, edits the source files, and calls `resolve_annotation(id)`. The server pings the overlay over WebSocket, the pin turns green, and the framework's hot reload shows the fix. Batching means one agent turn handles several notes at once.

Each annotation carries what the agent needs to find the code. A pin includes its comment, its position in pixels and percent, and a `target` with the CSS selector, tag, text, classes, selected computed styles, bounding rect, and a `source` object with `file`, `line`, `column` and `component`. Regions carry one target per covered element. Arrows carry `fromTarget` and `toTarget`.

Source information comes from each framework's dev-mode metadata. For React and Next.js the overlay walks the fiber's `_debugSource`. Vue 3 and Vue 2 expose the component file, Svelte dev builds expose `__svelte_meta.loc`, Astro injects `data-astro-source-file` attributes, and Angular, Qwik and SolidJS have their own debug hooks. Anything else can stamp a `data-uipen-source` attribute on a wrapper element. Selector, styles and rect are always captured, and source info is the precision upgrade on top.

The MCP tools go beyond resolve. `mark_annotation_failed` and `mark_annotation_reverted` turn a pin red or amber. `chat_append` streams a reply into a per-annotation thread in the overlay's sidebar. `get_tokens` returns the project's design-token vocabulary, scanned at startup from Tailwind configs, CSS `:root` and `@theme` blocks, and Style Dictionary output. `provide_knobs` pushes tunable controls to the browser: the user drags sliders or picks token swatches, sees the change live on the element, and applies it, which sends a linked annotation back to Claude.

## The hard parts

**Choosing not to support everything.** I tried bridging UIpen to agents that have no push channel, through terminal wrappers and editor extensions, and concluded the approach does not work: without server-to-agent push the loop degrades into polling and keystroke injection. UIpen is Claude Code native by design and rides on Channels. The cost is real. Channels is a research preview, so users launch Claude with `--dangerously-load-development-channels server:uipen`, and the notification schema may change.

**Treating the browser as untrusted input.** An April audit, run as parallel reviews of security, code quality, UX and features, found critical issues. The server bound to `0.0.0.0` and was reachable on the LAN. Notification metadata could carry a non-string URL. And browser-controlled file paths flowed to Claude unvalidated, so a page could post a pin whose source file was `../../.ssh/id_rsa` with the comment "fix this", aimed at an agent told to edit the referenced file. All of them were fixed in 0.2.16, the high-priority items followed, and a second review caught that the knobs endpoint skipped the same path sanitising and fixed it too.

**Licensing without pretending.** No client-side licence check is uncrackable, so the goal was that paying is cheaper than cracking. Licences are Ed25519-signed and bound to a machine, with a 7-day trial, revocation and an admin CLI. The activation server issues trials, creates licences on Polar.sh `order.paid` webhooks and revokes them on `order.refunded`. The server ships as a compiled Bun binary. The activation server is containerised, and in August I moved its image build to GitHub Actions for arm64, pushing to AWS ECR over OIDC.

## Where it stands

UIpen is at 0.3.1, with installers, licensing, activation and the uipen.dev site in place. Its open roadmap items are screenshot capture per annotation and opening the source. The marketing site's repository is public. The product repository is private.
