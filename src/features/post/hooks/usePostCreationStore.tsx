import { analyzeImageApi } from "@/src/features/post/api";
import { eventTimeSchema, type EventTime } from "@/src/features/post/schemas";
import {
  CardSlice,
  createCardSlice,
  createElectronicsSlice,
  createPersonalBelongingSlice,
  ElectronicsSlice,
  PersonalBelongingSlice,
} from "@/src/features/post/store";
import {
  AnalyzeImageRequest,
  AnalyzeImageResponse,
  CARD_SUBCATEGORY,
  ELECTRONICS_SUBCATEGORY,
  OTHER_SUBCATEGORY,
  PERSONAL_BELONGING_SUBCATEGORY,
  POST_CATEGORIES,
  PostCategory,
  PostSubcategoryCode,
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

const DEFAULT_SUBCATEGORY: Record<PostCategory, PostSubcategoryCode> = {
  [POST_CATEGORIES.ELECTRONICS]: ELECTRONICS_SUBCATEGORY.PHONE,
  [POST_CATEGORIES.CARD]: CARD_SUBCATEGORY.BANK_CARD,
  [POST_CATEGORIES.PERSONAL_BELONGINGS]:
    PERSONAL_BELONGING_SUBCATEGORY.BACKPACK,
  [POST_CATEGORIES.OTHERS]: OTHER_SUBCATEGORY.OTHER,
};

type PostCreationState = {
  postTitle: string;
  postType: PostType;
  category: PostCategory;
  subCategoryCode: PostSubcategoryCode;
  timeline: {
    date: EventTime;
  };

  aiAnalyzeDraft: Promise<Nullable<AnalyzeImageResponse>>;
  isPickerSheetVisible: boolean;
};

type PostCreateActions = {
  selectPostType: (type: PostType) => void;
  selectCategory: (category: PostCategory) => void;
  selectSubCategory: (subCategory: PostSubcategoryCode) => void;
  updateEventDate: (date: EventTime) => void;
  updatePostTitle: (title: string) => void;
  analyzeByAI: () => Promise<Nullable<AnalyzeImageResponse>>;
  getAnalyzeResult: () => Promise<Nullable<AnalyzeImageResponse>>;

  openPickerSheet: () => void;
  closePickerSheet: () => void;

  debug: () => void;
  resetForm: () => void;
};

const initialState: PostCreationState = {
  postTitle: "Unknown item",
  postType: PostType.Lost,
  category: POST_CATEGORIES.ELECTRONICS,
  subCategoryCode: ELECTRONICS_SUBCATEGORY.PHONE,
  timeline: {
    date: eventTimeSchema.getDefault(),
  },
  aiAnalyzeDraft: Promise.resolve(null),
  isPickerSheetVisible: false,
};

export const usePostCreationStore = create<
  PostCreationState &
    PostCreateActions &
    PhotoSlice &
    LocationSlice &
    ElectronicsSlice &
    CardSlice &
    PersonalBelongingSlice
>((set, get, api) => ({
  ...initialState,
  ...createPhotoSlice(set, get, api),
  ...createLocationSlice(set, get, api),
  ...createElectronicsSlice(set, get, api),
  ...createCardSlice(set, get, api),
  ...createPersonalBelongingSlice(set, get, api),

  selectPostType: (type) => set({ postType: type }),
  selectCategory: (category) =>
    set({ category, subCategoryCode: DEFAULT_SUBCATEGORY[category] }),
  selectSubCategory: (subCategory) => set({ subCategoryCode: subCategory }),

  updatePostTitle: (title) => set({ postTitle: title }),

  updateEventDate: (date) =>
    set((state) => ({
      timeline: {
        ...state.timeline,
        date,
      },
    })),

  analyzeByAI: async () => {
    const { getUploadedImageUrls } = get();
    const imageUrls = await getUploadedImageUrls();

    const req: AnalyzeImageRequest = {
      imageUrls,
      subcategoryCode: get().subCategoryCode,
    };

    set({ aiAnalyzeDraft: analyzeImageApi(req) });
    return get().aiAnalyzeDraft;
  },

  resetForm: () => {
    set(initialState);

    const {
      resetPhotoSlice,
      resetLocationSlice,
      resetElectronicDetail,
      resetCardDetail,
      resetPersonalBelongingDetail,
    } = get();

    resetPhotoSlice();
    resetLocationSlice();
    resetElectronicDetail();
    resetCardDetail();
    resetPersonalBelongingDetail();
  },

  openPickerSheet: () => set({ isPickerSheetVisible: true }),
  closePickerSheet: () => set({ isPickerSheetVisible: false }),

  getAnalyzeResult: () => get().aiAnalyzeDraft,

  debug: () => {
    set((state) => {
      console.log("Current post creation state:", state);
      return state;
    });
  },
}));
