import { ElectronicDetail } from "@/src/features/post/types";
import { Nullable } from "@/src/shared/types";
import { StateCreator } from "zustand";


const DEFAULT_ELECTRONIC_DETAIL: ElectronicDetail = {
  itemName: "Electronic Item",
  brand: null,
  model: null,
  color: null,
  hasCase: null,
  caseDescription: null,
  screenCondition: null,
  lockScreenDescription: null,
  distinguishingFeatures: null,
  aiDescription: null,
  additionalDetails: null,
};

export type ElectronicsSlice = {
  electronicDetail: ElectronicDetail;
  setItemname: (itemName: string) => void;
  setElectronicDetail: (detail: ElectronicDetail) => void;
  setElectronicBrand: (brand: Nullable<string>) => void;
  setElectronicModel: (model: Nullable<string>) => void;
  setElectronicColor: (color: Nullable<string>) => void;
  setElectronicHasCase: (hasCase: Nullable<boolean>) => void;
  setElectronicCaseDescription: (caseDescription: Nullable<string>) => void;
  setElectronicScreenCondition: (screenCondition: Nullable<string>) => void;
  setElectronicLockScreenDescription: (
    lockScreenDescription: Nullable<string>,
  ) => void;
  setElectronicDistinguishingFeatures: (
    distinguishingFeatures: Nullable<string>,
  ) => void;
  setElectronicAiDescription: (aiDescription: Nullable<string>) => void;
  setElectronicAdditionalDetails: (
    additionalDetails: Nullable<string>,
  ) => void;
  resetElectronicDetail: () => void;
};

export const createElectronicsSlice: StateCreator<ElectronicsSlice> = (set) => ({
  electronicDetail: DEFAULT_ELECTRONIC_DETAIL,

  setElectronicDetail: (detail) => set({ electronicDetail: detail }),

  setItemname: (itemName) =>
    set((state) => ({
      electronicDetail: {
        ...state.electronicDetail,
        itemName,
      },
    })),

  setElectronicBrand: (brand) =>
    set((state) => ({
      electronicDetail: {
        ...state.electronicDetail,
        brand,
      },
    })),

  setElectronicModel: (model) =>
    set((state) => ({
      electronicDetail: {
        ...state.electronicDetail,
        model,
      },
    })),

  setElectronicColor: (color) =>
    set((state) => ({
      electronicDetail: {
        ...state.electronicDetail,
        color,
      },
    })),

  setElectronicHasCase: (hasCase) =>
    set((state) => ({
      electronicDetail: {
        ...state.electronicDetail,
        hasCase,
      },
    })),

  setElectronicCaseDescription: (caseDescription) =>
    set((state) => ({
      electronicDetail: {
        ...state.electronicDetail,
        caseDescription,
      },
    })),

  setElectronicScreenCondition: (screenCondition) =>
    set((state) => ({
      electronicDetail: {
        ...state.electronicDetail,
        screenCondition,
      },
    })),

  setElectronicLockScreenDescription: (lockScreenDescription) =>
    set((state) => ({
      electronicDetail: {
        ...state.electronicDetail,
        lockScreenDescription,
      },
    })),

  setElectronicDistinguishingFeatures: (distinguishingFeatures) =>
    set((state) => ({
      electronicDetail: {
        ...state.electronicDetail,
        distinguishingFeatures,
      },
    })),

  setElectronicAiDescription: (aiDescription) =>
    set((state) => ({
      electronicDetail: {
        ...state.electronicDetail,
        aiDescription,
      },
    })),

  setElectronicAdditionalDetails: (additionalDetails) =>
    set((state) => ({
      electronicDetail: {
        ...state.electronicDetail,
        additionalDetails,
      },
    })),

  resetElectronicDetail: () =>
    set({ electronicDetail: DEFAULT_ELECTRONIC_DETAIL }),
});

export { DEFAULT_ELECTRONIC_DETAIL };
