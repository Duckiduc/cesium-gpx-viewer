# Cesium GPX Viewer

Electron desktop app that shows GPX tracks on a Cesium 3D globe, with track statistics and
weather. Stack: Electron, electron-vite, React 19, TypeScript, Cesium.

## Commands

```bash
npm run dev          # dev server + Electron window with HMR
npm run build        # typecheck, then build to out/
npm start            # run the built app from out/
npm run typecheck    # tsc for main/preload and renderer
npm run lint         # eslint with --fix
npm test             # vitest, unit tests for src/renderer/src/utils
npm run format       # prettier --write
```

Before calling a change done, run what CI runs:
`npx prettier --check . && npx eslint . && npm test && npm run build`.

Unit tests only cover the pure utilities. Anything touching the viewer or the UI must also be
checked in the running app; see [docs/verification.md](docs/verification.md).

## Layout

```
src/main/            Electron main process (window creation only)
src/preload/         Preload script (exposes the electron-toolkit API, nothing custom)
src/renderer/src/
  App.tsx            Shell: sidebar, file import, weather requests
  hooks/             Viewer, track layers, track list state, preferences
  components/        One component per file, with a matching .css file
  utils/             Pure functions (GPX parsing, formatting, weather) and their tests
  types/             Shared types
  styles/base.css    Design tokens and shared primitives (.panel, .button, .stat ...)
```

How the pieces fit together is described in [docs/architecture.md](docs/architecture.md). Read it
before changing anything in `hooks/`.

## Conventions

- Prettier: single quotes, no semicolons, 100 columns, no trailing commas.
- Every function has an explicit return type, including inline arrow handlers
  (`(event): void => ...`). ESLint enforces this.
- Named exports for components. BEM class names (`track-list__item--selected`). Colors, radii and
  fonts come from the CSS variables in `styles/base.css`, not hard-coded values.
- `eslint-plugin-react-hooks` v7 runs the React Compiler rules. Do not mutate values returned from
  hooks or read refs during render. Use `useEffectEvent` for callbacks called from effects.
- Internal values are metric (meters, m/s, °C, km/h). Convert only at display time through
  `utils/format.ts` using the user's preferences.
- No Cesium private fields (`_entities`, `_position` ...). Use the public API.

## Things that will bite you

- **The viewer renders on demand** (`requestRenderMode: true`). After changing anything Cesium does
  not observe by itself, call `viewer.scene.requestRender()`, otherwise the globe shows stale
  state until the camera moves.
- **Never recreate the viewer to apply a change.** It is created once per ion token in
  `useCesiumViewer`. Track changes go through `useTrackLayers`, which diffs against the track list.
- **Cesium static assets** are copied by `vite-plugin-static-copy` to `assets/cesium/` and found
  through `window.CESIUM_BASE_URL` (`cesiumConfig.ts`, imported first in `main.tsx`). The
  `rename: { stripBase: 4 }` in `electron.vite.config.ts` is required. Without it the files land
  under `assets/cesium/node_modules/...` and the globe fails at runtime while the build still passes.
- **`ELECTRON_RUN_AS_NODE=1` is set in VS Code terminals and agent shells.** Electron then runs as
  plain Node and rejects its own flags. Launch with `env -u ELECTRON_RUN_AS_NODE`.
- **`*.gpx` is gitignored.** Sample tracks cannot be committed. Generate them outside the repo.
- **API keys live in localStorage** (`cesium-gpx-viewer:preferences`), unencrypted. Never log them
  or put them in test fixtures. `RENDERER_VITE_CESIUM_ACCESS_TOKEN` in `.env` pre-fills the token
  in development.

## Dependency constraints

- `typescript` stays on 6.x. `typescript-eslint` refuses to load with TypeScript 7 and `npm ci`
  fails on the peer conflict. Re-check when `typescript-eslint` widens its peer range.
- `electron-vite` is on a 6.0 beta because stable 5 only supports Vite up to 7. Move to the stable
  6.0 release when it ships.
- `@types/node` is ahead of the Node version bundled with Electron. Check the Electron release
  notes before relying on a recent Node API in `src/main`.
- Node 22.12 or newer is required. CI uses Node 24.
