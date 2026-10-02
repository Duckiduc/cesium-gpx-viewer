import { Track } from '../types/track'
import { computeTrackStats, parseGpxPoints, trackNameFromFile } from './gpx'

// High-contrast colors that stay readable over satellite imagery
const TRACK_COLORS = ['#ffd60a', '#ff5d8f', '#4cc9f0', '#b8f24b', '#ff9f1c', '#c77dff']

export const trackColorAt = (index: number): string => TRACK_COLORS[index % TRACK_COLORS.length]

export const isGpxFile = (file: File): boolean => file.name.toLowerCase().endsWith('.gpx')

/**
 * Read a GPX file and compute its statistics.
 * Throws when the file is not valid XML.
 */
export async function createTrack(file: File, color: string): Promise<Track> {
  const points = parseGpxPoints(await file.text())

  return {
    id: crypto.randomUUID(),
    name: trackNameFromFile(file.name),
    file,
    color,
    visible: true,
    stats: computeTrackStats(points)
  }
}
