import { useState } from 'react';
import { getDetailLocation } from '../services/googleMap.service';
import { GoogleMapLocation } from '../types/location.type';

export default function useGetDetailLocation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatLocation = async (mapLocation: GoogleMapLocation) => {
    setLoading(true);
    setError(null);

    const detailLocation = await getDetailLocation(mapLocation);
    if (!detailLocation) setError('Failed to get formatted location');

    setLoading(false);
    return detailLocation;
  };

  return { loading, error, formatLocation };
}