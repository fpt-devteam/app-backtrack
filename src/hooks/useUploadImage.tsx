import { useState } from "react";
import { auth } from "../lib/firebase";
import { uploadImageToStorage } from "../services/firebase.service";
import type {
  ImageAsset,
  ImageUploadRequest,
  ImageUploadResponse
} from "../types/firebase.type";

export function useUploadImage() {
  const [uploading, setUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const uploadImages = async (imageAssets: ImageAsset[]): Promise<ImageUploadResponse[]> => {
    const user = auth.currentUser;

    //Validate 
    if (!user) throw new Error("Not logged in");
    if (!imageAssets?.length) return [];
    //End validate

    setUploading(true);
    setProgress(0);

    const uid = user.uid;
    const total = imageAssets.length;
    const results: ImageUploadResponse[] = [];

    for (let i = 0; i < total; i++) {
      const img = imageAssets[i];

      if (!img?.uri) {
        console.log("Image is not exist!")
        continue;
      }

      const fileName = `img_${Date.now()}_${i}`;
      const response = await fetch(img.uri);
      const blob: Blob = await response.blob();

      const req: ImageUploadRequest = {
        filename: fileName,
        firebaseUid: uid,
        uri: img.uri,
        blob,
        path: `posts/images/${uid}/${fileName}`,
      };

      const res = await uploadImageToStorage(req);
      results.push(res);
      setProgress((i + 1) / total);
    }

    setUploading(false);
    return results;
  };

  return { uploading, progress, uploadImages };
}
