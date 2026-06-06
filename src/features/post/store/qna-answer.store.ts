import {
  ANSWER_TYPE,
  AnswerType,
  QnAAnswerRequest,
  QnAQuestion,
} from "@/src/features/post/types";
import { toast } from "@/src/shared/components/ui/toast";
import { uploadImageAssets } from "@/src/shared/services";
import { ImagePickerAsset } from "expo-image-picker";
import { create } from "zustand";

export const MAX_IMAGE_PER_ANSWER = 5;

export type DraftQnAAnswer = {
  questionId: string;
  type: AnswerType;
  draftText?: string;
  draftImages?: ImagePickerAsset[];
  existingImageUrls?: string[];
};

type QnAState = {
  postId: string;
  questions: QnAQuestion[];
  answers: DraftQnAAnswer[];
  isPickerSheetVisible: boolean;
  activeImageQuestionId: string | null;
};

type QnAAction = {
  init: (postId: string, questions: QnAQuestion[]) => void;
  hydrateAnswers: (answers: DraftQnAAnswer[]) => void;
  getQuestionText: (questionId: string) => string;

  canSubmitAnswers: () => boolean;
  changeMode: (questionId: string, type: AnswerType) => void;
  updateAnswerText: (questionId: string, answerText: string) => void;

  buildAnswerRequests: () => Promise<QnAAnswerRequest[] | null>;

  addImages: (questionId: string, newImages: ImagePickerAsset[]) => void;
  addImagesToActiveQuestion: (newImages: ImagePickerAsset[]) => void;
  removeImage: (questionId: string, index: number) => void;

  openPickerSheet: (questionId: string) => void;
  closePickerSheet: () => void;

  reset: () => void;
};

const isImageAnswerValid = (answer: DraftQnAAnswer): boolean => {
  const count = answer.draftImages?.length || 0;
  return count > 0 && count <= MAX_IMAGE_PER_ANSWER;
};

const isTextAnswerValid = (answer: DraftQnAAnswer): boolean => {
  return !!answer.draftText && answer.draftText.trim().length > 0;
};

const isAnswerValid = (answer: DraftQnAAnswer): boolean => {
  if (answer.type === ANSWER_TYPE.IMAGE) return isImageAnswerValid(answer);
  if (answer.type === ANSWER_TYPE.TEXT) return isTextAnswerValid(answer);
  return false;
};

export const useQnAStore = create<QnAState & QnAAction>((set, get) => ({
  postId: "",
  questions: [],
  answers: [],
  isPickerSheetVisible: false,
  activeImageQuestionId: null,

  init: (postId, questions) => {
    const initialAnswers: DraftQnAAnswer[] = questions.map((question) => ({
      questionId: question.id,
      type: ANSWER_TYPE.TEXT,
      draftText: "",
      draftImages: [],
      existingImageUrls: [],
    }));

    set({
      postId,
      questions,
      answers: initialAnswers,
      isPickerSheetVisible: false,
      activeImageQuestionId: null,
    });
  },

  hydrateAnswers: (answers) => {
    set((state) => ({
      answers: answers.map((answer) => {
        const currentAnswer = state.answers.find(
          (item) => item.questionId === answer.questionId
        );

        return {
          questionId: answer.questionId,
          type: answer.type,
          draftText: answer.draftText ?? "",
          draftImages: answer.draftImages ?? [],
          existingImageUrls: answer.existingImageUrls ?? currentAnswer?.existingImageUrls ?? [],
        };
      }),
    }));
  },

  getQuestionText: (questionId) => {
    const question = get().questions.find((q) => q.id === questionId);
    return question?.questionText || "";
  },

  changeMode: (questionId, type) => {
    set((state) => ({
      answers: state.answers.map((answer) =>
        answer.questionId === questionId
          ? {
              ...answer,
              type,
              draftText: type === ANSWER_TYPE.TEXT ? answer.draftText ?? "" : answer.draftText,
              draftImages: type === ANSWER_TYPE.IMAGE ? answer.draftImages ?? [] : answer.draftImages,
            }
          : answer
      ),
    }));
  },

  updateAnswerText: (questionId, answerText) => {
    set((state) => ({
      answers: state.answers.map((answer) =>
        answer.questionId === questionId ? { ...answer, draftText: answerText } : answer
      ),
    }));
  },

  addImages: (questionId, newImages) => {
    set((state) => ({
      answers: state.answers.map((answer) => {
        if (answer.questionId !== questionId) return answer;

        const existingImages = answer.draftImages || [];
        const availableSlots = MAX_IMAGE_PER_ANSWER - existingImages.length;

        if (availableSlots <= 0) return answer;

        const imagesToAdd = newImages.slice(0, availableSlots);
        return {
          ...answer,
          draftImages: [...existingImages, ...imagesToAdd],
        };
      }),
    }));
  },

  addImagesToActiveQuestion: (newImages) => {
    const { activeImageQuestionId, addImages } = get();

    if (!activeImageQuestionId) {
      set({ isPickerSheetVisible: false, activeImageQuestionId: null });
      return;
    }

    addImages(activeImageQuestionId, newImages);
    set({ isPickerSheetVisible: false, activeImageQuestionId: null });
  },

  removeImage: (questionId, indexToRemove) => {
    set((state) => ({
      answers: state.answers.map((answer) => {
        if (answer.questionId !== questionId) return answer;

        const existingImages = answer.draftImages || [];
        return {
          ...answer,
          existingImageUrls: (answer.existingImageUrls || []).filter(
            (_, idx) => idx !== indexToRemove
          ),
          draftImages: existingImages.filter((_, idx) => idx !== indexToRemove),
        };
      }),
    }));
  },

  canSubmitAnswers: () => {
    return get().answers.every(isAnswerValid);
  },

  buildAnswerRequests: async () => {
    const { answers, canSubmitAnswers } = get();

    if (!canSubmitAnswers()) {
      toast.error(
        "Incomplete Answers",
        "Please ensure all questions are answered correctly before submitting."
      );
      return null;
    }

    try {
      const reqs = await Promise.all(
        answers.map(async (answer) => {
          if (answer.type === ANSWER_TYPE.IMAGE) {
            const draftImages = answer.draftImages || [];
            const existingImageUrls = answer.existingImageUrls || [];
            const existingImageUrlSet = new Set(existingImageUrls);
            const newDraftImages = draftImages.filter(
              (image) => !existingImageUrlSet.has(image.uri)
            );
            const uploadedImageUrls = await uploadImageAssets(newDraftImages);
            const imageUrls = [
              ...existingImageUrls,
              ...uploadedImageUrls,
            ];

            return {
              questionId: answer.questionId,
              type: answer.type,
              imageUrls,
            } satisfies QnAAnswerRequest;
          }

          return {
            questionId: answer.questionId,
            type: answer.type,
            answerText: answer.draftText,
          } satisfies QnAAnswerRequest;
        })
      );

      return reqs;

    } catch (_error) {
      toast.error(
        "Upload Failed",
        "We couldn't save your photos. Please check your connection and try again."
      );
      return null;
    }
  },

  openPickerSheet: (questionId) =>
    set({
      isPickerSheetVisible: true,
      activeImageQuestionId: questionId,
    }),

  closePickerSheet: () => set({ isPickerSheetVisible: false }),

  reset: () =>
    set({
      postId: "",
      questions: [],
      answers: [],
      isPickerSheetVisible: false,
      activeImageQuestionId: null,
    }),
}));
