import { eventTimeSchema, type EventTime } from "@/src/features/post/schemas";
import {
  ELECTRONICS_SUBCATEGORY,
  POST_CATEGORIES,
  PostCategory,
  PostSubcategory,
  PostType,
} from "@/src/features/post/types";
import {
  createLocationSlice,
  createPhotoSlice,
  LocationSlice,
  PhotoSlice,
} from "@/src/shared/store";
import { Nullable } from "@/src/shared/types";
import { create } from "zustand";

type PostCreationState = {
  postType: PostType;
  category: PostCategory;
  subCategory: Nullable<PostSubcategory>;
  timeline: {
    date: EventTime;
  };
};

type PostCreateActions = {
  selectPostType: (type: PostType) => void;
  selectCategory: (category: PostCategory) => void;
  selectSubCategory: (subCategory: Nullable<PostSubcategory>) => void;
  updateEventDate: (date: EventTime) => void;
  debug: () => void;
  resetForm: () => void;
};

const initialState: PostCreationState = {
  postType: PostType.Lost,
  category: POST_CATEGORIES.ELECTRONICS,
  subCategory: ELECTRONICS_SUBCATEGORY.CHARGER_ADAPTER,
  timeline: {
    date: eventTimeSchema.getDefault(),
  },
};

export const usePostCreationStore = create<
  PostCreationState & PostCreateActions & PhotoSlice & LocationSlice
>((set, get, api) => ({
  ...initialState,
  ...createPhotoSlice(set, get, api),
  ...createLocationSlice(set, get, api),

  selectPostType: (type) => set({ postType: type }),
  selectCategory: (category) => set({ category, subCategory: null }),
  selectSubCategory: (subCategory) => set({ subCategory }),

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
