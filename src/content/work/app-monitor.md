---
title: "App Monitor"
tier: 2
order: 2
hook: "Self-hosted telemetry, crash reports and symbolication for every app one developer ships, on Cloudflare."
summary: "App Monitor is my own monitoring platform: register an app, drop in a small SDK, and see usage, versions, errors and crashes on one dashboard. It runs on Cloudflare Workers and D1, with SDKs for the web, Android, iOS and Python, and an MCP server so an agent can query it."
categories: ["infrastructure", "dev-tools"]
role: "Sole designer and engineer"
period: "Oct 2026"
status: "In use for my own apps, behind Cloudflare Access"
stack: ["TypeScript", "Cloudflare Workers", "D1", "R2", "Queues", "Cloudflare Access", "Java/NDK", "Swift", "C", "Python", "MCP", "GitHub Actions"]
highlights:
  - "Two Cloudflare Workers (ingest and dashboard) sharing validation, fingerprinting and version-compare modules"
  - "SDKs for the web, Android, iOS and Python, including native crash capture on Android (NDK signal handler) and iOS (C crash writer)"
  - "Source map and native symbol upload, with a symbolication job in CI"
  - "Alert rules for new issues, regressions, error spikes and crash-free drops, by email, Telegram or webhook"
  - "Funnels, retention cohorts and release adoption views"
  - "MCP server over the admin API so an agent can query apps, issues and releases"
credits: []
links: {}
openQuestions:
  - "Which apps report into it today, and can any be named?"
  - "Any plan to offer it to other developers?"
  - "Dashboard screenshots need recapturing with the seeded demo apps before publishing."
---

## The problem

I ship a lot of small apps: web apps, Android and iOS builds, Workers, Python tools. Each one needs the same basic answers. Is anyone using the new version? Did it crash, and where? Did the fix I shipped actually reduce the errors? Commercial monitoring tools answer those questions well, but paying for a plan per app does not make sense for one developer, and spreading crashes across several vendors means I never see the whole picture.

I wanted one place, on infrastructure I already run, that every app could report into.

## What I built

App Monitor is a personal monitoring platform built around one owner and many apps. These are its pieces.

**An ingest Worker** that receives events, errors and crashes from apps. It validates every payload, rate limits per install, applies a daily quota per app and an account-wide cap, and hands work to a queue so the request path stays fast.

**A dashboard Worker** with the UI, an admin API and scheduled jobs for rollups, retention and alerts. The dashboard covers an apps list, per-app overview, releases with adoption curves, issues with resolved stack traces, an events explorer with funnels, installs, retention cohorts and settings. It was designed to work at phone width with no horizontal scroll.

**SDKs** for browser and Workers JavaScript, Android (a single-file Java SDK plus an NDK signal handler for native crashes), iOS (a Swift package with a C crash writer, callable from Objective-C) and Python for scripts and servers. Each one batches, persists and respects an opt-out.

**An MCP server** over the admin API, registered for Claude Code, so an agent can ask about usage, open issues, events, funnels and alerts without me opening the dashboard.

## How it works

Both Workers share a set of pure modules: validation, error fingerprinting, version comparison and storage writes. That keeps grouping consistent: the same error thrown twice becomes one issue with a count, not two.

Symbolication is a first-class feature. Web builds upload source maps, and a thrown error in a minified page shows up with its original stack. Native crashes arrive as JSON or multipart minidumps, are stored in R2, and are resolved by a symbolication job in GitHub Actions against uploaded symbols. Large native libraries upload in multiple parts, and other repositories' CI can use an upload-only token that can do nothing else.

Fitting a small budget shaped the design. Rollups are hourly and diffed, and only for active apps, so D1 writes stay inside the included allowance. A cost page reports month-to-date usage per Cloudflare product.

Testing runs at several levels: unit tests for the pure modules, a curl suite against the ingest API, an acceptance script for JavaScript errors, and end-to-end runs against production using an Android emulator and an iOS simulator in CI. Those device runs found real bugs, for example Xcode 16 debug dylib frames that needed to count as in-app code.

## Where it stands

App Monitor is deployed on Cloudflare and in daily use for my own apps, with the dashboard behind Cloudflare Access. Every phase of the original spec is implemented on the server side. The Android and iOS SDKs build and pass in CI on emulator and simulator; physical device coverage is still thin. The code is private, and the public screenshots will come from seeded demo data rather than real apps.
