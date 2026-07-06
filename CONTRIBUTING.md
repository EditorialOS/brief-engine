# Contributing to Brief Engine

Thanks for your interest! This project is intentionally small, auditable, and dependency-light.

## Ground rules

- **The design system is the source of truth.** Behavioral changes to output should start in [`docs/design-system.md`](docs/design-system.md) and [`ai-skills/`](ai-skills/), not buried in code.
- **No secrets in commits.** API keys live in local browser storage only. See [.gitignore](.gitignore).
- **Keep it client-side.** No backend, no analytics, no tracking.

## Dev setup

1. Fork and clone.
2. Load `extension/` as an unpacked extension (`chrome://extensions` → Developer mode → Load unpacked).
3. Make changes; reload the extension to test.

## Pull requests

- Keep PRs focused and describe the user-facing change.
- If you change output behavior, update the relevant `ai-skills/` file and `docs/design-system.md`.
- CI validates the manifest, checks JS syntax, and confirms required docs exist.

## Reporting issues

Open an issue with steps to reproduce, what you expected, and what happened.
