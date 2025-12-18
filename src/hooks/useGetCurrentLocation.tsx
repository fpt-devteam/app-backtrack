import { useState } from 'react';
import { ensureLocationPermission, getCurrentPosition } from '../services/googleMap.service';
import { GoogleMapFormattedLocation } from '../types/location.type';

export const useGetCurrentPosition = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPosition = async (): Promise<GoogleMapFormattedLocation | null> => {
    setLoading(true);
    setError(null);

    const hasPermission = await ensureLocationPermission();
    if (!hasPermission) return null;

    const currentPosition = await getCurrentPosition();
    if (!currentPosition) {
      setError('Failed to retrieve position data.');
      setLoading(false);
      return null;
    }

    setLoading(false);
    return currentPosition;
  };

  return { loading, error, getCurrentPosition: getPosition };
}

