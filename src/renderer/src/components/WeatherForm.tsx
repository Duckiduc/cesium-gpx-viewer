import { DayCard } from './DayCard'
import { GregorianDate } from 'cesium'
import { JsonCard } from './JsonCard'
import { NowCard } from './NowCard'
import { WeatherData } from '../types/weatherData'
import './WeatherForm.css'
import { JSX } from 'react'

interface WeatherFormProps {
  weatherData: WeatherData | null
  currentClock: GregorianDate | null
}

export const WeatherForm = ({ weatherData, currentClock }: WeatherFormProps): JSX.Element => {
  return (
    <div className="weather-form">
      {weatherData && <NowCard weatherData={weatherData} currentClock={currentClock} />}
      {weatherData && <DayCard weatherData={weatherData} currentClock={currentClock} mid={'am'} />}
      {weatherData && <DayCard weatherData={weatherData} currentClock={currentClock} mid={'pm'} />}
      {weatherData && <JsonCard weatherData={weatherData} />}
    </div>
  )
}
