import { auth, firebaseStorage } from "@/src/shared/lib";
import type { ImageUploadRequest, ImageUploadResponse } from "@/src/shared/types";
import { getMediaLibraryPermissionsAsync, ImagePickerAsset, PermissionStatus, requestMediaLibraryPermissionsAsync } from "expo-image-picker";
import { getAuth, sendEmailVerification } from "firebase/auth";
import type { StorageReference } from "firebase/storage";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Alert, Linking, Platform } from "react-native";

const UPLOAD_IMAGE_API = "posts/images";

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


/**
 * @param imageAssets An array of ImagePickerAsset objects representing the images to be uploaded.
 * @returns An array of download URLs for the uploaded images.
 */
export async function uploadImageAssets(imageAssets: ImagePickerAsset[]) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  const uid = user.uid;
  const results = [];

  for (let i = 0; i < imageAssets.length; i++) {
    const img = imageAssets[i];
    if (!img?.uri) continue;

    const fileName = `img_${Date.now()}_${i}`;
    const response = await fetch(img.uri);
    const blob = await response.blob();

    const req: ImageUploadRequest = {
      filename: fileName,
      firebaseUid: uid,
      uri: img.uri,
      blob,
      path: `${UPLOAD_IMAGE_API}/${uid}/${fileName}`,
    };

    const res = await uploadImageToStorage(req);
    results.push(res.downloadURL);
  }

  return results;
}