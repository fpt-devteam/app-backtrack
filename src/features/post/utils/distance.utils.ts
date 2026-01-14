/**
 * Calculate the distance between two points using the Haversine formula
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Distance in meters
 */
export const calculateHaversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371e3 // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c // Distance in meters
}

/**
 * Format distance for display
 * @param distanceInMeters Distance in meters
 * @returns Formatted string (e.g., "500m" or "1.2km")
 */
export const formatDistance = (distanceInMeters: number): string => {
  if (distanceInMeters < 1000) {
    return `${Math.round(distanceInMeters)}m`
  }
  return `${(distanceInMeters / 1000).toFixed(1)}km`
}

/**
 * Get location match status based on distance
 * @param distanceInMeters Distance in meters
 * @returns Match status
 */
export const getLocationMatchStatus = (distanceInMeters: number): 'high' | 'medium' | 'low' => {
  if (distanceInMeters <= 500) return 'high'
  if (distanceInMeters <= 2000) return 'medium'
  return 'low'
}
