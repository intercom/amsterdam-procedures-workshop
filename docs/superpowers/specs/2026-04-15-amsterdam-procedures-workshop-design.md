# Amsterdam Procedures Workshop — Design Spec

**Date:** 2026-04-15
**Owner:** Will Roberts (Manager, Scaled Customer Success, EMEA)
**Delivery:** Amsterdam, ~May 2026
**Duration:** 3–4 hours (flexible)
**Audience:** Customer support leaders (external, customer-facing)

---

## Overview

A self-paced workshop website for support leaders to learn how to build Fin Procedures, delivered in a facilitated group session in Amsterdam. Modelled on the [Shopify Fin Workshop](https://intercom.github.io/shopify-fin-workshop) but tailored to Procedures, with a distinct exploration phase before attendees go into the product.

Attendees start in shared demo Intercom workspaces and transition to their own workspaces at the end of the day.

---

## Use Case: Refund Request

All hands-on stages (4–6) are built around a refund request procedure. This was chosen over WISMO because it demonstrates:
- Conditional branching (eligible / not eligible)
- An action step (processing the refund), not just data reads
- More compelling business impact for support leaders

### Data Connectors

Four mock connectors are pre-built in the shared workspace. Endpoints will be provided via Beeceptor (to be set up by the team separately):

| # | Connector | Input | Returns |
|---|---|---|---|
| 1 | Customer lookup | Email | `{ customer_id, name, email }` |
| 2 | Order lookup | Customer ID | `[{ order_id, item, amount, date }]` |
| 3 | Refund eligibility | Order ID | `{ eligible: bool, reason }` |
| 4 | Process refund | Order ID | `{ success: true, confirmation_id }` |

---

## Workshop Stages

| # | Stage | Type | Time |
|---|---|---|---|
| 1 | Welcome & Overview | Facilitated | ~15 min |
| 2 | Exploration: Map Your SOP | Offline exercise | ~30 min |
| 3 | Translate to a Fin Procedure | Facilitated | ~20 min |
| 4 | Data Connectors | Hands-on | ~25 min |
| 5 | Build the Procedure | Hands-on | ~45 min |
| 6 | Simulate & Stress Test | Hands-on | ~30 min |
| 7 | Advanced: Internal Agent | Optional | ~20 min |
| 8 | Your Own Use Cases | Own workspace | ~30 min |

**Total:** ~3.5 hours core, ~3h 50m with optional stage

---

## Site Architecture

### Hosting
GitHub Pages, under the `intercom` org (e.g. `intercom.github.io/amsterdam-procedures-workshop`)

### Tech Stack
- Static HTML/CSS/JS — no framework
- One HTML file per stage for clean direct linking
- Shared `style.css` and `nav.js`
- Navigation: previous/next buttons at the bottom of each page + top-level table of contents on the index page

### Visual Design
Two distinct visual modes:

**Exploration phase (Stage 2):**
- Warm background (`#fff8ec`), amber accent (`#f5a623`)
- Worksheet-style layout with fillable/printable SOP template
- Signals to attendees they're doing a thinking exercise, not following technical steps

**Technical phases (Stages 3–7):**
- Clean white/blue treatment matching Intercom brand
- Step-by-step instructions with numbered substeps
- Code blocks for JSON/config values
- Callouts for tips, warnings, checkpoints

**Stage 8 (Own Use Cases):**
- Neutral styling — open-ended, less prescriptive
- Guidance prompts rather than step-by-step instructions

### File Structure
```
/
├── index.html              # Table of contents + overview
├── stage-1-welcome.html
├── stage-2-exploration.html
├── stage-3-translate.html
├── stage-4-connectors.html
├── stage-5-build.html
├── stage-6-simulate.html
├── stage-7-internal-agent.html
├── stage-8-own-use-cases.html
├── style.css
├── nav.js
└── assets/
    └── sop-template.pdf    # Printable SOP worksheet for Stage 2
```

---

## Content Notes

### Stage 2 — SOP Template
The printable/in-page worksheet should guide attendees through:
1. What customer request triggers this process?
2. What information does the agent need to gather?
3. What decisions need to be made?
4. What are the possible outcomes?
5. What action does the agent take in each case?

### Stage 5 — Build the Procedure
Step-by-step instructions for:
1. Creating a new Procedure in the shared workspace
2. Adding a step for each data connector (in order)
3. Configuring the eligibility condition (if/else branch)
4. Setting the outcome for each branch (process refund / explain policy)
5. Publishing

### Stage 6 — Simulation
Three scenarios to test:
- Happy path: eligible order, refund processed
- Ineligible: outside return window
- Edge case: order not found

---

## Out of Scope
- Real API integrations (Beeceptor mock endpoints only)
- Authentication / login for attendees
- Analytics or progress tracking
- Mobile optimisation (laptop-only workshop)
