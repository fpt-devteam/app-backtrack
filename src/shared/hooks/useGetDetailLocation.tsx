import { useState } from 'react';
import { LatLng } from 'react-native-maps';
import { getDetailLocation } from '../services';

export const useGetDetailLocation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatLocation = async (mapLocation: LatLng) => {
    setLoading(true);
    setError(null);

    const detailLocation = await getDetailLocation(mapLocation);
    if (!detailLocation) setError('Failed to get formatted location');

    setLoading(false);
    return detailLocation;
  };

  return { loading, error, formatLocation };
}
