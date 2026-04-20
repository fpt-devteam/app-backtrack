import { Nullable } from '@/src/shared/types';
import { ImagePickerAsset } from 'expo-image-picker';
import { StateCreator } from 'zustand';

type PhotoItem = Nullable<ImagePickerAsset>

export type PhotoSlice = {
  images: PhotoItem[];
  isUploadingImages: boolean;
  maxImages: number;

  setUploadingImages: (status: boolean) => void;
  setImages: (images: PhotoItem[]) => void;
  addImage: (image: PhotoItem) => void;
  addMultipleImages: (newImages: PhotoItem[]) => void;
  removeImage: (index: number) => void;
  resetPhotoSlice: () => void;
}

export const createPhotoSlice: StateCreator<PhotoSlice> = (set, get) => ({
  images: [],
  isUploadingImages: false,
  maxImages: 5,

  setUploadingImages: (status) => set({ isUploadingImages: status }),

  setImages: (images) => set({ images }),

  addImage: (image) => {
    const { images, maxImages } = get();
    if (images.length < maxImages) {
      set({ images: [...images, image] });
    } else {
      console.warn("Detective, we've reached the maximum evidence limit!");
    }
  },

  addMultipleImages: (newImages) => {
    const { images, maxImages } = get();
    const availableSlots = maxImages - images.length;

    if (availableSlots > 0) {
      const imagesToAdd = newImages.slice(0, availableSlots);
      set({ images: [...images, ...imagesToAdd] });
    }
  },

  removeImage: (index) => {
    set((state) => ({
      images: state.images.filter((_, i) => i !== index),
    }));
  },

  resetPhotoSlice: () => set({ images: [], isUploadingImages: false }),
});