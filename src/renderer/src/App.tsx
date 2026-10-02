import { ChangeEvent, DragEvent, JSX, useRef, useState } from 'react'
import { JulianDate } from 'cesium'
import { PreferencesDialog } from './components/PreferencesDialog'
import { TrackDetails } from './components/TrackDetails'
import { TrackList } from './components/TrackList'
import { WeatherPanel, WeatherState } from './components/WeatherPanel'
import { Welcome } from './components/Welcome'
import { Icon } from './components/Icon'
import { usePreferences } from './hooks/preferencesContext'
import { useCesiumViewer } from './hooks/useCesiumViewer'
import { useTrackLayers } from './hooks/useTrackLayers'
import { useTracks } from './hooks/useTracks'
import { Track } from './types/track'
import { createTrack, isGpxFile, trackColorAt } from './utils/tracks'
import { fetchWeather } from './utils/weather'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import './App.css'

const hasFiles = (event: DragEvent): boolean => event.dataTransfer.types.includes('Files')

function App(): JSX.Element {
  const { preferences, updatePreferences } = usePreferences()
  const [tracks, trackActions] = useTracks()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [weather, setWeather] = useState<WeatherState>({ status: 'idle' })
  const [notice, setNotice] = useState<string | null>(null)
  const [preferencesOpen, setPreferencesOpen] = useState(false)
  const [fileDragging, setFileDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  // Number of tracks ever added, so colors keep cycling after removals
  const addedCountRef = useRef(0)

  const viewer = useCesiumViewer(containerRef, preferences.cesiumToken, preferences.globeLighting)

  const layers = useTrackLayers(viewer, tracks, {
    onPick: setSelectedId,
    onLoadError: (track: Track, error: unknown): void => {
      console.error('Error loading GPX file:', track.file.name, error)
      trackActions.remove(track.id)
      setNotice(`Could not display ${track.file.name}.`)
    }
  })

  const selectedTrack = tracks.find((track) => track.id === selectedId) ?? null
  // Weather is looked up for the selected track, or the first one
  const weatherTrack = selectedTrack ?? tracks[0] ?? null

  const addFiles = async (files: File[]): Promise<void> => {
    const gpxFiles = files.filter(isGpxFile)
    const failed = files.filter((file) => !isGpxFile(file)).map((file) => file.name)
    const added: Track[] = []

    for (const file of gpxFiles) {
      try {
        added.push(await createTrack(file, trackColorAt(addedCountRef.current++)))
      } catch (error) {
        console.error('Error processing GPX file:', file.name, error)
        failed.push(file.name)
      }
    }

    if (added.length > 0) trackActions.add(added)
    setNotice(failed.length > 0 ? `Could not read ${failed.join(', ')}.` : null)
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    addFiles(Array.from(event.target.files ?? []))
    // Allow selecting the same file again after removing it
    event.target.value = ''
  }

  const handleFileDrop = (event: DragEvent): void => {
    if (!hasFiles(event)) return
    event.preventDefault()
    setFileDragging(false)
    addFiles(Array.from(event.dataTransfer.files))
  }

  const handleSelect = (id: string): void => {
    setSelectedId(id)
    const track = tracks.find((candidate) => candidate.id === id)
    if (track) layers.focus(track)
  }

  const handleFetchWeather = async (): Promise<void> => {
    if (!viewer || !weatherTrack) return

    const position = layers.currentPosition(weatherTrack.id) ?? weatherTrack.stats?.start
    if (!position) {
      setWeather({ status: 'error', message: 'This track has no position to look up.' })
      return
    }

    const observedAt = JulianDate.toDate(viewer.clock.currentTime)
    setWeather({ status: 'loading' })

    try {
      const data = await fetchWeather({
        ...position,
        date: observedAt,
        apiKey: preferences.weatherApiKey
      })
      setWeather({ status: 'ready', report: { data, observedAt, trackName: weatherTrack.name } })
    } catch (error) {
      console.error('Error fetching weather:', error)
      setWeather({
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to fetch weather data.'
      })
    }
  }

  return (
    <div
      className="app"
      onDragOver={(event): void => {
        if (!hasFiles(event) || !viewer) return
        event.preventDefault()
        setFileDragging(true)
      }}
      onDragLeave={(event): void => {
        if (event.currentTarget === event.target) setFileDragging(false)
      }}
      onDrop={handleFileDrop}
    >
      <div ref={containerRef} className="app__globe" />

      {!preferences.cesiumToken && (
        <Welcome onSubmit={(cesiumToken): void => updatePreferences({ cesiumToken })} />
      )}

      {preferences.cesiumToken && (
        <aside className="sidebar panel">
          <header className="sidebar__header">
            <h1 className="sidebar__title">GPX Viewer</h1>
            <button
              className="icon-button"
              title="Preferences"
              onClick={(): void => setPreferencesOpen(true)}
            >
              <Icon name="settings" />
            </button>
          </header>

          <div className="sidebar__body">
            <section>
              <header className="section-header">
                <h2 className="section-header__title">
                  Tracks{tracks.length > 0 && <span className="count">{tracks.length}</span>}
                </h2>
                <label className="button button--primary button--small">
                  <Icon name="plus" size={14} />
                  Add GPX
                  <input type="file" accept=".gpx" multiple hidden onChange={handleFileChange} />
                </label>
              </header>

              {tracks.length > 0 ? (
                <TrackList
                  tracks={tracks}
                  selectedId={selectedId}
                  actions={trackActions}
                  onSelect={handleSelect}
                />
              ) : (
                <p className="empty">Add GPX files, or drop them anywhere on the window.</p>
              )}
              {notice && (
                <p className="empty empty--error" role="alert">
                  {notice}
                </p>
              )}
            </section>

            {selectedTrack && (
              <TrackDetails
                track={selectedTrack}
                onFlyTo={(): void => layers.focus(selectedTrack)}
                onClose={(): void => setSelectedId(null)}
              />
            )}

            <WeatherPanel
              state={weather}
              canFetch={!!viewer && !!weatherTrack}
              onFetch={handleFetchWeather}
              onOpenPreferences={(): void => setPreferencesOpen(true)}
            />
          </div>
        </aside>
      )}

      {fileDragging && (
        <div className="app__drop-overlay">
          <Icon name="upload" size={32} />
          Drop GPX files to add them
        </div>
      )}

      {preferencesOpen && <PreferencesDialog onClose={(): void => setPreferencesOpen(false)} />}
    </div>
  )
}

export default App
