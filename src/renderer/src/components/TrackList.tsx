import { DragEvent, JSX, KeyboardEvent, useState } from 'react'
import { Track } from '../types/track'
import { TrackActions } from '../hooks/useTracks'
import { usePreferences } from '../hooks/preferencesContext'
import { formatDistance } from '../utils/format'
import { Icon } from './Icon'
import './TrackList.css'

interface TrackListProps {
  tracks: Track[]
  selectedId: string | null
  actions: TrackActions
  onSelect: (id: string) => void
}

interface DropTarget {
  id: string
  after: boolean
}

export function TrackList({ tracks, selectedId, actions, onSelect }: TrackListProps): JSX.Element {
  const { preferences } = usePreferences()
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [dropTarget, setDropTarget] = useState<DropTarget | null>(null)

  const handleDragOver = (event: DragEvent<HTMLLIElement>, id: string): void => {
    if (!draggedId) return
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'

    const { top, height } = event.currentTarget.getBoundingClientRect()
    const after = event.clientY > top + height / 2
    if (dropTarget?.id !== id || dropTarget.after !== after) setDropTarget({ id, after })
  }

  const handleDrop = (): void => {
    if (draggedId && dropTarget && draggedId !== dropTarget.id) {
      const fromIndex = tracks.findIndex((track) => track.id === draggedId)
      let toIndex = tracks.findIndex((track) => track.id === dropTarget.id)
      if (dropTarget.after) toIndex++
      // Removing the dragged track first shifts the following ones up
      if (fromIndex < toIndex) toIndex--
      actions.move(draggedId, toIndex)
    }
    setDraggedId(null)
    setDropTarget(null)
  }

  const handleGripKeyDown = (event: KeyboardEvent, id: string, index: number): void => {
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return
    event.preventDefault()
    actions.move(id, event.key === 'ArrowUp' ? index - 1 : index + 1)
  }

  return (
    <ul className="track-list">
      {tracks.map((track, index) => {
        const classes = ['track-list__item']
        if (track.id === selectedId) classes.push('track-list__item--selected')
        if (!track.visible) classes.push('track-list__item--hidden')
        if (track.id === draggedId) classes.push('track-list__item--dragging')
        if (dropTarget?.id === track.id && draggedId !== track.id) {
          classes.push(
            dropTarget.after ? 'track-list__item--drop-after' : 'track-list__item--drop-before'
          )
        }

        return (
          <li
            key={track.id}
            className={classes.join(' ')}
            draggable
            onDragStart={(event): void => {
              event.dataTransfer.effectAllowed = 'move'
              setDraggedId(track.id)
            }}
            onDragOver={(event): void => handleDragOver(event, track.id)}
            onDrop={handleDrop}
            onDragEnd={handleDrop}
          >
            <button
              className="track-list__grip"
              title="Drag to reorder, or use the arrow keys"
              aria-label={`Reorder ${track.name}`}
              onKeyDown={(event): void => handleGripKeyDown(event, track.id, index)}
            >
              <Icon name="grip" />
            </button>
            <label className="track-list__color" title="Track color">
              <input
                type="color"
                value={track.color}
                aria-label={`Color of ${track.name}`}
                onChange={(event): void => actions.update(track.id, { color: event.target.value })}
              />
            </label>
            <button className="track-list__main" onClick={(): void => onSelect(track.id)}>
              <span className="track-list__name">{track.name}</span>
              <span className="track-list__meta">
                {track.stats
                  ? formatDistance(track.stats.distance, preferences.unitSystem)
                  : 'No track data'}
              </span>
            </button>
            <button
              className="icon-button"
              title={track.visible ? 'Hide track' : 'Show track'}
              aria-label={`${track.visible ? 'Hide' : 'Show'} ${track.name}`}
              aria-pressed={!track.visible}
              onClick={(): void => actions.update(track.id, { visible: !track.visible })}
            >
              <Icon name={track.visible ? 'eye' : 'eyeOff'} />
            </button>
            <button
              className="icon-button icon-button--danger"
              title="Remove track"
              aria-label={`Remove ${track.name}`}
              onClick={(): void => actions.remove(track.id)}
            >
              <Icon name="close" />
            </button>
          </li>
        )
      })}
    </ul>
  )
}
