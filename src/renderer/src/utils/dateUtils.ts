export const getMonthName = (monthNumber: number): string => {
  const monthNames: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]

  if (monthNumber >= 1 && monthNumber <= 12) {
    return monthNames[monthNumber - 1]
  } else {
    return 'Invalid Month'
  }
}
