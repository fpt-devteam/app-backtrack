/**
 * Calculate time difference between two dates
 * @param date1 First date (Date object or ISO string)
 * @param date2 Second date (Date object or ISO string)
 * @returns Time difference in milliseconds
 */
export const calculateTimeDifference = (date1: Date | string, date2: Date | string): number => {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2
  return Math.abs(d1.getTime() - d2.getTime())
}

/**
 * Format time difference for display
 * @param diffInMs Time difference in milliseconds
 * @returns Formatted string (e.g., "2 hrs apart", "30 mins apart")
 */
export const formatTimeDifference = (diffInMs: number): string => {
  const minutes = Math.floor(diffInMs / (1000 * 60))
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} apart`
  }
  if (hours > 0) {
    return `${hours} hr${hours > 1 ? 's' : ''} apart`
  }
  if (minutes > 0) {
    return `${minutes} min${minutes > 1 ? 's' : ''} apart`
  }
  return 'Same time'
}

/**
 * Format time for display
 * @param date Date to format (Date object or ISO string)
 * @returns Formatted time string (e.g., "14:00")
 */
export const formatTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  const hours = d.getHours().toString().padStart(2, '0')
  const minutes = d.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

/**
 * Get time match status based on time difference
 * @param diffInMs Time difference in milliseconds
 * @returns Match status
 */
export const getTimeMatchStatus = (diffInMs: number): 'high' | 'medium' | 'low' => {
  const hours = diffInMs / (1000 * 60 * 60)

  if (hours <= 3) return 'high'
  if (hours <= 24) return 'medium'
  return 'low'
}
