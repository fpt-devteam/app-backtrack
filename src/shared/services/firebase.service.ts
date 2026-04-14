import { firebaseStorage } from "@/src/shared/lib";
import type { ImageUploadRequest, ImageUploadResponse } from "@/src/shared/types";
import { getMediaLibraryPermissionsAsync, PermissionStatus, requestMediaLibraryPermissionsAsync } from "expo-image-picker";
import { getAuth, sendEmailVerification } from "firebase/auth";
import type { StorageReference } from "firebase/storage";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Alert, Linking, Platform } from "react-native";

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

export const resendVerificationEmail = async () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    await sendEmailVerification(user);
    return true;
  } else {
    throw new Error("No user is currently signed in.");
  }
};