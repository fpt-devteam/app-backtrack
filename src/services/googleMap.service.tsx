import * as Location from 'expo-location';
import { Alert, Linking, Platform } from 'react-native';
import { GeocodingResponse, GeocodingStatusValue, GoogleMapDetailLocation, GoogleMapLocation } from '../types/location.type';

export const ensureLocationPermission = async (): Promise<boolean> => {
  const { status, canAskAgain } = await Location.getForegroundPermissionsAsync();

  if (status === 'granted') return true;

  if (canAskAgain) {
    const request = await Location.requestForegroundPermissionsAsync();
    return request.status === 'granted';
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
    const currentLocation = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    const googleMapLocation: GoogleMapLocation = {
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
    };
    return googleMapLocation;
  } catch (error) {
    console.error('Failed to get current position:', error);
    return null;
  }
};

export const fetchGeocodingDataAsync = async (location: GoogleMapLocation) => {
  const { latitude: lat, longitude: lng } = location;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.EXPO_PUBLIC_GOOGLE_API_KEY}`;
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

export const getDetailLocation = async (googleMapLocation: GoogleMapLocation) => {
  const { latitude: lat, longitude: lng } = googleMapLocation;

  try {
    const result = await fetchGeocodingDataAsync({ latitude: lat, longitude: lng });
    if (!result) return null;

    const detailLocation: GoogleMapDetailLocation = {
      location: {
        latitude: lat,
        longitude: lng,
      },
      displayAddress: result.formatted_address,
      externalPlaceId: result.place_id,
    };

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