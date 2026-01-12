import { HOOK_QUERY_KEY } from '@/src/features/location/constants';
import { useMutation } from '@tanstack/react-query';
import { Accuracy, getCurrentPositionAsync } from 'expo-location';
import { useMemo } from 'react';
import type { LatLng } from 'react-native-maps';

const useUserLocation = () => {
  const mutation = useMutation<LatLng | null>({
    mutationKey: HOOK_QUERY_KEY.getUserLocation,
    mutationFn: async () => {
      try {
        const response = await getCurrentPositionAsync({
          accuracy: Accuracy.Balanced,
        });

        const location: LatLng = {
          latitude: response.coords.latitude,
          longitude: response.coords.longitude,
        };

        return location;
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

export default useUserLocation;
