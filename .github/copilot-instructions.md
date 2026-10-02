# Cesium GPX Viewer

Cesium GPX Viewer is an Electron desktop application built with React, TypeScript, and Cesium.js that allows users to visualize GPX (GPS Exchange Format) files on an interactive 3D map with weather data integration.

**ALWAYS reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Working Effectively

### Bootstrap and Setup

Run these commands in order to set up the development environment:

```bash
npm install
```

- Takes ~30 seconds to complete. NEVER CANCEL.
- Installs all dependencies including Electron, React, Cesium.js, and TypeScript tools.
- May show deprecation warnings - these can be ignored.
- Automatically runs `electron-builder install-app-deps` as postinstall step.

### Build and Development Commands

**CRITICAL TIMING NOTES:**

- Build commands: Set timeout to 60+ minutes minimum. NEVER CANCEL BUILD COMMANDS.
- Development commands: Set timeout to 30+ minutes minimum.
- Linting/formatting: Usually complete in under 10 seconds.

#### Core Development Workflow

```bash
# Type checking (required before builds)
npm run typecheck
```

- Takes ~4 seconds. Runs TypeScript compiler checks for both Node.js and web code.
- ALWAYS run this before building or committing changes.

```bash
# Linting and formatting (REQUIRED before committing)
npm run lint
npm run format
```

- `npm run lint`: Takes ~2 seconds. ESLint with TypeScript and React rules, auto-fixes issues.
- `npm run format`: Takes ~1 second. Prettier formatting for all files.
- **CRITICAL**: CI will fail if these don't pass. ALWAYS run both before committing.

#### Building the Application

```bash
# Development build
npm run build
```

- Takes ~15 seconds. NEVER CANCEL. Set timeout to 30+ minutes.
- Builds Electron main process, preload scripts, and React renderer.
- Creates `/out` directory with compiled application.
- Required before running production Electron app.

```bash
# Development server
npm run dev
```

- Starts Vite development server and Electron app.
- **NOTE**: Electron UI cannot run in CI/sandbox environments due to security restrictions.
- In development, opens at http://localhost:5173/ for renderer process.
- NEVER CANCEL. Set timeout to 30+ minutes for initial startup.

#### Platform-Specific Builds

```bash
# Linux build (AppImage, snap, deb packages)
npm run build:linux
```

- Takes ~2 minutes. NEVER CANCEL. Set timeout to 60+ minutes.
- Creates dist/ directory with multiple Linux package formats.
- Downloads Electron binaries and packaging tools automatically.

```bash
# Windows build
npm run build:win
```

- Takes ~2-3 minutes. NEVER CANCEL. Set timeout to 60+ minutes.
- Creates Windows installer and portable executable.

```bash
# macOS build
npm run build:mac
```

- Takes ~2-3 minutes. NEVER CANCEL. Set timeout to 60+ minutes.
- Creates macOS DMG installer and app bundle.

## Application Architecture

### Key Directories

```
├── src/
│   ├── main/           # Electron main process (Node.js)
│   ├── preload/        # Electron preload scripts
│   └── renderer/       # React application (UI)
│       ├── src/
│       │   ├── components/  # React components
│       │   ├── hooks/       # Viewer, track and preferences hooks
│       │   ├── styles/      # Design tokens and shared styles
│       │   ├── types/       # TypeScript type definitions
│       │   └── utils/       # Utility functions and unit tests
├── out/                # Build output (after npm run build)
├── dist/               # Distribution packages (after platform builds)
├── build/              # Build assets (icons, entitlements)
├── resources/          # Application resources
└── .github/workflows/  # CI/CD pipelines
```

### Core Components

- **App.tsx**: Application shell (sidebar, file import, weather requests)
- **hooks/useCesiumViewer.ts**: Creates the Cesium viewer once per ion token
- **hooks/useTrackLayers.ts**: Syncs the track list with Cesium data sources (color, visibility, order)
- **hooks/useTracks.ts**: Track list state (add, remove, update, move)
- **hooks/PreferencesProvider.tsx**: Preferences persisted in localStorage
- **components/TrackList.tsx**: Track rows with reorder, color, hide and remove
- **components/WeatherPanel.tsx**, **TrackDetails.tsx**, **PreferencesDialog.tsx**, **Welcome.tsx**
- **utils/gpx.ts**: GPX parsing and track statistics

## Validation and Testing

### ALWAYS Validate Changes

Unit tests only cover the utilities (`npm test`), so ALWAYS validate changes manually as well:

1. **Build Validation**:

   ```bash
   npm run typecheck && npm run lint && npm run format && npm test && npm run build
   ```

   - Must complete successfully without errors.
   - Takes ~20 seconds total.

2. **Development Server Validation**:

   ```bash
   npm run dev
   ```

   - Verify the development server starts without compilation errors.
   - Check console for any runtime errors.
   - **NOTE**: Electron app UI cannot be tested in CI environments.

3. **Platform Build Validation**:
   ```bash
   npm run build:linux
   ```
   - Verify platform-specific build completes successfully.
   - Check that `dist/` directory contains expected package files.
   - Takes ~2 minutes.

### Manual Testing Scenarios

**CRITICAL**: After making changes, test these user workflows:

1. **API Key Setup**:

   - Application should show the token form on first launch (the token is then remembered)
   - Enter a valid Cesium Ion API key
   - Verify 3D globe loads correctly

2. **GPX File Loading**:

   - Add one or more GPX files with the Add GPX button or by dropping them on the window
   - Change colors, hide, remove and reorder tracks from the list
   - Verify tracks appear on the 3D map
   - Test zoom and navigation controls

3. **Weather Integration**:
   - Enter a Visual Crossing API key in Preferences
   - Click Get weather with a track loaded
   - Verify weather data displays correctly

### CI Requirements

The GitHub Actions CI requires:

- `npm run typecheck` passes
- `npm test` passes
- `npm run lint` passes
- `npm run format` produces no changes
- `npm run build` completes successfully

**ALWAYS run these commands locally before committing to avoid CI failures.**

## Common Development Tasks

### Adding New Features

1. Make changes to source files in `src/renderer/src/`
2. Update TypeScript types in `src/renderer/src/types/` if needed
3. Run validation commands:
   ```bash
   npm run typecheck && npm run lint && npm run format
   ```
4. Test with development server:
   ```bash
   npm run build && npm run dev
   ```

### Debugging Build Issues

1. Check TypeScript compilation: `npm run typecheck`
2. Verify ESLint rules: `npm run lint`
3. Ensure formatting: `npm run format`
4. Clean build: Remove `out/` and `dist/` directories, then rebuild

### Working with Cesium.js

- Cesium Ion API key required for map tiles and terrain
- 3D globe uses WebGL - ensure graphics drivers are available
- Large asset files (~8MB+ JavaScript bundle) due to Cesium.js
- Assets automatically copied from node_modules during build

## Environment Requirements

### Required Tools

- Node.js 22.12 or newer (CI uses 24.x)
- npm (included with Node.js)
- Git for version control

### Optional for Full Testing

- Cesium Ion API key (free account: https://cesium.com/ion/)
- Weather API key for weather integration features
- GPX files for testing visualization

## Common Commands Reference

```bash
# Setup and dependencies
npm install                    # ~30 seconds, install all dependencies

# Development workflow
npm run typecheck             # ~4 seconds, TypeScript compilation check
npm run lint                  # ~2 seconds, ESLint with auto-fix
npm run format                # ~1 second, Prettier formatting
npm run build                 # ~15 seconds, development build

# Platform builds (NEVER CANCEL - set 60+ minute timeouts)
npm run build:linux           # ~2 minutes, Linux packages
npm run build:win             # ~2-3 minutes, Windows installer
npm run build:mac             # ~2-3 minutes, macOS DMG

# Development server
npm run dev                   # Start development server (30+ min timeout)
```

## Troubleshooting

### Build Failures

- **TypeScript errors**: Run `npm run typecheck` to see detailed compilation errors
- **Linting failures**: Run `npm run lint` to auto-fix or see remaining issues
- **Electron sandbox issues**: Expected in CI environments, not a real failure
- **Missing dependencies**: Re-run `npm install`

### Development Server Issues

- **Port conflicts**: Default port 5173, may need to change in electron.vite.config.ts
- **Cesium loading errors**: Check Ion API key configuration
- **GPU/WebGL issues**: Cesium.js requires hardware acceleration

### Package Build Issues

- **Large bundle sizes**: Expected due to Cesium.js (~8MB+ renderer bundle)
- **Missing assets**: Verify vite-plugin-static-copy configuration
- **Platform-specific failures**: Check electron-builder.yml configuration

## Repository Information

### Configuration Files

- `package.json`: Dependencies and npm scripts
- `electron.vite.config.ts`: Vite and Electron build configuration
- `electron-builder.yml`: Platform build and packaging settings
- `eslint.config.js`: ESLint configuration with TypeScript rules
- `.prettierrc.yaml`: Prettier formatting rules
- `tsconfig.*.json`: TypeScript compiler configurations

### CI/CD Pipeline

- `.github/workflows/build.yml`: Main CI pipeline (runs on PR/push)
- `.github/workflows/release.yml`: Release builds (runs on git tags)
- Builds on Ubuntu, macOS, and Windows
- Publishes release artifacts on tagged versions
