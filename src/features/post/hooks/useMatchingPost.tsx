import { matchingPostsApi } from "@/src/features/post/api";
import { POST_MATCHING_QUERY_KEY } from "@/src/features/post/constants";
import type {
  MatchingPostsData,
  MatchingPostsRequest,
} from "@/src/features/post/types";
import { Optional } from "@/src/shared/types";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useCheckPostMatchingStatus } from "./useCheckPostMatchingStatus";

export const useMatchingPost = (postId: Optional<string>) => {
  const { isMatching } = useCheckPostMatchingStatus(postId);

  const query = useQuery<MatchingPostsData>({
    queryKey: [...POST_MATCHING_QUERY_KEY, "result", postId],
    enabled: !isMatching && !!postId,
    queryFn: async () => {
      if (!postId) throw new Error("Post ID is required for matching");

      const request: MatchingPostsRequest = { postId };
      const response = await matchingPostsApi(request);

      if (!response?.success || !response.data)
        throw new Error("Matching failed");
      return response.data;
    },
  });

  const error = useMemo(() => {
    if (!query.error) return null;
    if (query.error instanceof Error) return query.error;
    return new Error("Matching failed");
  }, [query.error]);

  return {
    error,
    similarPosts: query?.data?.similarPosts || [],
    isMatching,
    isLoading: query.isLoading,
  };
};
