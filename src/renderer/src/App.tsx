import { Color, GpxDataSource, Ion, Terrain, Viewer } from 'cesium'
import { useEffect, useRef, useState } from 'react'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import './App.css'
import { ApiForm } from './components/ApiForm'
import { GpxForm } from './components/GpxForm'

function App(): JSX.Element {
  const [apiKey, setApiKey] = useState('')
  const [GPXFiles, setGPXFiles] = useState<File[]>([]) // Store multiple GPX files
  const viewerRef = useRef<Viewer | null>(null)

  useEffect(() => {
    const initializeViewer = async (): Promise<void> => {
      Ion.defaultAccessToken = apiKey

      viewerRef.current = new Viewer('cesiumContainer', {
        terrain: Terrain.fromWorldTerrain({
          requestVertexNormals: false
        })
      })

      viewerRef.current.scene.globe.enableLighting = true

      if (viewerRef.current && GPXFiles.length > 0) {
        GPXFiles.forEach((file) => {
          const dataSource = new GpxDataSource()
          dataSource.load(file, {
            clampToGround: true
            // trackColor: Color.YELLOW.toCssColorString()
          })

          // Make sure viewerRef.current is not null before adding the data source
          if (viewerRef.current) {
            viewerRef.current.dataSources.add(dataSource)
          }
        })
      }
    }

    const destroyViewer = (): void => {
      viewerRef.current?.destroy()
    }

    if (apiKey) {
      initializeViewer()
    }

    return destroyViewer
  }, [apiKey, GPXFiles])

  const handleApiKeySubmit = (value: string): void => {
    setApiKey(value)
  }

  const handleGpxFileUpload = (files: File[]): void => {
    setGPXFiles(files)
  }

  return (
    <>
      <div id="cesiumContainer"></div>
      <GpxForm onFileUpload={handleGpxFileUpload} />
      {!apiKey && <ApiForm onSubmit={handleApiKeySubmit} />}
    </>
  )
}

export default App
