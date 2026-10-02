# GPX Viewer with Cesium

A desktop GPX viewer built with Electron, React, Vite, and Cesium. This project allows you to visualize GPX (GPS Exchange Format) files on an interactive map using the Cesium library.

## Features

- Display one or more GPX files on a 3D globe with terrain.
- Manage tracks from the sidebar: pick a color, hide or show, remove, and reorder by dragging (the first track is drawn on top).
- Track statistics: distance, duration, average speed and elevation.
- Weather along a track for the date on the timeline, using [Visual Crossing](https://www.visualcrossing.com/).
- Preferences for API keys, metric or imperial units, temperature unit and globe lighting.

## Requirements

- Node.js 22.12 or newer
- A [Cesium ion access token](https://ion.cesium.com/tokens) (free)
- Optional: a Visual Crossing API key for the weather panel

## Installation

1.  Clone the repository:

    ```bash
    git clone git@github.com:Duckiduc/cesium-gpx-viewer.git
    ```

2.  Navigate to the project directory:

    ```bash
    cd cesium-gpx-viewer
    ```

3.  Install dependencies:

    ```bash
    npm install
    ```

4.  Start the app in development mode:

    ```bash
    npm run dev
    ```

## Usage

1. On first launch, enter your Cesium ion access token.
2. Click **Add GPX** or drop `.gpx` files on the window.
3. Click a track in the list or on the globe to see its statistics.
4. Open **Preferences** (top of the sidebar) to add a weather API key or change units.

Preferences, including the API keys, are stored unencrypted in the app's local storage on your computer.
To skip the token prompt during development, set `RENDERER_VITE_CESIUM_ACCESS_TOKEN` in a `.env` file.

## Development

```bash
npm run typecheck   # TypeScript
npm run lint        # ESLint
npm test            # unit tests (Vitest)
npm run format      # Prettier
```

## Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```

## Contributors

The following individuals have made significant contributions to the development of this project:

- [Duc-Thomas NGUYEN](https://www.linkedin.com/in/duc-thomas-nguyen/)
  - Led the development of the project.
  - Contributed to the innovation and feature ideas of the project.
- [Jeanne RIAUDEL](https://www.linkedin.com/in/jeanne-riaudel-77514020a/)
  - Obtained valuable real GPX data during fieldwork and provided them for testing purposes.
  - Contributed to the innovation and feature ideas of the project.

## License

<p xmlns:cc="http://creativecommons.org/ns#" xmlns:dct="http://purl.org/dc/terms/"><a property="dct:title" rel="cc:attributionURL" href="https://github.com/Duckiduc/cesium-gpx-viewer">Cesium GPX Viewer</a> by <a rel="cc:attributionURL dct:creator" property="cc:attributionName" href="https://www.linkedin.com/in/duc-thomas-nguyen/">Duc-Thomas NGUYEN</a> & <a rel="cc:attributionURL dct:creator" property="cc:attributionName" href="https://www.linkedin.com/in/jeanne-riaudel-77514020a/">Jeanne RIAUDEL</a> is licensed under <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/?ref=chooser-v1" target="_blank" rel="license noopener noreferrer" style="display:inline-block;">Attribution-NonCommercial-ShareAlike 4.0 International<img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1"><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1"><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/nc.svg?ref=chooser-v1"><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/sa.svg?ref=chooser-v1"></a></p>

See the [LICENSE](LICENSE.md) file for details.
