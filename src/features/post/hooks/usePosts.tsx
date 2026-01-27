import { filterPostsApi } from "@/src/features/post/api";
import { POSTS_QUERY_KEY } from "@/src/features/post/constants";
import type {
  PostFilters,
  PostsRequest,
  PostsResponse,
} from "@/src/features/post/types";
import { DEFAULT_PAGED_REQUEST } from "@/src/shared/api";
import { useInfiniteQuery } from "@tanstack/react-query";

export type PostsFiltersOptions = {
  filters: PostFilters;
  enabled?: boolean;
};

export const usePosts = ({ filters, enabled = true }: PostsFiltersOptions) => {
  const query = useInfiniteQuery<PostsResponse>({
    queryKey: [...POSTS_QUERY_KEY, filters],
    enabled,
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const filtersRequest: PostsRequest = {
        searchTerm: filters.searchTerm,
        postType: filters.postType,
        latitude: filters.location?.latitude,
        longitude: filters.location?.longitude,
        radiusInKm: filters.radiusInKm,
        page: Number(pageParam),
        pageSize: DEFAULT_PAGED_REQUEST.pageSize,
      };

      const res: PostsResponse = await filterPostsApi(filtersRequest);
      if (!res) throw new Error("Failed to fetch posts");
      if (!res.success || !res.data)
        throw new Error(res.error?.message || "Failed to fetch posts");
      return res;
    },

    getNextPageParam: (lastPage) => {
      if (!lastPage.data) return undefined;
      const loadedCount = lastPage.data.page * lastPage.data.pageSize;
      return loadedCount < lastPage.data.totalCount
        ? lastPage.data.page + 1
        : undefined;
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
};
