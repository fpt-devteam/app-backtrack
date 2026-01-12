import { getForegroundPermissionsAsync, PermissionStatus, requestForegroundPermissionsAsync } from "expo-location";
import { Alert, Linking, Platform } from "react-native";

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
