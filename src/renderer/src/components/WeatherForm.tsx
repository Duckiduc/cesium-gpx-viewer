import { Cartographic, GregorianDate, JulianDate, Math, Viewer } from 'cesium'
import { RefObject, useState } from 'react'
import './WeatherForm.css'
import { NowCard } from './NowCard'
import data from '../assets/weather-mock.json'
import { DayCard } from './DayCard'

interface WeatherFormProps {
  viewerRef: RefObject<Viewer | null>
}

export function WeatherForm({ viewerRef }: WeatherFormProps): JSX.Element {
  const [currentClock, setCurrentClock] = useState<GregorianDate | null>(null)

  const getCoordinates = (): { latitude: number; longitude: number } => {
    if (viewerRef.current) {
      const mainDataSource = viewerRef.current.dataSources.get(0)
      const activeEntity = (mainDataSource.entities as any)._entities._array[0]
      const activeEntityPosition = activeEntity._position.getValue(
        viewerRef.current.clock.currentTime
      )

      const date = JulianDate.toGregorianDate(viewerRef.current.clock.currentTime)

      setCurrentClock(date)

      console.log(currentClock)

      const cartographic = Cartographic.fromCartesian(activeEntityPosition)

      const longRadians = cartographic.longitude
      const latRadians = cartographic.latitude

      const latDegrees = Math.toDegrees(latRadians)
      const longDegrees = Math.toDegrees(longRadians)

      return { latitude: latDegrees, longitude: longDegrees }
    }
    return { latitude: 0, longitude: 0 }
  }

  const getWeather = async (): Promise<void> => {
    const { latitude, longitude } = getCoordinates()

    console.log(data)

    // try {
    //   const response = await fetch(``)

    //   if (!response.ok) {
    //     throw new Error(`HTTP error! Status: ${response.status}`);
    //   }

    //   const data = await response.json();
    //   console.log("🚀 ~ file: WeatherForm.tsx:65 ~ getWeather ~ data", data)
    //   return data;
    // } catch (error) {
    //   console.error('Error:', error);
    //   throw error;
    // }
  }

  return (
    <div className="weather-form">
      <NowCard weatherData={data} currentClock={currentClock}></NowCard>
      <DayCard weatherData={data} currentClock={currentClock} mid={'am'}></DayCard>
      <DayCard weatherData={data} currentClock={currentClock} mid={'pm'}></DayCard>
      <button onClick={(): Promise<void> => getWeather()}>Hello</button>
    </div>
  )
}
