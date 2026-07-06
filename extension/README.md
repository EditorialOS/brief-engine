# Brief Engine — Editorial OS

> Structured briefs that power every downstream workflow.

A Chrome extension that turns brief-writing into a structured, repeatable input layer. Fill in a core brief, toggle on the modules you need, and export a portable JSON brief that any tool, teammate, or AI workflow can consume.

**Fully client-side.** No API calls, no network requests, no accounts, no data collection. Your draft autosaves to local browser storage on your device and nowhere else.

## Why

Most briefs are prose documents that every downstream tool has to re-interpret. Brief Engine treats the brief as structured data from the start: one canonical schema, readable by humans in the Brief tab, consumable by machines as JSON. Write it once; everything downstream inherits it.

## Features

- **Core brief schema** — project, objectives, KPI, audience and awareness level, the single key message, proof points, and constraints (timeline, channels, tone, must-include / must-avoid)
- **Modular depth** — toggle on the Marketing module for planning context, audience depth (jobs-to-be-done, pain points, objections, motivators), channel strategy, and brand/market positioning. The module registry is designed for additional tracks to plug in.
- **Two output views** — a readable brief and clean JSON, side by side as you type
- **Portable output** — copy the brief as text, copy the JSON, or download a timestamped `.json` file
- **Draft autosave** — the popup can close and reopen without losing work; "New brief" clears it

## Installation

**From the Chrome Web Store:** (link once published)

**Developer mode:**
1. Download or clone this folder
2. Open `chrome://extensions/`
3. Enable Developer mode (top right)
4. Click "Load unpacked" and select this folder

## Architecture notes

Single-file vanilla JS, no framework, no build step. All UI is rendered from one state object; every field binds through a `data-path` attribute to a nested schema path, so adding a field is one line of schema plus one renderer call. Modules register in `MODULES` and `MODULE_RENDERERS` — a new track (editorial, design, product) is a schema key, a registry entry, and a renderer. MV3 CSP-compliant: no inline handlers anywhere.

## Privacy

No data leaves your device. See [PRIVACY.md](../PRIVACY.md).

---

## Chrome Web Store listing copy

**Name:** Brief Engine - Editorial OS

**Short description (≤132 chars):**
Build structured campaign briefs — readable and as clean JSON. Runs entirely on your device. No accounts, no data collection.

**Detailed description:**

Brief Engine turns brief-writing into a structured, repeatable process.

Fill in one canonical brief — objectives, audience, key message, proof points, constraints — and toggle on deeper modules when the work calls for them. The Marketing module adds funnel stage, jobs-to-be-done, objections, channel strategy, and positioning.

As you type, Brief Engine renders two live views: a readable brief for humans and clean JSON for machines. Copy either, or download the JSON to hand to any tool, teammate, or AI workflow.

WHY STRUCTURED BRIEFS
• One source of truth every downstream asset inherits
• No re-interpreting prose — the schema is the contract
• Portable: JSON works everywhere your work does

PRIVACY
• 100% client-side — no network requests, ever
• No accounts, no analytics, no data collection
• Drafts autosave to local storage on your device only

Part of Editorial OS: systems for content and communications teams.

**Category:** Productivity
