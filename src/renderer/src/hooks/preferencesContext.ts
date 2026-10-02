import { createContext, useContext } from 'react'
import { Preferences } from '../types/preferences'

export interface PreferencesContextValue {
  preferences: Preferences
  updatePreferences: (changes: Partial<Preferences>) => void
}

export const PreferencesContext = createContext<PreferencesContextValue | null>(null)

export function usePreferences(): PreferencesContextValue {
  const context = useContext(PreferencesContext)
  if (!context) throw new Error('usePreferences must be used within a PreferencesProvider')
  return context
}
