import { Accuracy, getCurrentPositionAsync, getForegroundPermissionsAsync, PermissionStatus, requestForegroundPermissionsAsync } from 'expo-location';
import { Alert, Linking, Platform } from 'react-native';
import type { LatLng } from 'react-native-maps';
import type { GeocodingResponse, UserLocation } from '../../../shared/types';
import { GeocodingStatusValue } from '../../../shared/types';

export const ensureLocationPermission = async () => {
  const { status, canAskAgain } = await getForegroundPermissionsAsync();
  if (status === PermissionStatus.GRANTED) return true;

  if (canAskAgain) {
    const request = await requestForegroundPermissionsAsync();
    return request.status === PermissionStatus.GRANTED;
  }

  Alert.alert(
    'Location permission required',
    'Please enable location access in Settings to continue.',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Open Settings',
        onPress: () => {
          if (Platform.OS === 'ios') {
            Linking.openURL('app-settings:');
          } else {
            Linking.openSettings();
          }
        },
      },
    ]
  );

  return false;
};

export const getCurrentPosition = async () => {
  try {
    const currentLocation = await getCurrentPositionAsync({
      accuracy: Accuracy.Balanced,
    });
    const googleMapLocation: LatLng = {
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
    };
    return googleMapLocation;
  } catch (error) {
    console.error('Failed to get current position:', error);
    return null;
  }
};

export const fetchGeocodingDataAsync = async (location: LatLng) => {
  const { latitude, longitude } = location;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.EXPO_PUBLIC_GOOGLE_API_KEY}`;
  const res = await fetch(url);

  if (!res.ok) {
    console.error('Geocoding API request failed:', res.status, res.statusText);
    return null;
  }

  const data: GeocodingResponse = await res.json();

  if (data.status !== GeocodingStatusValue.OK) {
    console.error('Geocoding API error:', data.status, data.error_message);
    return null;
  }

  if (data.results.length === 0) {
    console.warn('No geocoding results found');
    return null;
  }

  const result = data.results[0];
  return result;
};

export const getDetailLocation = async (googleMapLocation: LatLng) => {
  const { latitude, longitude } = googleMapLocation;

  try {
    const result = await fetchGeocodingDataAsync({ latitude, longitude });
    if (!result) return null;

    const detailLocation = {
      location: { latitude, longitude },
      displayAddress: result.formatted_address,
      externalPlaceId: result.place_id,
    } as UserLocation;

    return detailLocation;
  } catch (error) {
    console.error('Failed to fetch geocoding data:', error);
    return null;
  }
};

export const getDetailCurrentLocation = async () => {
  const currentLocation = await getCurrentPosition();
  if (!currentLocation) return null;

  const detailLocation = await getDetailLocation(currentLocation);
  return detailLocation;
};
