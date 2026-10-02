import { WeatherData } from '../types/weather'

const API_URL =
  'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline'

interface WeatherQuery {
  latitude: number
  longitude: number
  date: Date
  apiKey: string
}

export async function fetchWeather({
  latitude,
  longitude,
  date,
  apiKey
}: WeatherQuery): Promise<WeatherData> {
  const day = date.toISOString().slice(0, 10)
  const params = new URLSearchParams({
    unitGroup: 'metric',
    include: 'days,hours',
    contentType: 'json',
    key: apiKey
  })

  const response = await fetch(`${API_URL}/${latitude},${longitude}/${day}/${day}?${params}`)

  if (!response.ok) {
    const reason = response.status === 401 ? 'the API key was rejected' : await response.text()
    throw new Error(`Failed to fetch weather data: ${reason || response.statusText}`)
  }

  return response.json()
}

/**
 * Wall clock time at the weather location, exposed through the UTC fields of the returned date
 */
export function toLocationTime(date: Date, tzoffset: number): Date {
  return new Date(date.getTime() + tzoffset * 3600_000)
}

export function formatUtcOffset(tzoffset: number): string {
  const sign = tzoffset < 0 ? '-' : '+'
  const hours = Math.floor(Math.abs(tzoffset))
  const minutes = Math.round((Math.abs(tzoffset) - hours) * 60)
  return `UTC${sign}${hours}${minutes ? `:${String(minutes).padStart(2, '0')}` : ''}`
}
