---
title: "Chatability"
tier: 2
order: 8
hook: "Ask the page you are reading: capture any part of a PDF or slide and get answers about exactly that."
summary: "Chatability lets you capture a region of the PDF, slide or page you are reading and ask Claude about exactly that part. It started as SlideChat, a web app for chatting with a slide deck, and grew into a web app, a browser side-panel extension and mobile clients, with answers that can include small interactive demos."
categories: ["ai-agents", "consumer-apps", "mobile"]
role: "Sole designer and engineer"
period: "Nov 2025 to now"
status: "Beta; usage numbers not yet confirmed"
stack: ["React", "Vite", "Express", "SQLite", "Claude Agent SDK", "Anthropic API", "Chrome Extensions MV3", "Swift/iOS", "Android", "poppler"]
highlights:
  - "Region capture on every surface: select part of a page, stage several captures, ask about them together"
  - "Claude Agent SDK with read-only tools and hard timeouts, resuming one session per conversation"
  - "Slide images and PDFs served only through short-lived HMAC-signed URLs, so the owner and share model holds"
  - "Inline interactive answers rendered in a sandboxed frame with no network access"
  - "Chrome side-panel extension, plus iOS and Android clients"
credits: []
links:
  live: "https://web.chatability.app"
openQuestions:
  - "Is web.chatability.app the right public link, and are sign-ups open?"
  - "Is the iOS app on TestFlight or the App Store? Is the Android app published?"
  - "Is the extension on the Chrome Web Store?"
  - "How many users, if any can be stated?"
---

## The problem

When I read a long slide deck or a paper, my question is almost never about the whole document. It is about one figure, one equation or one slide. General chatbots make you paste in the whole file, or describe the thing you are looking at, and then the answer drifts away from it. I wanted to point at the part I am reading and ask about exactly that.

## What I built

Chatability began in November 2025 as PDF Chat, later SlideChat: a React and Express app where you upload a PDF presentation, browse it as slides and chat with Claude about the current slide. Uploads are converted to per-slide images with poppler in the background, and Claude can write an optional overview of the deck. Answers stream token by token, conversations persist on the server, and Claude remembers earlier turns in the same conversation. Each user has a library, and decks can be shared.

Over 2026 it became Chatability. The core interaction moved from "the current slide" to "what you capture". You hold, select a region of the page, and that capture (or several of them) becomes the context for the question. The same gesture works in:

- **the web app**, with a full PDF reader, annotations (highlight, ink and notes) and pins that mark where a conversation started;
- **a Chrome side-panel extension** that captures from any page while you read, with its own sessions view;
- **iOS and Android clients**, with phone-specific capture and gestures.

Answers can include small interactive pieces, such as a demo of the idea being explained, rendered inline next to the text. LaTeX renders properly, including when a whole `.tex` file comes back.

## How it works

The Claude integration uses the Claude Agent SDK, which runs Claude Code as a library. It streams structured deltas and resumes a session per conversation, so follow-up questions keep real context. Tools are restricted to read-only, and every call has a hard timeout. A later revision added a direct Messages API provider with prompt caching and a usage meter, alongside the Agent SDK.

Chat state lives in SQLite with versioned migrations; the browser only stores UI preferences. Media is never publicly mounted. Slide images and PDFs are served through short-lived HMAC-signed URLs, so a share link grants exactly what the owner intended and nothing that can be guessed.

Interactive answers are the part that needed the most care. In the extension, each interactive block is hosted in its own iframe on a sandboxed extension page. It gets a relaxed content policy so its inline scripts can run, but no access to extension APIs and `connect-src 'none'`, so it cannot make network requests. The panel parses the answer into segments, fetches stored blobs with authentication, and posts the HTML into the sandbox with the current theme.

A lot of the later commits are about feel rather than features: the capture ripple, a dock that opens with one hold-slide-release gesture, a panel that does not fight the reader while text streams.

## Where it stands

Chatability is in beta, built and maintained by me, with 91 commits from November 2025 to September 2026. The web app, the extension (version 0.15) and the mobile clients exist, and the clients point at the live cloud service. The source is private. I cannot yet state user numbers or store availability.
