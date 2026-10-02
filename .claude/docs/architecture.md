# Architecture

## Processes

The main process (`src/main/index.ts`) only creates the window and opens external links in the
system browser. There is no IPC and no custom preload API. Everything else is the renderer.

## Renderer data flow

```
PreferencesProvider (localStorage)
        │
       App ── useTracks ─────────── Track[]  (source of truth, in list order)
        │                              │
        ├── useCesiumViewer ── Viewer  │
        │                        │     │
        └── useTrackLayers(viewer, tracks) ── GpxDataSource per track
```

### Track list: `hooks/useTracks.ts`

A reducer holding `Track[]` with `add`, `remove`, `update` (color, visible) and `move`. The array
order is the display order. The first track is drawn on top.

A `Track` (`types/track.ts`) keeps the original `File`, a color, a visibility flag and `stats`
computed once on import by `utils/gpx.ts`. `stats` is `null` when the file has fewer than two
track points.

### Viewer: `hooks/useCesiumViewer.ts`

Creates the `Viewer` in an effect keyed on the ion token and destroys it on cleanup. It returns
the viewer as state so dependent effects re-run when it is replaced. Globe lighting is applied in
the same hook because the React Compiler lint rules forbid mutating the returned viewer elsewhere.

### Track layers: `hooks/useTrackLayers.ts`

Keeps one `GpxDataSource` per track in a `Map` held in a ref. On every change of `tracks` the sync
effect:

1. removes data sources whose track is gone,
2. applies visibility, color and z-index to loaded ones, skipping unchanged styles so ground
   polyline geometry is not rebuilt needlessly,
3. starts loading tracks that have no data source yet.

Loading is asynchronous. When a load finishes, the hook stores the layer and bumps a counter so
the sync effect runs again and styles it. A load is dropped if the viewer was destroyed or the
track was removed in the meantime.

The hook returns two functions:

- `focus(track)` flies to the track and moves the clock and timeline to its time span.
- `currentPosition(trackId)` gives the position of the track marker at the current clock time, for
  tracks with timestamps.

Clicking a track on the globe is handled here too, through a `ScreenSpaceEventHandler` that maps
the picked entity back to its track id.

### Clock and timeline

Cesium only adopts the clock of the last added data source, and only when every segment has
timestamps. `showTrackTime` in `useTrackLayers.ts` therefore sets the clock explicitly from
`stats.startTime` and `stats.endTime` whenever a track loads or is focused. Tracks without
timestamps leave the clock unchanged.

### Weather

`App.tsx` requests weather for the selected track, or the first one. The location is
`currentPosition` or the track start. The date is the viewer clock time. `utils/weather.ts` calls
the Visual Crossing timeline API with `unitGroup=metric`.

The response covers one day in the location's timezone. `toLocationTime` shifts the clock time by
`tzoffset`, and the current hour is highlighted only when the shifted date matches the returned
day.

### Preferences

`hooks/PreferencesProvider.tsx` loads and saves the `Preferences` object in localStorage.
Components read it with `usePreferences()` from `hooks/preferencesContext.ts`. The context and the
provider are in separate files so the provider file exports only a component.

Changing the Cesium token recreates the viewer. The track list is kept and the layers reload.

## Styling

`styles/base.css` defines the tokens and shared primitives. Each component adds its own stylesheet
for layout specific to it. Panels are nearly opaque on purpose. A `backdrop-filter` blur over the
WebGL canvas was measurably expensive and was removed.

The sidebar leaves room at the bottom for Cesium's animation and timeline widgets, and the top
right corner is left to Cesium's toolbar.
