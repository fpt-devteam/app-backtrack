import { getConversationsApi } from "@/src/features/chat/api";
import {
  CHAT_QUERY_KEY,
  getMockConversations,
  IS_CHAT_FEATURE_MOCK,
} from "@/src/features/chat/constants";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useConversations = () => {
  const query = useInfiniteQuery({
    queryKey: CHAT_QUERY_KEY.conversations,
    queryFn: async ({ pageParam }) => {
      const params = {
        cursor: pageParam || undefined,
        limit: 10,
      };

      if (IS_CHAT_FEATURE_MOCK) {
        return getMockConversations(params);
      }

      const response = await getConversationsApi(params);
      if (!response?.success) throw new Error("Failed to fetch conversations");
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage?.hasMore ? (lastPage.nextCursor ?? undefined) : undefined;
    },
    initialPageParam: undefined as string | undefined,
  });

  return {
    data: query.data?.pages.flatMap((page) => page?.conversations || []) || [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
  };
};
