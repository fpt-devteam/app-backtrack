import { useInfiniteQuery } from '@tanstack/react-query';
import { filterPostsApi } from '../api';
import { POSTS_QUERY_KEY } from '../constants';
import { PostFilters, PostsRequest, PostsResponse } from '../types';

type usePostsOptions = {
  filters: PostFilters;
  enabled?: boolean;
}

export const usePosts = ({
  filters,
  enabled = true,
}: usePostsOptions) => {
  const query = useInfiniteQuery<PostsResponse>({
    queryKey: [...POSTS_QUERY_KEY, filters],
    enabled,
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const filtersRequest: PostsRequest = {
        ...filters,
        page: Number(pageParam),
        pageSize: 10,
      };

      const res: PostsResponse = await filterPostsApi(filtersRequest);
      if (!res) throw new Error('Failed to fetch posts');
      if (!res.success || !res.data) throw new Error(res.error?.message || 'Failed to fetch posts');
      return res;
    },

    getNextPageParam: (lastPage) => {
      if (!lastPage.data) return undefined;
      const loadedCount = lastPage.data.page * lastPage.data.pageSize;
      return loadedCount < lastPage.data.totalCount ? lastPage.data.page + 1 : undefined;
    },
  });

  const items = query.data?.pages.flatMap((p) => p.data?.items ?? []) ?? [];
  const totalCount = query.data?.pages?.[0]?.data?.totalCount ?? 0;

  return {
    ...query,
    items,
    totalCount,
    hasMore: query.hasNextPage,
    loadMore: () => {
      if (query.hasNextPage && !query.isFetchingNextPage) query.fetchNextPage();
    },
    isLoading: query.isLoading || query.isFetching,
    isLoadingNextPage: query.isFetchingNextPage,
    refresh: () => query.refetch(),
  };
}
