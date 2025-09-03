export interface GPXFileData {
  file: File
  color: string
  trackInfo?: TrackInfo
}

export interface TrackInfo {
  name: string
  distance: number // in meters
  duration?: number // in milliseconds if time data available
  elevationGain: number // in meters
  elevationLoss: number // in meters
  minElevation: number // in meters
  maxElevation: number // in meters
  points: number // number of track points
  averageSpeed?: number // in m/s if time data available
}

export interface TrackPoint {
  latitude: number
  longitude: number
  elevation?: number
  time?: Date
}
