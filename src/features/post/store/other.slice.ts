import { OtherDetail } from "@/src/features/post/types";
import { Nullable } from "@/src/shared/types";
import { StateCreator } from "zustand";

const DEFAULT_OTHER_DETAIL: OtherDetail = {
  itemName: "Other Item",
  primaryColor: null,
  aiDescription: null,
  additionalDetails: null,
};

export type OtherSlice = {
  otherDetail: OtherDetail;
  setOtherDetail: (detail: OtherDetail) => void;
  setOtherItemName: (itemName: string) => void;
  setOtherPrimaryColor: (primaryColor: Nullable<string>) => void;
  setOtherAiDescription: (aiDescription: Nullable<string>) => void;
  setOtherAdditionalDetails: (additionalDetails: Nullable<string>) => void;
  resetOtherDetail: () => void;
};

export const createOtherSlice: StateCreator<OtherSlice> = (set) => ({
  otherDetail: DEFAULT_OTHER_DETAIL,

  setOtherDetail: (detail) => set({ otherDetail: detail }),

  setOtherItemName: (itemName) =>
    set((state) => ({
      otherDetail: {
        ...state.otherDetail,
        itemName,
      },
    })),

  setOtherPrimaryColor: (primaryColor) =>
    set((state) => ({
      otherDetail: {
        ...state.otherDetail,
        primaryColor,
      },
    })),

  setOtherAiDescription: (aiDescription) =>
    set((state) => ({
      otherDetail: {
        ...state.otherDetail,
        aiDescription,
      },
    })),

  setOtherAdditionalDetails: (additionalDetails) =>
    set((state) => ({
      otherDetail: {
        ...state.otherDetail,
        additionalDetails,
      },
    })),

  resetOtherDetail: () => set({ otherDetail: DEFAULT_OTHER_DETAIL }),
});

export { DEFAULT_OTHER_DETAIL };
