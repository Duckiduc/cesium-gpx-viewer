import { TrackInfo, TrackPoint } from '../types/trackInfo'

/**
 * Parse GPX file content to extract track information
 */
export function parseGPXFile(fileContent: string, fileName: string): TrackInfo | null {
  try {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(fileContent, 'text/xml')

    // Check for parsing errors
    const parserError = xmlDoc.querySelector('parsererror')
    if (parserError) {
      console.error('GPX parsing error:', parserError.textContent)
      return null
    }

    // Find track segments
    const trksegs = xmlDoc.querySelectorAll('trkseg')
    if (trksegs.length === 0) {
      console.warn('No track segments found in GPX file')
      return null
    }

    const allPoints: TrackPoint[] = []

    // Extract all track points from all segments
    trksegs.forEach((trkseg) => {
      const trkpts = trkseg.querySelectorAll('trkpt')

      trkpts.forEach((trkpt) => {
        const lat = parseFloat(trkpt.getAttribute('lat') || '0')
        const lon = parseFloat(trkpt.getAttribute('lon') || '0')

        // Extract elevation
        const eleElement = trkpt.querySelector('ele')
        const elevation = eleElement ? parseFloat(eleElement.textContent || '0') : undefined

        // Extract time
        const timeElement = trkpt.querySelector('time')
        const time = timeElement ? new Date(timeElement.textContent || '') : undefined

        const point: TrackPoint = {
          latitude: lat,
          longitude: lon,
          elevation,
          time
        }

        allPoints.push(point)
      })
    })

    if (allPoints.length < 2) {
      console.warn('Insufficient track points found in GPX file')
      return null
    }

    return calculateTrackInfoFromPoints(allPoints, fileName)
  } catch (error) {
    console.error('Error parsing GPX file:', error)
    return null
  }
}

/**
 * Calculate track information from an array of track points
 */
function calculateTrackInfoFromPoints(points: TrackPoint[], fileName: string): TrackInfo {
  let totalDistance = 0
  let elevationGain = 0
  let elevationLoss = 0
  let minElevation = Number.MAX_VALUE
  let maxElevation = Number.MIN_VALUE
  let totalDuration = 0
  let hasTimeData = false
  let hasElevationData = false

  // Check if we have time data
  if (points[0].time && points[points.length - 1].time) {
    hasTimeData = true
    totalDuration = points[points.length - 1].time!.getTime() - points[0].time!.getTime()
  }

  // Calculate statistics
  for (let i = 0; i < points.length; i++) {
    const point = points[i]

    // Update elevation stats
    if (point.elevation !== undefined && !isNaN(point.elevation)) {
      hasElevationData = true
      minElevation = Math.min(minElevation, point.elevation)
      maxElevation = Math.max(maxElevation, point.elevation)

      // Calculate elevation gain/loss
      if (i > 0 && points[i - 1].elevation !== undefined && !isNaN(points[i - 1].elevation!)) {
        const elevationDiff = point.elevation - points[i - 1].elevation!
        if (elevationDiff > 0) {
          elevationGain += elevationDiff
        } else {
          elevationLoss += Math.abs(elevationDiff)
        }
      }
    }

    // Calculate distance
    if (i > 0) {
      const prevPoint = points[i - 1]
      totalDistance += calculateHaversineDistance(
        prevPoint.latitude,
        prevPoint.longitude,
        point.latitude,
        point.longitude
      )
    }
  }

  // Handle case where no elevation data was found
  if (!hasElevationData) {
    minElevation = 0
    maxElevation = 0
    elevationGain = 0
    elevationLoss = 0
  }

  const trackInfo: TrackInfo = {
    name: getTrackName(fileName),
    distance: totalDistance,
    elevationGain,
    elevationLoss,
    minElevation,
    maxElevation,
    points: points.length
  }

  // Add time-based calculations if available
  if (hasTimeData && totalDuration > 0) {
    trackInfo.duration = totalDuration
    trackInfo.averageSpeed = totalDistance / (totalDuration / 1000) // m/s
  }

  return trackInfo
}

/**
 * Extract a clean track name from the file name
 */
function getTrackName(fileName: string): string {
  // Remove file extension and clean up the name
  const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '')
  return nameWithoutExt.replace(/[_-]/g, ' ').trim()
}

/**
 * Calculate the distance between two points using the Haversine formula
 */
function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000 // Earth's radius in meters
  const dLat = toRadians(lat2 - lat1)
  const dLon = toRadians(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

/**
 * Format distance for display
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`
  }
  return `${(meters / 1000).toFixed(2)} km`
}

/**
 * Format elevation for display
 */
export function formatElevation(meters: number): string {
  return `${Math.round(meters)} m`
}

/**
 * Format duration for display
 */
export function formatDuration(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`
  } else {
    return `${seconds}s`
  }
}

/**
 * Format speed for display
 */
export function formatSpeed(metersPerSecond: number): string {
  const kmh = metersPerSecond * 3.6
  return `${kmh.toFixed(1)} km/h`
}
