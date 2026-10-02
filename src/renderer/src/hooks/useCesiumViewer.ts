import { RefObject, useEffect, useRef, useState } from 'react'
import { Ion, Terrain, Viewer } from 'cesium'

/**
 * Create a Cesium viewer in the container once an ion token is available.
 * The viewer is recreated only when the token changes.
 */
export function useCesiumViewer(
  containerRef: RefObject<HTMLDivElement | null>,
  token: string,
  globeLighting: boolean
): Viewer | null {
  const [viewer, setViewer] = useState<Viewer | null>(null)
  const instanceRef = useRef<Viewer | null>(null)

  useEffect(() => {
    if (!token || !containerRef.current) return

    Ion.defaultAccessToken = token

    const instance = new Viewer(containerRef.current, {
      terrain: Terrain.fromWorldTerrain({ requestVertexNormals: false }),
      infoBox: false, // Disable InfoBox to avoid CSS loading issues
      selectionIndicator: false,
      navigationInstructionsInitiallyVisible: false,
      // Only draw a frame when something changed instead of 60 times per second
      requestRenderMode: true
    })
    instanceRef.current = instance
    setViewer(instance)

    return (): void => {
      instanceRef.current = null
      setViewer(null)
      instance.destroy()
    }
  }, [containerRef, token])

  useEffect(() => {
    const instance = instanceRef.current
    if (!instance) return
    instance.scene.globe.enableLighting = globeLighting
    instance.scene.requestRender()
  }, [viewer, globeLighting])

  return viewer
}
