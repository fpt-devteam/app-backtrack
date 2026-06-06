import { answerQnA as answerQnAApi } from "@/src/features/post/api";
import { POST_QNA_WITH_ANSWER_QUERY_KEY } from "@/src/features/post/constants";
import type { QnAAnswerRequest } from "@/src/features/post/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

export const useAnswerQnA = () => {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (request: QnAAnswerRequest) => {
      const response = await answerQnAApi(request);

      if (!response.success) {
        throw new Error("Failed to answer QnA");
      }

      return response.data;
    },

    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: POST_QNA_WITH_ANSWER_QUERY_KEY,
      });
    },
  });

  const error = useMemo(() => {
    if (!mutation.error) return null;
    if (mutation.error instanceof Error) return mutation.error;
    return new Error("Failed to answer QnA");
  }, [mutation.error]);

  return {
    answerQnA: mutation.mutateAsync,
    isAnswering: mutation.isPending,
    error,
  };
};
