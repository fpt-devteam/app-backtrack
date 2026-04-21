import { ImagePickerAsset } from 'expo-image-picker';
import { StateCreator } from 'zustand';
import { uploadImageAssets } from '../services';

export type PhotoSlice = {
  maxImages: number;
  draftImages: ImagePickerAsset[];
  imageUrls: Promise<string[]>;

  uploadImages: () => void;
  getUploadedImageUrls: () => Promise<string[]>;

  addImages: (newImages: ImagePickerAsset[]) => void;
  removeImage: (index: number) => void;
  resetPhotoSlice: () => void;
}

export const createPhotoSlice: StateCreator<PhotoSlice> = (set, get) => ({
  draftImages: [],
  imageUrls: Promise.resolve([]),
  maxImages: 5,
  isUploadingImages: false,

  addImages: (newImages) => {
    const { draftImages: images, maxImages } = get();
    const availableSlots = maxImages - images.length;

    if (availableSlots > 0) {
      const imagesToAdd = newImages.slice(0, availableSlots);
      set({ draftImages: [...images, ...imagesToAdd] });
    }
  },

  getUploadedImageUrls: () => get().imageUrls,

  uploadImages: () => {
    const uploadTask = uploadImageAssets(get().draftImages);

    uploadTask
      .catch((error) => {
        console.log("Error uploading images:", error);
        set({ imageUrls: Promise.resolve([]) });
      })
    set({ imageUrls: uploadTask });
  },

  removeImage: (index) => {
    set((state) => ({
      draftImages: state.draftImages.filter((_, i) => i !== index),
    }));
  },

  resetPhotoSlice: () => set({
    draftImages: [],
    imageUrls: Promise.resolve([]),
  }),
});