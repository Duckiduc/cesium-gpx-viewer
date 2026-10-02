export interface TrackPoint {
  latitude: number
  longitude: number
  elevation?: number
  time?: Date
}

export interface TrackStats {
  distance: number // in meters
  duration?: number // in milliseconds if time data available
  averageSpeed?: number // in m/s if time data available
  startTime?: Date // time of the first and last timestamped points
  endTime?: Date
  hasElevation: boolean
  elevationGain: number // in meters
  elevationLoss: number // in meters
  minElevation: number // in meters
  maxElevation: number // in meters
  points: number // number of track points
  start: { latitude: number; longitude: number }
}

export interface Track {
  id: string
  name: string
  file: File
  color: string // css hex string
  visible: boolean
  stats: TrackStats | null // null when the file has no usable track points
}
