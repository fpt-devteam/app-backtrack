import type { ImagePickerAsset } from "expo-image-picker";

export type ImageAsset = ImagePickerAsset & {
  type: 'image';
};

export type ImageUploadRequest = {
  filename: string;
  firebaseUid: string;
  uri: string;
  path: string;
  blob: Blob;
};

export type ImageUploadResponse = {
  downloadURL: string;
};
