---
title: "H Distribution"
tier: 2
order: 6
hook: "Self-hosted publishing across social platforms, from a UI, a CLI, an API or an agent."
summary: "H Distribution is a self-hosted social publishing control centre. It turns one post into per-platform variants, schedules and publishes them, pulls analytics, collects comments into one inbox, and exposes the same operations through a web UI, a CLI, an HTTP API and an MCP server."
categories: ["business-software", "ai-agents", "dev-tools"]
role: "Sole designer and engineer"
period: "Apr 2026 to now"
status: "Prototype; connector coverage in real use not yet verified"
stack: ["TypeScript", "Next.js", "React", "SQLite", "Drizzle ORM", "OAuth", "MCP"]
highlights:
  - "One service layer behind the UI, CLI, HTTP API and MCP server"
  - "Scheduled and immediate publishing share a single code path with structured outcomes"
  - "A background worker that prevents overlapping ticks across scheduling, automation, analytics and feeds"
  - "Assisted and manual states for platforms without full API publishing"
  - "Template renderer for post images, including Arabic right-to-left variants"
credits: []
links: {}
openQuestions:
  - "Which platforms have actually been connected and used end to end?"
  - "Is this what you use for your own publishing today?"
  - "Should it merge into the H story or stand alone?"
  - "Git history has only two commits (16 Apr 2026) while the working tree is much newer: commit the current state so dates are defensible?"
---

## The problem

Posting one idea well to many platforms is a lot of small, repetitive work. Each platform wants a different length, format and tone. Scheduling is done by hand in several dashboards. Replies and comments arrive in several inboxes, and the numbers that say whether a post worked are scattered across each platform's own analytics page.

Hosted scheduling tools solve part of this, but they keep the content, the tokens and the history on someone else's servers, and they are built for a person clicking through a UI. I wanted something I own, that an agent can operate as easily as I can.

## What I built

H Distribution is a Next.js application backed by SQLite. A post is written once and expanded into variants, one per platform, which can be edited independently. Variants can be published immediately or scheduled. A background worker publishes due work, pulls post and account analytics, runs automations and reads feeds. Comments come back into a single engagement inbox where they can be answered.

The same operations are available four ways: the web UI, a command-line tool, an HTTP API (with an OpenAPI description) and an MCP server. An agent connected over MCP can draft a post, generate variants, schedule them and check how they did, using exactly the same rules as the UI.

Connectors exist for Instagram, Facebook Pages, YouTube, Bluesky, Mastodon, Reddit, Telegram, Discord, Slack, X and dev.to. Not every platform allows full API publishing (Meta, for example, does not allow third-party publishing to personal Facebook profiles), so connectors can report assisted or manual states instead of pretending a post went out.

There is also a template renderer that produces post images from compositions, such as tweet-style cards, with right-to-left Arabic variants.

## How it works

The design decision I care most about is that there is only one way to publish. Separate service modules handle posts, variants, media, scheduling, the inbox, analytics, OAuth, automations, queues, templates and webhooks, and every interface calls into that layer rather than reimplementing it.

The scheduler persists schedules in SQLite and, when work is due, sends it through the same publishing service that immediate posts use. That service runs a shared per-variant workflow and returns structured outcomes (published, failed, needs assistance), so a scheduled post and a manual one fail or succeed in the same, inspectable way. The worker guards against overlapping ticks, so a slow publish cannot cause the next tick to send the same variant twice.

Platform specifics stay inside connectors. The Instagram connector uses Instagram Login directly, so a creator account does not need a linked Facebook Page. The YouTube connector records a warning on the variant when Google overrides the requested privacy for an unaudited API project. Tokens are held in a local secret store.

## Where it stands

H Distribution is a working prototype on my machine. The source is much broader than its minimal git history suggests, and it has no public repository. Connectors being present does not mean every external integration has been configured and exercised in real use, so I am treating platform coverage as unverified until each one has been tested end to end.
