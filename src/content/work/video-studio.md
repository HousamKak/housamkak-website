---
title: "Studio"
tier: 2
order: 1
hook: "Write a film as a script; get narration, animation, sound and a DaVinci Resolve timeline."
summary: "Studio is my script-to-film pipeline. A film is written in a small script language, and Studio compiles it into narration, Manim animation, delivered pictures, music and sound, and a DaVinci Resolve timeline that stays in sync as the script changes."
categories: ["media-creative", "ai-agents", "dev-tools"]
role: "Sole designer and engineer"
period: "Sep 2026 to now"
status: "Working personal pipeline, with finished film exports"
stack: ["Python", "Manim", "FFmpeg", "DaVinci Resolve scripting", "ElevenLabs", "BlockForge", "Claude agents"]
highlights:
  - "A film script language with statements, diagnostics and a linter, compiled to narration, visuals, sound and a Resolve timeline"
  - "The voice is the clock: every visual is placed by a word or beat reference, never by guessed seconds"
  - "Docs generated from code, and the test suite fails when docs drift or an example script stops compiling"
  - "An agent production board derived from the script, so specialist agents share ids, dependencies, claims and approvals"
  - "Resolve round trip: build a timeline, update it in place, pull manual edits back, render the delivery"
  - "BlockForge integration: voxel scenes and skinned presenters rendered directly from script lines"
credits:
  - "Hyperframes (HTML and GSAP motion rendering), used as a vendored tool"
  - "video-use, used for footage editing"
  - "davinci-resolve-mcp, used as a modified fork for the Resolve bridge"
  - "Manim Community Edition"
links: {}
openQuestions:
  - "Are the finished films published anywhere (for example a YouTube channel)?"
  - "Is the war film safe to show publicly (subject matter, footage sources)?"
  - "Should Studio be presented alone or as part of the BlockForge story?"
  - "When did the earlier per-film tools (fractals_ar, fractals_en) start? The Studio git history begins 23 Sep 2026."
---

## The problem

I make explainer films, and the slow part was never the ideas. It was the assembly. A narrated film with diagrams means recording or generating the voice, animating each idea so it lands on the right word, finding or commissioning pictures, laying music and sound under it, and then building the edit in DaVinci Resolve by hand. Every time the script changes, half of that work moves. A rewritten sentence shifts every animation after it, and the timeline has to be rebuilt.

My first films each grew their own copy of helper scripts. They worked, but they drifted apart, and nothing knew what the film as a whole still needed.

## What I built

Studio is a Python package and a script language. The film lives in one `script.md`: narration, media tags, music cues and sound. Studio treats that file as source code. It compiles the script into beats, reports every problem with its line number, and from there drives the rest of production:

- narration through ElevenLabs (cached, so unchanged lines never cost credits again) or from my own recording;
- Manim scenes paced to the words they illustrate;
- delivered pictures and takes, tracked by stable ids;
- levelled and ducked music beds, sound effects, ambience and room tone;
- a preview cut, interchange timelines, and a real Resolve timeline through a bridge.

It also has an agent production board. Studio derives a job graph from the script and the files on disk, one job per media id, per animated scene, per music cue, plus assembly and QC. Specialist agents claim jobs, hand them off and approve each other's work, and any change to an input automatically reopens review.

More recently I connected it to BlockForge, my voxel engine, so a script line can call for a blocky scene, an in-world screen or a skinned presenter (including one of me), and Studio renders it offline.

## How it works

The key rule is that the voice is the clock. Nothing is placed by a guessed number of seconds. A visual is anchored to a word or a beat reference such as `06.5@infinite`, and Studio resolves that against the narration timing. When I rewrite a sentence, everything anchored after it moves with it.

The Resolve side is a round trip. `studio resolve build` mounts a new timeline, `update` brings an existing one up to date in place, `pull` reads my manual edits back so they are not lost, and `render` produces the delivery. The FFmpeg side follows hard rules I learned the painful way: extract each segment and concatenate losslessly instead of one giant filter graph, put 30 ms audio fades at every boundary, apply subtitles last, and never cut inside a word.

Documentation is part of the build. The reference tables in the language guide are generated from the code, and the test suite fails if those tables go stale, a name has no description, a link breaks, or an example script stops compiling. Styles are measurable too: `studio score` checks writing against a style guide and `studio style check` checks pictures and music.

## Where it stands

Studio is my working pipeline. It has produced finished exports, including a full film on fractals, and it is what I use for every new film. It runs on my machine against my own Resolve install and is not packaged for anyone else. The next step is publishing the films themselves and showing the script and the compiled film side by side.
