import { ApiResponse, PagedRequest, PagedResponse } from "@/src/shared/api";
import { AppQnAAnswer, QnAAnswer, QnAQuestion } from "./qna.type";

export type QnABatchRequest = {
  postId: string;
  questionTexts: string[];
}

export type QnAGetByPostIdRequest = {
  postId: string;
} & PagedRequest

export type QnAGetByPostIdResponse = ApiResponse<PagedResponse<QnAQuestion>>;

// 
export type QnAQuestionCreateRequest = {
  questionText: string;
}

//====
export type QnAAnswerRequest = QnAAnswer;

export type QnAGetWithAnswerRequest = {
  postId: string;
  answererId: string;
}

export type QnAAnswerResult = {
  id: string;
  postId: string;
  askerId: string;
  questionText: string;
  answers: AppQnAAnswer[];
  createdAt: string;
}

export type QnAGetAnswerResponse = ApiResponse<QnAAnswerResult[]>;
