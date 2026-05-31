import { privateClient } from "@/src/shared/api";
import { QnAAnswerRequest, QnABatchRequest, QnAGetByPostIdRequest, QnAGetByPostIdResponse } from "@/src/features/post/types";

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

export const answerQnA = async (req: QnAAnswerRequest) => {
  const payload: Record<string, unknown> = {
    type: req.type,
  };
  if (req.answerText !== undefined) payload.answerText = req.answerText;
  if (req.imageUrls !== undefined) payload.imageUrls = req.imageUrls;

  const response = await privateClient.post(QNA_API.answerQnA(req.qnaId), payload);
  return response.data;
};
