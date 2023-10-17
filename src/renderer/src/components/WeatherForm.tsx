import { GregorianDate } from 'cesium'
import './WeatherForm.css'
import { NowCard } from './NowCard'
import { DayCard } from './DayCard'
import { JsonCard } from './JsonCard'
import { WeatherData } from '../types/weatherData'

interface WeatherFormProps {
  weatherData: WeatherData | null
  currentClock: GregorianDate | null
}

export function WeatherForm({ weatherData, currentClock }: WeatherFormProps): JSX.Element {
  return (
    <div className="weather-form">
      {weatherData && <NowCard weatherData={weatherData} currentClock={currentClock} />}
      {weatherData && <DayCard weatherData={weatherData} currentClock={currentClock} mid={'am'} />}
      {weatherData && <DayCard weatherData={weatherData} currentClock={currentClock} mid={'pm'} />}
      {weatherData && <JsonCard weatherData={weatherData} />}
    </div>
  )
}
