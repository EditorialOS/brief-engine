# PRD — Brief Engine

## Problem

Creative work is only as good as the brief that starts it, and most briefs are a paragraph in a Slack thread. Fields go missing, success metrics are vague, tone is undefined — so designers spend the first day of every project reverse-engineering what was actually wanted. The cost isn't the brief; it's the rework downstream.

## Solution

Brief Engine turns brief-writing into a structured, repeatable system. A modular schema (owned by the design team as markdown) captures every field a great brief needs; the AI skill helps a requester turn rough notes into a complete, on-brand brief and exports clean JSON that any downstream tool or workflow can consume. The template is the brand's definition of 'a good brief,' made self-serve.

## Users

Design & brand owners (who define the brief schema and standards) and non-designers — PMs, marketers, founders, stakeholders — who need to request work without knowing how to write a brief.

### Primary personas

1. **The Brand/Design Owner** — defines the voice, rules, and standards. Wants leverage: to encode their judgment once and have it applied everywhere without becoming a bottleneck.
2. **The Non-Designer Producer** — needs on-brand output but lacks design/brand training. Wants speed and confidence that what they ship won't be "off."

## Goals

- **G1 — On-brand by default.** Output should be consistent with the brand system without the user having to know the rules.
- **G2 — Self-serve.** A non-designer completes the task end-to-end without escalating to the design team.
- **G3 — Owned system.** The brand rules live as a readable, versionable reference framework (markdown), not tribal knowledge.
- **G4 — Zero backend.** No accounts, no server, no data collection — trust and auditability by design.

## Requirements

### Functional
- Accept the user's input: Rough project notes, goals, audience, constraints, deadlines, and any reference links.
- Produce: A complete, validated brief following the schema — rendered for humans and exported as structured JSON for downstream tools.
- Let the brand owner configure voice/rules that constrain every generation.
- Store settings locally; never require an account.

### Non-functional
- **Privacy:** all data stays on-device except the direct, user-keyed call to Client-side structuring with optional Anthropic Claude assist (bring-your-own API key).
- **Latency:** a full generation completes in a few seconds.
- **Auditability:** the entire behavior is open source and inspectable.
- **Extensibility:** the rule set is modular markdown, editable without touching code.

## Success & adoption metrics

| Metric | Definition | Target signal |
|---|---|---|
| Activation | User completes one real generation | First-session success |
| Self-serve rate | Tasks completed without design-team review | ↑ over time |
| On-brand acceptance | Output shipped with minimal edits | Low edit distance |
| Repeat use | Return within 7 days | Habitual use |
| Rule reuse | Brand config reused across generations | Encoded voice pays off |

## Non-goals

- Not an autonomous agent, and not an evals harness. This is an **AI skill**: a structured, human-directed instruction set that produces reliable, on-brand output.
- Not a content database or CMS.
- Not a replacement for the brand/design owner — a force multiplier for them.
