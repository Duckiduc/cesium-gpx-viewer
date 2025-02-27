import { JSX } from 'react'
import { WeatherData } from '../types/weatherData'
import './JsonCard.css'

interface JsonCardProps {
  weatherData: WeatherData
}

export const JsonCard = ({ weatherData }: JsonCardProps): JSX.Element => {
  return (
    <div className="card">
      <pre>{JSON.stringify(weatherData, null, 2)}</pre>
    </div>
  )
}
