import { useState } from 'react';
import { ensureLocationPermission, getDetailCurrentLocation } from '../services';

export const useGetDetailCurrentLocation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getDetailPosition = async () => {
    setLoading(true);
    setError(null);

    const hasPermission = await ensureLocationPermission();
    if (!hasPermission) {
      setError('Location permission denied.');
      setLoading(false);
      return null;
    }

    const currentPosition = await getDetailCurrentLocation();
    if (!currentPosition) {
      setError('Failed to retrieve position data.');
      setLoading(false);
      return null;
    }

    setLoading(false);
    return currentPosition;
  };

  return { loading, error, getDetailCurrentLocation: getDetailPosition };
}

