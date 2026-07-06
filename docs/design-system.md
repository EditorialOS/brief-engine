# Design System — Brief Engine

> This document is the **single source of truth** for how Brief Engine produces on-brand output. It is intentionally written in markdown so it can be versioned, reviewed, and reused the way a design team reviews components. The AI skill in [`../ai-skills/brief-structuring-skill.md`](../ai-skills/brief-structuring-skill.md) consumes these rules directly.

## 1. Brand voice

Voice is the constant; everything else adapts around it.

- **Personality:** clear, confident, human. Never corporate-stiff, never gimmicky.
- **Point of view:** speak *to* the reader, not *at* them. Second person, active voice.
- **What we sound like:** direct, warm, specific.
- **What we never sound like:** hype-y, jargon-heavy, hedging, or filler-padded.

## 2. Tone rules

Tone flexes by context, within guardrails:

- Match the reader's emotional state; never overclaim.
- One idea per sentence; cut qualifiers ("just," "very," "really").
- Prefer concrete nouns and verbs over abstractions.
- Read it aloud — if it sounds like a press release, rewrite it.

## 3. Vocabulary

- **Use:** the product's real names and the audience's own words.
- **Avoid:** internal jargon, acronyms without expansion, banned words configured by the brand owner.
- **Locked terms:** product names, legal language, and claims are verbatim and never paraphrased.

## 4. Type, color & layout principles

Although Brief Engine outputs primarily text, its UI and any rendered output follow the same design discipline:

- **Type:** a clear hierarchy — one heading level per level of meaning; generous line length limits for readability.
- **Color:** functional first (state, emphasis), brand second; sufficient contrast (WCAG AA).
- **Layout:** whitespace is a feature; group related fields; one primary action per view.
- **Rhythm:** consistent spacing scale; nothing arbitrary.

## 5. Adaptation rules (what may flex)

The brief schema is modular so teams can extend it without breaking downstream consumers:

| Section | Required | Purpose |
|---|---|---|
| Objective | yes | The single outcome this work must achieve |
| Audience | yes | Who it's for, in the team's persona vocabulary |
| Deliverables | yes | Concrete artifacts + specs |
| Tone & voice | yes | Links to the brand voice definition |
| Success metrics | yes | How "done well" is measured |
| Constraints | no | Budget, legal, technical, timeline |
| References | no | Inspiration, prior work, links |

## 6. Guardrails (what must never break)

- Never alter locked sections/terms.
- Never invent facts, claims, prices, or features.
- Never break platform/format hard limits.
- Never drift from the brand voice defined in §1–§3, regardless of audience.

## 7. How this becomes behavior

These rules are not documentation *about* the product — they are the product's **instructions**. The AI skill composes them with user input at runtime, so editing this file changes the output. That is the core idea: **markdown-based brand documentation as executable source of truth.**
