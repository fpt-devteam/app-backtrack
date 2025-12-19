import { useState } from 'react';
import { getFormattedLocation } from '../services/googleMap.service';
import { GoogleMapFormattedLocation, LocationCoordinates } from '../types/location.type';

export default function useGetFormattedLocation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatLocation = async (coordinates: LocationCoordinates): Promise<GoogleMapFormattedLocation | null> => {
    setLoading(true);
    setError(null);

    const location = await getFormattedLocation(coordinates);
    if (!location) setError('Failed to get formatted location');

    setLoading(false);
    return location;
  };

  return { loading, error, formatLocation };
}