---
title: "Rung"
tier: 3
order: 2
hook: "The box is disposable, the data is not: infrastructure-as-code with a timed rebuild drill as its test suite."
summary: "Rung describes a self-hosted server in OpenTofu so any Dockerized app can be deployed, destroyed and rebuilt without losing data. A timed rebuild drill is its test suite."
categories: ["infrastructure"]
role: "Sole designer and engineer"
period: "Aug 2026 to Sep 2026"
status: "Working; private repository"
stack: ["OpenTofu", "cloud-init", "Docker", "Litestream", "wal-g", "Turso"]
highlights:
  - "make drill destroys, recreates, restores and times the whole box"
  - "Apps must declare a state strategy before they can deploy"
  - "No daemon or control panel on the box"
  - "One app manifest meant to survive from laptop to N boxes"
credits: []
links: {}
openQuestions:
  - "Measured drill time and cost savings (README mentions measured takedown savings) can be quoted?"
draft: false
---

Self-hosted servers have a way of becoming precious: hand-fixed machines that nobody dares rebuild. Rung is my answer, built around one sentence: the box is disposable, the data is not, and nothing else is promised. The name is the idea. It is the bottom rung of a ladder, and the same app manifest should survive every step up, from a laptop to one box, a bigger box, a standby and eventually many boxes.

The server is provisioned from OpenTofu modules and cloud-init, never built by hand, and there is no daemon or panel living on it. Every app has to declare how its state survives, using Turso, Litestream or wal-g depending on the data, and it will not deploy without that declaration. The real test suite is `make drill`: it destroys the box, recreates it, restores the data and times the whole cycle. If the drill passes, the promise holds.
