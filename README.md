# Brief Engine

![version](https://img.shields.io/badge/version-1.0.0-blue)
![status](https://img.shields.io/badge/status-portfolio--ready-brightgreen)
![type](https://img.shields.io/badge/type-AI%20skill-8A2BE2)
![design tool](https://img.shields.io/badge/design-brand%20system-ff69b4)
![platform](https://img.shields.io/badge/platform-Chrome%20MV3-orange)
![license](https://img.shields.io/badge/license-MIT-lightgrey)

> **Turn scattered inputs into a structured, on-brand creative brief — every time.**

Brief Engine turns brief-writing into a structured, repeatable system. A modular schema (owned by the design team as markdown) captures every field a great brief needs; the AI skill helps a requester turn rough notes into a complete, on-brand brief and exports clean JSON that any downstream tool or workflow can consume. The template is the brand's definition of 'a good brief,' made self-serve.

**The design/brand problem it solves:** Creative work is only as good as the brief that starts it, and most briefs are a paragraph in a Slack thread. Fields go missing, success metrics are vague, tone is undefined — so designers spend the first day of every project reverse-engineering what was actually wanted. The cost isn't the brief; it's the rework downstream.

---

## 30-second tour

If you only have half a minute, look here:

- **[`ai-skills/brief-structuring-skill.md`](ai-skills/brief-structuring-skill.md)** — the AI skill itself: a structured, markdown instruction set that turns brand rules into reliably on-brand output. *This is the heart of the project.*
- **[`docs/design-system.md`](docs/design-system.md)** — the brand system as source of truth: voice, tone, type/color/layout and content rules the tool enforces.
- **[`docs/PRD.md`](docs/PRD.md)** — the product thinking: problem, users, goals, and adoption metrics.
- **[`docs/architecture.md`](docs/architecture.md)** — how it works: UI surface, the AI/model layer, and the prompt layer that binds them.
- **[`extension/`](extension/) + demo** — the working Chrome extension (Manifest V3) with a popup UI, fully client-side. *(Demo GIF: see `docs/demo.gif` once added.)*

---

## Who it's for

Design & brand owners (who define the brief schema and standards) and non-designers — PMs, marketers, founders, stakeholders — who need to request work without knowing how to write a brief.

## How it works (in one paragraph)

Brief Engine is a Chrome extension (Manifest V3) with a popup UI, fully client-side. The brand owner defines the voice and rules **once** as a markdown reference framework (see [`docs/design-system.md`](docs/design-system.md) and [`ai-skills/brief-structuring-skill.md`](ai-skills/brief-structuring-skill.md)). At runtime, the tool composes those rules with the user's input into a structured prompt and sends it to Client-side structuring with optional Anthropic Claude assist (bring-your-own API key). The result is on-brand output that a non-designer can produce without ever seeing the underlying system.

- **Input:** Rough project notes, goals, audience, constraints, deadlines, and any reference links.
- **Output:** A complete, validated brief following the schema — rendered for humans and exported as structured JSON for downstream tools.

## Install & use

1. Clone this repo.
2. In Chrome, open `chrome://extensions`, enable **Developer mode**, and click **Load unpacked**.
3. Select the [`extension/`](extension/) folder.
4. Open the extension, add your Anthropic API key (stored locally, never sent to any server but Anthropic), and go.

> No accounts. No backend. No analytics. See [PRIVACY.md](PRIVACY.md).

## How it stays on-brand

On-brand output is not luck — it's a designed system:

1. **The brand voice is encoded, not remembered.** Tone, vocabulary, and rules live in [`docs/design-system.md`](docs/design-system.md) as the single source of truth.
2. **The AI skill enforces it.** [`ai-skills/brief-structuring-skill.md`](ai-skills/brief-structuring-skill.md) is a structured instruction set with explicit constraints, examples, and guardrails — the same discipline you'd apply to a component library, applied to language.
3. **Adaptation is bounded.** The tool only flexes what should flex (phrasing and completeness); everything the brand must protect stays fixed.
4. **Anyone can self-serve.** Non-designers produce on-brand work because the design system is doing the work for them — invisibly.

---

## Why this exists (portfolio note)

This repo is part of a small suite of tools exploring one idea: **the best design systems are increasingly invisible — AI skills, brand-encoded tools, and markdown reference frameworks that let anyone produce on-brand work.** Shows a markdown reference framework operating as the single source of truth: the brief schema is the design standard, and the AI skill makes non-designers produce to that standard automatically.

**Related tools in the suite:**
- [Message Variant Engine](https://github.com/EditorialOS/message-variant-engine) — one message, every audience, on-brand.
- [Brief Engine](https://github.com/EditorialOS/brief-engine) — scattered inputs → structured, on-brand brief.
- [Social Copy Multiplier](https://github.com/EditorialOS/social-copy-multiplier) — one message, platform-perfect everywhere.

## License

MIT — see [LICENSE](LICENSE).
