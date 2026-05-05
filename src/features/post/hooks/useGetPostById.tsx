import { getPostByIdApi } from "@/src/features/post/api";
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
      if (!response.success) throw new Error("Post not found");
      return response.data;
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
