import {
  ELECTRONICS_SUBCATEGORY,
  POST_CATEGORIES,
  PostCategory,
  PostSubcategory,
  PostType,
} from "@/src/features/post/types";
import { eventTimeSchema, type EventTime } from "@/src/features/post/schemas";
import { Nullable } from "@/src/shared/types";
import type { ImagePickerAsset } from "expo-image-picker";
import type { LatLng } from "react-native-maps";
import { create } from "zustand";

type PostCreationState = {
  postType: PostType;
  category: PostCategory;
  subCategory: Nullable<PostSubcategory>;
  images: ImagePickerAsset[];
  location: {
    address: string;
    coords: Nullable<LatLng>;
    history: string[];
  };
  timeline: {
    date: EventTime;
  };
};

type PostCreateActions = {
  selectPostType: (type: PostType) => void;
  selectCategory: (category: PostCategory) => void;
  selectSubCategory: (subCategory: Nullable<PostSubcategory>) => void;
  setImages: (images: ImagePickerAsset[]) => void;
  removeImageAt: (index: number) => void;
  setPrimaryImage: (index: number) => void;
  updateLocationAddress: (address: string) => void;
  updateLocationCoords: (coords: Nullable<LatLng>) => void;
  addToLocationHistory: (address: string) => void;
  updateEventDate: (date: EventTime) => void;
  debug: () => void;
  resetForm: () => void;
};

const initialState: PostCreationState = {
  postType: PostType.Lost,
  category: POST_CATEGORIES.ELECTRONICS,
  subCategory: ELECTRONICS_SUBCATEGORY.CHARGER_ADAPTER,
  images: [],
  location: {
    address: "",
    coords: null,
    history: [],
  },
  timeline: {
    date: eventTimeSchema.getDefault(),
  },
};

export const usePostCreationStore = create<
  PostCreationState & PostCreateActions
>((set) => ({
  ...initialState,

  selectPostType: (type) => set({ postType: type }),
  selectCategory: (category) => set({ category, subCategory: null }),
  selectSubCategory: (subCategory) => set({ subCategory }),
  setImages: (images) => set({ images }),
  removeImageAt: (index) =>
    set((state) => ({
      images: state.images.filter((_, i) => i !== index),
    })),
  setPrimaryImage: (index) =>
    set((state) => {
      const nextImages = [...state.images];
      const [selected] = nextImages.splice(index, 1);

      if (!selected) return state;

      return {
        images: [selected, ...nextImages],
      };
    }),
  updateLocationAddress: (address) =>
    set((state) => {
      return {
        location: {
          ...state.location,
          address,
        },
      };
    }),
  updateLocationCoords: (coords) =>
    set((state) => {
      return {
        location: {
          ...state.location,
          coords,
        },
      };
    }),
  addToLocationHistory: (address) =>
    set((state) => {
      if (!address.trim()) return {};

      const dedupedHistory = state.location.history.filter(
        (item) => item !== address,
      );

      return {
        location: {
          ...state.location,
          history: [address, ...dedupedHistory].slice(0, 10),
        },
      };
    }),
  updateEventDate: (date) =>
    set((state) => ({
      timeline: {
        ...state.timeline,
        date,
      },
    })),
  resetForm: () => set(initialState),

  debug: () => {
    set((state) => {
      console.log("Current post creation state:", state);
      return state;
    });
  },
}));
