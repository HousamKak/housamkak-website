---
title: "AnyThyng"
tier: 1
order: 4
hook: "Say a sentence, get a working app on your phone."
summary: "AnyThyng is a blank phone screen with a chat bar: you describe something and the screen becomes it. A Node/TypeScript server built around the Claude Agent SDK generates each app as a self-contained HTML document, versions it, runs its server-side code in a sandbox and serves it to a thin Kotlin/Compose Android shell, with AWS infrastructure described in OpenTofu."
categories: ["ai-agents", "mobile", "infrastructure", "consumer-apps"]
role: "Sole engineer across the server, Android shell, infrastructure and landing site"
period: "Aug 2026"
status: "Beta. Landing page at anythyng.app; sign-up status and user numbers not published."
stack: ["TypeScript", "Node.js", "Claude Agent SDK", "SQLite/libSQL", "Turso", "Kotlin", "Jetpack Compose", "Android WebView", "WebSocket", "WebRTC", "OpenTofu", "AWS ECS Fargate", "GitHub Actions OIDC"]
highlights:
  - "Generation through the Claude Agent SDK with a default-deny canUseTool boundary"
  - "Anchored edits that fail closed: an edit sends only the changed region, keyed on data-morph or unique text, and a missing or duplicated anchor rejects the whole patch"
  - "Agent-written endpoints run in a worker thread with resource limits and a 3 second timeout enforced from another thread"
  - "A sealed WebView: no network, no token in the page, and only the native powers the installed APK already has"
  - "Rooms: a four-character code, a socket, a server-sequenced event log and an optional WebRTC fast path"
  - "AWS in OpenTofu, applied over GitHub OIDC with no long-lived credentials, behind a WAF with nine CloudWatch alarms"
credits:
  - "The repositories live in the Houya-Projects GitHub organisation"
  - "Built on Anthropic's Claude Agent SDK"
links:
  live: "https://anythyng.app"
openQuestions:
  - "Is anythyng.app live and open to sign-ups, or invite-only?"
  - "What is Houya-Projects (company, studio, partnership), and is AnyThyng owned by it? The role line may need to say so."
  - "Any external testers or users so far?"
  - "The 'mario' screenshot in anythyng-web/img: does it show Nintendo IP? Replace it before using any gallery on this page."
  - "Play Store status, or is the APK side-loaded only?"
  - "Is the AWS stack applied and serving production today, or written and not yet live?"
  - "The 115 server tests are self-reported in the README and were not rerun. OK to quote?"
  - "Measured numbers (about 43 s generation, plan at about 9 s, about 6 s per edit, on a Galaxy A51) come from your 4 Aug 2026 notes. Still representative?"
confidential: false
draft: false
---

## The problem

Plenty of people want a small app that fits exactly one need: a counter for a shop, a tracker for a clinic, a game for a kid. They cannot build one, and no-code tools still ask them to think like developers, in screens, tables and logic blocks. Most app builders also stop at the browser, while the device people actually carry is a phone.

I wanted the shortest possible path: a sentence in, a working app on the phone out, and every further sentence an edit to the app you are already holding.

## What I built

I built AnyThyng in August 2026 across four repositories. All of the commits are mine.

- **The server** (`AnyThyng-server`, Node and TypeScript). It wraps the Claude Agent SDK to turn a request into an app, stores every version, runs the app's server-side code in a sandbox, keeps app data in SQLite through libSQL, handles pairing and publishing, and serves all of it to the phone. Its `docs/` folder holds design records, including the options I rejected and why.
- **The Android shell** (`AnyThyng-mobile`, Kotlin and Jetpack Compose). It is deliberately thin. It holds no generated code, only a WebView, a JavaScript bridge, the composer and the engines that apply changes to a live page. A new app never needs an APK release.
- **The infrastructure** (`AnyThyng-infra`, OpenTofu for AWS) and its deploy pipelines.
- **The landing site** (`AnyThyng-web`), built from screens the product actually generated.

## How it works

You type a request. The server runs an Agent SDK loop that plans the app and writes it as a single self-contained HTML document. A plan arrives first and the full app follows. The phone renders it in a WebView on a synthetic origin. Version history is append-only and you can step through it in both directions, with a morph animation between versions of the same app.

Edits are where most of the design went. Instead of regenerating the document, an edit sends only the changed region, anchored on a `data-morph` key or on exact unique text. The phone applies the patch to the live DOM instead of reloading, so a running game keeps its state through an edit. You can also pick an element in a running app and describe a change to just that element.

Generated apps reach data and device features through one fixed bridge. A call like `AnyThyng.rows(...)` goes to a Kotlin `@JavascriptInterface`, then to the API with a device token the page never sees, then through an ownership check in the repository layer. The bridge can grant `camera`, `location`, `notify`, `share`, `clipboard` and `vibrate`, each fixed at install time by the APK and narrowed again by the app's own manifest. No generated JavaScript and no prompt injection can widen that set.

Phones pair with a six-character code. Device tokens are HMAC-signed with a server secret. Minting a pairing code is an owner action: it works from the server machine, from an already paired device, or with an admin token, and returns 401 from anywhere else.

Rooms put several phones in one app, for things like a buzzer, a shared list, or a game where you shoot another person's phone. A room is a four-character code and three transports. The WebSocket carries every event and is the one that is correct. The `room_events` log stores every event with a server-assigned sequence number before it is broadcast, so a phone that slept can catch up. WebRTC data channels give an optional peer-to-peer fast path across a table, unordered and unreliable on purpose, because the socket's copy is always coming. The phone joins rooms on the same engine as a published web page.

## The hard parts

**Finding the real security boundary.** In the Agent SDK, `allowedTools` is an auto-approval list and restricts nothing, and combined with `bypassPermissions` the pair looks like an allow-list while enforcing nothing. I found that with a probe: asked to read a file outside its working directory, the agent read it, and the contents ended up in the generated app. The boundary is now `canUseTool`, default-deny, so a tool that ships in a future SDK release is refused by construction.

**Running a stranger's code.** Once apps are shared, endpoint code is untrusted. `node:vm` alone is not a security boundary, so endpoints run in a worker thread with `resourceLimits`. The 3 second timeout is enforced from the parent thread, because a `while (true)` inside the sandbox never yields and nothing on that thread could stop it.

**Concurrent edits.** Two agents editing one app at once could clobber each other. Anchored patches act as optimistic concurrency control: if the anchor moved or became ambiguous, the whole patch is rejected instead of guessed. The concurrency design record works through 17 edge cases and adds an element registry for the semantic ones. Indexes such as `app_elements` are caches that can be rebuilt from the document, and the document always wins.

**Infrastructure from Lebanon.** HashiCorp geo-blocks Terraform downloads from Lebanon, where I build this, so the infrastructure is OpenTofu. It defines a VPC across two availability zones with no NAT gateway (VPC endpoints for Bedrock, ECR, S3, Secrets Manager and Logs instead), a WAF, an HTTPS load balancer, ECS Fargate services for the server and a scheduler, ECR with immutable tags and scan on push, GitHub OIDC deploy roles, and nine CloudWatch alarms to SNS. The database sits outside AWS on Turso, because Fargate has no persistent disk and SQLite over EFS is a locking problem.

## Where it stands

AnyThyng is in beta. My notes from early August, measured on a Galaxy A51, put generation at about 43 seconds end to end with the plan at about 9 seconds, and an anchored edit at about 6 seconds. The server README reports 115 tests. The known limits are written down: it is single-tenant, access is by device token rather than an account, a development server on a LAN speaks plain HTTP, and the job registry is in-process, so it runs as one instance.
