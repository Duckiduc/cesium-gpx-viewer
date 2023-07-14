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
import GPX from './assets/moto.gpx'
import ApiForm from './components/ApiForm'

function App(): JSX.Element {
  const [apiKey, setApiKey] = useState('')
  const viewerRef = useRef<Viewer | null>(null)

  useEffect(() => {
    const initializeViewer = async (): Promise<void> => {
      const CESIUM_ACCESS_TOKEN = apiKey

      Ion.defaultAccessToken = CESIUM_ACCESS_TOKEN

      // Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID
      viewerRef.current = new Viewer('cesiumContainer', {
        terrain: Terrain.fromWorldTerrain({
          requestVertexNormals: true
        })
      })

      viewerRef.current.scene.globe.enableLighting = true

      viewerRef.current.dataSources.add(GpxDataSource.load(GPX))

      console.log(Color.YELLOW)

      // viewerRef.current.dataSources.add(
      //   GpxDataSource.load('/src/assets/raye.gpx', {
      //     clampToGround: true,
      //     trackColor: Color.YELLOW.toCssColorString()
      //   })
      // )

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

    if (apiKey) {
      initializeViewer()
    }

    return () => {
      viewerRef.current?.destroy()
    }
  }, [apiKey])

  // const handleApiKeyChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
  //   setApiKey(event.target.value)
  // }

  // const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
  //   event.preventDefault()
  //   const form = event.currentTarget
  //   const apiKeyInput = form.elements.namedItem('apiKey') as HTMLInputElement
  //   const enteredApiKey = apiKeyInput.value
  //   // Validate the API key if needed
  //   // You can add your validation logic here before setting the API key
  //   setApiKey(enteredApiKey)
  // }

  const handleFormSubmit = (value: string): void => {
    // Do something with the input value in the parent component
    console.log('Input value:', value)
    setApiKey(value)
  }

  // // Add Cesium OSM Buildings, a global 3D buildings layer
  // const buildingTileset = await createOsmBuildingsAsync()
  // viewer.scene.primitives.add(buildingTileset)

  return (
    <>
      <div id="cesiumContainer"></div>
      {!apiKey && <ApiForm onSubmit={handleFormSubmit} />}
    </>
  )
}

export default App
