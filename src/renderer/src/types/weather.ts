// Subset of the Visual Crossing timeline response used by the app.
// Values are always requested with `unitGroup=metric`.
export interface WeatherHour {
  datetime: string
  temp: number
  feelslike: number
  humidity: number
  precipprob: number
  windspeed: number
  conditions: string
  icon: string
}

export interface WeatherDay {
  datetime: string // YYYY-MM-DD in the location's timezone
  tempmax: number
  tempmin: number
  temp: number
  feelslikemax: number
  feelslikemin: number
  humidity: number
  precipprob: number
  windspeed: number
  conditions: string
  description: string
  icon: string
  hours: WeatherHour[]
}

export interface WeatherData {
  latitude: number
  longitude: number
  resolvedAddress: string
  address: string
  timezone: string
  tzoffset: number // hours from UTC
  days: WeatherDay[]
}

export interface WeatherReport {
  data: WeatherData
  observedAt: Date // viewer clock time the report was requested for
  trackName: string
}
