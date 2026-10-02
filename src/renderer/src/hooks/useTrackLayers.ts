import { useCallback, useEffect, useEffectEvent, useRef, useState } from 'react'
import {
  Cartographic,
  ClockRange,
  Color,
  ConstantProperty,
  GpxDataSource,
  JulianDate,
  Math as CesiumMath,
  PolylineOutlineMaterialProperty,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  Viewer,
  defined
} from 'cesium'
import { Track } from '../types/track'

interface TrackLayersOptions {
  onPick: (trackId: string) => void
  onLoadError: (track: Track, error: unknown) => void
}

export interface TrackLayers {
  /** Zoom to the track and move the clock and timeline to its time span */
  focus: (track: Track) => void
  /** Position of the track marker at the current clock time, for time-dynamic tracks */
  currentPosition: (trackId: string) => { latitude: number; longitude: number } | undefined
}

interface TrackLayer {
  dataSource: GpxDataSource
  // Last style applied to the polylines, to avoid rebuilding unchanged geometry
  color: string
  zIndex: number
}

const trackMaterial = (color: string): PolylineOutlineMaterialProperty =>
  new PolylineOutlineMaterialProperty({
    color: Color.fromCssColorString(color),
    outlineColor: Color.BLACK,
    outlineWidth: 2
  })

/**
 * Move the clock and timeline to the time span of a track.
 * Cesium only does this for the last added data source, and only when every segment has times,
 * which otherwise leaves the timeline on today's date.
 */
function showTrackTime(viewer: Viewer, track: Track): void {
  const { startTime, endTime } = track.stats ?? {}
  if (!startTime || !endTime) return

  const start = JulianDate.fromDate(startTime)
  const stop = JulianDate.fromDate(endTime)
  const { clock } = viewer

  clock.startTime = start
  clock.stopTime = stop
  clock.currentTime = JulianDate.clone(start)
  clock.clockRange = ClockRange.LOOP_STOP
  // Play the whole track in about a minute
  clock.multiplier = Math.max(1, Math.round(JulianDate.secondsDifference(stop, start) / 60))
  viewer.timeline?.zoomTo(start, stop)
  viewer.scene.requestRender()
}

/**
 * Keep the viewer's GPX data sources in sync with the track list:
 * loads added tracks, removes deleted ones and applies color, visibility and order.
 */
export function useTrackLayers(
  viewer: Viewer | null,
  tracks: Track[],
  options: TrackLayersOptions
): TrackLayers {
  const layersRef = useRef(new Map<string, TrackLayer>())
  const loadingRef = useRef(new Set<string>())
  // Bumped when a data source finishes loading so the sync effect styles it
  const [loadCount, setLoadCount] = useState(0)

  const onPick = useEffectEvent(options.onPick)
  const onLoadError = useEffectEvent(options.onLoadError)

  useEffect(() => {
    if (!viewer) return

    const layers = layersRef.current
    const loading = loadingRef.current

    const handler = new ScreenSpaceEventHandler(viewer.scene.canvas)
    handler.setInputAction((click: ScreenSpaceEventHandler.PositionedEvent) => {
      const entity = viewer.scene.pick(click.position)?.id
      if (!defined(entity)) return

      for (const [trackId, { dataSource }] of layers) {
        if (dataSource.entities.contains(entity)) {
          onPick(trackId)
          return
        }
      }
    }, ScreenSpaceEventType.LEFT_CLICK)

    return (): void => {
      handler.destroy()
      // The data sources are destroyed with the viewer
      layers.clear()
      loading.clear()
    }
  }, [viewer])

  useEffect(() => {
    if (!viewer) return

    const layers = layersRef.current
    const loading = loadingRef.current
    const wanted = new Set(tracks.map((track) => track.id))

    for (const [trackId, layer] of layers) {
      if (!wanted.has(trackId)) {
        viewer.dataSources.remove(layer.dataSource, true)
        layers.delete(trackId)
      }
    }

    tracks.forEach((track, index) => {
      const layer = layers.get(track.id)

      if (layer) {
        layer.dataSource.show = track.visible
        // First track in the list is drawn on top
        const zIndex = tracks.length - index
        if (layer.color === track.color && layer.zIndex === zIndex) return

        for (const entity of layer.dataSource.entities.values) {
          if (!entity.polyline) continue
          entity.polyline.material = trackMaterial(track.color)
          entity.polyline.zIndex = new ConstantProperty(zIndex)
        }
        layer.color = track.color
        layer.zIndex = zIndex
        return
      }

      if (loading.has(track.id)) return
      loading.add(track.id)

      GpxDataSource.load(track.file, {
        clampToGround: true,
        // Cesium types this option as a string but expects a Color
        trackColor: Color.fromCssColorString(track.color) as unknown as string
      })
        .then(async (loaded) => {
          // The viewer was replaced or the track removed while loading
          if (viewer.isDestroyed() || !loading.has(track.id)) return
          await viewer.dataSources.add(loaded)
          layers.set(track.id, { dataSource: loaded, color: track.color, zIndex: 0 })
          setLoadCount((count) => count + 1)
          viewer.flyTo(loaded)
          showTrackTime(viewer, track)
        })
        .catch((error) => {
          if (!viewer.isDestroyed()) onLoadError(track, error)
        })
        .finally(() => loading.delete(track.id))
    })

    for (const trackId of loading) {
      if (!wanted.has(trackId)) loading.delete(trackId)
    }

    viewer.scene.requestRender()
  }, [viewer, tracks, loadCount])

  const focus = useCallback(
    (track: Track): void => {
      const layer = layersRef.current.get(track.id)
      if (!viewer || !layer) return
      viewer.flyTo(layer.dataSource)
      showTrackTime(viewer, track)
    },
    [viewer]
  )

  const currentPosition = useCallback(
    (trackId: string) => {
      const layer = layersRef.current.get(trackId)
      if (!viewer || !layer) return undefined

      for (const entity of layer.dataSource.entities.values) {
        const position = entity.position?.getValue(viewer.clock.currentTime)
        if (!position) continue
        const cartographic = Cartographic.fromCartesian(position)
        return {
          latitude: CesiumMath.toDegrees(cartographic.latitude),
          longitude: CesiumMath.toDegrees(cartographic.longitude)
        }
      }
      return undefined
    },
    [viewer]
  )

  return { focus, currentPosition }
}
