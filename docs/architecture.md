# Architecture — Brief Engine

## Overview

Brief Engine is a Chrome extension (Manifest V3) with a popup UI, fully client-side. It has three layers: a **front-end surface**, an **AI/model layer**, and a **prompt layer** that binds the brand system to user input.

```
┌─────────────────────────────────────────────┐
│  Front-end surface (Chrome extension  with a popup UI, fully client-side)   │
│  • collects user input                        │
│  • stores settings locally (chrome.storage)   │
└───────────────┬───────────────────────────────┘
                │  composes
                ▼
┌─────────────────────────────────────────────┐
│  Prompt layer (the AI skill)                 │
│  • design-system.md rules + ai-skills/*.md    │
│  • user input + locked sections               │
│  • assembles a structured instruction set     │
└───────────────┬───────────────────────────────┘
                │  request (user's own API key)
                ▼
┌─────────────────────────────────────────────┐
│  AI/model layer                              │
│  • Client-side structuring with optional Anthropic Claude assist (bring-your-own API key)
│  • called directly from the browser           │
└─────────────────────────────────────────────┘
```

## 1. Front-end surface

- Built on Chrome **Manifest V3**.
- A popup UI provides the workspace.
- Settings, brand config, and the API key are persisted with `chrome.storage` — local only.

## 2. Prompt layer (the AI skill)

This is the design-critical layer. It:

- Loads the brand rules from the design system as a reference framework.
- Merges them with the user's input and any locked content.
- Produces a **structured instruction set** with explicit constraints, format specs, and examples — see [`../ai-skills/brief-structuring-skill.md`](../ai-skills/brief-structuring-skill.md).
- Because the rules are markdown, they are edited without touching code.

## 3. AI/model layer

- Client-side structuring with optional Anthropic Claude assist (bring-your-own API key).
- The request goes **directly from the browser** to `api.anthropic.com` using the user's own key — there is no intermediary server.


## Data flow & privacy

1. User enters input in the extension.
2. The prompt layer assembles the instruction set locally.
3. A single authenticated request goes to the model provider.
4. The response is rendered in the UI.

No data touches any server operated by this project — because there isn't one. See [`../PRIVACY.md`](../PRIVACY.md).

## Why this shape

The architecture is deliberately thin so the **design system and the AI skill** — not the plumbing — are the substance. It's a demonstration that a well-structured markdown reference framework plus a small, honest surface is enough to make on-brand production self-serve.
