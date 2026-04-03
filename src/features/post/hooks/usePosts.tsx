import { getFeedPostsApi } from "@/src/features/post/api";
import { POSTS_QUERY_KEY } from "@/src/features/post/constants";
import type {
  PostFilters,
  PostsRequest,
  PostsResponse,
} from "@/src/features/post/types";
import { DEFAULT_PAGED_REQUEST } from "@/src/shared/api";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRef } from "react";

export type PostsFiltersOptions = {
  filters: PostFilters;
  enabled?: boolean;
};

export const usePosts = ({ filters, enabled = true }: PostsFiltersOptions) => {
  const pageNumberRef = useRef(1);
  const query = useInfiniteQuery<PostsResponse>({
    queryKey: [...POSTS_QUERY_KEY, filters],
    enabled,
    initialPageParam: pageNumberRef.current,
    queryFn: async ({ pageParam }) => {
      const filtersRequest: PostsRequest = {
        searchTerm: filters.searchTerm,
        postType: filters.postType,
        location: {
          latitude: filters.location?.latitude,
          longitude: filters.location?.longitude,
        },
        radiusInKm: filters.radiusInKm,
        page: Number(pageParam),
        pageSize: DEFAULT_PAGED_REQUEST.pageSize,
      };

      const res = await getFeedPostsApi(filtersRequest);
      if (!res.success || !res.data) throw new Error("Failed to fetch posts");
      return res;
    },

    getNextPageParam: (lastPage) => {
      if (lastPage.data?.items.length === 0) return undefined;
      pageNumberRef.current += 1;
      return pageNumberRef.current;
    },
  });

  const items = query.data?.pages.flatMap((p) => p.data?.items ?? []) ?? [];

  const handleLoadMore = () => {
    if (!query.hasNextPage || query.isFetchingNextPage) return;
    query.fetchNextPage();
  };

  return {
    items,
    hasMore: query.hasNextPage,
    loadMore: handleLoadMore,
    isLoading: query.isLoading || query.isFetching,
    isFetchingNextPage: query.isFetchingNextPage,
    isRefetching: query.isRefetching,
    refetch: query.refetch,
  };
};
