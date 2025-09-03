import React, { JSX, RefObject, useState } from 'react'
import { Color, GregorianDate, Viewer } from 'cesium'
import { ApiForm } from './ApiForm'
import { getCoordinates, fetchWeatherData } from '../utils/cesiumUtils'
import { WeatherData } from '../types/weatherData'
import { GPXFileData } from '../types/trackInfo'
import { parseGPXFile } from '../utils/gpxParser'
import './GpxForm.css'

interface GpxFormProps {
  getWeather: (data: WeatherData) => void
  handleClockUpdate: (clock: GregorianDate) => void
  onFileUpload: (files: GPXFileData[]) => void
  toggleWeatherForm: (visible?: boolean) => void
  status: boolean
  viewerRef: RefObject<Viewer | null>
  weatherStatus: boolean
}

export function GpxForm({
  getWeather,
  handleClockUpdate,
  onFileUpload,
  toggleWeatherForm,
  status,
  viewerRef,
  weatherStatus
}: GpxFormProps): JSX.Element {
  const [weatherApiKey, setWeatherApiKey] = useState<string>('')
  const [weatherApiFormVisible, setWeatherApiFormVisible] = useState<boolean>(false)
  const [selectedFiles, setSelectedFiles] = useState<GPXFileData[]>([])

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const newFiles = Array.from(event.target.files || [])

    // Process each file and extract track information
    const newTracks: GPXFileData[] = []

    for (const file of newFiles) {
      try {
        // Read the file content
        const fileContent = await file.text()

        // Parse GPX and extract track info
        const trackInfo = parseGPXFile(fileContent, file.name)

        const gpxFileData: GPXFileData = {
          file,
          color: Color.YELLOW.toCssColorString(),
          trackInfo: trackInfo || undefined
        }

        newTracks.push(gpxFileData)
      } catch (error) {
        console.error('Error processing GPX file:', file.name, error)

        // Add file without track info if parsing fails
        const gpxFileData: GPXFileData = {
          file,
          color: Color.YELLOW.toCssColorString()
        }

        newTracks.push(gpxFileData)
      }
    }

    setSelectedFiles([...selectedFiles, ...newTracks])
  }

  const handleColorChange = (index: number, color: string): void => {
    const updatedTracks = [...selectedFiles]
    updatedTracks[index].color = color
    setSelectedFiles(updatedTracks)
  }

  const handleDelete = (index: number): void => {
    const updatedTracks = selectedFiles.filter((_, i) => i !== index)
    setSelectedFiles(updatedTracks)
  }

  const handleUpload = (): void => {
    onFileUpload(selectedFiles)
  }

  const handleHideWeatherClick = (): void => {
    toggleWeatherForm()
  }

  const handleApiKeySubmit = async (value: string): Promise<void> => {
    setWeatherApiKey(value)
    setWeatherApiFormVisible(false)
    const { latitude, longitude, date } = getCoordinates(viewerRef, handleClockUpdate)
    const weather = await fetchWeatherData(latitude, longitude, date, value)
    getWeather(weather)
    toggleWeatherForm(true)
  }

  const handleRefreshWeatherClick = async (): Promise<void> => {
    if (!weatherApiKey) {
      setWeatherApiFormVisible(true)
      return
    }
    const { latitude, longitude, date } = getCoordinates(viewerRef, handleClockUpdate)
    const weather = await fetchWeatherData(latitude, longitude, date, weatherApiKey)
    getWeather(weather)
    toggleWeatherForm(true)
  }

  return (
    <div className="gpx-form">
      <div className="gpx-form__upload-container">
        <div className="gpx-form__btn-container">
          <label className="gpx-form__upload-label" htmlFor="upload">
            Choose files
          </label>
          <input
            id="upload"
            type="file"
            accept=".gpx"
            multiple
            hidden
            onChange={handleFileChange}
          />
          <button className="gpx-form__upload-btn" onClick={handleUpload}>
            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
              <path
                fill="#fff"
                d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"
              />
            </svg>
          </button>
        </div>
        <div className="gpx-form__btn-container">
          {weatherStatus && (
            <button className="gpx-form__hide-btn" onClick={handleHideWeatherClick}>
              {status ? 'Hide weather' : 'Show weather'}
            </button>
          )}
          <button className="gpx-form__data-btn" onClick={handleRefreshWeatherClick}>
            {status ? 'Refresh weather' : 'Get weather'}
          </button>
        </div>
      </div>
      <div className="gpx-form__file-container">
        {selectedFiles.map((track, index) => (
          <div key={index} className="gpx-form__file">
            <span>{track.file.name}</span>
            <div className="gpx-form__right">
              <div className="gpx-form__color-container">
                <input
                  type="color"
                  value={track.color}
                  onChange={(e): void => handleColorChange(index, e.target.value)}
                />
              </div>
              <button onClick={(): void => handleDelete(index)} className="gpx-form__delete-btn">
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                  <path
                    fill="#fff"
                    d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      {weatherApiFormVisible && <ApiForm onSubmit={handleApiKeySubmit} />}
    </div>
  )
}
