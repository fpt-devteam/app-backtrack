import { getMediaLibraryPermissionsAsync, PermissionStatus, requestMediaLibraryPermissionsAsync } from "expo-image-picker";
import { Platform } from "expo-modules-core";
import { getDownloadURL, ref, StorageReference, uploadBytes } from "firebase/storage";
import { Alert } from "react-native/Libraries/Alert/Alert";
import { Linking } from "react-native/Libraries/Linking/Linking";
import { firebaseStorage } from "../../lib/firebase";
import { ImageUploadRequest, ImageUploadResponse } from "../types/firebase.type";

export async function uploadImageToStorage(req: ImageUploadRequest): Promise<ImageUploadResponse> {
  const { path, blob } = req;
  const storageRef: StorageReference = ref(firebaseStorage, path);
  await uploadBytes(storageRef, blob);

  const res = { downloadURL: await getDownloadURL(storageRef) } as ImageUploadResponse;
  return res;
}

export const ensureMediaPermission = async () => {
  const permissionResult = await getMediaLibraryPermissionsAsync();

  const { status, canAskAgain } = permissionResult;
  if (status === PermissionStatus.GRANTED) return true;

  if (canAskAgain) {
    const request = await requestMediaLibraryPermissionsAsync();
    const isGranted = request.status === PermissionStatus.GRANTED;
    return isGranted;
  }

  Alert.alert('Permission required', 'Please enable photo access in Settings to upload images.',
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