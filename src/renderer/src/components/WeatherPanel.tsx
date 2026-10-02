import { JSX } from 'react'
import { WeatherReport } from '../types/weather'
import { usePreferences } from '../hooks/preferencesContext'
import { formatKmh, formatTemperature } from '../utils/format'
import { formatUtcOffset, toLocationTime } from '../utils/weather'
import { Icon } from './Icon'
import { Stat } from './TrackDetails'
import './WeatherPanel.css'

export type WeatherState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; report: WeatherReport }

interface WeatherPanelProps {
  state: WeatherState
  canFetch: boolean
  onFetch: () => void
  onOpenPreferences: () => void
}

export function WeatherPanel({
  state,
  canFetch,
  onFetch,
  onOpenPreferences
}: WeatherPanelProps): JSX.Element {
  const { preferences } = usePreferences()
  const hasKey = !!preferences.weatherApiKey

  return (
    <section className="weather">
      <header className="section-header">
        <h2 className="section-header__title">Weather</h2>
        {hasKey && (
          <button
            className="button button--small"
            onClick={onFetch}
            disabled={!canFetch || state.status === 'loading'}
          >
            <Icon name="refresh" size={14} />
            {state.status === 'ready' ? 'Refresh' : 'Get weather'}
          </button>
        )}
      </header>

      {!hasKey && (
        <p className="empty">
          Add a Visual Crossing API key in{' '}
          <button className="link" onClick={onOpenPreferences}>
            Preferences
          </button>{' '}
          to see the weather along a track.
        </p>
      )}
      {hasKey && state.status === 'idle' && (
        <p className="empty">
          {canFetch
            ? 'Shows the weather at the track position for the date on the timeline.'
            : 'Add a track to look up its weather.'}
        </p>
      )}
      {state.status === 'loading' && <p className="empty">Loading weather…</p>}
      {state.status === 'error' && <p className="empty empty--error">{state.message}</p>}
      {state.status === 'ready' && <WeatherReportView report={state.report} />}
    </section>
  )
}

function WeatherReportView({ report }: { report: WeatherReport }): JSX.Element {
  const { unitSystem, temperatureUnit } = usePreferences().preferences
  const { data, observedAt, trackName } = report
  const day = data.days[0]

  const localTime = toLocationTime(observedAt, data.tzoffset)
  // The report covers one day; the hour is only known when the local date is that day
  const currentHour =
    localTime.toISOString().slice(0, 10) === day.datetime ? localTime.getUTCHours() : -1
  const current = day.hours[currentHour]

  const temp = (celsius: number): string => formatTemperature(celsius, temperatureUnit)

  return (
    <>
      <div className="weather__now">
        <div>
          <p className="weather__time">
            {localTime.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              timeZone: 'UTC'
            })}
          </p>
          <p className="weather__date">
            {localTime.toLocaleDateString([], { dateStyle: 'medium', timeZone: 'UTC' })} ·{' '}
            {data.timezone} ({formatUtcOffset(data.tzoffset)})
          </p>
          <p className="weather__date">{trackName}</p>
        </div>
        <p className="weather__temp">{current ? temp(current.temp) : temp(day.temp)}</p>
      </div>

      <p className="weather__description">{day.description || day.conditions}</p>

      <dl className="stat-grid">
        <Stat label="Low / high" value={`${temp(day.tempmin)} / ${temp(day.tempmax)}`} />
        <Stat label="Feels like" value={`${temp(day.feelslikemin)} / ${temp(day.feelslikemax)}`} />
        <Stat label="Humidity" value={`${Math.round(day.humidity)} %`} />
        <Stat label="Wind" value={formatKmh(day.windspeed, unitSystem)} />
      </dl>

      <ol className="weather__hours">
        {day.hours.map((hour, index) => (
          <li
            key={hour.datetime}
            className={`weather__hour ${index === currentHour ? 'weather__hour--current' : ''}`}
          >
            <span className="weather__hour-label">{hour.datetime.slice(0, 2)}</span>
            <span>{temp(hour.temp)}</span>
          </li>
        ))}
      </ol>
    </>
  )
}
