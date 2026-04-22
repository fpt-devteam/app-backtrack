import { matchingPostsApi, checkPostMatchingStatusApi } from "@/src/features/post/api";
import { MATCHED_POST_IDS_QUERY_KEY } from "@/src/features/post/constants";
import { useGetAllMyPost } from "@/src/features/post/hooks/useGetAllMyPost";
import { PostMatchingStatus } from "@/src/features/post/types";
import { useQueries } from "@tanstack/react-query";
import { useMemo } from "react";

export const useMatchedPostIds = () => {
  const { data: myPosts, isLoading: isLoadingMyPosts } = useGetAllMyPost();

  const matchingQueries = useQueries({
    queries: (myPosts ?? []).map((post) => ({
      queryKey: [...MATCHED_POST_IDS_QUERY_KEY, post.id],
      queryFn: async () => {
        // First check if matching is completed
        const statusResponse = await checkPostMatchingStatusApi({ postId: post.id });
        if (
          !statusResponse?.success ||
          statusResponse.data?.matchingStatus !== PostMatchingStatus.Completed
        ) {
          return [];
        }

        const response = await matchingPostsApi({ postId: post.id });
        if (!response?.success || !response.data) return [];
        return response.data.similarPosts.map((sp) => sp.id);
      },
      enabled: myPosts !== undefined && myPosts.length > 0,
      staleTime: 5 * 60 * 1000, // 5 minutes
    })),
  });

  const isLoading =
    isLoadingMyPosts || matchingQueries.some((q) => q.isLoading);

  const matchedPostIds = useMemo(() => {
    const ids = new Set<string>();

    // Add user's own post IDs
    if (myPosts) {
      for (const post of myPosts) {
        ids.add(post.id);
      }
    }

    // Add all matched similar post IDs
    for (const query of matchingQueries) {
      if (query.data) {
        for (const id of query.data) {
          ids.add(id);
        }
      }
    }

    return ids;
  }, [myPosts, matchingQueries]);

  return { matchedPostIds, isLoading };
};
