# YouTube Shorts Auto Scroll

A lightweight browser extension that automatically plays the next YouTube Short when the current one ends, eliminating the need for manual scrolling.

## Features

- **Auto-scrolling**: Automatically advances to the next Short when the current one finishes playing
- **Toggle control**: Easily enable or disable the auto-scroll feature with a single click
- **Works on**: Regular YouTube Shorts feed and hashtag pages
- **Lightweight**: Minimal impact on browser performance
- **Available for**: Firefox and Chrome browsers

## Installation

### Firefox

#### Manual Installation (Developer Mode)
1. Download the Firefox version from this repository
2. Open Firefox and navigate to `about:debugging`
3. Click "This Firefox"
4. Click "Load Temporary Add-on..."
5. Navigate to the Firefox folder and select the `manifest.json` file

### Chrome

#### Manual Installation (Developer Mode)
1. Download the Chrome version from this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top-right corner
4. Click "Load unpacked"
5. Navigate to the Chrome folder and select it

## Usage

1. Navigate to YouTube Shorts (`https://www.youtube.com/shorts`)
2. The extension will automatically activate (shown by the "Stop" button in the popup)
3. Watch Shorts without manually scrolling
4. To disable auto-scrolling, click the extension icon and press the "Start/Stop" button

## Repository Structure

```
YouTube-Shorts-Auto-Scroll/
├── README.md/
├── Firefox/
│   ├── src/
│   │   ├── background.js
│   │   ├── content.js
│   │   └── script.js
│   ├── manifest.json
│   └── popup.html
│
└── Chrome/
    ├── src/
    │   ├── background.js
    │   ├── content.js
    │   └── script.js
    ├── manifest.json
    └── popup.html
```

## Development

### Prerequisites
- Basic knowledge of HTML, CSS, and JavaScript
- Git for version control
- A text editor or IDE (e.g., Visual Studio Code)

### Local Development
1. Clone this repository
2. Make changes to the appropriate version (Firefox or Chrome)
3. Load the extension in developer mode (see installation instructions above)
4. Test your changes

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Credits
This extension is based on https://github.com/SoRadGaming/Auto-Youtube-Shorts-Scroller by SoRadGaming, 
which is licensed under the Apache 2.0 License.

My version is significantly simplified from the original:
- Removed multiple complex features
- Streamlined to a single on/off toggle button
- Focused solely on auto-scrolling functionality
- Ported to Chrome browser
---

Created by Bishal Subedi - theb8821 - feel free to contact me!
