import { useInfiniteQuery } from '@tanstack/react-query';
import { getConversationsApi } from '../api';
import { CHAT_QUERY_KEY } from '../constants';

const useConversations = () => {
  const query = useInfiniteQuery({
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
      return lastPage?.hasMore ? lastPage.nextCursor : undefined;
    },
    initialPageParam: undefined as string | undefined,
  });

  return {
    data: query.data?.pages.flatMap(page => page?.items || []) || [],
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

export default useConversations;
