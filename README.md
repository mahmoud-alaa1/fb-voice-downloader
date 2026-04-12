![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Build](https://img.shields.io/badge/build-passing-brightgreen)

# Voice Message Downloader for Facebook


Save Facebook and Messenger voice messages as audio files one click, no setup.

## Demo

#### Send Message
<img width="390" height="156" alt="image" src="https://github.com/user-attachments/assets/3be51aca-da3b-46f9-9012-0bb55a924cec" />

#### Recieved Message
<img width="321" height="167" alt="image" src="https://github.com/user-attachments/assets/70ec0f44-a79d-4f9f-b448-d201b0a24baa" />

#### Popup
<img width="321" height="259" alt="image" src="https://github.com/user-attachments/assets/c5f31c98-2f32-44f7-a226-2feab00dfc01" />

## Introduction

You can't forward audio messages from Facebook and Messenger to any other social media.

Facebook Voice Message Downloader solves this by injecting a download button directly into the UI, allowing you to save voice messages with one click.

## Features

- Download voice messages from Facebook & Messenger
- Supports both CDN audio and Blob-based audio
- One-click download directly from UI
- Works on sent and received messages
- No setup or authentication required

## How It Works (CDN + Blob Interception)

The extension captures audio from two sources: direct CDN responses and in-page Blob URLs. In the background worker, `chrome.webRequest` inspects CDN response headers and broadcasts candidate audio URLs for analysis. In parallel, a main-world interceptor patches `URL.createObjectURL` to detect audio Blobs, forwards Blob URLs to the content script, and both paths are matched to the correct UI player using duration-based pairing.

## Architecture

The extension uses a split architecture across content scripts, background worker, and popup state.

1. `src/content/blob-interceptor.ts` (MAIN world)
   Captures audio Blob URLs by wrapping `window.URL.createObjectURL`.
2. `src/content/blob-bridge.ts` (ISOLATED world)
   Receives `postMessage` events and sends `registerAudioUrl` messages to background.
3. `src/background/network-sniffer.ts`
   Uses `chrome.webRequest.onHeadersReceived` to detect CDN audio responses and broadcast analysis requests.
4. `src/background/store.ts` + `src/background/handlers.ts`
   Maintains duration-based matching between DOM players and audio URLs, then coordinates downloads.
5. `src/content/player-scanner.ts` + `src/content/player-injector.ts`
   Scans for voice players, injects the download UI, and handles user clicks.
6. `src/popup/index.ts`
   Persists the enable/disable toggle in `chrome.storage.local`; content scripts react to state changes.

## Project structure

```
src/
├── background/        # Service worker — stores URLs, handles downloads
├── content/           # Content scripts — intercepts blobs, injects buttons
│   ├── blob-interceptor.ts   # Patches URL.createObjectURL (MAIN world)
│   ├── blob-bridge.ts        # Forwards blob URLs to background (isolated world)
│   ├── audio-analyzer.ts     # Handles network audio URLs
│   ├── player-scanner.ts     # Scans DOM for voice message players
│   └── player-injector.ts    # Injects download buttons
├── messaging/         # Message contracts between content and background
├── protocol/          # Message type definitions
├── types/             # Shared TypeScript types
└── utils/             # Shared helpers
```

## How To Develop

### Prerequisites

- Node.js 18+
- pnpm 8+
- Chrome or Edge (for loading unpacked extension)

## Installation

### From Chrome Web Store
(Coming soon)

### Manual Installation

```bash
pnpm install
```

### Run Dev Build

```bash
pnpm dev
```

Then load the generated extension output as an unpacked extension:

1. Open `chrome://extensions`.
2. Enable Developer mode.
3. Click Load unpacked.
4. Select the generated extension folder (from the current Vite/CRX output).

## Build Instructions For Contributors

### Type Check

```bash
pnpm type-check
```

### Build Production Package

```bash
pnpm build
```

This generates a production build and zip package in `release/` via `vite-plugin-zip-pack`.


## Contributing

Contributions are welcome: bug fixes, new features, or just improving the docs.

Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening issues or pull requests.

## License

MIT © [mahmoud-alaa1](https://github.com/mahmoud-alaa1)

MIT (see LICENSE)
