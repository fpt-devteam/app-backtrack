import { getPostByIdApi, getQnAByPostId } from "@/src/features/post/api";
import { POST_DETAIL_QUERY_KEY } from "@/src/features/post/constants";
import type { PostGetByIdRequest } from "@/src/features/post/types";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useGetPostById = (request: PostGetByIdRequest) => {
  const query = useQuery({
    queryKey: [...POST_DETAIL_QUERY_KEY, request.postId],
    enabled: !!request.postId,
    queryFn: async () => {
      const response = await getPostByIdApi(request);
      if (!response.success || !response.data)
        throw new Error("Post not found");

      const post = response.data;

      if (post.postType === "Found") {
        const qnaResponse = await getQnAByPostId({
          postId: post.id,
          page: 1,
          pageSize: 20,
        });

        if (!qnaResponse.success) throw new Error("Failed to fetch QnAs");
        return { ...post, qnAs: qnaResponse.data?.items || [] };
      }

      return post;
    },
  });

  const error = useMemo(() => {
    if (!query.error) return null;
    if (query.error instanceof Error) return query.error;
    return new Error("Fetch item failed");
  }, [query.error]);

  return {
    data: query.data,
    isLoading: query.isLoading,
    error,
  };
};
