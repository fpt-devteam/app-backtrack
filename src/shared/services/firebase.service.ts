import { getDownloadURL, ref, StorageReference, uploadBytes } from "firebase/storage";
import { firebaseStorage } from "../../lib/firebase";
import { ImageUploadRequest, ImageUploadResponse } from "../types/firebase.type";

export async function uploadImageToStorage(req: ImageUploadRequest): Promise<ImageUploadResponse> {
  const { path, blob } = req;
  const storageRef: StorageReference = ref(firebaseStorage, path);
  await uploadBytes(storageRef, blob);

  const res = { downloadURL: await getDownloadURL(storageRef) } as ImageUploadResponse;
  return res;
}