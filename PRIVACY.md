# Privacy

Brief Engine is built privacy-first. There is no "us" to send your data to.

## What we collect

**Nothing.** Brief Engine has no backend server, no accounts, no analytics, and no telemetry.

## Where your data goes

- Your inputs, brand settings, and API key are stored **locally in your browser** (Chrome storage).
- When you generate output, your input and brand rules are sent **directly from your browser to the Anthropic API** (`api.anthropic.com`) using *your* API key. They are never routed through any server we control, because none exists.
- Your API key never leaves your device except in the authenticated request to Anthropic.

## What you should know

- Review [Anthropic's privacy policy](https://www.anthropic.com/legal/privacy) for how they handle API requests.
- Uninstalling the extension removes all locally stored data.
- This project is open source — you can audit exactly what it does in [`extension/`](extension/).
