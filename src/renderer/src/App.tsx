import { JSX, useEffect, useRef, useState } from 'react'
import { Color, GpxDataSource, GregorianDate, Ion, Terrain, Viewer } from 'cesium'
import { ApiForm } from './components/ApiForm'
import { GpxForm } from './components/GpxForm'
import { WeatherData } from './types/weatherData'
import { WeatherForm } from './components/WeatherForm'
import { TemperatureUnit } from './utils/temperatureUtils'
import './App.css'
import 'cesium/Build/Cesium/Widgets/widgets.css'

const hexToRgb = (hex): Color => {
  const red = parseInt(hex.substring(1, 3), 16)
  const green = parseInt(hex.substring(3, 5), 16)
  const blue = parseInt(hex.substring(5, 7), 16)
  return Color.fromBytes(red, green, blue, 255)
}

const initializeViewer = async (
  apiKey: string,
  GPXFiles: { file: File; color: string }[],
  viewerRef
): Promise<void> => {
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
      dataSource.load(file.file, {
        clampToGround: true,
        trackColor: hexToRgb(file.color) as unknown as string
      })

      // Make sure viewerRef.current is not null before adding the data source
      if (viewerRef.current) {
        viewerRef.current.dataSources.add(dataSource)
      }
    })
  }
}

function App(): JSX.Element {
  const [apiKey, setApiKey] = useState<string>('')
  const [GPXFiles, setGPXFiles] = useState<{ file: File; color: string }[]>([]) // Store multiple GPX files
  const [weatherFormVisible, setWeatherFormVisible] = useState<boolean>(false)
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [currentClock, setCurrentClock] = useState<GregorianDate | null>(null)
  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>('C')
  const viewerRef = useRef<Viewer | null>(null)

  // Load temperature unit preference from localStorage on mount
  useEffect(() => {
    const savedUnit = localStorage.getItem('temperatureUnit') as TemperatureUnit
    if (savedUnit && ['C', 'F', 'K'].includes(savedUnit)) {
      setTemperatureUnit(savedUnit)
    }
  }, [])

  // Save temperature unit preference to localStorage when changed
  useEffect(() => {
    localStorage.setItem('temperatureUnit', temperatureUnit)
  }, [temperatureUnit])

  useEffect(() => {
    const destroyViewer = (): void => {
      viewerRef.current?.destroy()
    }

    if (apiKey) {
      initializeViewer(apiKey, GPXFiles, viewerRef)
    }

    return destroyViewer
  }, [apiKey, GPXFiles])

  const handleApiKeySubmit = (value: string): void => {
    setApiKey(value)
  }

  const handleGpxFileUpload = (files: { file: File; color: string }[]): void => {
    setGPXFiles(files)
  }

  const toggleWeatherForm = (visible?: boolean): void => {
    setWeatherFormVisible(visible !== undefined ? visible : !weatherFormVisible)
  }

  const getWeather = (data): void => {
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
            <WeatherForm 
              weatherData={weatherData} 
              currentClock={currentClock}
              temperatureUnit={temperatureUnit}
              onTemperatureUnitChange={setTemperatureUnit}
            />
          )}
        </div>
      )}
      {!apiKey && <ApiForm onSubmit={handleApiKeySubmit} />}
    </>
  )
}

export default App
