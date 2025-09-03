import { JSX, useEffect, useRef, useState } from 'react'
import {
  Color,
  GpxDataSource,
  GregorianDate,
  Ion,
  Terrain,
  Viewer,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  defined
} from 'cesium'
import { ApiForm } from './components/ApiForm'
import { GpxForm } from './components/GpxForm'
import { WeatherData } from './types/weatherData'
import { WeatherForm } from './components/WeatherForm'
import { TrackInfoPanel } from './components/TrackInfoPanel'
import { TrackInfo, GPXFileData } from './types/trackInfo'
import './App.css'
import 'cesium/Build/Cesium/Widgets/widgets.css'

const hexToRgb = (hex: string): Color => {
  const red = parseInt(hex.substring(1, 3), 16)
  const green = parseInt(hex.substring(3, 5), 16)
  const blue = parseInt(hex.substring(5, 7), 16)
  return Color.fromBytes(red, green, blue, 255)
}

const initializeViewer = async (
  apiKey: string,
<<<<<<< HEAD
  GPXFiles: { file: File; color: string }[],
<<<<<<< HEAD
  viewerRef: RefObject<Viewer | null>
=======
=======
  GPXFiles: GPXFileData[],
>>>>>>> 4bea2bb (Complete GPX track click functionality with comprehensive track information display)
  viewerRef,
  onTrackClick: (trackInfo: TrackInfo) => void
>>>>>>> 8bf57a9 (Implement basic GPX track click detection with track info panel)
): Promise<void> => {
  Ion.defaultAccessToken = apiKey

  viewerRef.current = new Viewer('cesiumContainer', {
    terrain: Terrain.fromWorldTerrain({
      requestVertexNormals: false
    })
  })

  viewerRef.current.scene.globe.enableLighting = true

  // Add click handler for track selection
  const handler = new ScreenSpaceEventHandler(viewerRef.current.scene.canvas)
  // Store mapping between data sources and track info
  const dataSourceToTrackInfo = new Map()

  handler.setInputAction((click) => {
    const pickedObject = viewerRef.current?.scene.pick(click.position)

    if (defined(pickedObject) && defined(pickedObject.id)) {
      const entity = pickedObject.id

      // Check if the clicked entity is from a GPX track
      if (entity.polyline || entity.path) {
        // Find the data source that contains this entity
        const dataSources = viewerRef.current?.dataSources
        if (dataSources) {
          for (let i = 0; i < dataSources.length; i++) {
            const dataSource = dataSources.get(i)
            if (dataSource.entities.contains(entity)) {
              const trackInfo = dataSourceToTrackInfo.get(dataSource)
              if (trackInfo) {
                onTrackClick(trackInfo)
                return
              }
            }
          }
        }

        // Fallback: use the first available track info
        const trackInfo = GPXFiles.find((file) => file.trackInfo)?.trackInfo
        if (trackInfo) {
          onTrackClick(trackInfo)
        }
      }
    }
  }, ScreenSpaceEventType.LEFT_CLICK)

  if (viewerRef.current && GPXFiles.length > 0) {
    for (const fileData of GPXFiles) {
      const dataSource = new GpxDataSource()
      await dataSource.load(fileData.file, {
        clampToGround: true,
        trackColor: hexToRgb(fileData.color) as unknown as string
      })

      // Associate the data source with track info
      if (fileData.trackInfo) {
        dataSourceToTrackInfo.set(dataSource, fileData.trackInfo)
      }

      // Make sure viewerRef.current is not null before adding the data source
      if (viewerRef.current) {
        viewerRef.current.dataSources.add(dataSource)
      }
    }
  }
}

function App(): JSX.Element {
  const [apiKey, setApiKey] = useState<string>('')
  const [GPXFiles, setGPXFiles] = useState<GPXFileData[]>([]) // Store multiple GPX files
  const [weatherFormVisible, setWeatherFormVisible] = useState<boolean>(false)
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [currentClock, setCurrentClock] = useState<GregorianDate | null>(null)
  const [selectedTrackInfo, setSelectedTrackInfo] = useState<TrackInfo | null>(null)
  const viewerRef = useRef<Viewer | null>(null)

  const handleTrackClick = (trackInfo: TrackInfo): void => {
    setSelectedTrackInfo(trackInfo)
  }

  const handleCloseTrackInfo = (): void => {
    setSelectedTrackInfo(null)
  }

  useEffect(() => {
    const destroyViewer = (): void => {
      viewerRef.current?.destroy()
    }

    if (apiKey) {
      initializeViewer(apiKey, GPXFiles, viewerRef, handleTrackClick)
    }

    return destroyViewer
  }, [apiKey, GPXFiles])

  const handleApiKeySubmit = (value: string): void => {
    setApiKey(value)
  }

  const handleGpxFileUpload = (files: GPXFileData[]): void => {
    setGPXFiles(files)
  }

  const toggleWeatherForm = (visible?: boolean): void => {
    setWeatherFormVisible(visible !== undefined ? visible : !weatherFormVisible)
  }

  const getWeather = (data: SetStateAction<WeatherData | null>): void => {
    setWeatherData(data)
  }

  const handleClockUpdate = (clock: GregorianDate): void => {
    setCurrentClock(clock)
  }

  return (
    <>
      <div id="cesiumContainer"></div>
      {apiKey && (
        <div className="left-sidebar">
          <GpxForm
            onFileUpload={handleGpxFileUpload}
            toggleWeatherForm={toggleWeatherForm}
            getWeather={getWeather}
            handleClockUpdate={handleClockUpdate}
            viewerRef={viewerRef}
            status={weatherFormVisible}
            weatherStatus={!!weatherData}
          />
          {weatherFormVisible && (
            <WeatherForm weatherData={weatherData} currentClock={currentClock} />
          )}
        </div>
      )}
      {!apiKey && <ApiForm onSubmit={handleApiKeySubmit} />}
      <TrackInfoPanel trackInfo={selectedTrackInfo} onClose={handleCloseTrackInfo} />
    </>
  )
}

export default App
