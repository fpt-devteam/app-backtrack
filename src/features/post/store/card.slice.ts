import { CardDetail } from "@/src/features/post/types";
import { Nullable } from "@/src/shared/types";
import { StateCreator } from "zustand";

const DEFAULT_CARD_DETAIL: CardDetail = {
  itemName: "Card Item",
  cardNumberHash: null,
  cardNumberMasked: null,
  holderName: null,
  holderNameNormalized: null,
  dateOfBirth: null,
  issueDate: null,
  expiryDate: null,
  issuingAuthority: null,
  ocrText: null,
};

export type CardSlice = {
  cardDetail: CardDetail;
  setCardItemName: (itemName: string) => void;
  setCardDetail: (detail: CardDetail) => void;
  setCardNumberHash: (cardNumberHash: Nullable<string>) => void;
  setCardNumberMasked: (cardNumberMasked: Nullable<string>) => void;
  setCardHolderName: (holderName: Nullable<string>) => void;
  setCardHolderNameNormalized: (
    holderNameNormalized: Nullable<string>,
  ) => void;
  setCardDateOfBirth: (dateOfBirth: Date | null) => void;
  setCardIssueDate: (issueDate: Date | null) => void;
  setCardExpiryDate: (expiryDate: Date | null) => void;
  setCardIssuingAuthority: (issuingAuthority: Nullable<string>) => void;
  setCardOcrText: (ocrText: Nullable<string>) => void;
  resetCardDetail: () => void;
};

export const createCardSlice: StateCreator<CardSlice> = (set) => ({
  cardDetail: DEFAULT_CARD_DETAIL,

  setCardDetail: (detail) => set({ cardDetail: detail }),

  setCardItemName: (itemName) =>
    set((state) => ({
      cardDetail: {
        ...state.cardDetail,
        itemName,
      },
    })),

  setCardNumberHash: (cardNumberHash) =>
    set((state) => ({
      cardDetail: {
        ...state.cardDetail,
        cardNumberHash,
      },
    })),

  setCardNumberMasked: (cardNumberMasked) =>
    set((state) => ({
      cardDetail: {
        ...state.cardDetail,
        cardNumberMasked,
      },
    })),

  setCardHolderName: (holderName) =>
    set((state) => ({
      cardDetail: {
        ...state.cardDetail,
        holderName,
      },
    })),

  setCardHolderNameNormalized: (holderNameNormalized) =>
    set((state) => ({
      cardDetail: {
        ...state.cardDetail,
        holderNameNormalized,
      },
    })),

  setCardDateOfBirth: (dateOfBirth) =>
    set((state) => ({
      cardDetail: {
        ...state.cardDetail,
        dateOfBirth,
      },
    })),

  setCardIssueDate: (issueDate) =>
    set((state) => ({
      cardDetail: {
        ...state.cardDetail,
        issueDate,
      },
    })),

  setCardExpiryDate: (expiryDate) =>
    set((state) => ({
      cardDetail: {
        ...state.cardDetail,
        expiryDate,
      },
    })),

  setCardIssuingAuthority: (issuingAuthority) =>
    set((state) => ({
      cardDetail: {
        ...state.cardDetail,
        issuingAuthority,
      },
    })),

  setCardOcrText: (ocrText) =>
    set((state) => ({
      cardDetail: {
        ...state.cardDetail,
        ocrText,
      },
    })),

  resetCardDetail: () => set({ cardDetail: DEFAULT_CARD_DETAIL }),
});

export { DEFAULT_CARD_DETAIL };
