import { PersonalBelongingDetail } from "@/src/features/post/types";
import { Nullable } from "@/src/shared/types";
import { StateCreator } from "zustand";

const DEFAULT_PERSONAL_BELONGING_DETAIL: PersonalBelongingDetail = {
  itemName: "Personal Belonging Item",
  color: null,
  brand: null,
  material: null,
  size: null,
  condition: null,
  distinctiveMarks: null,
  aiDescription: null,
  additionalDetails: null,
};

export type PersonalBelongingSlice = {
  personalBelongingDetail: PersonalBelongingDetail;
  setPersonalBelongingItemName: (itemName: string) => void;
  setPersonalBelongingDetail: (detail: PersonalBelongingDetail) => void;
  setPersonalBelongingColor: (color: Nullable<string>) => void;
  setPersonalBelongingBrand: (brand: Nullable<string>) => void;
  setPersonalBelongingMaterial: (material: Nullable<string>) => void;
  setPersonalBelongingSize: (size: Nullable<string>) => void;
  setPersonalBelongingCondition: (condition: Nullable<string>) => void;
  setPersonalBelongingDistinctiveMarks: (
    distinctiveMarks: Nullable<string>,
  ) => void;
  setPersonalBelongingAiDescription: (aiDescription: Nullable<string>) => void;
  setPersonalBelongingAdditionalDetails: (
    additionalDetails: Nullable<string>,
  ) => void;
  resetPersonalBelongingDetail: () => void;
};

export const createPersonalBelongingSlice: StateCreator<
  PersonalBelongingSlice
> = (set) => ({
  personalBelongingDetail: DEFAULT_PERSONAL_BELONGING_DETAIL,

  setPersonalBelongingDetail: (detail) => set({ personalBelongingDetail: detail }),

  setPersonalBelongingItemName: (itemName) =>
    set((state) => ({
      personalBelongingDetail: {
        ...state.personalBelongingDetail,
        itemName,
      },
    })),

  setPersonalBelongingColor: (color) =>
    set((state) => ({
      personalBelongingDetail: {
        ...state.personalBelongingDetail,
        color,
      },
    })),

  setPersonalBelongingBrand: (brand) =>
    set((state) => ({
      personalBelongingDetail: {
        ...state.personalBelongingDetail,
        brand,
      },
    })),

  setPersonalBelongingMaterial: (material) =>
    set((state) => ({
      personalBelongingDetail: {
        ...state.personalBelongingDetail,
        material,
      },
    })),

  setPersonalBelongingSize: (size) =>
    set((state) => ({
      personalBelongingDetail: {
        ...state.personalBelongingDetail,
        size,
      },
    })),

  setPersonalBelongingCondition: (condition) =>
    set((state) => ({
      personalBelongingDetail: {
        ...state.personalBelongingDetail,
        condition,
      },
    })),

  setPersonalBelongingDistinctiveMarks: (distinctiveMarks) =>
    set((state) => ({
      personalBelongingDetail: {
        ...state.personalBelongingDetail,
        distinctiveMarks,
      },
    })),

  setPersonalBelongingAiDescription: (aiDescription) =>
    set((state) => ({
      personalBelongingDetail: {
        ...state.personalBelongingDetail,
        aiDescription,
      },
    })),

  setPersonalBelongingAdditionalDetails: (additionalDetails) =>
    set((state) => ({
      personalBelongingDetail: {
        ...state.personalBelongingDetail,
        additionalDetails,
      },
    })),

  resetPersonalBelongingDetail: () =>
    set({ personalBelongingDetail: DEFAULT_PERSONAL_BELONGING_DETAIL }),
});

export { DEFAULT_PERSONAL_BELONGING_DETAIL };
