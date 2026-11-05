---
title: "Electrical Lab"
tier: 2
order: 5
hook: "An MCP hardware lab: an agent designs a circuit once and runs it on whichever simulator answers the question."
summary: "Electrical Lab is a backend-neutral circuit model behind an MCP server. An agent or a person builds a circuit once, then runs it through headless Arduino emulation, a visual workbench, ngspice, KiCad or Wokwi, and Lab Studio gives the same circuit a web editor with a live simulator."
categories: ["engineering-hardware", "ai-agents", "research-simulation"]
role: "Sole designer and engineer"
period: "Sep 2026"
status: "Prototype, in active development"
stack: ["TypeScript", "Node.js", "MCP", "avr8js", "ngspice", "KiCad CLI", "Playwright", "Arduino CLI", "C++", "Zig", "Vite", "Vitest"]
highlights:
  - "One circuit model (parts, nets, firmware), run on whichever backend answers the question being asked"
  - "Arduino sketches compiled to Intel HEX with a project-local toolchain and emulated headlessly"
  - "ngspice operating point, transient, DC sweep and AC analyses with real device models"
  - "Lab Studio: schematic, breadboard, 3D and PCB views, with live sync and version history"
  - "A C++ sparse solver core built to WebAssembly and a Node addon, checked against ngspice in tests"
credits:
  - "Fritzing parts library (CC-BY-SA)"
  - "avr8js and rp2040js for microcontroller emulation"
  - "ngspice, KiCad and Wokwi as backends"
links: {}
openQuestions:
  - "Has a real board been built from an exported design?"
  - "How does this relate to the fridge diagnostics and hand keyboard hardware experiments?"
  - "Is Lab Studio deployed anywhere, or local only?"
---

## The problem

Electronics work is spread across tools that do not share a model. Checking whether firmware logic works means an emulator. Seeing whether a mixed analog and digital circuit behaves means a visual simulator. Getting exact voltages, currents and frequency response means SPICE. Making a board means KiCad. Each tool wants the circuit described again in its own format, so every new question starts with redrawing the same circuit.

That is tedious for a person and close to impossible for an AI agent, which has no screen to redraw on. I wanted an agent to be able to describe a circuit once and then ask any of those questions of it.

## What I built

Electrical Lab is an MCP "hardware lab". At its centre is a backend-neutral circuit model: parts, nets and firmware, saved as a circuit file. An MCP server exposes tools to edit that circuit (add parts, connect pins, set firmware) and to run it on a backend:

| Question | Backend |
|---|---|
| Does the firmware logic work? Serial output, pin timing? | headless Arduino emulation (avr8js) |
| What does it look like, and does the mixed circuit behave? | the PCBX visual workbench, driven through Playwright |
| Exact voltages, currents, transients, frequency response | ngspice |
| Schematic, netlist, BOM and Gerbers for manufacturing | KiCad export |
| Sharing, or a wider range of microcontrollers | Wokwi export |

`circuit_show` tells the agent which backends can represent the open circuit.

Around that model sits **Lab Studio**, a web editor for the same circuits. It has schematic, breadboard, 3D and PCB views (with auto-placement, a two-layer autorouter, design rule checks and Gerber export), a serial monitor and scope, version history with diff and restore, and an assistant chat. Changes from the editor, the MCP server or the assistant are all saved as versions of the same project, so a person and an agent can work on one circuit.

## How it works

Firmware is real. Arduino sketches compile to Intel HEX with a project-local Arduino CLI, and standard libraries such as LiquidCrystal and Servo run unmodified in the emulator. Breadboards are real connectivity: parts snap into holes, and rows and rails flatten into nets, so simulation works through the board rather than around it.

The part catalogue has built-in parts that simulate live (from passives and transistors to regulators, displays, sensors, Arduino boards and a Raspberry Pi Pico), each mapped to ngspice, KiCad or Wokwi where those tools have an equivalent, plus parts imported from the Fritzing library.

In the third engine revision the simulator moved onto a C++ sparse core, built with Zig to WebAssembly and to a Node addon. It adds full SPICE device models, adaptive timestep, event-driven mixed-mode digital logic, thermal models, AC and noise analysis, transmission lines and batch sweeps with Monte Carlo and worst-case corners. Every model is checked against ngspice in the test suite, alongside end-to-end runs in a real browser.

## Where it stands

Electrical Lab is a prototype built in an intense stretch in late September 2026. The repository is private. It runs locally, with a Dockerfile and a token requirement for running it beyond localhost.
