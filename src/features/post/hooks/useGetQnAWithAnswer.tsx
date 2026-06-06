import { getQnAWithAnswer } from "@/src/features/post/api";
import { POST_QNA_WITH_ANSWER_QUERY_KEY } from "@/src/features/post/constants";
import type {
  QnAAnswerResult,
  QnAGetWithAnswerRequest,
} from "@/src/features/post/types";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useGetQnAWithAnswer = (request: QnAGetWithAnswerRequest) => {
  const query = useQuery({
    queryKey: [
      ...POST_QNA_WITH_ANSWER_QUERY_KEY,
      request.postId,
      request.answererId,
    ],
    enabled: !!request.postId && !!request.answererId,
    queryFn: async () => {
      const response = await getQnAWithAnswer(request);
      if (!response.success || !response.data) {
        throw new Error("Failed to fetch QnAs with answers");
      }

      return response.data;
    },
  });

  const error = useMemo(() => {
    if (!query.error) return null;
    if (query.error instanceof Error) return query.error;
    return new Error("Failed to fetch QnAs with answers");
  }, [query.error]);

  return {
    data: query.data as QnAAnswerResult[] | undefined,
    isLoading: query.isLoading,
    error,
  };
};
