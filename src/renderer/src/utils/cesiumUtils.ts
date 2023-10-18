import { Cartographic, GregorianDate, JulianDate, Math, Viewer } from 'cesium'
import { RefObject } from 'react'
import { WeatherData } from '../types/weatherData'

const defaultDate = {
  year: 2023,
  month: 2,
  day: 12,
  hour: 8,
  minute: 34,
  second: 4,
  millisecond: 112.30769229587168,
  isLeapSecond: false
}

export const getCoordinates = (
  viewerRef: RefObject<Viewer | null>,
  handleClockUpdate: (date: GregorianDate) => void
): { latitude: number; longitude: number; date: GregorianDate } => {
  if (!viewerRef.current) {
    return { latitude: 0, longitude: 0, date: defaultDate }
  }

  const mainDataSource = viewerRef.current.dataSources.get(0)
  const entitiesUnkown = mainDataSource.entities as unknown
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const activeEntity = (entitiesUnkown as { _entities: any })._entities?._array[0]
  const activeEntityPosition = activeEntity._position.getValue(viewerRef.current.clock.currentTime)

  const date = JulianDate.toGregorianDate(viewerRef.current.clock.currentTime)
  handleClockUpdate(date)

  const cartographic = Cartographic.fromCartesian(activeEntityPosition)

  const latDegrees = Math.toDegrees(cartographic.latitude)
  const longDegrees = Math.toDegrees(cartographic.longitude)

  return { latitude: latDegrees, longitude: longDegrees, date }
}

export const fetchWeatherData = async (
  latitude: number,
  longitude: number,
  date: GregorianDate,
  weatherApiKey: string
): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${latitude}%2C${longitude}/${date.year}-${date.month}-${date.day}/${date.year}-${date.month}-${date.day}?unitGroup=metric&include=days%2Chours&key=${weatherApiKey}&contentType=json`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch weather data')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}
