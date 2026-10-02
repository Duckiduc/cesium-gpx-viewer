import { TrackPoint, TrackStats } from '../types/track'

const EARTH_RADIUS = 6371000 // in meters

/**
 * Extract the track points of every track segment in a GPX document
 */
export function parseGpxPoints(fileContent: string): TrackPoint[] {
  const xmlDoc = new DOMParser().parseFromString(fileContent, 'text/xml')

  const parserError = xmlDoc.querySelector('parsererror')
  if (parserError) {
    throw new Error(`Invalid GPX file: ${parserError.textContent?.trim() ?? 'parsing error'}`)
  }

  const points: TrackPoint[] = []

  xmlDoc.querySelectorAll('trkseg > trkpt').forEach((trkpt) => {
    const latitude = parseFloat(trkpt.getAttribute('lat') ?? '')
    const longitude = parseFloat(trkpt.getAttribute('lon') ?? '')
    if (Number.isNaN(latitude) || Number.isNaN(longitude)) return

    const elevation = parseFloat(trkpt.querySelector('ele')?.textContent ?? '')
    const time = new Date(trkpt.querySelector('time')?.textContent ?? '')

    points.push({
      latitude,
      longitude,
      elevation: Number.isNaN(elevation) ? undefined : elevation,
      time: Number.isNaN(time.getTime()) ? undefined : time
    })
  })

  return points
}

/**
 * Calculate track statistics from an array of track points
 */
export function computeTrackStats(points: TrackPoint[]): TrackStats | null {
  if (points.length < 2) return null

  let distance = 0
  let elevationGain = 0
  let elevationLoss = 0
  let minElevation = Infinity
  let maxElevation = -Infinity
  let previousElevation: number | undefined

  points.forEach((point, i) => {
    if (i > 0) distance += haversineDistance(points[i - 1], point)

    if (point.elevation === undefined) return
    minElevation = Math.min(minElevation, point.elevation)
    maxElevation = Math.max(maxElevation, point.elevation)

    if (previousElevation !== undefined) {
      const diff = point.elevation - previousElevation
      if (diff > 0) elevationGain += diff
      else elevationLoss -= diff
    }
    previousElevation = point.elevation
  })

  const hasElevation = previousElevation !== undefined

  const stats: TrackStats = {
    distance,
    hasElevation,
    elevationGain,
    elevationLoss,
    minElevation: hasElevation ? minElevation : 0,
    maxElevation: hasElevation ? maxElevation : 0,
    points: points.length,
    start: { latitude: points[0].latitude, longitude: points[0].longitude }
  }

  // Tolerate points without a timestamp at either end of the track
  const startTime = points.find((point) => point.time)?.time
  const endTime = points.findLast((point) => point.time)?.time
  if (startTime && endTime && endTime > startTime) {
    stats.startTime = startTime
    stats.endTime = endTime
    stats.duration = endTime.getTime() - startTime.getTime()
    stats.averageSpeed = distance / (stats.duration / 1000)
  }

  return stats
}

/**
 * Extract a clean track name from the file name
 */
export function trackNameFromFile(fileName: string): string {
  return (
    fileName
      .replace(/\.[^/.]+$/, '')
      .replace(/[_-]+/g, ' ')
      .trim() || fileName
  )
}

/**
 * Distance in meters between two points using the Haversine formula
 */
export function haversineDistance(
  a: Pick<TrackPoint, 'latitude' | 'longitude'>,
  b: Pick<TrackPoint, 'latitude' | 'longitude'>
): number {
  const dLat = toRadians(b.latitude - a.latitude)
  const dLon = toRadians(b.longitude - a.longitude)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(a.latitude)) * Math.cos(toRadians(b.latitude)) * Math.sin(dLon / 2) ** 2
  return 2 * EARTH_RADIUS * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}
