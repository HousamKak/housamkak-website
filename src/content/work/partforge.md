---
title: "Partforge"
tier: 2
order: 4
hook: "One toolchain that lets an agent design, check, slice and print a real mechanical part."
summary: "Partforge is a parametric part toolset with one core and two front ends: a terminal command (pf) and an MCP server an agent can drive. It spans OpenSCAD, headless Bambu Studio slicing, Bambu printers and SolidWorks over COM, and adds the engineering checks that a render cannot show."
categories: ["engineering-hardware", "ai-agents", "dev-tools"]
role: "Designer and engineer"
period: "Sep 2026"
status: "Working locally on my machine; not packaged for others"
stack: ["Node.js", "OpenSCAD", "Bambu Studio CLI", "SolidWorks COM API", "C#", "MCP", "Python"]
highlights:
  - "pf build renders, measures, judges printability and slices in one pass, with grams and print time"
  - "Mesh metrology: watertightness, shell count, wall-thickness distribution, overhang area, tipping risk"
  - "ISO 286 limits and fits from the published tables, verified against reference values"
  - "A .scad standard library with real ISO 68-1 helical threads, fastener features and print-aware holes"
  - "SolidWorks control over COM, verified end to end on a real part by volume deltas"
  - "SolidWorks add-in task pane that sends the live selection to a Claude session"
credits: []
links: {}
openQuestions:
  - "When was it built? There is no git history (file dates suggest early September 2026). Put it under version control?"
  - "Sole author?"
  - "Which real parts have been printed with it (the bottle dispenser project)?"
---

## The problem

Taking a mechanical part from an idea to a print means moving between three or four programs that do not talk to each other: CAD to model it, a slicer to see whether it prints, printer software to send it, and a calculator or a reference table for fits and fasteners. None of them can be driven or reasoned about by an agent. And a render is a poor judge of a part. A wall 0.31 mm thick looks exactly as correct as one 3 mm thick, and two solids that only touch look like one part until they snap at the joint.

I wanted a single loop where a part's dimensions are named, a change is one command, and the answer comes back as measurements and a verdict rather than a picture.

## What I built

Partforge is one core with two front ends: `pf` in a terminal, and an MCP server for an agent. The repository ships an `.mcp.json`, so Claude Code registers the tools automatically when working in that folder. It covers these systems:

- **OpenSCAD** for parametric authoring, named dimensions and STL, 3MF or PNG export;
- **Bambu Studio** for headless slicing to a real `.gcode.3mf` with true print time and grams;
- **Bambu Cloud and LAN** for print history, devices, live status and printer storage;
- **SolidWorks 2018** over COM for named-dimension and equation control, mass properties and STL or STEP export.

On top of those sit the parts that make it engineering rather than rendering: mesh metrology, design-for-additive checks, ISO 286 limits and fits, ISO metric fastener data (`pf fastener M4` gives clearance, tap drill, counterbore, nut pocket and heat-set boss), and a `.scad` library whose primitives are each tested to render as a closed, single-shell solid.

## How it works

The core loop is `pf scad set part.scad hub_wall=6` followed by `pf build part.scad --slice`. That renders the part, measures it, prints a verdict such as PRINTABLE-WITH-CARE with the reasons (for example, how many square millimetres of overhang are steeper than 45 degrees), and slices it. On both test parts, the cheap geometric estimate and the slicer's own number agreed within 0.2 %, which is what makes the fast check safe to iterate against.

Two problems took real work. The Bambu Studio command line crashed with an access violation on stock profiles, because the shipped profile files only store their differences from a parent and the CLI does not resolve that chain. Partforge walks the chain to the root, merges child over parent and hands the slicer a flat profile. SolidWorks had no usable type library on this install, so the bridge is late-bound, kept alive across calls because attaching costs seconds, and converts everything to millimetres and degrees in one place so a 40 mm boss never becomes 40 m.

SolidWorks changes are verified, not assumed: `sw_update_part` records mass properties before and after. On a real part, driving one dimension from 10 to 16 mm changed the volume by a ratio of exactly 1.6000. A C# add-in also puts a task pane inside SolidWorks that sends the current selection, described in millimetres, to the Claude session.

## Where it stands

Partforge works on my machine against my own OpenSCAD, Bambu Studio, printer and SolidWorks install. It is not packaged for anyone else and has no public repository. The same toolchain also holds a larger design in progress: a bottle-tipping dispenser whose parts are generated from a handful of measured bottle dimensions.
