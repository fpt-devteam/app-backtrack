
export type QnAQuestion = {
  id: string;
  postId: string;
  askerId: string;
  questionText: string;
}

export const ANSWER_TYPE = {
  TEXT: "Text",
  IMAGE: "Image",
}

export type AnswerType = typeof ANSWER_TYPE[keyof typeof ANSWER_TYPE];

export type QnAAnswer = {
  questionId: string;
  type: AnswerType;
  answerText?: string;
  imageUrls?: string[];
}

export type AppQnAAnswer = {
  id: string;
  answererId: string;
  createdAt: string;
} & QnAAnswer;

export type AppQnA = QnAQuestion & QnAAnswer;