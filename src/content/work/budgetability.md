---
title: "Budgetability"
tier: 2
order: 3
hook: "Personal finance built for people who live in more than one currency."
summary: "Budgetability is a budgeting and cash-flow app for households that hold dollars, lira and dirhams at the same time. Accounts are wallets that keep a separate balance per currency, planning happens in one base currency, and a forecast page models best and worst cases from real data."
categories: ["consumer-apps", "business-software", "mobile", "ai-agents"]
role: "Sole designer and engineer"
period: "Sep 2025 to now"
status: "Live at budgetability.app"
stack: ["React", "Vite", "Supabase", "PostgreSQL", "React Native/Expo", "MCP", "GitHub Actions", "GitHub Pages"]
highlights:
  - "Wallet accounts: one account holds several currencies, each with its own balance"
  - "Every cross-currency movement snapshots its amounts at entry, so changing a rate never rewrites history"
  - "Forecast page for cash-flow uncertainty, with rules that total real records per month"
  - "Web app, installable PWA and a native mobile client on one Supabase backend"
  - "MCP server against the live app so an agent can read and manage budgets"
credits: []
links:
  live: "https://www.budgetability.app"
  repo: "https://github.com/HousamKak/budgetability"
openQuestions:
  - "How many people use it, and is sign-up open to the public?"
  - "Is the mobile app published on a store, or only the APK and PWA?"
  - "The public repo README is still a generic template: update it before linking?"
  - "Confirm the existing screenshots use demo data."
  - "Do you use it for your own household budget (could be said on the page)?"
---

## The problem

In Lebanon, a household budget does not live in one currency. Salaries may arrive in dollars, groceries are paid in lira, savings sit in a dollar account, and some income comes in dirhams. A cash envelope at home holds lira bills and dollar bills side by side, and they do not mix. Mainstream budget apps assume one currency per user, or at best convert everything at a single rate, which quietly corrupts the history every time the rate moves.

I wanted a budget app that matched how money actually works here.

## What I built

Budgetability is a React and Vite web app on Supabase. It covers the usual ground (monthly budgets, expenses, plans, savings goals, a calendar, analytics, spreadsheet and book views) but the core is the currency model and the forecast.

**Wallet accounts.** An account holds a set of currencies, chosen when it is created, with an independent balance for each. Every deposit, expense, transfer or contribution names the currency it moves, and only that balance changes. Accounts can be grouped (a "mother" account with combined totals), and tapping the total balance shows the cross-currency breakdown.

**One planning currency.** Each user has a base currency. Budgets, plans, analytics and the forecast are shown in that base, so the calendar reads in dollars while inputs can be in whatever currency the account holds.

**Forecasting.** The forecast page models cash flow under uncertainty, with best and worst cases on a balance chart. Real income, expenses and plans can be linked into it, related records can be grouped into one line, and rules act as saved queries that total real data per month.

Around the web app there is an installable PWA with a phone layout, a native mobile client built with Expo, a separate marketing site, and an MCP server that runs against the live backend so an agent can query and update budgets.

## How it works

Exchange rates are user-entered and stored as units per one US dollar, so conversion always pivots through USD. Rates are treated as current values only. Historical accuracy never depends on the rate table: every cross-currency movement records its original amount, its converted amount and its base amount at the moment it is entered, and later rate changes leave those records alone. Transactions can also carry their own rate when the real exchange differed from the default.

The schema evolved through migrations: money columns were widened, currency-aware balance triggers were added, and accounts created before the wallet model were backfilled to hold all supported currencies with their old balance seeded under the original currency. A GitHub Action regenerates the database types from each migration, and pushes to `main` build and deploy the web app to GitHub Pages under a custom domain.

## Where it stands

Budgetability is my longest-running personal product. It has been in steady development since September 2025, almost entirely in my commits apart from CI automation, and it is live at budgetability.app with the web app's source public on GitHub. The most recent work has been forecast refinements and automatic transfers within an account. Public usage numbers are not something I can state yet.
