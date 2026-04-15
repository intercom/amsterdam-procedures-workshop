# Amsterdam Procedures Workshop — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static GitHub Pages workshop site for support leaders to learn Fin Procedures, covering exploration through simulation using a Refund use case.

**Architecture:** One HTML file per stage, shared CSS with two visual modes (exploration vs. technical), and a vanilla JS navigation module. No build tools — pure static files deployable directly to GitHub Pages.

**Tech Stack:** HTML5, CSS3 (custom properties), vanilla JavaScript, GitHub Pages

---

## File Map

| File | Responsibility |
|------|---------------|
| `index.html` | Table of contents, workshop overview |
| `stage-1-welcome.html` | Welcome & Overview — what Procedures are, what we're building |
| `stage-2-exploration.html` | SOP mapping exercise — warm visual treatment, offline worksheet |
| `stage-3-translate.html` | Anatomy of a Procedure — bridging SOP to Intercom concepts |
| `stage-4-connectors.html` | Data connectors walkthrough — 4 pre-built connectors explained |
| `stage-5-build.html` | Step-by-step Procedure builder |
| `stage-6-simulate.html` | Simulation scenarios — happy path, ineligible, not found |
| `stage-7-internal-agent.html` | Optional: Internal Agent with Procedures |
| `stage-8-own-use-cases.html` | Free-form: apply to own workspace |
| `style.css` | All shared styles, CSS custom properties, stage mode classes |
| `nav.js` | Stage list, prev/next logic, active stage indicator |
| `assets/sop-template.html` | Print-optimised SOP worksheet (open + Cmd+P to print) |

---

## Task 1: Project Scaffold

**Files:**
- Create: `style.css`
- Create: `nav.js`
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Create `style.css` with CSS custom properties and base styles**

```css
/* style.css */
:root {
  --brand: #6b30b0;
  --brand-light: #f0e8ff;
  --explore-accent: #f5a623;
  --explore-bg: #fff8ec;
  --explore-border: #f5a623;
  --technical-accent: #2a7de1;
  --technical-bg: #f8fbff;
  --technical-border: #2a7de1;
  --neutral-bg: #f5f5f5;
  --text: #1a1a1a;
  --text-muted: #666;
  --border: #e0e0e0;
  --max-width: 860px;
  --font: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: var(--font);
  color: var(--text);
  line-height: 1.6;
  background: #fff;
}

/* ── Layout ── */
.site-header {
  background: var(--brand);
  color: white;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
}

.site-header .logo { font-weight: 600; letter-spacing: -0.3px; }
.site-header .stage-indicator { opacity: 0.8; font-size: 13px; }

.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 40px 24px 80px;
}

h1 { font-size: 2rem; font-weight: 700; margin-bottom: 8px; line-height: 1.2; }
h2 { font-size: 1.4rem; font-weight: 600; margin: 32px 0 12px; }
h3 { font-size: 1.1rem; font-weight: 600; margin: 24px 0 8px; }
p  { margin-bottom: 16px; color: var(--text); }

.subtitle {
  font-size: 1.1rem;
  color: var(--text-muted);
  margin-bottom: 32px;
}

/* ── Stage mode: Exploration ── */
body.stage--explore {
  background: var(--explore-bg);
}

body.stage--explore .site-header {
  background: #c47d00;
}

body.stage--explore h1,
body.stage--explore h2 {
  color: #8a5500;
}

/* ── Stage mode: Technical ── */
body.stage--technical {
  background: var(--technical-bg);
}

/* ── Stage mode: Open ── */
body.stage--open {
  background: var(--neutral-bg);
}

/* ── Steps ── */
.steps { list-style: none; counter-reset: step; margin: 24px 0; }

.steps li {
  counter-increment: step;
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  align-items: flex-start;
}

.steps li::before {
  content: counter(step);
  background: var(--technical-accent);
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 13px;
  flex-shrink: 0;
  margin-top: 2px;
}

body.stage--explore .steps li::before {
  background: var(--explore-accent);
}

.steps li .step-body { flex: 1; }
.steps li .step-body p:last-child { margin-bottom: 0; }

/* ── Callouts ── */
.callout {
  border-radius: 6px;
  padding: 14px 16px;
  margin: 20px 0;
  font-size: 14px;
  border-left: 4px solid;
}

.callout--tip    { background: #f0fff4; border-color: #22a06b; }
.callout--warn   { background: #fffbe6; border-color: #f0d060; }
.callout--check  { background: var(--brand-light); border-color: var(--brand); }

.callout strong { display: block; margin-bottom: 4px; }

/* ── Code blocks ── */
pre {
  background: #1e1e2e;
  color: #cdd6f4;
  border-radius: 6px;
  padding: 16px;
  overflow-x: auto;
  font-size: 13px;
  margin: 16px 0;
  line-height: 1.5;
}

code { font-family: 'JetBrains Mono', 'Fira Code', monospace; font-size: 13px; }

p code, li code {
  background: #f0e8ff;
  color: var(--brand);
  padding: 2px 6px;
  border-radius: 3px;
}

/* ── Tables ── */
table {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
  font-size: 14px;
}

th {
  background: var(--brand);
  color: white;
  padding: 10px 14px;
  text-align: left;
  font-weight: 600;
}

td { padding: 10px 14px; border-bottom: 1px solid var(--border); }
tr:last-child td { border-bottom: none; }
tr:nth-child(even) td { background: #fafafa; }

/* ── Worksheet (Stage 2) ── */
.worksheet {
  background: white;
  border: 2px dashed var(--explore-accent);
  border-radius: 8px;
  padding: 24px;
  margin: 24px 0;
}

.worksheet h3 {
  color: #8a5500;
  margin-top: 0;
}

.worksheet-field {
  margin-bottom: 20px;
}

.worksheet-field label {
  display: block;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 6px;
  color: #8a5500;
}

.worksheet-field .hint {
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 6px;
}

.worksheet-field textarea {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  font-family: var(--font);
  font-size: 14px;
  resize: vertical;
  min-height: 72px;
  background: #fffdf8;
}

.worksheet-field textarea:focus {
  outline: none;
  border-color: var(--explore-accent);
  box-shadow: 0 0 0 3px rgba(245, 166, 35, 0.15);
}

/* ── Navigation ── */
.stage-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 60px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
}

.nav-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: opacity 0.15s;
}

.nav-btn:hover { opacity: 0.85; }

.nav-btn--prev {
  background: white;
  color: var(--text);
  border: 1px solid var(--border);
}

.nav-btn--next {
  background: var(--brand);
  color: white;
}

body.stage--explore .nav-btn--next { background: #c47d00; }
body.stage--technical .nav-btn--next { background: var(--technical-accent); }

.nav-btn--ghost { visibility: hidden; }

/* ── Progress bar ── */
.progress {
  height: 4px;
  background: rgba(255,255,255,0.3);
  position: relative;
}

.progress-fill {
  height: 100%;
  background: white;
  transition: width 0.3s ease;
}

/* ── TOC (index page) ── */
.toc { list-style: none; margin: 24px 0; }

.toc-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 10px;
  text-decoration: none;
  color: var(--text);
  border: 1px solid var(--border);
  transition: border-color 0.15s, box-shadow 0.15s;
}

.toc-item:hover {
  border-color: var(--brand);
  box-shadow: 0 2px 8px rgba(107, 48, 176, 0.1);
}

.toc-item .toc-num {
  font-size: 18px;
  font-weight: 700;
  color: var(--brand);
  min-width: 28px;
}

.toc-item .toc-meta { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
.toc-item .toc-badge {
  margin-left: auto;
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 10px;
  white-space: nowrap;
  align-self: center;
}

.badge--explore  { background: #fde8c0; color: #c47d00; }
.badge--hands-on { background: #d0e8ff; color: #1a5fb4; }
.badge--optional { background: #c8f0dc; color: #1a7a50; }
.badge--open     { background: #e0e0e0; color: #555; }
```

- [ ] **Step 2: Create `nav.js`**

```javascript
// nav.js
const STAGES = [
  { file: 'index.html',                    title: 'Overview' },
  { file: 'stage-1-welcome.html',          title: 'Welcome & Overview' },
  { file: 'stage-2-exploration.html',      title: 'Exploration: Map Your SOP' },
  { file: 'stage-3-translate.html',        title: 'Translate to a Fin Procedure' },
  { file: 'stage-4-connectors.html',       title: 'Data Connectors' },
  { file: 'stage-5-build.html',            title: 'Build the Procedure' },
  { file: 'stage-6-simulate.html',         title: 'Simulate & Stress Test' },
  { file: 'stage-7-internal-agent.html',   title: 'Advanced: Internal Agent' },
  { file: 'stage-8-own-use-cases.html',    title: 'Your Own Use Cases' },
];

function currentIndex() {
  const file = window.location.pathname.split('/').pop() || 'index.html';
  return STAGES.findIndex(s => s.file === file);
}

function renderNav(containerId) {
  const idx = currentIndex();
  const container = document.getElementById(containerId);
  if (!container) return;

  const prev = idx > 0 ? STAGES[idx - 1] : null;
  const next = idx < STAGES.length - 1 ? STAGES[idx + 1] : null;

  container.innerHTML = `
    ${prev
      ? `<a href="${prev.file}" class="nav-btn nav-btn--prev">← ${prev.title}</a>`
      : `<span class="nav-btn nav-btn--ghost"></span>`}
    ${next
      ? `<a href="${next.file}" class="nav-btn nav-btn--next">${next.title} →</a>`
      : `<span class="nav-btn nav-btn--ghost"></span>`}
  `;
}

function renderProgress(fillId) {
  const idx = currentIndex();
  if (idx < 1) return;
  const fill = document.getElementById(fillId);
  if (!fill) return;
  const pct = Math.round(((idx) / (STAGES.length - 1)) * 100);
  fill.style.width = pct + '%';
}

function renderStageIndicator(elemId) {
  const idx = currentIndex();
  if (idx < 1) return;
  const el = document.getElementById(elemId);
  if (!el) return;
  el.textContent = `Stage ${idx} of ${STAGES.length - 1}`;
}
```

- [ ] **Step 3: Create GitHub Pages deployment workflow**

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 4: Verify structure looks correct**

```bash
ls -R /Users/willroberts/src/amsterdam-procedures-workshop
```

Expected: `style.css`, `nav.js`, `.github/workflows/deploy.yml`, `docs/`

- [ ] **Step 5: Commit**

```bash
cd /Users/willroberts/src/amsterdam-procedures-workshop
git add style.css nav.js .github/
git commit -m "feat: add shared styles, navigation, and GitHub Pages workflow"
```

---

## Task 2: Index Page (Table of Contents)

**Files:**
- Create: `index.html`

- [ ] **Step 1: Create `index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fin Procedures Workshop — Amsterdam 2026</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header class="site-header">
    <span class="logo">Fin Procedures Workshop</span>
    <span class="stage-indicator">Amsterdam 2026</span>
  </header>

  <div class="container">
    <h1>Fin Procedures Workshop</h1>
    <p class="subtitle">A hands-on guide to building your first Fin Procedure — from standard operating procedure to live simulation.</p>

    <div class="callout callout--tip">
      <strong>How to use this guide</strong>
      Work through each stage in order. Some stages are exercises you'll complete away from your screen — others are step-by-step walkthroughs inside Intercom. Use the navigation at the bottom of each page to move forward.
    </div>

    <h2>Stages</h2>
    <ul class="toc">
      <li><a href="stage-1-welcome.html" class="toc-item">
        <span class="toc-num">1</span>
        <div>
          <div><strong>Welcome &amp; Overview</strong></div>
          <div class="toc-meta">What is a Fin Procedure? What are we building today?</div>
        </div>
        <span class="toc-badge badge--hands-on">~15 min</span>
      </a></li>

      <li><a href="stage-2-exploration.html" class="toc-item">
        <span class="toc-num">2</span>
        <div>
          <div><strong>Exploration: Map Your SOP</strong></div>
          <div class="toc-meta">Paper exercise — document your standard operating procedure before touching the product.</div>
        </div>
        <span class="toc-badge badge--explore">Offline exercise · ~30 min</span>
      </a></li>

      <li><a href="stage-3-translate.html" class="toc-item">
        <span class="toc-num">3</span>
        <div>
          <div><strong>Translate to a Fin Procedure</strong></div>
          <div class="toc-meta">How does your SOP map to Procedure steps? Anatomy of a Procedure.</div>
        </div>
        <span class="toc-badge badge--hands-on">~20 min</span>
      </a></li>

      <li><a href="stage-4-connectors.html" class="toc-item">
        <span class="toc-num">4</span>
        <div>
          <div><strong>Data Connectors</strong></div>
          <div class="toc-meta">Explore the pre-built connectors in your shared workspace.</div>
        </div>
        <span class="toc-badge badge--hands-on">~25 min</span>
      </a></li>

      <li><a href="stage-5-build.html" class="toc-item">
        <span class="toc-num">5</span>
        <div>
          <div><strong>Build the Procedure</strong></div>
          <div class="toc-meta">Step-by-step: create the procedure, wire up connectors, configure outcomes.</div>
        </div>
        <span class="toc-badge badge--hands-on">~45 min</span>
      </a></li>

      <li><a href="stage-6-simulate.html" class="toc-item">
        <span class="toc-num">6</span>
        <div>
          <div><strong>Simulate &amp; Stress Test</strong></div>
          <div class="toc-meta">Run three scenarios — happy path, ineligible order, order not found.</div>
        </div>
        <span class="toc-badge badge--hands-on">~30 min</span>
      </a></li>

      <li><a href="stage-7-internal-agent.html" class="toc-item">
        <span class="toc-num">7</span>
        <div>
          <div><strong>Advanced: Internal Agent</strong></div>
          <div class="toc-meta">How Procedures work with Internal Agent. Optional bonus stage.</div>
        </div>
        <span class="toc-badge badge--optional">Optional · ~20 min</span>
      </a></li>

      <li><a href="stage-8-own-use-cases.html" class="toc-item">
        <span class="toc-num">8</span>
        <div>
          <div><strong>Your Own Use Cases</strong></div>
          <div class="toc-meta">Switch to your own workspace and apply the process to a real SOP.</div>
        </div>
        <span class="toc-badge badge--open">Own workspace · ~30 min</span>
      </a></li>
    </ul>
  </div>

  <script src="nav.js"></script>
</body>
</html>
```

- [ ] **Step 2: Open in browser and verify TOC renders correctly**

```bash
open /Users/willroberts/src/amsterdam-procedures-workshop/index.html
```

Expected: Header with purple background, 8 stage cards with correct badges and timings.

- [ ] **Step 3: Commit**

```bash
cd /Users/willroberts/src/amsterdam-procedures-workshop
git add index.html
git commit -m "feat: add index page with stage table of contents"
```

---

## Task 3: Stage 1 — Welcome & Overview

**Files:**
- Create: `stage-1-welcome.html`

- [ ] **Step 1: Create `stage-1-welcome.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Stage 1: Welcome — Fin Procedures Workshop</title>
  <link rel="stylesheet" href="style.css">
</head>
<body class="stage--technical">
  <header class="site-header">
    <span class="logo">Fin Procedures Workshop</span>
    <span id="stage-indicator" class="stage-indicator"></span>
    <div class="progress"><div id="progress-fill" class="progress-fill"></div></div>
  </header>

  <div class="container">
    <h1>Welcome</h1>
    <p class="subtitle">What is a Fin Procedure, and what are we building today?</p>

    <h2>What is a Fin Procedure?</h2>
    <p>A <strong>Fin Procedure</strong> is a structured, multi-step workflow that Fin follows to resolve a specific type of customer request. Unlike Guidance — which tells Fin <em>what to say</em> — a Procedure tells Fin <em>what to do</em>: gather data, make decisions, take actions.</p>

    <p>Procedures are the right tool when:</p>
    <ul style="margin: 0 0 16px 20px;">
      <li>Fin needs to look up real-time data to answer the customer</li>
      <li>There are conditional decision points (if eligible → do X, else → do Y)</li>
      <li>Fin needs to take an action on the customer's behalf</li>
    </ul>

    <div class="callout callout--tip">
      <strong>Think of it this way</strong>
      A Guidance note is a brief for Fin. A Procedure is a runbook. Both matter — but they solve different problems.
    </div>

    <h2>What we're building today</h2>
    <p>We'll build a <strong>Refund Request Procedure</strong> from scratch. A customer messages in asking for a refund. Fin will:</p>

    <ol style="margin: 0 0 16px 24px; line-height: 2;">
      <li>Look up the customer's account</li>
      <li>Retrieve their recent orders</li>
      <li>Check refund eligibility for the relevant order</li>
      <li>Either process the refund or explain why it can't be done</li>
    </ol>

    <p>By the end of the day you'll have built this yourself — and have a framework for mapping any of your own SOPs into a Procedure.</p>

    <h2>What you'll need</h2>
    <table>
      <tr><th>What</th><th>Details</th></tr>
      <tr><td>Shared Intercom workspace</td><td>Login details provided by your facilitator</td></tr>
      <tr><td>This guide</td><td>Open on your laptop — follow along stage by stage</td></tr>
      <tr><td>Pen and paper</td><td>For the Stage 2 exercise</td></tr>
    </table>

    <div class="callout callout--check">
      <strong>Checkpoint</strong>
      Before moving on: make sure you can log in to the shared Intercom workspace. Your facilitator will share the credentials now.
    </div>

    <nav class="stage-nav" id="stage-nav"></nav>
  </div>

  <script src="nav.js"></script>
  <script>
    renderNav('stage-nav');
    renderProgress('progress-fill');
    renderStageIndicator('stage-indicator');
  </script>
</body>
</html>
```

- [ ] **Step 2: Open in browser and verify**

```bash
open /Users/willroberts/src/amsterdam-procedures-workshop/stage-1-welcome.html
```

Expected: Blue header with stage indicator, content renders correctly, prev/next nav at bottom (← Overview | Stage 2 →).

- [ ] **Step 3: Commit**

```bash
cd /Users/willroberts/src/amsterdam-procedures-workshop
git add stage-1-welcome.html
git commit -m "feat: add stage 1 welcome page"
```

---

## Task 4: Stage 2 — Exploration

**Files:**
- Create: `stage-2-exploration.html`

- [ ] **Step 1: Create `stage-2-exploration.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Stage 2: Exploration — Fin Procedures Workshop</title>
  <link rel="stylesheet" href="style.css">
</head>
<body class="stage--explore">
  <header class="site-header">
    <span class="logo">Fin Procedures Workshop</span>
    <span id="stage-indicator" class="stage-indicator"></span>
    <div class="progress"><div id="progress-fill" class="progress-fill"></div></div>
  </header>

  <div class="container">
    <h1>Map Your Standard Operating Procedure</h1>
    <p class="subtitle">Before we open Intercom, let's get your process on paper. This is the most important stage — everything else follows from it.</p>

    <div class="callout callout--warn">
      <strong>Step away from the screen</strong>
      This exercise works best on paper. Use the printed worksheet your facilitator has provided, or work through the questions below. Take ~20 minutes with your team.
    </div>

    <h2>Why this matters</h2>
    <p>Most Procedure failures aren't technical — they're caused by poorly defined processes. Before you can automate a workflow, you need to understand it clearly: what triggers it, what data is needed, what decisions are made, and what the outcomes are.</p>

    <p>Use the refund process you deal with today as your starting point. Think about a real conversation your team handles regularly.</p>

    <div class="worksheet">
      <h3>SOP Mapping Worksheet</h3>

      <div class="worksheet-field">
        <label>1. What customer message triggers this process?</label>
        <div class="hint">e.g. "I'd like a refund on my order", "Can I return this?"</div>
        <textarea placeholder="Write the typical message a customer sends..."></textarea>
      </div>

      <div class="worksheet-field">
        <label>2. What information does your agent need to gather?</label>
        <div class="hint">List each piece of data needed — order number, purchase date, reason, etc.</div>
        <textarea placeholder="1. &#10;2. &#10;3. "></textarea>
      </div>

      <div class="worksheet-field">
        <label>3. What decisions need to be made?</label>
        <div class="hint">What determines whether you process the refund or not? Are there rules?</div>
        <textarea placeholder="e.g. Is the order within the 30-day return window? Was the item damaged?"></textarea>
      </div>

      <div class="worksheet-field">
        <label>4. What are the possible outcomes?</label>
        <div class="hint">Walk through each branch — what happens in each case?</div>
        <textarea placeholder="If eligible: &#10;If not eligible: &#10;If order not found: "></textarea>
      </div>

      <div class="worksheet-field">
        <label>5. What action does the agent take in each case?</label>
        <div class="hint">What does the agent actually do — not just say? Process refund? Escalate? Send a link?</div>
        <textarea placeholder="In each outcome, what system action is taken?"></textarea>
      </div>
    </div>

    <h2>Now compare with today's use case</h2>
    <p>We'll build a Refund Request Procedure together. Here's how the shared use case answers these same questions:</p>

    <table>
      <tr><th>Question</th><th>Today's use case</th></tr>
      <tr><td>Trigger</td><td>"I'd like a refund on my order"</td></tr>
      <tr><td>Data needed</td><td>Customer email → Customer ID → Orders → Order eligibility</td></tr>
      <tr><td>Decision</td><td>Is the order eligible for a refund?</td></tr>
      <tr><td>Outcome A</td><td>Eligible → process refund, confirm to customer</td></tr>
      <tr><td>Outcome B</td><td>Not eligible → explain policy, offer escalation</td></tr>
      <tr><td>Outcome C</td><td>Order not found → ask customer to verify details</td></tr>
    </table>

    <div class="callout callout--check">
      <strong>Checkpoint</strong>
      Before moving on: you should have your SOP written out — even roughly. Keep it nearby. You'll refer back to it in Stage 3.
    </div>

    <nav class="stage-nav" id="stage-nav"></nav>
  </div>

  <script src="nav.js"></script>
  <script>
    renderNav('stage-nav');
    renderProgress('progress-fill');
    renderStageIndicator('stage-indicator');
  </script>
</body>
</html>
```

- [ ] **Step 2: Open in browser and verify**

```bash
open /Users/willroberts/src/amsterdam-procedures-workshop/stage-2-exploration.html
```

Expected: Amber/warm header, warm background, dashed-border worksheet with fillable textareas, comparison table at bottom.

- [ ] **Step 3: Commit**

```bash
cd /Users/willroberts/src/amsterdam-procedures-workshop
git add stage-2-exploration.html
git commit -m "feat: add stage 2 exploration page with SOP worksheet"
```

---

## Task 5: Stage 3 — Translate to a Fin Procedure

**Files:**
- Create: `stage-3-translate.html`

- [ ] **Step 1: Create `stage-3-translate.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Stage 3: Translate — Fin Procedures Workshop</title>
  <link rel="stylesheet" href="style.css">
</head>
<body class="stage--technical">
  <header class="site-header">
    <span class="logo">Fin Procedures Workshop</span>
    <span id="stage-indicator" class="stage-indicator"></span>
    <div class="progress"><div id="progress-fill" class="progress-fill"></div></div>
  </header>

  <div class="container">
    <h1>Translate to a Fin Procedure</h1>
    <p class="subtitle">Your SOP is the blueprint. Now let's see how it maps to Fin's Procedure structure.</p>

    <h2>Anatomy of a Fin Procedure</h2>
    <p>A Procedure in Intercom is made up of:</p>

    <table>
      <tr><th>Element</th><th>What it is</th><th>Maps to your SOP</th></tr>
      <tr><td><strong>Trigger</strong></td><td>The customer intent that starts the Procedure</td><td>The customer message that kicks off the process</td></tr>
      <tr><td><strong>Steps</strong></td><td>Actions Fin takes — each step calls a Data Connector or performs logic</td><td>Each piece of data you need to gather</td></tr>
      <tr><td><strong>Conditions</strong></td><td>If/else branches based on data returned</td><td>Your decision points</td></tr>
      <tr><td><strong>Outcomes</strong></td><td>What Fin says or does at the end of each branch</td><td>Your outcomes and agent actions</td></tr>
    </table>

    <h2>The refund use case mapped</h2>
    <p>Here's how today's Refund Request SOP translates directly into a Procedure:</p>

    <ol class="steps">
      <li>
        <div class="step-body">
          <p><strong>Trigger:</strong> Customer sends a refund-related message</p>
          <p>Fin recognises this intent and starts the Procedure automatically.</p>
        </div>
      </li>
      <li>
        <div class="step-body">
          <p><strong>Step 1 — Customer lookup:</strong> Fin calls the Customer Lookup connector</p>
          <p>Input: customer's email. Returns: <code>customer_id</code>, name.</p>
        </div>
      </li>
      <li>
        <div class="step-body">
          <p><strong>Step 2 — Order lookup:</strong> Fin calls the Order Lookup connector</p>
          <p>Input: <code>customer_id</code>. Returns: list of recent orders.</p>
        </div>
      </li>
      <li>
        <div class="step-body">
          <p><strong>Step 3 — Refund eligibility:</strong> Fin calls the Eligibility connector</p>
          <p>Input: <code>order_id</code>. Returns: <code>eligible: true/false</code> and a reason.</p>
        </div>
      </li>
      <li>
        <div class="step-body">
          <p><strong>Condition:</strong> Is <code>eligible</code> true?</p>
          <p><strong>If yes →</strong> Step 4 (process refund). <strong>If no →</strong> explain policy and offer escalation.</p>
        </div>
      </li>
      <li>
        <div class="step-body">
          <p><strong>Step 4 — Process refund:</strong> Fin calls the Process Refund connector</p>
          <p>Input: <code>order_id</code>. Returns: <code>confirmation_id</code>. Fin confirms to the customer.</p>
        </div>
      </li>
    </ol>

    <div class="callout callout--tip">
      <strong>Data flows forward</strong>
      Notice how each step passes data to the next. The output of Customer Lookup (<code>customer_id</code>) becomes the input for Order Lookup. This chaining is what makes Procedures powerful.
    </div>

    <div class="callout callout--check">
      <strong>Checkpoint</strong>
      Can you see where your own SOP maps to these elements? In Stage 8 you'll apply this same pattern to your own use case.
    </div>

    <nav class="stage-nav" id="stage-nav"></nav>
  </div>

  <script src="nav.js"></script>
  <script>
    renderNav('stage-nav');
    renderProgress('progress-fill');
    renderStageIndicator('stage-indicator');
  </script>
</body>
</html>
```

- [ ] **Step 2: Open in browser and verify**

```bash
open /Users/willroberts/src/amsterdam-procedures-workshop/stage-3-translate.html
```

Expected: Blue/technical styling, numbered steps with purple circles, table maps SOP to Procedure elements.

- [ ] **Step 3: Commit**

```bash
cd /Users/willroberts/src/amsterdam-procedures-workshop
git add stage-3-translate.html
git commit -m "feat: add stage 3 translate page"
```

---

## Task 6: Stage 4 — Data Connectors

**Files:**
- Create: `stage-4-connectors.html`

- [ ] **Step 1: Create `stage-4-connectors.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Stage 4: Data Connectors — Fin Procedures Workshop</title>
  <link rel="stylesheet" href="style.css">
</head>
<body class="stage--technical">
  <header class="site-header">
    <span class="logo">Fin Procedures Workshop</span>
    <span id="stage-indicator" class="stage-indicator"></span>
    <div class="progress"><div id="progress-fill" class="progress-fill"></div></div>
  </header>

  <div class="container">
    <h1>Data Connectors</h1>
    <p class="subtitle">Four connectors are already set up in your shared workspace. Let's explore what each one does before we use them.</p>

    <div class="callout callout--tip">
      <strong>What is a Data Connector?</strong>
      A Data Connector is how Fin calls an external system during a Procedure. It defines the API endpoint to call, what data to send, and what data to extract from the response. Think of it as a pre-wired integration step.
    </div>

    <h2>Finding the connectors in your workspace</h2>
    <ol class="steps">
      <li><div class="step-body"><p>In your shared Intercom workspace, go to <strong>AI &amp; Automation → Fin AI Agent → Procedures</strong>.</p></div></li>
      <li><div class="step-body"><p>Click <strong>Data Connectors</strong> in the left navigation.</p></div></li>
      <li><div class="step-body"><p>You should see four connectors listed. Open each one to familiarise yourself with its configuration.</p></div></li>
    </ol>

    <h2>The four connectors</h2>

    <h3>1. Customer Lookup</h3>
    <p>Retrieves a customer record using their email address.</p>
    <table>
      <tr><th>Field</th><th>Value</th></tr>
      <tr><td>Method</td><td><code>GET</code></td></tr>
      <tr><td>Input</td><td><code>email</code> (from conversation context)</td></tr>
      <tr><td>Returns</td><td><code>customer_id</code>, <code>name</code>, <code>email</code></td></tr>
    </table>
    <p>Example response:</p>
    <pre><code>{
  "customer_id": "cust_8821",
  "name": "Alex Johnson",
  "email": "alex@example.com"
}</code></pre>

    <h3>2. Order Lookup</h3>
    <p>Retrieves the customer's recent orders.</p>
    <table>
      <tr><th>Field</th><th>Value</th></tr>
      <tr><td>Method</td><td><code>GET</code></td></tr>
      <tr><td>Input</td><td><code>customer_id</code> (from Customer Lookup)</td></tr>
      <tr><td>Returns</td><td>Array of orders: <code>order_id</code>, <code>item</code>, <code>amount</code>, <code>date</code></td></tr>
    </table>
    <p>Example response:</p>
    <pre><code>{
  "orders": [
    { "order_id": "ord_441", "item": "Blue Jacket", "amount": 89.99, "date": "2026-03-28" },
    { "order_id": "ord_398", "item": "Grey Hoodie", "amount": 54.00, "date": "2026-02-14" }
  ]
}</code></pre>

    <h3>3. Refund Eligibility</h3>
    <p>Checks whether a specific order is eligible for a refund.</p>
    <table>
      <tr><th>Field</th><th>Value</th></tr>
      <tr><td>Method</td><td><code>GET</code></td></tr>
      <tr><td>Input</td><td><code>order_id</code> (selected from Order Lookup)</td></tr>
      <tr><td>Returns</td><td><code>eligible</code> (boolean), <code>reason</code></td></tr>
    </table>
    <p>Example responses:</p>
    <pre><code>// Eligible
{ "eligible": true, "reason": "Within 30-day return window" }

// Not eligible
{ "eligible": false, "reason": "Outside 30-day return window" }</code></pre>

    <h3>4. Process Refund</h3>
    <p>Submits the refund and returns a confirmation.</p>
    <table>
      <tr><th>Field</th><th>Value</th></tr>
      <tr><td>Method</td><td><code>POST</code></td></tr>
      <tr><td>Input</td><td><code>order_id</code></td></tr>
      <tr><td>Returns</td><td><code>success</code> (boolean), <code>confirmation_id</code></td></tr>
    </table>
    <p>Example response:</p>
    <pre><code>{ "success": true, "confirmation_id": "ref_7742" }</code></pre>

    <div class="callout callout--warn">
      <strong>Mock endpoints</strong>
      These connectors call mock API endpoints — no real transactions take place. They're pre-configured to return realistic sample data so you can focus on building the Procedure, not on API setup.
    </div>

    <div class="callout callout--check">
      <strong>Checkpoint</strong>
      Before moving on: open all four connectors in your workspace and confirm they're listed. You don't need to edit anything — just get familiar with the structure.
    </div>

    <nav class="stage-nav" id="stage-nav"></nav>
  </div>

  <script src="nav.js"></script>
  <script>
    renderNav('stage-nav');
    renderProgress('progress-fill');
    renderStageIndicator('stage-indicator');
  </script>
</body>
</html>
```

- [ ] **Step 2: Open in browser and verify**

```bash
open /Users/willroberts/src/amsterdam-procedures-workshop/stage-4-connectors.html
```

Expected: 4 connector sections with tables and JSON code blocks, mock endpoints callout.

- [ ] **Step 3: Commit**

```bash
cd /Users/willroberts/src/amsterdam-procedures-workshop
git add stage-4-connectors.html
git commit -m "feat: add stage 4 data connectors page"
```

---

## Task 7: Stage 5 — Build the Procedure

**Files:**
- Create: `stage-5-build.html`

- [ ] **Step 1: Create `stage-5-build.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Stage 5: Build the Procedure — Fin Procedures Workshop</title>
  <link rel="stylesheet" href="style.css">
</head>
<body class="stage--technical">
  <header class="site-header">
    <span class="logo">Fin Procedures Workshop</span>
    <span id="stage-indicator" class="stage-indicator"></span>
    <div class="progress"><div id="progress-fill" class="progress-fill"></div></div>
  </header>

  <div class="container">
    <h1>Build the Procedure</h1>
    <p class="subtitle">Time to build. Follow each step carefully — by the end you'll have a working Refund Request Procedure.</p>

    <div class="callout callout--tip">
      <strong>Work in your shared workspace</strong>
      Make sure you're logged in to the shared Intercom workspace. You'll each be building your own copy of the Procedure.
    </div>

    <h2>Part 1: Create the Procedure</h2>
    <ol class="steps">
      <li><div class="step-body">
        <p>Navigate to <strong>AI &amp; Automation → Fin AI Agent → Procedures</strong>.</p>
      </div></li>
      <li><div class="step-body">
        <p>Click <strong>New Procedure</strong>.</p>
      </div></li>
      <li><div class="step-body">
        <p>Give it a name: <strong>Refund Request</strong>.</p>
      </div></li>
      <li><div class="step-body">
        <p>In the <strong>Trigger</strong> field, describe when Fin should run this Procedure:</p>
        <p><em>"When a customer asks for a refund or wants to return an item."</em></p>
      </div></li>
    </ol>

    <h2>Part 2: Add the Data Connector steps</h2>
    <ol class="steps">
      <li><div class="step-body">
        <p>Click <strong>Add step → Call a Data Connector</strong>.</p>
        <p>Select <strong>Customer Lookup</strong>. Map the input: set <code>email</code> to the customer's conversation email.</p>
      </div></li>
      <li><div class="step-body">
        <p>Add a second step: <strong>Call a Data Connector → Order Lookup</strong>.</p>
        <p>Map the input: set <code>customer_id</code> to the output of the previous step (<code>customer_id</code>).</p>
      </div></li>
      <li><div class="step-body">
        <p>Add a third step: <strong>Call a Data Connector → Refund Eligibility</strong>.</p>
        <p>Map the input: set <code>order_id</code> to the most recent order from the Order Lookup results.</p>
        <div class="callout callout--tip">
          <strong>Tip</strong>
          If the customer has multiple orders, Fin will use the most recent one by default. You can add a clarifying question step before this if you want the customer to confirm which order.
        </div>
      </div></li>
    </ol>

    <h2>Part 3: Add the eligibility condition</h2>
    <ol class="steps">
      <li><div class="step-body">
        <p>After the Refund Eligibility step, click <strong>Add step → Add condition</strong>.</p>
      </div></li>
      <li><div class="step-body">
        <p>Set the condition: <strong>If <code>eligible</code> is <code>true</code></strong>.</p>
      </div></li>
      <li><div class="step-body">
        <p>In the <strong>Yes</strong> branch: add a step → <strong>Call a Data Connector → Process Refund</strong>. Map <code>order_id</code> from the Order Lookup output.</p>
      </div></li>
      <li><div class="step-body">
        <p>After the Process Refund step, add a <strong>Send message</strong> step:</p>
        <p><em>"I've processed your refund for {{order_id}}. Your confirmation number is {{confirmation_id}}. You should see the refund within 3–5 business days."</em></p>
      </div></li>
      <li><div class="step-body">
        <p>In the <strong>No</strong> branch: add a <strong>Send message</strong> step:</p>
        <p><em>"Unfortunately, your order isn't eligible for a refund. {{reason}}. If you think this is a mistake, I can connect you with our support team."</em></p>
      </div></li>
    </ol>

    <h2>Part 4: Publish</h2>
    <ol class="steps">
      <li><div class="step-body"><p>Review the full Procedure flow — make sure all steps are connected and inputs are mapped.</p></div></li>
      <li><div class="step-body"><p>Click <strong>Save</strong>, then <strong>Enable Procedure</strong>.</p></div></li>
    </ol>

    <div class="callout callout--check">
      <strong>Checkpoint</strong>
      Your Procedure is now live in the shared workspace. Before moving to simulation, check that all four steps appear in the flow and the condition has both a Yes and No branch.
    </div>

    <nav class="stage-nav" id="stage-nav"></nav>
  </div>

  <script src="nav.js"></script>
  <script>
    renderNav('stage-nav');
    renderProgress('progress-fill');
    renderStageIndicator('stage-indicator');
  </script>
</body>
</html>
```

- [ ] **Step 2: Open in browser and verify**

```bash
open /Users/willroberts/src/amsterdam-procedures-workshop/stage-5-build.html
```

Expected: 4 numbered parts with clear step-by-step instructions, tip callout for multi-order scenario, checkpoint at end.

- [ ] **Step 3: Commit**

```bash
cd /Users/willroberts/src/amsterdam-procedures-workshop
git add stage-5-build.html
git commit -m "feat: add stage 5 build procedure page"
```

---

## Task 8: Stage 6 — Simulate & Stress Test

**Files:**
- Create: `stage-6-simulate.html`

- [ ] **Step 1: Create `stage-6-simulate.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Stage 6: Simulate — Fin Procedures Workshop</title>
  <link rel="stylesheet" href="style.css">
</head>
<body class="stage--technical">
  <header class="site-header">
    <span class="logo">Fin Procedures Workshop</span>
    <span id="stage-indicator" class="stage-indicator"></span>
    <div class="progress"><div id="progress-fill" class="progress-fill"></div></div>
  </header>

  <div class="container">
    <h1>Simulate &amp; Stress Test</h1>
    <p class="subtitle">A Procedure isn't ready until it's been tested. Run these three scenarios to make sure yours handles every case correctly.</p>

    <div class="callout callout--tip">
      <strong>How to run a simulation</strong>
      In your Intercom workspace, open your Refund Request Procedure and click <strong>Simulate</strong>. You can provide a test customer and message, then watch Fin work through the steps.
    </div>

    <h2>Scenario 1: Happy Path — Eligible Refund</h2>
    <p>The most common case: customer has an order within the return window.</p>

    <table>
      <tr><th>Input</th><th>Value</th></tr>
      <tr><td>Customer message</td><td>"Hi, I'd like to return my recent order and get a refund."</td></tr>
      <tr><td>Expected connector calls</td><td>Customer Lookup → Order Lookup → Refund Eligibility → Process Refund</td></tr>
      <tr><td>Expected eligibility response</td><td><code>eligible: true</code></td></tr>
      <tr><td>Expected Fin response</td><td>Refund confirmed with confirmation number</td></tr>
    </table>

    <div class="callout callout--check">
      <strong>Pass criteria</strong>
      Fin calls all four connectors in order, processes the refund, and provides a confirmation number.
    </div>

    <h2>Scenario 2: Ineligible Order</h2>
    <p>Customer's order is outside the return window — Fin should explain and offer escalation.</p>

    <table>
      <tr><th>Input</th><th>Value</th></tr>
      <tr><td>Customer message</td><td>"I bought something a couple of months ago — can I still get a refund?"</td></tr>
      <tr><td>Expected connector calls</td><td>Customer Lookup → Order Lookup → Refund Eligibility (no Process Refund)</td></tr>
      <tr><td>Expected eligibility response</td><td><code>eligible: false</code>, reason returned</td></tr>
      <tr><td>Expected Fin response</td><td>Explains ineligibility, offers to escalate to support team</td></tr>
    </table>

    <div class="callout callout--check">
      <strong>Pass criteria</strong>
      Fin takes the No branch, does NOT call Process Refund, and communicates the reason clearly.
    </div>

    <h2>Scenario 3: Order Not Found</h2>
    <p>Edge case — the customer's email returns no orders, or a wrong order ID is returned.</p>

    <table>
      <tr><th>Input</th><th>Value</th></tr>
      <tr><td>Customer message</td><td>"I want a refund but I can't find my order number."</td></tr>
      <tr><td>Expected behaviour</td><td>Fin asks customer to verify their email or provide order number</td></tr>
      <tr><td>Expected Fin response</td><td>Asks for clarifying information, does not proceed to eligibility check</td></tr>
    </table>

    <div class="callout callout--warn">
      <strong>If this scenario fails</strong>
      Go back to your Procedure and add a condition after Order Lookup: <em>If orders list is empty → ask customer to confirm their email address or order number.</em>
    </div>

    <div class="callout callout--check">
      <strong>Checkpoint</strong>
      All three scenarios should pass before moving on. If any fail, revisit the relevant step in Stage 5 and adjust. Simulation is where you find the gaps — this is the process working as intended.
    </div>

    <nav class="stage-nav" id="stage-nav"></nav>
  </div>

  <script src="nav.js"></script>
  <script>
    renderNav('stage-nav');
    renderProgress('progress-fill');
    renderStageIndicator('stage-indicator');
  </script>
</body>
</html>
```

- [ ] **Step 2: Open in browser and verify**

```bash
open /Users/willroberts/src/amsterdam-procedures-workshop/stage-6-simulate.html
```

Expected: Three clearly labelled simulation scenarios with input tables, pass criteria checkpoints, and a warning for the edge case.

- [ ] **Step 3: Commit**

```bash
cd /Users/willroberts/src/amsterdam-procedures-workshop
git add stage-6-simulate.html
git commit -m "feat: add stage 6 simulate and stress test page"
```

---

## Task 9: Stage 7 — Internal Agent (Optional)

**Files:**
- Create: `stage-7-internal-agent.html`

- [ ] **Step 1: Create `stage-7-internal-agent.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Stage 7: Internal Agent — Fin Procedures Workshop</title>
  <link rel="stylesheet" href="style.css">
</head>
<body class="stage--technical">
  <header class="site-header">
    <span class="logo">Fin Procedures Workshop</span>
    <span id="stage-indicator" class="stage-indicator"></span>
    <div class="progress"><div id="progress-fill" class="progress-fill"></div></div>
  </header>

  <div class="container">
    <div class="callout callout--tip">
      <strong>Optional stage</strong>
      This stage is a bonus — only proceed here if your group has completed Stages 1–6 and has time remaining. Your facilitator will let you know.
    </div>

    <h1>Advanced: Internal Agent</h1>
    <p class="subtitle">How do Procedures change when Fin is working as an internal agent — helping your support team rather than your customers?</p>

    <h2>What is Internal Agent?</h2>
    <p>Internal Agent is Fin working inside your team's inbox, assisting human agents rather than talking directly to customers. Instead of resolving conversations autonomously, Fin surfaces relevant information, suggests responses, and executes actions on behalf of the agent.</p>

    <h2>How Procedures work with Internal Agent</h2>
    <p>The same Procedure you built today can be repurposed for Internal Agent with a few adjustments:</p>

    <table>
      <tr><th></th><th>Customer-facing Procedure</th><th>Internal Agent Procedure</th></tr>
      <tr><td><strong>Trigger</strong></td><td>Customer sends a message</td><td>Agent opens a conversation or requests a lookup</td></tr>
      <tr><td><strong>Data connectors</strong></td><td>Same connectors, same data</td><td>Same connectors, same data</td></tr>
      <tr><td><strong>Output</strong></td><td>Fin replies directly to customer</td><td>Fin surfaces data and a suggested response to the agent</td></tr>
      <tr><td><strong>Actions</strong></td><td>Fin processes refund autonomously</td><td>Agent reviews and approves before action is taken</td></tr>
    </table>

    <h2>When to use Internal Agent vs. autonomous Procedures</h2>
    <p>Use <strong>autonomous Procedures</strong> when:</p>
    <ul style="margin: 0 0 16px 20px;">
      <li>The process is well-defined and low-risk</li>
      <li>The outcome is reversible or confirmable</li>
      <li>Volume is high enough to justify full automation</li>
    </ul>

    <p>Use <strong>Internal Agent</strong> when:</p>
    <ul style="margin: 0 0 16px 20px;">
      <li>Human judgement is still needed before taking action</li>
      <li>The process handles sensitive or high-value cases</li>
      <li>You want to build team confidence before going fully autonomous</li>
    </ul>

    <div class="callout callout--tip">
      <strong>A useful starting point</strong>
      Many teams start with Internal Agent — Fin assists agents on refunds — before moving to fully autonomous Procedures once they're confident in the data and outcomes. It's a lower-risk way to get value from your Procedures earlier.
    </div>

    <nav class="stage-nav" id="stage-nav"></nav>
  </div>

  <script src="nav.js"></script>
  <script>
    renderNav('stage-nav');
    renderProgress('progress-fill');
    renderStageIndicator('stage-indicator');
  </script>
</body>
</html>
```

- [ ] **Step 2: Open in browser and verify**

```bash
open /Users/willroberts/src/amsterdam-procedures-workshop/stage-7-internal-agent.html
```

Expected: Optional callout at top, comparison table, and guidance on when to use each mode.

- [ ] **Step 3: Commit**

```bash
cd /Users/willroberts/src/amsterdam-procedures-workshop
git add stage-7-internal-agent.html
git commit -m "feat: add stage 7 internal agent optional page"
```

---

## Task 10: Stage 8 — Own Use Cases

**Files:**
- Create: `stage-8-own-use-cases.html`

- [ ] **Step 1: Create `stage-8-own-use-cases.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Stage 8: Your Own Use Cases — Fin Procedures Workshop</title>
  <link rel="stylesheet" href="style.css">
</head>
<body class="stage--open">
  <header class="site-header">
    <span class="logo">Fin Procedures Workshop</span>
    <span id="stage-indicator" class="stage-indicator"></span>
    <div class="progress"><div id="progress-fill" class="progress-fill"></div></div>
  </header>

  <div class="container">
    <h1>Your Own Use Cases</h1>
    <p class="subtitle">You've built the refund Procedure. Now apply the same process to a real workflow from your own business.</p>

    <div class="callout callout--tip">
      <strong>Switch workspaces</strong>
      For this stage, log in to your own Intercom workspace. Your facilitator will help if you need access.
    </div>

    <h2>The process you've learned</h2>
    <p>Every Procedure you build will follow the same pattern:</p>
    <ol style="margin: 0 0 24px 24px; line-height: 2.2;">
      <li>Map your SOP on paper (trigger, data, decisions, outcomes)</li>
      <li>Identify the data connectors you need</li>
      <li>Build the Procedure step by step</li>
      <li>Add conditions for each decision point</li>
      <li>Simulate all scenarios before going live</li>
    </ol>

    <h2>Choosing your use case</h2>
    <p>Pick a process that:</p>
    <ul style="margin: 0 0 16px 20px;">
      <li>Your team handles frequently</li>
      <li>Requires looking up data from an external system</li>
      <li>Has a clear trigger and defined outcomes</li>
      <li>Doesn't require complex human judgement</li>
    </ul>

    <p>Good candidates from common support workflows:</p>
    <table>
      <tr><th>Use case</th><th>Likely connectors</th><th>Complexity</th></tr>
      <tr><td>Order status (WISMO)</td><td>Customer lookup, Order lookup, Shipping status</td><td>Low</td></tr>
      <tr><td>Subscription cancellation</td><td>Customer lookup, Subscription lookup, Cancel subscription</td><td>Medium</td></tr>
      <tr><td>Password reset</td><td>Customer lookup, Trigger reset email</td><td>Low</td></tr>
      <tr><td>Invoice request</td><td>Customer lookup, Billing lookup, Send invoice</td><td>Low</td></tr>
      <tr><td>Account upgrade/downgrade</td><td>Customer lookup, Plan lookup, Update plan</td><td>Medium</td></tr>
    </table>

    <h2>Work time</h2>
    <p>Use the next ~30 minutes to:</p>
    <ol class="steps">
      <li><div class="step-body"><p>Go back to your Stage 2 worksheet. Apply the same questions to your chosen use case.</p></div></li>
      <li><div class="step-body"><p>Identify which data connectors you'd need to build (or check if any already exist in your workspace).</p></div></li>
      <li><div class="step-body"><p>Start building the Procedure in your own workspace — get as far as you can.</p></div></li>
    </ol>

    <div class="callout callout--tip">
      <strong>You don't need to finish today</strong>
      The goal is to start the process and get unstuck at the point where most people stop: mapping the SOP. Even a partial Procedure with placeholder connectors is valuable progress.
    </div>

    <div class="callout callout--check">
      <strong>Wrapping up</strong>
      We'll come back together to share what everyone built and discuss next steps. Your facilitator will let you know when to pause.
    </div>

    <nav class="stage-nav" id="stage-nav"></nav>
  </div>

  <script src="nav.js"></script>
  <script>
    renderNav('stage-nav');
    renderProgress('progress-fill');
    renderStageIndicator('stage-indicator');
  </script>
</body>
</html>
```

- [ ] **Step 2: Open in browser and verify**

```bash
open /Users/willroberts/src/amsterdam-procedures-workshop/stage-8-own-use-cases.html
```

Expected: Neutral grey styling, use case suggestion table, open-ended work time section, no next button (final stage).

- [ ] **Step 3: Commit**

```bash
cd /Users/willroberts/src/amsterdam-procedures-workshop
git add stage-8-own-use-cases.html
git commit -m "feat: add stage 8 own use cases page"
```

---

## Task 11: Printable SOP Template

**Files:**
- Create: `assets/sop-template.html`

- [ ] **Step 1: Create `assets/sop-template.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SOP Mapping Worksheet — Fin Procedures Workshop</title>
  <style>
    @media print {
      body { margin: 0; }
      .no-print { display: none; }
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      max-width: 720px;
      margin: 32px auto;
      padding: 0 24px;
      color: #1a1a1a;
    }

    h1 { font-size: 1.4rem; margin-bottom: 4px; }
    .subtitle { color: #666; font-size: 14px; margin-bottom: 32px; }

    .field { margin-bottom: 28px; }
    .field label { display: block; font-weight: 600; font-size: 14px; margin-bottom: 4px; }
    .field .hint { font-size: 12px; color: #888; margin-bottom: 6px; }

    .lines { border-bottom: 1px solid #ccc; margin-bottom: 8px; padding-bottom: 24px; }
    .lines + .lines { margin-top: -8px; }

    .print-btn {
      display: inline-block;
      margin-bottom: 24px;
      padding: 10px 20px;
      background: #6b30b0;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="no-print">
    <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
  </div>

  <h1>SOP Mapping Worksheet</h1>
  <p class="subtitle">Fin Procedures Workshop · Amsterdam 2026 · Use one sheet per use case</p>

  <div class="field">
    <label>Use case name</label>
    <div class="lines" style="padding-bottom: 8px;"></div>
  </div>

  <div class="field">
    <label>1. What customer message triggers this process?</label>
    <div class="hint">The typical message a customer sends that starts this workflow.</div>
    <div class="lines"></div>
    <div class="lines"></div>
  </div>

  <div class="field">
    <label>2. What information does your agent need to gather?</label>
    <div class="hint">List each piece of data — order number, customer ID, account status, etc.</div>
    <div class="lines"></div>
    <div class="lines"></div>
    <div class="lines"></div>
  </div>

  <div class="field">
    <label>3. What decisions need to be made?</label>
    <div class="hint">What determines the outcome? Are there eligibility rules or conditions?</div>
    <div class="lines"></div>
    <div class="lines"></div>
  </div>

  <div class="field">
    <label>4. What are the possible outcomes?</label>
    <div class="hint">Walk through each branch.</div>
    <p style="font-size: 13px; margin: 4px 0 2px; font-weight: 500;">If [condition is met]:</p>
    <div class="lines"></div>
    <p style="font-size: 13px; margin: 8px 0 2px; font-weight: 500;">If [condition is not met]:</p>
    <div class="lines"></div>
    <p style="font-size: 13px; margin: 8px 0 2px; font-weight: 500;">Edge case (e.g. data not found):</p>
    <div class="lines"></div>
  </div>

  <div class="field">
    <label>5. What action does the agent take in each case?</label>
    <div class="hint">What system action is taken — not just what is said.</div>
    <div class="lines"></div>
    <div class="lines"></div>
  </div>

  <div class="field">
    <label>Data connectors needed</label>
    <div class="hint">List each API/system that needs to be called, and what data it returns.</div>
    <div class="lines"></div>
    <div class="lines"></div>
    <div class="lines"></div>
  </div>
</body>
</html>
```

- [ ] **Step 2: Open and verify print layout**

```bash
open /Users/willroberts/src/amsterdam-procedures-workshop/assets/sop-template.html
```

Expected: Clean print-ready layout, "Print / Save as PDF" button visible, lines for each field, button hidden when printed.

- [ ] **Step 3: Commit**

```bash
cd /Users/willroberts/src/amsterdam-procedures-workshop
git add assets/
git commit -m "feat: add printable SOP mapping worksheet"
```

---

## Task 12: End-to-End Verification

- [ ] **Step 1: Open index and navigate through all stages**

```bash
open /Users/willroberts/src/amsterdam-procedures-workshop/index.html
```

Click through every stage in order. Verify:
- Prev/next buttons work correctly on every page
- Stage indicator shows correct stage number (e.g. "Stage 1 of 8")
- Progress bar advances with each stage
- Stage 2 shows warm/amber styling
- Stages 1, 3–7 show blue/technical styling
- Stage 8 shows neutral grey styling
- Final stage (8) has no "next" button

- [ ] **Step 2: Verify print template**

```bash
open /Users/willroberts/src/amsterdam-procedures-workshop/assets/sop-template.html
```

Use browser print preview (Cmd+P) and confirm layout is clean on A4/letter.

- [ ] **Step 3: Commit any fixes, then push to GitHub**

Create a new repo under the `intercom` GitHub org (or your personal account for now), set the default branch to `main`, and push:

```bash
cd /Users/willroberts/src/amsterdam-procedures-workshop
git remote add origin https://github.com/<org>/amsterdam-procedures-workshop.git
git push -u origin main
```

- [ ] **Step 4: Enable GitHub Pages**

In the repo Settings → Pages, set source to **GitHub Actions**. The deploy workflow will trigger on the next push.

- [ ] **Step 5: Verify live URL**

Once deployed, open `https://<org>.github.io/amsterdam-procedures-workshop` and confirm all pages load correctly.
