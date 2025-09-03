import { JSX } from 'react'
import { TrackInfo } from '../types/trackInfo'
import { formatDistance, formatElevation, formatDuration, formatSpeed } from '../utils/trackUtils'
import './TrackInfoPanel.css'

interface TrackInfoPanelProps {
  trackInfo: TrackInfo | null
  onClose: () => void
}

export function TrackInfoPanel({ trackInfo, onClose }: TrackInfoPanelProps): JSX.Element | null {
  if (!trackInfo) {
    return null
  }

  return (
    <div className="track-info-panel">
      <div className="track-info-panel__header">
        <h3 className="track-info-panel__title">{trackInfo.name}</h3>
        <button className="track-info-panel__close" onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512">
            <path
              fill="currentColor"
              d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
            />
          </svg>
        </button>
      </div>

      <div className="track-info-panel__content">
        <div className="track-info-panel__section">
          <h4>Distance & Duration</h4>
          <div className="track-info-panel__row">
            <span className="track-info-panel__label">Total Distance:</span>
            <span className="track-info-panel__value">{formatDistance(trackInfo.distance)}</span>
          </div>
          {trackInfo.duration && (
            <div className="track-info-panel__row">
              <span className="track-info-panel__label">Duration:</span>
              <span className="track-info-panel__value">{formatDuration(trackInfo.duration)}</span>
            </div>
          )}
          {trackInfo.averageSpeed && (
            <div className="track-info-panel__row">
              <span className="track-info-panel__label">Average Speed:</span>
              <span className="track-info-panel__value">{formatSpeed(trackInfo.averageSpeed)}</span>
            </div>
          )}
        </div>

        <div className="track-info-panel__section">
          <h4>Elevation</h4>
          <div className="track-info-panel__row">
            <span className="track-info-panel__label">Elevation Gain:</span>
            <span className="track-info-panel__value">
              {formatElevation(trackInfo.elevationGain)}
            </span>
          </div>
          <div className="track-info-panel__row">
            <span className="track-info-panel__label">Elevation Loss:</span>
            <span className="track-info-panel__value">
              {formatElevation(trackInfo.elevationLoss)}
            </span>
          </div>
          <div className="track-info-panel__row">
            <span className="track-info-panel__label">Min Elevation:</span>
            <span className="track-info-panel__value">
              {formatElevation(trackInfo.minElevation)}
            </span>
          </div>
          <div className="track-info-panel__row">
            <span className="track-info-panel__label">Max Elevation:</span>
            <span className="track-info-panel__value">
              {formatElevation(trackInfo.maxElevation)}
            </span>
          </div>
        </div>

        <div className="track-info-panel__section">
          <h4>Track Details</h4>
          <div className="track-info-panel__row">
            <span className="track-info-panel__label">Track Points:</span>
            <span className="track-info-panel__value">{trackInfo.points.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
