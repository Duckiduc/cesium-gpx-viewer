import { FormEvent, JSX, useEffect, useRef, useState } from 'react'
import { Preferences, TemperatureUnit, UnitSystem } from '../types/preferences'
import { usePreferences } from '../hooks/preferencesContext'
import { Icon } from './Icon'
import './PreferencesDialog.css'

interface PreferencesDialogProps {
  onClose: () => void
}

const unitSystems: { value: UnitSystem; label: string }[] = [
  { value: 'metric', label: 'Metric (km, m)' },
  { value: 'imperial', label: 'Imperial (mi, ft)' }
]

const temperatureUnits: { value: TemperatureUnit; label: string }[] = [
  { value: 'C', label: '°C' },
  { value: 'F', label: '°F' },
  { value: 'K', label: 'K' }
]

export function PreferencesDialog({ onClose }: PreferencesDialogProps): JSX.Element {
  const { preferences, updatePreferences } = usePreferences()
  const [draft, setDraft] = useState<Preferences>(preferences)
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    dialogRef.current?.showModal()
  }, [])

  const set = <K extends keyof Preferences>(key: K, value: Preferences[K]): void => {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    updatePreferences({
      ...draft,
      cesiumToken: draft.cesiumToken.trim(),
      weatherApiKey: draft.weatherApiKey.trim()
    })
    onClose()
  }

  return (
    <dialog ref={dialogRef} className="preferences panel" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <header className="section-header">
          <h2 className="preferences__title">Preferences</h2>
          <button type="button" className="icon-button" title="Close" onClick={onClose}>
            <Icon name="close" />
          </button>
        </header>

        <fieldset className="preferences__group">
          <legend>API keys</legend>
          <label className="field">
            <span className="field__label">Cesium ion access token</span>
            <input
              className="input"
              type="password"
              value={draft.cesiumToken}
              onChange={(event): void => set('cesiumToken', event.target.value)}
            />
            <span className="field__hint">Changing the token reloads the globe.</span>
          </label>
          <label className="field">
            <span className="field__label">Visual Crossing weather API key</span>
            <input
              className="input"
              type="password"
              value={draft.weatherApiKey}
              onChange={(event): void => set('weatherApiKey', event.target.value)}
            />
          </label>
        </fieldset>

        <fieldset className="preferences__group">
          <legend>Units</legend>
          <div className="field">
            <span className="field__label">Distance and elevation</span>
            <div className="segmented">
              {unitSystems.map(({ value, label }) => (
                <label key={value} className="segmented__option">
                  <input
                    type="radio"
                    name="unitSystem"
                    checked={draft.unitSystem === value}
                    onChange={(): void => set('unitSystem', value)}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="field">
            <span className="field__label">Temperature</span>
            <div className="segmented">
              {temperatureUnits.map(({ value, label }) => (
                <label key={value} className="segmented__option">
                  <input
                    type="radio"
                    name="temperatureUnit"
                    checked={draft.temperatureUnit === value}
                    onChange={(): void => set('temperatureUnit', value)}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>
        </fieldset>

        <fieldset className="preferences__group">
          <legend>Globe</legend>
          <label className="checkbox">
            <input
              type="checkbox"
              checked={draft.globeLighting}
              onChange={(event): void => set('globeLighting', event.target.checked)}
            />
            <span>Sun lighting (day and night follow the timeline)</span>
          </label>
        </fieldset>

        <footer className="preferences__footer">
          <button type="button" className="button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="button button--primary">
            Save
          </button>
        </footer>
      </form>
    </dialog>
  )
}
