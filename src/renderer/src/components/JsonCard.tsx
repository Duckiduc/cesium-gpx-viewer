import './JsonCard.css'

interface JsonCardProps {
  weatherData: any
}

export function JsonCard({ weatherData }: JsonCardProps): JSX.Element {
  return (
    <div className="card">
      <pre>{JSON.stringify(weatherData, null, 2)}</pre>
    </div>
  )
}
