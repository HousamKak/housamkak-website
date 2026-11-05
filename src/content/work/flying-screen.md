---
title: "Flying Screen"
tier: 2
order: 10
hook: "Can a display hover beside you while you work? A physics co-design engine that answers whether any such aircraft can exist."
summary: "Flying Screen is a co-design engine, a design tool and a paper about one question: given a screen, a mission and today's technology, does any feasible hovering aircraft exist, and if so what is the best one physics allows? Every number traces to an equation, and the tests check the code against closed-form theory."
categories: ["research-simulation", "engineering-hardware"]
role: "Sole researcher and engineer"
period: "Sep 2026"
status: "Research complete enough for a paper; public repository"
stack: ["Python", "NumPy", "MuJoCo", "LaTeX", "HTML/JS"]
highlights:
  - "Seven model layers, from momentum theory and mass closure to Newton-Euler dynamics, control and optimisation"
  - "The feasibility wall: a saddle-node fold beyond which no equilibrium mass exists at all"
  - "Tests assert the engine's sensitivity exponents against the closed-form theory"
  - "Browser design tool and a CLI covering design, wall, simulation, closure, optimisation and tether studies"
  - "MuJoCo turnaround and walk-loop simulations"
  - "A full paper with derivations, proofs, 71 diagrams and a design study generated from the engine"
credits: []
links:
  repo: "https://github.com/HousamKak/flying-screen"
openQuestions:
  - "Publish the paper on arXiv as well as the blog? Blog post URL to add to links.writing once it exists."
  - "Any physical prototype planned?"
  - "Was the measured hardware used for calibration your own, or published data?"
---

## The problem

I wanted a display that hovers beside me while I work, so I could stand or move around instead of sitting at a desk. It sounds like a drone with a screen strapped to it. It is not, and finding out why is the project.

The obvious question, "can a multirotor fly?", is the wrong one. The real one is: given a screen, a mission and the technology available, does any feasible aircraft exist at all? And if one does, what rotor size, battery, motors, geometry and controller make it the best design physics allows? Those parts are coupled. The machine's mass sets the power it needs, the power sets the battery, the battery is part of the mass, and the path the controller flies sets the power in the first place.

## What I built

A co-design engine in Python, built layer by layer from my own derivation, with a browser UI and a command line over it:

| Layer | What it decides |
|---|---|
| Momentum theory | hover energy |
| Mass closure | whether the design can exist |
| Structure and components | frame mass, motor mass, real figure of merit |
| Newton-Euler dynamics | how the body moves |
| Motor and battery states | actuator response and energy use |
| Control | stability and following a person |
| Optimisation | the best machine the constraints allow |

A closure loop ties the control layer back into the mass budget, and a separate tether model covers the version of the problem with the energy supply taken off the aircraft. MuJoCo simulations show the machine turning around and following a walking person.

The written result is a paper, *The Flying Screen*, with the full derivations, proofs, diagrams and a design study. Every number in the design study is produced from the engine by a script, together with the configuration that produced it.

## How it works

Nothing is a black box. Every number in the tool traces back to an equation, and the test suite checks the code against the closed-form theory rather than against itself.

The core of the algebraic layer is mass closure. Splitting mass into fixed, structural, propulsive and battery parts, everything collapses to one equation, `alpha m - beta m^1.5 = M0`. The left side is not monotonic, so there is a maximum fixed load `M0_max`. Below it there are two solutions, a light design and an unstable heavy branch. Above it there is no equilibrium mass at all. That is a saddle-node fold, not "a heavier aircraft", and it is the feasibility wall the tool draws.

It also explains why endurance is brutal. The wall scales with the inverse square of flight time, so four times the flight time costs sixteen times the payload. The engine computes these exponents numerically and the tests assert they come out at exactly the theoretical values. The paper then shows the fold exists only while rotor disk area grows slower than mass; at constant disk loading the wall moves from mass to rotor diameter.

The study turned up four findings that invert the naive expectation. Indoors, beside a person, the binding constraint is acoustic, not energetic. A declared sound-power level is not a pressure at one metre, and confusing the two (with an uncalibrated anchor) was worth fourteen decibels of error. The safe standoff is measured to the display, but the rotors reach most of a metre back toward the user. And the standoff that makes the blades safe makes ordinary text too small: at 1.2 m a laptop panel needs heavy interface scaling, leaving roughly a tablet's worth of usable workspace.

## Where it stands

The engine, tool, tests, simulations and paper are complete enough to publish, and the code is public on GitHub. I will publish the paper on this site's blog.
