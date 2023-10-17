import { GregorianDate } from 'cesium'
import './NowCard.css'
import { WeatherData } from '../types/weatherData'
import { getMonthName } from '../utils/dateUtils'

interface NowCardProps {
  weatherData: WeatherData
  currentClock: GregorianDate | null
}

export function NowCard({ weatherData, currentClock }: NowCardProps): JSX.Element {
  const currentDayTz =
    (currentClock?.hour ?? 0) + weatherData.tzoffset > 23
      ? (currentClock?.day ?? 0) + 1
      : currentClock?.day

  const currentTempTz =
    (currentClock?.hour ?? 0) + weatherData.tzoffset > 23
      ? 'N/A'
      : `${weatherData.days[0].hours[((currentClock?.hour ?? 0) + weatherData.tzoffset) % 24].temp}
  ° C`

  return (
    <>
      <div className="card">
        <div className="card__info">
          <p className="card__info__place">{weatherData.address}</p>
          <p className="card__info__time">
            {currentClock && ((currentClock.hour ?? 0) + weatherData.tzoffset) % 24}h
            {currentClock && currentClock.minute}
          </p>
          <p className="card__info__date">
            {currentClock && getMonthName(currentClock.month)} {currentDayTz},{' '}
            {currentClock && currentClock.year} on {weatherData.timezone} timezone
          </p>
        </div>
        <div className="card__weather">
          <svg
            width="34"
            className="card__weather__icon"
            height="24"
            viewBox="0 0 34 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M31.7764 13.3718C30.8073 12.1841 29.5779 11.4201 28.0897 11.0793C28.5632 10.3633 28.7992 9.57921 28.7992 8.72709C28.7992 7.52249 28.3664 6.49418 27.5014 5.64182C26.6361 4.78976 25.592 4.36354 24.3688 4.36354C23.2612 4.36354 22.3034 4.71584 21.496 5.42044C20.8155 3.80682 19.7334 2.50001 18.251 1.50001C16.7682 0.500241 15.1152 0 13.2921 0C10.8461 0 8.75757 0.852482 7.02679 2.55703C5.29589 4.26116 4.43071 6.31818 4.43071 8.72727C4.43071 8.89777 4.44229 9.1419 4.46532 9.46011C3.12694 10.0738 2.04801 11.0027 1.22884 12.2473C0.409735 13.4913 0 14.8637 0 16.3637C0 18.4659 0.758789 20.2642 2.27594 21.7583C3.79316 23.2528 5.61918 24 7.75375 24H26.5847C28.4191 24 29.9853 23.3603 31.2836 22.0823C32.5816 20.804 33.2308 19.2615 33.2308 17.4545C33.2306 15.9206 32.7457 14.5591 31.7764 13.3718Z"
              fill="#567DF4"
            />
          </svg>

          <p className="card__weather__temp">{currentTempTz}</p>
        </div>
      </div>
      <div className="card-column">
        <div className="card-full">
          <div>Conditions: {weatherData.days[0].conditions}</div>
          <div>Description: {weatherData.days[0].description}</div>
        </div>
        <br />
        <div className="sub-card">
          <div className="card-half">
            <div>
              Temperature: {weatherData.days[0].tempmin}° C | {weatherData.days[0].tempmax}° C
            </div>
            <div>
              Feels like: {weatherData.days[0].feelslikemin}° C | {weatherData.days[0].feelslikemax}
              ° C
            </div>
          </div>
          <div className="card-half">
            <div>Humidity: {weatherData.days[0].humidity} %</div>
            <div>Wind speed: {weatherData.days[0].windspeed} kph</div>
          </div>
        </div>
        {/* stations */}
      </div>
    </>
  )
}
