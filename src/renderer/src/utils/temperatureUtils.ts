export type TemperatureUnit = 'C' | 'F' | 'K'

export interface TemperatureConversion {
  value: number
  unit: TemperatureUnit
  symbol: string
}

/**
 * Convert temperature from Celsius to other units
 */
export function convertTemperature(celsius: number, targetUnit: TemperatureUnit): TemperatureConversion {
  let value: number
  let symbol: string

  switch (targetUnit) {
    case 'C':
      value = celsius
      symbol = '°C'
      break
    case 'F':
      value = (celsius * 9) / 5 + 32
      symbol = '°F'
      break
    case 'K':
      value = celsius + 273.15
      symbol = 'K'
      break
    default:
      value = celsius
      symbol = '°C'
      break
  }

  return {
    value: Math.round(value * 10) / 10, // Round to 1 decimal place
    unit: targetUnit,
    symbol
  }
}

/**
 * Format temperature with unit symbol
 */
export function formatTemperature(celsius: number, unit: TemperatureUnit): string {
  const conversion = convertTemperature(celsius, unit)
  return `${conversion.value}${conversion.symbol}`
}

/**
 * Get all available temperature units
 */
export function getTemperatureUnits(): { value: TemperatureUnit; label: string; symbol: string }[] {
  return [
    { value: 'C', label: 'Celsius', symbol: '°C' },
    { value: 'F', label: 'Fahrenheit', symbol: '°F' },
    { value: 'K', label: 'Kelvin', symbol: 'K' }
  ]
}