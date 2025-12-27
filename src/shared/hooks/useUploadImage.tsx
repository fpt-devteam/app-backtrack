import { Nullable } from "@/src/shared/types";
import { useMutation } from "@tanstack/react-query";
import { ImagePickerAsset } from "expo-image-picker";
import { useState } from "react";
import {
  MAX_IMAGE_UPLOAD,
  MIN_IMAGE_UPLOAD,
  UPLOAD_IMAGE_API,
  UPLOAD_IMAGE_QUERY_KEY,
} from "../constants";
import { auth } from "../lib";
import { uploadImageToStorage } from "../services";
import type {
  ImageUploadRequest,
  ImageUploadResponse
} from "../types/firebase.type";

export function useUploadImage() {
  const [progress, setProgress] = useState(0);

  const mutation = useMutation<Nullable<ImageUploadResponse[]>, Error, ImagePickerAsset[]>(
    {
      mutationKey: [UPLOAD_IMAGE_QUERY_KEY],
      onMutate: () => setProgress(0),
      mutationFn: async (imageAssets) => {
        const user = auth.currentUser;
        if (!user) throw new Error("Not authenticated");

        const total = imageAssets.length;
        const isValidSize = total >= MIN_IMAGE_UPLOAD && total <= MAX_IMAGE_UPLOAD;
        if (!isValidSize) throw new Error("Invalid image count");

        const uid = user.uid;
        const results = [] as ImageUploadResponse[];

        for (let i = 0; i < total; i++) {
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
          results.push(res);

          setProgress((i + 1) / total);
        }

        return results;
      },
    }
  );

  return {
    isUploadingImages: mutation.isPending,
    progress,
    uploadImages: mutation.mutateAsync,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}
