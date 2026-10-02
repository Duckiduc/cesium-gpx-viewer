export type UnitSystem = 'metric' | 'imperial'
export type TemperatureUnit = 'C' | 'F' | 'K'

export interface Preferences {
  cesiumToken: string
  weatherApiKey: string
  unitSystem: UnitSystem
  temperatureUnit: TemperatureUnit
  globeLighting: boolean
}
