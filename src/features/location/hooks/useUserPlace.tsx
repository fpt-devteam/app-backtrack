import { HOOK_QUERY_KEY } from '@/src/features/location/constants';
import { useMutation } from '@tanstack/react-query';
import { useMemo } from 'react';
import type { PlaceDetails } from '../services/googlePlaces.service';
import { GooglePlacesService } from '../services/googlePlaces.service';

const useUserPlace = () => {
  const mutation = useMutation<PlaceDetails | null>({
    mutationKey: HOOK_QUERY_KEY.getUserLocation,
    mutationFn: async () => {
      try {
        const response = await GooglePlacesService.getCurrentPlace();
        return response;
      } catch (error) {
        console.error('Failed to get current position:', error);
        return null;
      }
    },

    onError: (err) => {
      console.log("Get user location failed:", err.message);
    },
  })

  const errorMessage = useMemo(() => {
    if (!mutation.error) return null;
    return mutation.error.message;
  }, [mutation.error]);

  return {
    getUserLocation: mutation.mutateAsync,
    loadingUserLocation: mutation.isPending,
    error: errorMessage,
  };
}

export default useUserPlace;
