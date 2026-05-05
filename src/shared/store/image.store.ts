import { toast } from "@/src/shared/components/ui/toast";
import { uploadImageAssets } from "@/src/shared/services";
import { ImagePickerAsset, ImagePickerOptions } from "expo-image-picker";
import { create } from "zustand";

export const PICKER_OPTIONS: ImagePickerOptions = {
  mediaTypes: ["images"],
  quality: 0.7,
  allowsMultipleSelection: true,
};

export const CAMERA_OPTIONS: ImagePickerOptions = {
  mediaTypes: ["images"],
  quality: 0.7,
};

type PhotoState = {
  uploadedImageUrls: string[];
  draftImages: ImagePickerAsset[];
  isUploading: boolean;
  maxImages: number;

  isPickerSheetVisible: boolean;
}

type PhotoActions = {
  uploadImages: () => Promise<void>;
  addImages: (newImages: ImagePickerAsset[]) => void;
  removeImage: (index: number) => void;
  reset: () => void;

  openPickerSheet: () => void;
  closePickerSheet: () => void;
  getUploadedImageUrls: () => string[];
}

const initialState: PhotoState = {
  draftImages: [],
  uploadedImageUrls: [],
  isUploading: false,
  maxImages: 5,
  isPickerSheetVisible: false,
};

export const usePhotoStore = create<PhotoState & PhotoActions>((set, get) => ({
  ...initialState,

  addImages: (newImages) => {
    const { draftImages, maxImages } = get();
    const availableSlots = maxImages - draftImages.length;

    if (availableSlots > 0) {
      const imagesToAdd = newImages.slice(0, availableSlots);
      set({ draftImages: [...draftImages, ...imagesToAdd] });
    }
  },

  uploadImages: async () => {
    const { draftImages } = get();
    if (draftImages.length === 0) return;

    set({ isUploading: true });

    try {
      const urls = await uploadImageAssets(draftImages);
      set({ uploadedImageUrls: urls, isUploading: false });
    } catch (error) {
      toast.error("Upload Failed", "We couldn't save your photos. Please check your connection and try again.");
      set({ isUploading: false, uploadedImageUrls: [] });
      throw error;
    }
  },

  getUploadedImageUrls: () => {
    return get().uploadedImageUrls;
  },

  removeImage: (index) => {
    set((state) => ({
      draftImages: state.draftImages.filter((_, i) => i !== index),
    }));
  },

  reset: () => set(initialState),

  openPickerSheet: () => set({ isPickerSheetVisible: true }),
  closePickerSheet: () => set({ isPickerSheetVisible: false }),
}));