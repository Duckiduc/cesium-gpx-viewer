# Verifying changes in the running app

Type checks and unit tests do not exercise Cesium or the UI. Changes to hooks, components or the
build configuration need a run of the real app.

## Launching

```bash
npm run build
env -u ELECTRON_RUN_AS_NODE npx electron \
  --remote-debugging-port=9333 \
  --user-data-dir="$SCRATCH/profile" .
```

- `env -u ELECTRON_RUN_AS_NODE` is required in VS Code terminals and agent shells.
- A separate `--user-data-dir` outside the repository keeps the run away from the user's saved
  preferences and API keys. Delete it between runs to start from the welcome screen.
- The remote debugging port lets a script drive the window over the Chrome DevTools Protocol:
  fetch `http://127.0.0.1:9333/json`, connect to the page's `webSocketDebuggerUrl`, then use
  `Runtime.evaluate`, `DOM.setFileInputFiles` and `Page.captureScreenshot`. Node 22+ has `fetch`
  and `WebSocket` built in, so no extra dependency is needed.

Stop the app afterwards with `pkill -f "remote-debugging-port=9333"`.

## Without a Cesium ion token

Any non-empty string gets past the welcome screen. The viewer starts, but imagery and terrain
requests fail, so the globe is black and a `RequestErrorEvent` appears in the console. This is
expected.

What can still be verified: the whole sidebar UI, track statistics, reorder, hide, remove,
preferences, the clock and timeline, and track markers for tracks that have timestamps.

What cannot: track lines, because they are clamped to terrain that never loads, and real weather
responses. Say so explicitly when reporting results instead of claiming the feature was seen
working.

## Sample GPX files

`*.gpx` is gitignored, so generate samples in a scratch directory. Useful cases:

- a track with elevation and timestamps,
- a track with neither,
- a track dated years in the past, to check the timeline jumps to it,
- an invalid file such as `<gpx><trk>`, to check the error notice.

## Checklist

1. Welcome screen appears on a fresh profile and the token is remembered after restart.
2. Adding files through **Add GPX** and by dropping them on the window.
3. Selecting a track shows its statistics and moves the timeline to its date.
4. Reorder by drag and by arrow keys on the grip, hide, show and remove.
5. Preferences: switching units updates the list and statistics immediately.
6. The console has no errors other than the expected ones above.

## Reading the result

Prefer a screenshot over scraping Cesium's widgets. The animation widget is SVG and its text nodes
are not a reliable source for the current clock time.

To check for idle rendering cost, enable the `Performance` domain and compare `TaskDuration` from
`Performance.getMetrics` across a few idle seconds. With on-demand rendering it should be around
100 ms of main-thread time per 5 seconds, not several hundred.
