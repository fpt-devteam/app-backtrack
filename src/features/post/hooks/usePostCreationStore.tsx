import {
  ELECTRONICS_SUBCATEGORY,
  POST_CATEGORIES,
  PostCategory,
  PostSubcategory,
  PostType,
} from "@/src/features/post/types";
import { Nullable } from "@/src/shared/types";
import type { ImagePickerAsset } from "expo-image-picker";
import { create } from "zustand";

type PostCreationState = {
  postType: PostType;
  category: PostCategory;
  subCategory: Nullable<PostSubcategory>;
  images: ImagePickerAsset[];
};

type PostCreateActions = {
  selectPostType: (type: PostType) => void;
  selectCategory: (category: PostCategory) => void;
  selectSubCategory: (subCategory: Nullable<PostSubcategory>) => void;
  setImages: (images: ImagePickerAsset[]) => void;
  removeImageAt: (index: number) => void;
  setPrimaryImage: (index: number) => void;
  debug: () => void;
  resetForm: () => void;
};

const initialState: PostCreationState = {
  postType: PostType.Lost,
  category: POST_CATEGORIES.ELECTRONICS,
  subCategory: ELECTRONICS_SUBCATEGORY.CHARGER_ADAPTER,
  images: [],
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
  resetForm: () => set(initialState),

  debug: () => {
    set((state) => {
      console.log("Current post creation state:", state);
      return state;
    });
  },
}));
