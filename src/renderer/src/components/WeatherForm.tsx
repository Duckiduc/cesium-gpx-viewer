import { DayCard } from './DayCard'
import { GregorianDate } from 'cesium'
import { JsonCard } from './JsonCard'
import { NowCard } from './NowCard'
import { TemperatureUnitSelector } from './TemperatureUnitSelector'
import { WeatherData } from '../types/weatherData'
import { TemperatureUnit } from '../utils/temperatureUtils'
import './WeatherForm.css'
import { JSX } from 'react'

interface WeatherFormProps {
  weatherData: WeatherData | null
  currentClock: GregorianDate | null
  temperatureUnit: TemperatureUnit
  onTemperatureUnitChange: (unit: TemperatureUnit) => void
}

export function WeatherForm({ weatherData, currentClock, temperatureUnit, onTemperatureUnitChange }: WeatherFormProps): JSX.Element {
  return (
    <div className="weather-form">
      <TemperatureUnitSelector selectedUnit={temperatureUnit} onUnitChange={onTemperatureUnitChange} />
      {weatherData && <NowCard weatherData={weatherData} currentClock={currentClock} temperatureUnit={temperatureUnit} />}
      {weatherData && <DayCard weatherData={weatherData} currentClock={currentClock} mid={'am'} temperatureUnit={temperatureUnit} />}
      {weatherData && <DayCard weatherData={weatherData} currentClock={currentClock} mid={'pm'} temperatureUnit={temperatureUnit} />}
      {weatherData && <JsonCard weatherData={weatherData} />}
    </div>
  )
}
