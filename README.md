# YouTube Shorts Auto Scroll

[![Manifest V3](https://img.shields.io/badge/Manifest-V3-success.svg)](#)
[![Browser](https://img.shields.io/badge/Browser-Chrome%20%7C%20Firefox-blue.svg)](#)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-yellow.svg)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#contributing)

A modern, ultra-lightweight browser extension for **Google Chrome** and **Mozilla Firefox** that automatically advances to the next YouTube Short the moment the current one ends. Enjoy a completely hands-free viewing experience on YouTube Shorts without touching your keyboard or mouse.

---

## Features

- ⚡ **Seamless Auto-Scrolling**: Watches the video playback in real time and automatically transitions to the next Short as soon as the current one finishes.
- 🎯 **100% Completion Guarantee**: Unlike naïve timer-cutoff scripts, this extension monitors HTML5 playback state and YouTube's internal loop wraparound to ensure every Short plays completely to its final frame without premature cutoffs.
- ⌨️ **Quick Keyboard Shortcut**: Toggle auto-scrolling on or off at any time using <kbd>Shift</kbd> + <kbd>S</kbd>, accompanied by a clean floating on-screen toast notification.
- 📌 **Live Toolbar Status**: The extension icon in your browser toolbar displays an active **ON** (green) / **OFF** (gray) badge so you always know the current state.
- 🎨 **Minimal Dark Popup**: A sleek YouTube-themed popup interface with a single-click Start/Stop button and live status indicators.
- 🪶 **Zero Overhead**: Pure vanilla JavaScript with zero dependencies and minimal memory footprint.
- 🛡️ **Manifest V3 Compliant**: Built strictly for modern browser extension specifications on both Chrome and Firefox.

---

## How It Works

1. **Active Player Detection**: Identifies the currently active `ytd-reel-video-renderer` and its associated HTML5 `<video>` element.
2. **Playback Completion Tracking**:
   - Strips the standard `loop` property when auto-scrolling is enabled.
   - Listens for the HTML5 `ended` event as well as detecting the exact timestamp reset when YouTube triggers a playback cycle.
3. **Native Navigation Execution**: Programmatically triggers the YouTube Shorts downward navigation controller (`#navigation-button-down`), ensuring native transitions, preload buffering, and smooth animations remain identical to manual viewing.

---

## Installation

### Google Chrome

1. Clone or download this repository:
   ```bash
   git clone https://github.com/theb8821/Youtube-Auto-Scroller.git
   ```
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** using the toggle in the upper-right corner.
4. Click **Load unpacked**.
5. Select the `chrome` directory from this repository.

### Mozilla Firefox

1. Clone or download this repository:
   ```bash
   git clone https://github.com/theb8821/Youtube-Auto-Scroller.git
   ```
2. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`.
3. Click **Load Temporary Add-on...**.
4. Browse into the `firefox` directory and select `manifest.json`.

---

## Usage

| Action | How to Perform |
| :--- | :--- |
| **Start / Watch** | Navigate to [`youtube.com/shorts`](https://www.youtube.com/shorts). The extension activates automatically. |
| **Keyboard Toggle** | Press <kbd>Shift</kbd> + <kbd>S</kbd> anywhere on the page to toggle auto-scrolling On / Off. |
| **Popup Toggle** | Click the extension icon in the toolbar and press **Stop** or **Start**. |
| **Normal Looping** | When turned Off, Shorts loop indefinitely as normal. |

---

## Project Structure

```
Youtube-Auto-Scroller/
├── README.md               # Project documentation
├── LICENSE                 # License file
├── .gitignore              # Git ignore rules
│
├── chrome/                 # Google Chrome extension (Manifest V3)
│   ├── manifest.json       # Chrome MV3 manifest with service worker
│   ├── popup.html          # Toolbar popup interface
│   └── src/
│       ├── background.js   # Background service worker & badge manager
│       ├── content.js      # Core auto-scroll engine & player monitor
│       └── script.js       # Popup interface controller
│
└── firefox/                # Mozilla Firefox extension (Manifest V3)
    ├── manifest.json       # Firefox MV3 manifest with Gecko ID & background script
    ├── popup.html          # Toolbar popup interface
    └── src/
        ├── background.js   # Background event script & badge manager
        ├── content.js      # Core auto-scroll engine & player monitor
        └── script.js       # Popup interface controller
```

---

## Local Development

```bash
# Verify JavaScript syntax across all files
node --check chrome/src/background.js
node --check chrome/src/content.js
node --check chrome/src/script.js
node --check firefox/src/background.js
node --check firefox/src/content.js
node --check firefox/src/script.js
```

---

## Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## Credits & License

- Based on [Auto-Youtube-Shorts-Scroller](https://github.com/SoRadGaming/Auto-Youtube-Shorts-Scroller) by SoRadGaming and Tyson3101.
- Modernized, refactored, and maintained by **Bishal Subedi** ([@theb8821](https://github.com/theb8821)).
- Licensed under the [Apache 2.0 License](./LICENSE).
