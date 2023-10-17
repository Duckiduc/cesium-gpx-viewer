import { GregorianDate } from 'cesium'
import './DayCard.css'
import { WeatherData } from '../types/weatherData'

interface DayCardProps {
  weatherData: WeatherData
  currentClock: GregorianDate | null
  mid: string
}

export function DayCard({ weatherData, currentClock, mid }: DayCardProps): JSX.Element {
  const hours =
    mid === 'am' ? weatherData.days[0].hours.slice(0, 12) : weatherData.days[0].hours.slice(12)

  const shift = weatherData.tzoffset > 0 ? `+${weatherData.tzoffset}` : weatherData.tzoffset
  const currentClockTz = (currentClock?.hour ?? 0) + weatherData.tzoffset ?? 0

  return (
    <div className="card">
      <div className="tz">UTC{shift}</div>
      {hours.map((hour, index) => (
        <div
          key={index}
          className={`hour-cell ${
            currentClockTz >= 0 && (mid === 'am' ? index : index + 12) === currentClockTz
              ? 'black'
              : ''
          }`}
        >
          <div>{mid === 'am' ? index : index + 12}</div>
          <br />
          <div>{hour.temp}</div>
        </div>
      ))}
    </div>
  )
}
