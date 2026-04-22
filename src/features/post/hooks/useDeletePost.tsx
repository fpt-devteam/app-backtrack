import { deletePostApi } from "@/src/features/post/api";
import {
  MY_POSTS_QUERY_KEY,
  POSTS_QUERY_KEY,
} from "@/src/features/post/constants";
import type { PostDeleteByIdRequest } from "@/src/features/post/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

export const useDeletePost = () => {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (request: PostDeleteByIdRequest) => {
      const response = await deletePostApi(request);
      if (!response.success) throw new Error("Delete post failed");
      return response.data;
    },

    onSuccess: async () => {
      qc.invalidateQueries({ queryKey: POSTS_QUERY_KEY });
      qc.invalidateQueries({ queryKey: MY_POSTS_QUERY_KEY });
    },
  });

  const error = useMemo(() => {
    if (!mutation.error) return null;
    if (mutation.error instanceof Error) return mutation.error;
    return new Error("Delete post failed");
  }, [mutation.error]);

  return {
    deletePost: mutation.mutateAsync,
    isDeletingPost: mutation.isPending,
    error,
  };
};
