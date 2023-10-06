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
  const hours = weatherData.days[0].hours

  return (
    <div className="card">
      {hours.map((hour, index) => (
        <div key={index} className="hour-cell">
          <div>{index}</div>
          <div>{hour.temp}</div>
        </div>
      ))}
    </div>
  )
}
