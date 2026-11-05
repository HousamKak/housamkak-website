---
title: "Saken"
tier: 3
order: 3
hook: "Community and residential management across web, mobile, admin, CLI and MCP."
summary: "Saken is a team-built platform for running residential communities, spanning a web app, a NestJS API, a React Native mobile app, an admin console, a CLI and an MCP server."
categories: ["business-software", "mobile"]
role: "Co-founder and CTO"
period: "May 2026 to Sep 2026"
status: "Deployment state unknown"
stack: ["Next.js", "NestJS", "Supabase", "React Native", "Expo", "MCP"]
highlights:
  - "Multi-tenant permissions on Supabase"
  - "React Native client prepared with Play Store assets"
  - "MCP server giving agents access to the API"
credits:
  - "nkaticha, collaborator and the largest contributor to the web app"
links: {}
openQuestions:
  - "Housam's role in Saken?"
  - "Is it a client engagement, and does the team approve showing it?"
  - "Live users?"
draft: true
---

Residential communities tend to run on spreadsheets and chat groups: dues, announcements, maintenance requests and budgets scattered across tools that were never meant for them. Saken is a platform that brings those into one place for residents and the people who manage the building. It is a team product, and the web app in particular was built largely by my collaborator nkaticha.

The system is split into several pieces that share one backend. A NestJS API sits on Supabase, which carries the multi-tenant data and permissions so each community only sees its own records. On top of it are the Next.js web app, an admin console, a React Native and Expo mobile app prepared for the Play Store, and a CLI. I also worked on an MCP server that exposes the API to agents, so community data can be queried and managed from an AI assistant as well as from the apps.
