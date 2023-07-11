import { Cartesian3, createOsmBuildingsAsync, Color, GpxDataSource, Ion, Math as CesiumMath, Terrain, Viewer, VRTheWorldTerrainProvider } from "cesium"
import { useEffect, useRef } from "react"
import "cesium/Build/Cesium/Widgets/widgets.css"
import "./App.css"


function App() {
  const viewerRef = useRef(null)

  useEffect(() => {
    const initializeViewer = async () => {
      const CESIUM_ACCESS_TOKEN = import.meta.env.VITE_CESIUM_ACCESS_TOKEN
    
      Ion.defaultAccessToken = CESIUM_ACCESS_TOKEN
    
      // Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID
      viewerRef.current = new Viewer("cesiumContainer", {
        terrain: Terrain.fromWorldTerrain({
          requestVertexNormals: true,
        }),
      })

      viewerRef.current.scene.globe.enableLighting = true

      viewerRef.current.dataSources.add(GpxDataSource.load("/src/assets/moto.gpx"))

      console.log(Color.YELLOW)

      viewerRef.current.dataSources.add(GpxDataSource.load("/src/assets/raye.gpx", { clampToGround: true, trackColor: Color.YELLOW }))
    
      // Fly the camera to San Francisco at the given longitude, latitude, and height
      // viewerRef.current.camera.flyTo({
      //   destination: Cartesian3.fromDegrees(-122.4175, 37.655, 400),
      //   orientation: {
      //     heading: CesiumMath.toRadians(0.0),
      //     pitch: CesiumMath.toRadians(-15.0),
      //   }
      // })
  
      // Add Cesium OSM Buildings, a global 3D buildings layer
      // const buildingTileset = await createOsmBuildingsAsync()
      // viewerRef.current.scene.primitives.add(buildingTileset)
    }

    initializeViewer()

    return () => {
      viewerRef.current.destroy()
    }
  }, [])

  // // Add Cesium OSM Buildings, a global 3D buildings layer
  // const buildingTileset = await createOsmBuildingsAsync()
  // viewer.scene.primitives.add(buildingTileset)

  return (
    <>
      <div id="cesiumContainer"></div>
    </>
  )
}

export default App
