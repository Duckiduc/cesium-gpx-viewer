import { TemperatureUnit, UnitSystem } from '../types/preferences'

const METERS_PER_MILE = 1609.344
const FEET_PER_METER = 3.28084

export function formatDistance(meters: number, units: UnitSystem): string {
  if (units === 'imperial') {
    const miles = meters / METERS_PER_MILE
    return miles < 0.1 ? `${Math.round(meters * FEET_PER_METER)} ft` : `${miles.toFixed(2)} mi`
  }
  return meters < 1000 ? `${Math.round(meters)} m` : `${(meters / 1000).toFixed(2)} km`
}

export function formatElevation(meters: number, units: UnitSystem): string {
  return units === 'imperial'
    ? `${Math.round(meters * FEET_PER_METER).toLocaleString()} ft`
    : `${Math.round(meters).toLocaleString()} m`
}

export function formatSpeed(metersPerSecond: number, units: UnitSystem): string {
  const kmh = metersPerSecond * 3.6
  return formatKmh(kmh, units)
}

export function formatKmh(kmh: number, units: UnitSystem): string {
  return units === 'imperial'
    ? `${((kmh * 1000) / METERS_PER_MILE).toFixed(1)} mph`
    : `${kmh.toFixed(1)} km/h`
}

export function formatDuration(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`
  if (minutes > 0) return `${minutes}m ${seconds}s`
  return `${seconds}s`
}

export function convertTemperature(celsius: number, unit: TemperatureUnit): number {
  if (unit === 'F') return (celsius * 9) / 5 + 32
  if (unit === 'K') return celsius + 273.15
  return celsius
}

export function formatTemperature(celsius: number, unit: TemperatureUnit): string {
  const value = Math.round(convertTemperature(celsius, unit))
  return unit === 'K' ? `${value} K` : `${value}°${unit}`
}
