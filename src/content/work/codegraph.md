---
title: "CodeGraph"
tier: 3
order: 5
hook: "Gives LLMs eyes on code relationships via a Neo4j graph and four conservation laws."
summary: "CodeGraph indexes Python code into a Neo4j graph and validates an agent's changes against four conservation laws by comparing snapshots. It is read-only: the model edits, CodeGraph reports what broke."
categories: ["dev-tools", "ai-agents"]
role: "Designer and engineer, built with Claude as a coding assistant"
period: "Nov 2025"
status: "Prototype; public repository"
stack: ["Python", "Neo4j", "FastAPI", "MCP"]
highlights:
  - "Python AST indexer into a Neo4j graph"
  - "Four conservation-law validators run by snapshot comparison"
  - "FastAPI backend, frontend, CLI and read-only MCP server"
credits: []
links:
  repo: "https://github.com/HousamKak/codegraph"
openQuestions: []
draft: false
---

Coding agents break call sites and references they cannot see. They change a function signature in one file and leave five callers broken in others. CodeGraph gives the model a view of those relationships without ever editing code itself: the model does the editing, and CodeGraph tells it what the edit did to the rest of the system.

It parses Python with the AST module and writes functions, classes, variables and their relationships into Neo4j. Before and after a change it takes a snapshot of the graph and compares them against four conservation laws, starting with signature conservation, so a changed function with unchanged callers shows up as a violation instead of a runtime surprise. The same engine is reachable through a FastAPI backend with a small frontend, a CLI, and a read-only MCP server, so an agent can query the graph and run validation as part of its own loop.
