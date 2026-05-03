import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { updatePostApi } from "@/src/features/post/api";
import {
  MY_POSTS_QUERY_KEY,
  POST_DETAIL_QUERY_KEY,
  POST_UPDATE_KEY,
} from "@/src/features/post/constants";
import type { PostUpdateRequest } from "@/src/features/post/types";

type UpdatePostVariables = {
  postId: string;
  req: PostUpdateRequest;
};

export const useUpdatePost = () => {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationKey: POST_UPDATE_KEY,
    mutationFn: async ({ postId, req }: UpdatePostVariables) => {
      const response = await updatePostApi(postId, req);
      if (!response.success) throw new Error("Update post failed");
      return response.data;
    },
    onSuccess: async (_data, { postId }) => {
      await qc.invalidateQueries({ queryKey: MY_POSTS_QUERY_KEY });
      await qc.invalidateQueries({
        queryKey: [...POST_DETAIL_QUERY_KEY, postId],
      });
    },
  });

  const error = useMemo(() => {
    if (!mutation.error) return null;
    if (mutation.error instanceof Error) return mutation.error;
    return new Error("Update post failed");
  }, [mutation.error]);

  return {
    updatePost: mutation.mutateAsync,
    isUpdatingPost: mutation.isPending,
    error,
  };
};
