import { getConversationsApi } from "@/src/features/chat/api";
import { CHAT_QUERY_KEY } from "@/src/features/chat/constants";
import { useInfiniteQuery } from "@tanstack/react-query";

type UseConversationsProps = {
  enabled?: boolean;
};

export const useConversations = ({ enabled = true }: UseConversationsProps) => {
  const query = useInfiniteQuery({
    enabled,
    queryKey: CHAT_QUERY_KEY.conversations,
    queryFn: async ({ pageParam }) => {
      const params = {
        cursor: pageParam || undefined,
        limit: 10,
      };

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
    isRefetching: query.isRefetching,
  };
};
