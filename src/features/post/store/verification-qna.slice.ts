import { HANDOVER_VERIFICATION_QUESTIONS } from "@/src/features/post/constants/handover-verification.constant";
import type { PostSubcategoryCode, QnA } from "@/src/features/post/types";
import { StateCreator } from "zustand";

const MAX_QNA_COUNT = 3;

const normalizeQuestionText = (questionText: string) => questionText.trim();

const buildMockQuestions = (subcategory: PostSubcategoryCode): QnA[] =>
  (HANDOVER_VERIFICATION_QUESTIONS[subcategory] ?? [])
    .slice(0, MAX_QNA_COUNT)
    .map((questionText) => ({
      questionText: normalizeQuestionText(questionText),
    }));

export type VerificationQnASlice = {
  questions: QnA[];
  loadMockQuestions: (subcategory: PostSubcategoryCode) => void;
  addQuestion: (qna: QnA) => void;
  updateQuestion: (originalQuestionText: string, qna: QnA) => void;
  deleteQuestion: (questionText: string) => void;
  resetQuestions: () => void;
};

type VerificationQnAStore = VerificationQnASlice & {
  subCategoryCode: PostSubcategoryCode;
};

export const createVerificationQnASlice: StateCreator<
  VerificationQnAStore,
  [],
  [],
  VerificationQnASlice
> = (set, get) => ({
  questions: [],

  loadMockQuestions: (subcategory) => {
    if (get().questions.length > 0) return;
    set({ questions: buildMockQuestions(subcategory) });
  },

  addQuestion: (qna) =>
    set((state) => {
      const normalizedQuestionText = normalizeQuestionText(qna.questionText);
      if (!normalizedQuestionText) return state;
      if (state.questions.length >= MAX_QNA_COUNT) return state;
      if (
        state.questions.some(
          (question) =>
            normalizeQuestionText(question.questionText) === normalizedQuestionText,
        )
      ) {
        return state;
      }

      return {
        questions: [
          ...state.questions,
          {
            ...qna,
            questionText: normalizedQuestionText,
          },
        ],
      };
    }),

  updateQuestion: (originalQuestionText, qna) =>
    set((state) => {
      const normalizedOriginalQuestionText = normalizeQuestionText(
        originalQuestionText,
      );
      const normalizedQuestionText = normalizeQuestionText(qna.questionText);

      if (!normalizedQuestionText) return state;

      const hasDuplicate = state.questions.some(
        (question) =>
          normalizeQuestionText(question.questionText) === normalizedQuestionText &&
          normalizeQuestionText(question.questionText) !==
            normalizedOriginalQuestionText,
      );

      if (hasDuplicate) return state;

      return {
        questions: state.questions.map((question) =>
          normalizeQuestionText(question.questionText) ===
          normalizedOriginalQuestionText
            ? {
                ...question,
                ...qna,
                questionText: normalizedQuestionText,
              }
            : question,
        ),
      };
    }),

  deleteQuestion: (questionText) =>
    set((state) => ({
      questions: state.questions.filter(
        (question) =>
          normalizeQuestionText(question.questionText) !==
          normalizeQuestionText(questionText),
      ),
    })),

  resetQuestions: () => {
    set({ questions: [] });
    get().loadMockQuestions(get().subCategoryCode);
  },
});

export { MAX_QNA_COUNT };
