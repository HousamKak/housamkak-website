---
title: "Enterprise conversational AI pilot"
tier: 2
order: 12
hook: "Leading a pilot team building a conversational AI system over a global investment firm's company data."
summary: "Since 2024 I have led product and senior software work on a pilot AI systems team at a global investment firm. The team is building a conversational system that answers questions from company data, connected through MCP integrations, graph and search data access, and distributed services."
categories: ["enterprise", "ai-agents"]
role: "Product Lead and Senior Software (exact title to confirm)"
period: "2024 to now"
status: "Pilot, in progress"
stack: ["MCP", "Graph data access", "Search and retrieval", "Distributed microservices"]
highlights:
  - "Conversational access to company data through MCP integrations"
  - "Graph-based data access alongside search-based retrieval"
  - "Distributed microservice architecture"
  - "Product and engineering leadership of a pilot team"
credits: []
links: {}
openQuestions:
  - "May the firm be named publicly?"
  - "Exact title?"
  - "Employment or assignment relationship (direct, or via OmniVista)?"
  - "Start month in 2024?"
  - "Team size and reporting scope?"
  - "Any shareable outcome (users, adoption, quality or time saved), with written approval?"
  - "Stack is kept generic on purpose (Gremlin, Cosmos DB and Azure AI Search omitted): OK to name them?"
  - "The lessons paragraph is drafted from the role description, not from your words: confirm or rewrite."
confidential: true
---

## The problem

Investment teams depend on information spread across many internal systems. Getting an answer can mean knowing which system holds it, who can access it, and how to combine it with something held elsewhere. A conversational interface is only useful in that setting if it reaches the real data, respects who is allowed to see what, and gives answers people can trust.

## What I built

Since 2024 I have headed a pilot AI systems team at a global investment firm. My role is Product Lead and Senior Software: I shape what the system should do and for whom, and I work on the software that does it.

The team is building a conversational system connected to company data. I cannot describe the firm's systems, data or users here, so this page stays at the level of the kind of system it is.

## How it works

At a high level, the system has three layers:

- **Integrations through MCP.** Company data sources are connected to the model through MCP, so each source is a defined integration rather than ad hoc access.
- **Graph and search data access.** Relationships between entities are reached through a graph layer, and documents and records through a search index, so a question can follow connections as well as match text.
- **Distributed services.** The work is split across services rather than one application, so integrations can be added and scaled independently.

## Where it stands

The system is a pilot and the work is ongoing. I am not stating outcomes, usage or rollout status publicly.

What I have learned so far is mostly about the gap between a demo and a system people rely on. Connecting a model to data is the easy part. The hard parts are deciding which sources to connect first, keeping access boundaries intact as the number of integrations grows, and holding answers to a standard where people act on them. Leading product and writing software on the same team has also taught me to keep the scope honest: a smaller set of well-understood integrations beats a broad set nobody trusts.
