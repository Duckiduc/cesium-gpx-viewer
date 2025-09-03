import {
  Cartographic,
  Entity,
  Math as CesiumMath,
  SampledPositionProperty,
  JulianDate
} from 'cesium'
import { TrackInfo, TrackPoint } from '../types/trackInfo'

/**
 * Calculate the distance between two points on Earth using the Haversine formula
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000 // Earth's radius in meters
  const dLat = CesiumMath.toRadians(lat2 - lat1)
  const dLon = CesiumMath.toRadians(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(CesiumMath.toRadians(lat1)) *
      Math.cos(CesiumMath.toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * Extract track points from a Cesium entity
 */
function extractTrackPoints(entity: Entity): TrackPoint[] {
  const points: TrackPoint[] = []

  // For GPX tracks, we'll try to extract points from the polyline or path
  if (entity.polyline && entity.polyline.positions) {
    const positions = entity.polyline.positions.getValue(new JulianDate())

    if (positions && Array.isArray(positions)) {
      positions.forEach((position) => {
        const cartographic = Cartographic.fromCartesian(position)
        const point: TrackPoint = {
          latitude: CesiumMath.toDegrees(cartographic.latitude),
          longitude: CesiumMath.toDegrees(cartographic.longitude),
          elevation: cartographic.height
        }
        points.push(point)
      })
    }
  } else if (entity.position && entity.position instanceof SampledPositionProperty) {
    // For tracked entities with time-based positions
    // This is a more complex case that would require accessing internal properties
    // For now, we'll skip time-based analysis and focus on static track data
  }

  return points
}

/**
 * Calculate comprehensive track information from track points
 */
export function calculateTrackInfo(entity: Entity): TrackInfo | null {
  if (!entity || !entity.name) {
    return null
  }

  const points = extractTrackPoints(entity)

  if (points.length < 2) {
    return null
  }

  let totalDistance = 0
  let elevationGain = 0
  let elevationLoss = 0
  let minElevation = Number.MAX_VALUE
  let maxElevation = Number.MIN_VALUE
  let totalDuration = 0
  let hasTimeData = false

  // Check if we have time data (for now, assume we don't from polyline data)
  if (points.length > 0 && points[0].time && points[points.length - 1].time) {
    hasTimeData = true
    totalDuration = points[points.length - 1].time!.getTime() - points[0].time!.getTime()
  }

  // Calculate statistics
  for (let i = 0; i < points.length; i++) {
    const point = points[i]

    // Update elevation stats
    if (point.elevation !== undefined) {
      minElevation = Math.min(minElevation, point.elevation)
      maxElevation = Math.max(maxElevation, point.elevation)

      // Calculate elevation gain/loss
      if (i > 0 && points[i - 1].elevation !== undefined) {
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
      totalDistance += calculateDistance(
        prevPoint.latitude,
        prevPoint.longitude,
        point.latitude,
        point.longitude
      )
    }
  }

  // Handle case where no elevation data was found
  if (minElevation === Number.MAX_VALUE) {
    minElevation = 0
    maxElevation = 0
  }

  const trackInfo: TrackInfo = {
    name: entity.name || 'Unknown Track',
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
