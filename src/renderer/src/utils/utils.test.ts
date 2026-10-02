import { describe, expect, it } from 'vitest'
import { computeTrackStats, haversineDistance, trackNameFromFile } from './gpx'
import {
  formatDistance,
  formatDuration,
  formatElevation,
  formatSpeed,
  formatTemperature
} from './format'
import { formatUtcOffset, toLocationTime } from './weather'

describe('computeTrackStats', () => {
  it('returns null without at least two points', () => {
    expect(computeTrackStats([])).toBeNull()
    expect(computeTrackStats([{ latitude: 1, longitude: 1 }])).toBeNull()
  })

  it('computes distance, elevation and speed', () => {
    const stats = computeTrackStats([
      { latitude: 0, longitude: 0, elevation: -10, time: new Date('2024-01-01T10:00:00Z') },
      { latitude: 0, longitude: 0.01, elevation: 20, time: new Date('2024-01-01T10:05:00Z') },
      { latitude: 0, longitude: 0.02, elevation: 5, time: new Date('2024-01-01T10:10:00Z') }
    ])!

    expect(stats.distance).toBeCloseTo(2223.9, 0)
    expect(stats.elevationGain).toBe(30)
    expect(stats.elevationLoss).toBe(15)
    expect(stats.minElevation).toBe(-10)
    expect(stats.maxElevation).toBe(20)
    expect(stats.duration).toBe(600_000)
    expect(stats.startTime).toEqual(new Date('2024-01-01T10:00:00Z'))
    expect(stats.endTime).toEqual(new Date('2024-01-01T10:10:00Z'))
    expect(stats.averageSpeed).toBeCloseTo(stats.distance / 600, 5)
    expect(stats.start).toEqual({ latitude: 0, longitude: 0 })
  })

  it('handles tracks without elevation or time', () => {
    const stats = computeTrackStats([
      { latitude: 45, longitude: 6 },
      { latitude: 45.001, longitude: 6 }
    ])!

    expect(stats.hasElevation).toBe(false)
    expect(stats.minElevation).toBe(0)
    expect(stats.duration).toBeUndefined()
    expect(stats.averageSpeed).toBeUndefined()
  })

  it('finds the time span when the first and last points have no timestamp', () => {
    const stats = computeTrackStats([
      { latitude: 0, longitude: 0 },
      { latitude: 0, longitude: 0.001, time: new Date('2015-06-01T08:00:00Z') },
      { latitude: 0, longitude: 0.002, time: new Date('2015-06-01T09:00:00Z') },
      { latitude: 0, longitude: 0.003 }
    ])!

    expect(stats.startTime).toEqual(new Date('2015-06-01T08:00:00Z'))
    expect(stats.duration).toBe(3_600_000)
  })

  it('skips points without elevation when summing gain', () => {
    const stats = computeTrackStats([
      { latitude: 0, longitude: 0, elevation: 100 },
      { latitude: 0, longitude: 0.001 },
      { latitude: 0, longitude: 0.002, elevation: 150 }
    ])!

    expect(stats.elevationGain).toBe(50)
  })
})

describe('haversineDistance', () => {
  it('measures one degree of latitude', () => {
    const distance = haversineDistance({ latitude: 0, longitude: 0 }, { latitude: 1, longitude: 0 })
    expect(distance).toBeCloseTo(111_195, -1)
  })
})

describe('trackNameFromFile', () => {
  it('strips the extension and separators', () => {
    expect(trackNameFromFile('mont_blanc-day-1.gpx')).toBe('mont blanc day 1')
  })
})

describe('formatters', () => {
  it('formats metric and imperial values', () => {
    expect(formatDistance(850, 'metric')).toBe('850 m')
    expect(formatDistance(12_345, 'metric')).toBe('12.35 km')
    expect(formatDistance(1609.344, 'imperial')).toBe('1.00 mi')
    expect(formatElevation(1000, 'imperial')).toBe('3,281 ft')
    expect(formatSpeed(10, 'metric')).toBe('36.0 km/h')
    expect(formatSpeed(10, 'imperial')).toBe('22.4 mph')
    expect(formatDuration(3_725_000)).toBe('1h 2m 5s')
  })

  it('converts temperatures', () => {
    expect(formatTemperature(25, 'C')).toBe('25°C')
    expect(formatTemperature(25, 'F')).toBe('77°F')
    expect(formatTemperature(0, 'K')).toBe('273 K')
  })
})

describe('weather time helpers', () => {
  it('shifts to the location timezone across midnight', () => {
    const local = toLocationTime(new Date('2024-03-10T23:30:00Z'), 5.5)
    expect(local.toISOString()).toBe('2024-03-11T05:00:00.000Z')
    expect(toLocationTime(new Date('2024-03-10T01:00:00Z'), -8).getUTCDate()).toBe(9)
  })

  it('formats UTC offsets', () => {
    expect(formatUtcOffset(2)).toBe('UTC+2')
    expect(formatUtcOffset(-3.5)).toBe('UTC-3:30')
    expect(formatUtcOffset(0)).toBe('UTC+0')
  })
})
