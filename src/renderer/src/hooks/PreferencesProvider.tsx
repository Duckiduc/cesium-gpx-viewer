import { JSX, ReactNode, useCallback, useMemo, useState } from 'react'
import { Preferences } from '../types/preferences'
import { PreferencesContext } from './preferencesContext'

const STORAGE_KEY = 'cesium-gpx-viewer:preferences'

const defaultPreferences: Preferences = {
  cesiumToken: import.meta.env.RENDERER_VITE_CESIUM_ACCESS_TOKEN ?? '',
  weatherApiKey: '',
  unitSystem: 'metric',
  temperatureUnit: 'C',
  globeLighting: true
}

function loadPreferences(): Preferences {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
    return { ...defaultPreferences, ...stored }
  } catch {
    return defaultPreferences
  }
}

export function PreferencesProvider({ children }: { children: ReactNode }): JSX.Element {
  const [preferences, setPreferences] = useState(loadPreferences)

  const updatePreferences = useCallback((changes: Partial<Preferences>): void => {
    setPreferences((current) => {
      const next = { ...current, ...changes }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const value = useMemo(
    () => ({ preferences, updatePreferences }),
    [preferences, updatePreferences]
  )

  return <PreferencesContext value={value}>{children}</PreferencesContext>
}
