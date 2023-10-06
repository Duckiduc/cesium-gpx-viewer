import { GregorianDate } from 'cesium'
import './DayCard.css'

interface DayCardProps {
  weatherData: any
  currentClock: GregorianDate | null
  mid: string
}

export function DayCard({ weatherData, currentClock, mid }: DayCardProps): JSX.Element {
  console.log('🚀 ~ file: NowCard.tsx:8 ~ NowCard ~ currentClock:', currentClock)
  console.log('🚀 ~ file: NowCard.tsx:10 ~ NowCard ~ weatherData', weatherData)
  console.log('🚀 ~ file: NowCard.tsx:10 ~ NowCard ~ mid')

  const hours = mid === "am" ? weatherData.days[0].hours.slice(0, 12) : weatherData.days[0].hours.slice(12);
  console.log('🚀 ~ file: NowCard.tsx:10 ~ NowCard ~ hours', hours)

  return (
    <div className="card">
      {hours.map((hour, index) => (
        <div key={index} className="hour-cell">
          <div>{mid === "am" ? index : index + 12}</div>
          <br />
          <div>{hour.temp}</div>
        </div>
      ))}
    </div>
  )
}
