import { useReducer } from 'react'
import { Track } from '../types/track'

type TrackAction =
  | { type: 'add'; tracks: Track[] }
  | { type: 'remove'; id: string }
  | { type: 'update'; id: string; changes: Partial<Pick<Track, 'color' | 'visible'>> }
  | { type: 'move'; id: string; toIndex: number }

function tracksReducer(tracks: Track[], action: TrackAction): Track[] {
  switch (action.type) {
    case 'add':
      return [...tracks, ...action.tracks]
    case 'remove':
      return tracks.filter((track) => track.id !== action.id)
    case 'update':
      return tracks.map((track) =>
        track.id === action.id ? { ...track, ...action.changes } : track
      )
    case 'move': {
      const fromIndex = tracks.findIndex((track) => track.id === action.id)
      const toIndex = Math.max(0, Math.min(tracks.length - 1, action.toIndex))
      if (fromIndex === -1 || fromIndex === toIndex) return tracks
      const next = [...tracks]
      next.splice(toIndex, 0, ...next.splice(fromIndex, 1))
      return next
    }
  }
}

export interface TrackActions {
  add: (tracks: Track[]) => void
  remove: (id: string) => void
  update: (id: string, changes: Partial<Pick<Track, 'color' | 'visible'>>) => void
  move: (id: string, toIndex: number) => void
}

export function useTracks(): [Track[], TrackActions] {
  const [tracks, dispatch] = useReducer(tracksReducer, [])

  const actions: TrackActions = {
    add: (added) => dispatch({ type: 'add', tracks: added }),
    remove: (id) => dispatch({ type: 'remove', id }),
    update: (id, changes) => dispatch({ type: 'update', id, changes }),
    move: (id, toIndex) => dispatch({ type: 'move', id, toIndex })
  }

  return [tracks, actions]
}
