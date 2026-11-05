---
title: "Atlagene"
tier: 2
order: 7
hook: "Co-founding a genomics startup: engineering, accelerators and the product story in Lebanon."
summary: "Atlagene is a genomics startup with a consumer and B2B model, which I co-founded with Yasser Shkeir. Yasser designed and built the platform; my side has been engineering and infrastructure, accelerator programs and in-country execution in Lebanon, and the product story: strategy, pitch material and an interactive 3D booth."
categories: ["startup", "graphics-3d", "business-software"]
role: "Co-Founder and CTO (Engineering); platform designed and built by co-founder Yasser Shkeir"
period: "2026"
status: "Early-stage startup; customer and launch status to be confirmed"
stack: ["Three.js", "esbuild", "Next.js", "TypeScript"]
highlights:
  - "Interactive Three.js exhibition booth at true scale, walkable on desktop and touch"
  - "Booth payload split so the scene paints in about 2 s instead of about 10 s on emulated 4G"
  - "B2B-first strategy, pitch deck and a three-minute pitch script"
  - "Accelerator programs and local partner execution as the in-country co-founder"
  - "Print collateral for events that points visitors to the virtual booth"
credits:
  - "Yasser Shkeir, Co-Founder and CEO: designed and built the Atlagene platform end to end (consumer app, lab portal and analysis pipeline)"
links: {}
openQuestions:
  - "Does Yasser approve this public wording and the co-founder framing?"
  - "Is atlagene.com live, and can it be linked?"
  - "Start date of the co-founder role?"
  - "Which accelerators accepted Atlagene, with dates and outcomes?"
  - "Any signed lab or partner agreements that can be named?"
  - "Which engineering or infrastructure pieces are personally yours, beyond the booth, so the role line can be strengthened?"
  - "Did the booth and desk cards get used at a real event (photo available)?"
---

## The problem

Genomic data is easy to get and hard to use. Many people already hold a raw DNA file from a consumer test and have no way to read it, and diagnostic labs in the region need interpretation and reporting they can put their own name on. A young genomics company has two jobs at once: build a platform that handles this data carefully, and earn the trust of labs, doctors and partners who have every reason to be cautious.

Atlagene is built around both sides: a consumer product for people with raw DNA data, and a B2B side for labs.

## What I built

I am one of two co-founders. The ownership is worth stating precisely. **Yasser Shkeir designed and built the Atlagene platform end to end**: the consumer app, the lab portal and the analysis pipeline. The repository history reflects that, and almost every commit in it is his. The platform is his work, not mine.

My remit as Co-Founder and CTO (Engineering) has been engineering and infrastructure, the accelerator programs, and on-the-ground execution in Lebanon. I am the in-country co-founder and the local contact for Lebanon-facing outreach and partner relationships.

The work that is directly mine in the repository is on the product story:

- **Strategy and pitch.** I reframed the company's pitch around a B2B-first strategy, with a problem and product narrative, a business model, a lab value proposition one-pager, a short deck and a pitch script under three minutes.
- **The 3D booth.** I turned the event collateral into an interactive Three.js scene served on the website, so a visitor can walk up to the booth, look at the banner and board, and draw cards from the deck.
- **Collateral.** Desk tent cards and an A4 desk card for events, pointing people at the virtual booth.

## How it works

The booth started as a CSS 3D scene. That approach had no depth buffer, so the floor painted over the tabletop and moving close blanked the view. I rebuilt it in WebGL with Three.js at true scale in metres (eye height 1.65 m, a 1.20 by 0.90 m board, 59 by 86 mm cards) with shadow-casting light and walls you cannot walk through. Walking uses pointer lock on desktop, with a drag-to-look fallback and an on-screen pad on touch devices so walk mode never becomes a dead end.

The card deck is a real deck: fifty cards in a face-down stack, drawn into your hand, flipped and returned, with a shuffle. Fifty card faces cost two textures, because each face is a UV window into a sprite sheet.

The first version shipped as one 3 MB self-contained document, which took 9.7 s to show anything on an emulated 4G connection. I split it into a 9 KB HTML shell, a cacheable bundle and real JPEG textures, made the card sheets load lazily after first paint, and re-encoded textures at their displayed size. Measured on the same connection, the scene now appears in about 2.3 s, and the bytes needed to paint dropped from 4.72 MB to 0.69 MB.

## Where it stands

Atlagene is an early-stage startup. The platform is Yasser's build; the strategy, pitch material, booth and local execution are where my contribution sits. Customer, revenue, partnership and launch status are not things I will state here until they are confirmed and agreed with my co-founder.
