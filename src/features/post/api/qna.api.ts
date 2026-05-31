import { privateClient } from "@/src/shared/api";
import { QnABatchRequest, QnAGetByPostIdRequest, QnAGetByPostIdResponse } from "../types";

export const QNA_API = {
  batchQnA: "/api/core/qna/batch",
  getQnAByPostId: (postId: string) => `/api/core/qna?postId=${postId}`,
  answerQnA: (qnaId: string) => `/api/core/qna/${qnaId}/answers`,
  getQnAWithAnswer: (postId: string, answererId: string) => `/api/core/qna/with-answers?postId=${postId}&answererId=${answererId}`,
} as const;

export const batchQnA = async (req: QnABatchRequest) => {
  const response = await privateClient.post(QNA_API.batchQnA, req);
  return response.data;
};

export const getQnAByPostId = async (req: QnAGetByPostIdRequest) => {
  const response = await privateClient.get<QnAGetByPostIdResponse>(QNA_API.getQnAByPostId(req.postId));
  return response.data;
};