---
title: "SlideFlip"
tier: 2
order: 11
hook: "Turn an English PowerPoint deck into a correctly mirrored Arabic deck, with no Office install."
summary: "SlideFlip mirrors English left-to-right PowerPoint decks into Arabic right-to-left reading order: geometry, groups, connectors, directional shapes, tables and charts. It works directly on the OOXML package, so the core runs with no Office install and no network, and every run is checked so that a layout change can never silently alter content."
categories: ["business-software", "dev-tools", "ai-agents"]
role: "Designer and engineer"
period: "Sep 2026"
status: "Working engine and CLI; not packaged"
stack: [".NET 8", "C#", "DocumentFormat.OpenXml", "Claude API"]
highlights:
  - "Works directly on OOXML: no Office and no network for the core engine"
  - "Translate-then-mirror ordering, so bidi flags and embedded Latin such as FY26 or +3.3% render correctly"
  - "Formatting runs survive translation through inline markers the translator must return"
  - "Every run hashes text, counts shapes and validates schema before and after, and writes atomically"
  - "Translation provider kept in its own assembly so the engine never takes a network dependency"
  - "67 tests that need no PowerPoint, plus an invariant-based verify harness over a fixture corpus"
credits: []
links: {}
openQuestions:
  - "Was this built for a client or employer? If so, which samples are safe to show?"
  - "Is xx.pptx at the folder root a client deck? Use a self-made sample deck for all public images."
  - "Sole author? There is no git history; put it under version control so dates are defensible."
  - "Any plan to sell it as a tool for Arabic localisation teams?"
---

## The problem

Localising a slide deck into Arabic is not just translation. Arabic reads right to left, so the whole slide has to be mirrored: shapes, groups, connectors, arrows and chevrons, tables, charts, even gradient angles and shadow directions. Done by hand in PowerPoint, that is hours of nudging per deck, and it is easy to break something without noticing.

Text is its own trap. Right-to-left paragraphs need the right bidi flags, and once they are wrong, embedded Latin text such as `FY26` or `+3.3%` renders in the wrong order. Consulting-style slides also carry most of their emphasis mid-sentence, in bold phrases and coloured figures, and a naive translation loses all of it.

## What I built

SlideFlip is a .NET 8 engine over the OOXML package, using DocumentFormat.OpenXml. It needs no Office install. A command-line tool drives it:

- `slideflip in.pptx out.pptx` mirrors the layout into right-to-left order;
- `translate` translates the copy in place;
- `localize` does both, in the right order;
- `harvest` dumps a fillable phrase table;
- `verify` runs every invariant over a file or a folder.

Options cover the real cases: a complex-script font such as Dubai, a language tag stamped only on right-to-left runs, pinning named shapes (brand furniture) in place, skipping masters and layouts, leaving charts or directional shapes alone, and mirroring pictures only when asked, since that reverses baked-in text and logos.

A separate PDF importer rebuilds a PDF deck as real PowerPoint shapes, so the engine can be tested against genuine layouts and not only ones I generated.

## How it works

**Order matters.** `localize` translates first, then mirrors. If the mirror pass sees Arabic, it marks each paragraph right-to-left on its own. Flipping first leaves every translated paragraph without its bidi flag. In `auto` mode a paragraph is marked right-to-left only once it holds right-to-left script, so a deck can still be flipped before translation without mangling the English.

**Translation is isolated.** It is the only part that touches the network, and it sits behind a provider interface in its own assembly. The default provider uses Claude; a dictionary provider uses an approved phrase table with no network at all. Paragraphs go out with their formatting runs marked inline, and the translator must return the same markers around the corresponding words. Markers may come back reordered, since word order changes between languages. If they come back malformed, the paragraph falls back to plain text and is flagged for review. Numbers, percentages, single-letter badges and do-not-translate terms are left exactly as they are. Each paragraph gets a character budget from its shape box and font size, and anything over budget is reported.

**Mirroring is a layout operation, so any content change is a bug.** Text is hashed before and after; one changed character fails the run. Shape counts must match. The schema is validated before and after, and only errors introduced by this pass count, because decks written by Office often carry their own complaints. The output is written to a partial file and moved into place only once every check passes, so a failed run never leaves a half-mirrored deck where someone might send it. The source file is never modified.

## Where it stands

SlideFlip is a working engine and CLI with 67 tests that run without PowerPoint and a verify harness over a fixture corpus. It is not packaged and has no public repository yet.
