import { JSX } from 'react'
import { Track } from '../types/track'
import { usePreferences } from '../hooks/preferencesContext'
import { formatDistance, formatDuration, formatElevation, formatSpeed } from '../utils/format'
import { Icon } from './Icon'
import './TrackDetails.css'

interface TrackDetailsProps {
  track: Track
  onFlyTo: () => void
  onClose: () => void
}

export function TrackDetails({ track, onFlyTo, onClose }: TrackDetailsProps): JSX.Element {
  const { unitSystem } = usePreferences().preferences
  const { stats } = track

  return (
    <section className="track-details">
      <header className="section-header">
        <span className="track-details__swatch" style={{ background: track.color }} />
        <h2 className="section-header__title track-details__title">{track.name}</h2>
        <button className="icon-button" title="Zoom to track" onClick={onFlyTo}>
          <Icon name="target" />
        </button>
        <button className="icon-button" title="Close details" onClick={onClose}>
          <Icon name="close" />
        </button>
      </header>

      {stats ? (
        <dl className="stat-grid">
          <Stat label="Distance" value={formatDistance(stats.distance, unitSystem)} />
          {stats.duration !== undefined && (
            <Stat label="Duration" value={formatDuration(stats.duration)} />
          )}
          {stats.averageSpeed !== undefined && (
            <Stat label="Avg speed" value={formatSpeed(stats.averageSpeed, unitSystem)} />
          )}
          {stats.hasElevation && (
            <>
              <Stat
                label="Elevation gain"
                value={formatElevation(stats.elevationGain, unitSystem)}
              />
              <Stat
                label="Elevation loss"
                value={formatElevation(stats.elevationLoss, unitSystem)}
              />
              <Stat label="Lowest" value={formatElevation(stats.minElevation, unitSystem)} />
              <Stat label="Highest" value={formatElevation(stats.maxElevation, unitSystem)} />
            </>
          )}
          <Stat label="Track points" value={stats.points.toLocaleString()} />
        </dl>
      ) : (
        <p className="empty">This file has no track points to measure.</p>
      )}
      {stats && !stats.hasElevation && <p className="empty">No elevation data in this file.</p>}
    </section>
  )
}

export function Stat({ label, value }: { label: string; value: string }): JSX.Element {
  return (
    <div className="stat">
      <dt className="stat__label">{label}</dt>
      <dd className="stat__value">{value}</dd>
    </div>
  )
}
