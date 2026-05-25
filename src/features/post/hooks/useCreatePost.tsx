import { batchQnA, createPost } from "@/src/features/post/api";
import {
  POST_CREATE_KEY,
  POSTS_QUERY_KEY,
} from "@/src/features/post/constants";
import {
  PostType,
  QnA,
  type PostCreateRequest,
} from "@/src/features/post/types";
import { Optional } from "@/src/shared/types/global.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

export const useCreatePost = () => {
  const qc = useQueryClient();

  async function createQnAs(qnAs: Optional<QnA[]>, postId: string) {
    if (!qnAs || qnAs.length === 0) return;

    const qnaRequest = {
      postId,
      questionTexts: qnAs.map((qna) => qna.questionText),
    };

    await batchQnA(qnaRequest);
  }

  const mutation = useMutation({
    mutationKey: POST_CREATE_KEY,
    mutationFn: async (request: PostCreateRequest) => {
      const response = await createPost(request);
      if (!response.success || !response.data)
        throw new Error("Create post failed");

      if (request.postType === PostType.Found)
        await createQnAs(request.qnAs, response.data.id);

      return response.data;
    },

    onSuccess: async () => {
      qc.invalidateQueries({ queryKey: POSTS_QUERY_KEY });
    },
  });

  const error = useMemo(() => {
    if (!mutation.error) return null;
    if (mutation.error instanceof Error) return mutation.error;
    return new Error("Create post failed");
  }, [mutation.error]);

  return {
    createPost: mutation.mutateAsync,
    isCreatingPost: mutation.isPending,
    error,
  };
};
