import * as Location from 'expo-location';
import { Alert, Linking, Platform } from 'react-native';
import { GoogleMapFormattedLocation, LocationCoordinates } from '../types/location.type';

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

export const getFormattedLocation = async (coordinates: LocationCoordinates): Promise<GoogleMapFormattedLocation | null> => {
  const { latitude: lat, longitude: lng } = coordinates;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.EXPO_PUBLIC_GOOGLE_API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.status !== 'OK') return null;

  const location: GoogleMapFormattedLocation =
  {
    latitude: lat,
    longitude: lng,
    formattedAddress: data.results[0].formatted_address,
    placeId: data.results[0].place_id,
  };
  return location;
};

export const getCurrentPosition = async (): Promise<GoogleMapFormattedLocation | null> => {
  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  const coordinates: LocationCoordinates = {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude
  };

  const formattedLocation = await getFormattedLocation(coordinates);
  return formattedLocation;
};