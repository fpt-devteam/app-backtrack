import { getForegroundPermissionsAsync, PermissionStatus, requestForegroundPermissionsAsync } from "expo-location";
import { Alert, Linking, Platform } from "react-native";

export const formatLocationGap = (distanceInMeters?: number | null): string => {
  if (typeof distanceInMeters !== "number" || !Number.isFinite(distanceInMeters)) {
    return "Location gap unavailable";
  }

  if (distanceInMeters < 1000) {
    return `About ${Math.round(distanceInMeters)}m away`;
  }

  return `About ${(distanceInMeters / 1000).toFixed(1)}km away`;
};


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
