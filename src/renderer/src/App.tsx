import {
  // Cartesian3,
  // createOsmBuildingsAsync,
  Color,
  GpxDataSource,
  Ion,
  Terrain,
  Viewer
} from 'cesium'
import { useEffect, useRef, useState } from 'react'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import './App.css'
import { ApiForm } from './components/ApiForm'
import { GpxForm } from './components/GpxForm'

function App(): JSX.Element {
  const [apiKey, setApiKey] = useState('')
  const [GPX, setGPX] = useState<File | null>(null)
  const viewerRef = useRef<Viewer | null>(null)

  useEffect(() => {
    const initializeViewer = async (): Promise<void> => {
      Ion.defaultAccessToken = apiKey

      // Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID
      viewerRef.current = new Viewer('cesiumContainer', {
        terrain: Terrain.fromWorldTerrain({
          requestVertexNormals: false
        })
      })

      viewerRef.current.scene.globe.enableLighting = true

      console.log(Color.YELLOW)

      if (viewerRef.current && GPX) {
        const dataSource = new GpxDataSource()
        dataSource.load(GPX, {
          clampToGround: true
          // trackColor: Color.YELLOW.toCssColorString()
        })
        viewerRef.current.dataSources.add(dataSource)
      }
    }

    const destroyViewer = (): void => {
      viewerRef.current?.destroy()
    }

    if (apiKey) {
      initializeViewer()
    }

    return destroyViewer
  }, [apiKey, GPX])

  const handleFormSubmit = (value: string): void => {
    // Do something with the input value in the parent component
    console.log('Input value:', value)
    setApiKey(value)
  }

  return (
    <>
      <div id="cesiumContainer"></div>
      <GpxForm onFileUpload={(file: File): void => setGPX(file)} />
      {!apiKey && <ApiForm onSubmit={handleFormSubmit} />}
    </>
  )
}

export default App

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
