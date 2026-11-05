---
title: "Store POS and management ecosystem"
tier: 1
order: 3
hook: "A point-of-sale system that keeps a Lebanese store selling when the internet does not, in dollars and lira."
summary: "An offline-first point of sale and store-management system for a small retail store in Lebanon: local SQLite as the source of truth, checkout and stock that never wait on the network, and USD/LBP books. Around it sit cloud replication to Turso and R2, a read-only remote viewer, a photo-driven product-discovery tool and the start of a multi-store platform."
categories: ["business-software", "infrastructure"]
role: "Lead developer and main author (153 of 184 commits in the main POS); Mahdi Kak contributed 31"
period: "Oct 2025 to now"
status: "In use in a family store (store count and volume not published). The central multi-store platform is early."
stack: ["JavaScript", "Node.js", "Express", "SQLite", "Turso/libSQL", "Cloudflare R2", "HTML/CSS", "PostgreSQL", "PostGIS", "Tauri", "Google Apps Script"]
highlights:
  - "Local SQLite is the source of truth; checkout works offline and replicates later through SQLite triggers into an outbox drained to Turso"
  - "Server-side checkout pricing with a hash that binds every quoted line, rate and rule to the committed sale"
  - "FIFO lot allocation with expiry, stock valuation and USD/LBP reporting"
  - "Dated reversals and audit records written inside the same transaction as the money or stock change they describe"
  - "Product discovery: photograph a product, an agent proposes metadata, a person confirms, the POS API registers it"
  - "Evolution from a Google Sheets and Apps Script edition to a local-first POS to a multi-store platform"
credits:
  - "Mahdi Kak (31 commits): the first atomic, idempotent checkout endpoint with receipt ids and a transaction-safe id generator, the returns approval page and restock-on-approval, LBP input and formatting fixes, mixed-currency total fixes, sync retry timestamps, catalog feed scripts, and the split of product discovery into its own repo"
  - "Developed under the HSM-brothers GitHub organisation"
links: {}
openQuestions:
  - "Which store(s) use it, since when, and can the store be named?"
  - "Approximate products, receipts or transactions handled (only if you are comfortable sharing)?"
  - "Is the credit line for Mahdi Kak accurate and worded the way he would want? Is he your brother, and should the role line say so?"
  - "Has offline mode been exercised during real outages? If so, a sentence about it would be the strongest proof on the page."
  - "Is the central platform (store-platform) a real plan for other stores or an experiment?"
  - "Who ran the 26 October 2026 audit: you, or agents you directed? The page currently says 'an audit'."
  - "What is HSM-brothers (company, family partnership), and who owns the product?"
  - "Is the Google Sheets edition retired, or still running alongside the local POS?"
  - "Side note, not for the page: the Sheets edition folder contains a Google OAuth client_secret JSON file. Check it is not committed to the repo."
confidential: false
draft: false
---

## The problem

A small shop in Lebanon has three constraints that most POS products ignore at once. The internet drops, so checkout cannot depend on it. Prices and payments move between US dollars and Lebanese lira, often in the same sale, and the books have to make sense in both. And the owners want to see the business from somewhere other than the counter.

The first version I built for the store was a Google Sheets and Apps Script system in October 2025, deployed with CI from GitHub. It handled suppliers, inventory and sales, but a spreadsheet that needs the network on every scan is the wrong shape for a cashier.

## What I built

The main product is `store-management-local`: a Node and Express backend on a local SQLite file, serving a vanilla JavaScript single-page app with no framework and no build step. It covers suppliers, products with barcodes, customers, purchases, a barcode-driven POS sell screen with receipts, returns with approvals, customer and supplier payments, expenses, cash advances from the till, capital and owner loans, an end-of-day drawer count against expected cash, stock adjustments, discount rules including box and bundle pricing, and reports. The backend has 22 models, 22 route files and 50 migrations. There are four roles (admin, manager, cashier, viewer), and the UI and confirmations work in English and Arabic.

Around it:

- **Cloud replication** to Turso (libSQL) for data and Cloudflare R2 for product images, plus a **read-only viewer** mode of the same code for looking at the store remotely.
- **Product discovery**, a sibling app on its own port. Photograph a product with a webcam, an agent proposes the name, category, unit and barcode, a person sets supplier and prices and confirms, and the discovery server creates the product through the store's own API.
- **store-platform**, the start of a central plane: a Postgres and PostGIS catalog API, a consumer marketplace for finding nearby stores, and a control plane that provisions stores, mints per-store tokens and tracks fleet heartbeats and releases.

Mahdi Kak contributed to the POS, and the credits list his work specifically. The rest of the code in the main POS is mine.

## How it works

The in-store machine is the only writer. Reads are the hot path (a scan must be instant), so they never leave the machine, and a sale commits locally before anything else happens.

Replication uses the outbox pattern. Each of 16 synced tables has SQLite triggers that, in the same transaction as the write, insert `(table_name, op, row_pk)` into `sync_outbox`. A background worker wakes every 5 seconds, takes up to 50 pending rows, re-reads the live row (so rapid edits coalesce to the final state), and writes it to Turso with `INSERT OR REPLACE`. On failure it backs off (5 seconds, 30 seconds, 2 minutes, 10 minutes, 1 hour) and retries forever. If the internet is down, the outbox simply grows. Images take a parallel path: written to disk, queued in `r2_upload_queue`, pushed to R2, and served local-first with a redirect to R2 when the file is not on that machine.

The viewer runs the same Express code with `READ_ONLY_MODE=true` against cloud Turso and no local database. Writes are refused three ways: a middleware returns 403 on every write route, the frontend hides write controls, and the viewer's Turso token is read-only at the database.

Checkout pricing lives in one module used by both the live quote and the commit. Product identity, lot prices, active rules and the exchange rate come from the database, never from the submitted cart, so a client cannot lower what it is charged. Stock is allocated FIFO across lots in expiry order. A hash binds every quoted line, rate and rule to the checkout, and the server recomputes before comparing, so a price change between quote and commit rolls back stock, rows and the idempotency key. At-cost sales need a manager and a known cost on every sold lot.

## The hard parts

**Money that has to add up twice.** Every amount exists in a native currency and a converted one, with a captured exchange rate. Reports that silently substitute today's rate for a missing historical one would be wrong in a way nobody notices, so profit and loss reports now mark unknown costs and conversions as incomplete and show only known totals.

**An audit that found real defects.** On 26 October 2026 the system was audited against 27 isolated database scenarios built on synthetic data. The existing 43 tests all passed, and the audit still found 30 issues. One example: approving partial returns reduced the USD sale total but not the LBP one, and under-reversed cost, so a fully returned $20 sale showed a $2 loss and a 1.6 million LBP profit at the same time. Another: two approvals of the same return could both apply. I remediated all 30 findings the next day. Original postings now stay on their original date and corrections are dated reversals, a reversal cannot apply twice, a loan with repayments cannot be reversed, and audit records are written inside the business transaction so a failed audit insert rolls back the sale or stock change. `ledger.test.js` injects audit failures into real SQLite operations to prove it.

**Keeping the cloud from seeing too much.** The central platform has no table for cost, suppliers, purchases, customers, sales or exact stock. A store's publish pipe sends only an allowlist (selling price, coarse in, low or out stock, and store location), and the catalog API re-applies that allowlist on ingest so private data cannot be stored even if a client sends it.

## Where it stands

The POS runs in a family store. Since February 2026 the local POS has grown through cloud sync, product discovery, cash and capital workflows, analytics and the October audit remediation, with the latest work on report layout and navigation. Tauri packaging files are in the repo. The central platform has two commits and still needs managed Postgres and live provisioning before it can serve a second store.
