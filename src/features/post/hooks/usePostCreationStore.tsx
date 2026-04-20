import { eventTimeSchema, type EventTime } from "@/src/features/post/schemas";
import {
  createElectronicsSlice,
  ElectronicsSlice,
} from "@/src/features/post/store";
import {
  CARD_SUBCATEGORY,
  ELECTRONICS_SUBCATEGORY,
  OTHER_SUBCATEGORY,
  PERSONAL_BELONGING_SUBCATEGORY,
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
import { create } from "zustand";

const DEFAULT_SUBCATEGORY: Record<PostCategory, PostSubcategory> = {
  [POST_CATEGORIES.ELECTRONICS]: ELECTRONICS_SUBCATEGORY.PHONE,
  [POST_CATEGORIES.CARD]: CARD_SUBCATEGORY.BANK_CARD,
  [POST_CATEGORIES.PERSONAL_BELONGINGS]:
    PERSONAL_BELONGING_SUBCATEGORY.BACKPACK,
  [POST_CATEGORIES.OTHER]: OTHER_SUBCATEGORY.OTHER,
};

type PostCreationState = {
  postType: PostType;
  category: PostCategory;
  subCategory: PostSubcategory;
  timeline: {
    date: EventTime;
  };
};

type PostCreateActions = {
  selectPostType: (type: PostType) => void;
  selectCategory: (category: PostCategory) => void;
  selectSubCategory: (subCategory: PostSubcategory) => void;
  updateEventDate: (date: EventTime) => void;
  debug: () => void;
  resetForm: () => void;
};

const initialState: PostCreationState = {
  postType: PostType.Lost,
  category: POST_CATEGORIES.ELECTRONICS,
  subCategory: ELECTRONICS_SUBCATEGORY.PHONE,
  timeline: {
    date: eventTimeSchema.getDefault(),
  },
};

export const usePostCreationStore = create<
  PostCreationState &
    PostCreateActions &
    PhotoSlice &
    LocationSlice &
    ElectronicsSlice
>((set, get, api) => ({
  ...initialState,
  ...createPhotoSlice(set, get, api),
  ...createLocationSlice(set, get, api),
  ...createElectronicsSlice(set, get, api),

  selectPostType: (type) => set({ postType: type }),
  selectCategory: (category) =>
    set({ category, subCategory: DEFAULT_SUBCATEGORY[category] }),
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
