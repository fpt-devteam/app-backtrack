import { answerQnA as answerQnAApi } from "@/src/features/post/api";
import type { QnAAnswerRequest } from "@/src/features/post/types";
import { useMutation } from "@tanstack/react-query";
import { useMemo } from "react";

export const useAnswerQnA = () => {
  const mutation = useMutation({
    mutationFn: async (request: QnAAnswerRequest) => {
      const response = await answerQnAApi(request);

      if (!response.success) {
        throw new Error("Failed to answer QnA");
      }

      return response.data;
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
