import { GregorianDate } from 'cesium'
import { WeatherData } from '../types/weatherData'
import './DayCard.css'
import { JSX } from 'react'

interface DayCardProps {
  currentClock: GregorianDate | null
  mid: string
  weatherData: WeatherData
}

export function DayCard({ currentClock, mid, weatherData }: DayCardProps): JSX.Element {
  const isAM = mid === 'am'
  const hours = isAM ? weatherData.days[0].hours.slice(0, 12) : weatherData.days[0].hours.slice(12)

  const shift = weatherData.tzoffset > 0 ? `+${weatherData.tzoffset}` : weatherData.tzoffset
  const currentClockTz = (currentClock?.hour ?? 0) + weatherData.tzoffset

  return (
    <div className="card">
      <div className="tz">UTC{shift}</div>
      {hours.map((hour, index) => {
        const hourIndex = isAM ? index : index + 12
        const isCurrentHour = currentClockTz >= 0 && hourIndex === currentClockTz
        return (
          <div key={index} className={`hour-cell ${isCurrentHour ? 'black' : ''}`}>
            <div>{hourIndex}</div>
            <br />
            <div>{hour.temp}</div>
          </div>
        )
      })}
    </div>
  )
}
