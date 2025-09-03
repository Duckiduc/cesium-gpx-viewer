import { JSX } from 'react'
import { TemperatureUnit, getTemperatureUnits } from '../utils/temperatureUtils'
import './TemperatureUnitSelector.css'

interface TemperatureUnitSelectorProps {
  selectedUnit: TemperatureUnit
  onUnitChange: (unit: TemperatureUnit) => void
}

export function TemperatureUnitSelector({ selectedUnit, onUnitChange }: TemperatureUnitSelectorProps): JSX.Element {
  const units = getTemperatureUnits()

  return (
    <div className="temperature-unit-selector">
      <label htmlFor="temp-unit-select" className="temp-unit-label">
        Temperature Unit:
      </label>
      <select
        id="temp-unit-select"
        className="temp-unit-select"
        value={selectedUnit}
        onChange={(e) => onUnitChange(e.target.value as TemperatureUnit)}
      >
        {units.map((unit) => (
          <option key={unit.value} value={unit.value}>
            {unit.label} ({unit.symbol})
          </option>
        ))}
      </select>
    </div>
  )
}