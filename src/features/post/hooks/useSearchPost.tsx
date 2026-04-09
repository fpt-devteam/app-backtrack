import { searchPost } from "@/src/features/post/api";
import { POST_SEARCH_QUERY_KEY } from "@/src/features/post/constants";
import type {
  PostSearchOptions,
  PostSearchRequest,
  PostSearchResponse,
} from "@/src/features/post/types";
import { DEFAULT_PAGED_REQUEST } from "@/src/shared/api";
import { Nullable } from "@/src/shared/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo, useRef } from "react";

export type PostSearchOptionsProps = {
  options: Nullable<PostSearchOptions>;
  enabled?: boolean;
};

export const useSearchPost = ({
  options,
  enabled = true,
}: PostSearchOptionsProps) => {
  const pageNumberRef = useRef(1);

  const query = useInfiniteQuery<PostSearchResponse>({
    queryKey: [...POST_SEARCH_QUERY_KEY, options],
    enabled: enabled && !!options,
    initialPageParam: pageNumberRef.current,

    queryFn: async ({ pageParam }) => {
      if (!options) throw new Error("Search options are required!");

      const req: PostSearchRequest = {
        ...options,
        page: Number(pageParam),
        pageSize: DEFAULT_PAGED_REQUEST.pageSize,
      };

      const res = await searchPost(req);
      if (!res.success || !res.data) throw new Error("Failed to search posts");
      return res;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.data?.items.length === 0) return undefined;
      pageNumberRef.current += 1;
      return pageNumberRef.current;
    },
  });

  const items = query.data?.pages.flatMap((p) => p.data?.items ?? []) ?? [];

  const error = useMemo(() => {
    if (!query.error) return null;
    if (query.error instanceof Error) return query.error;
    return new Error("Failed to search posts");
  }, [query.error]);

  const handleLoadMore = () => {
    if (!query.hasNextPage || query.isFetchingNextPage) return;
    query.fetchNextPage();
  };

  return {
    error,
    items,
    hasMore: query.hasNextPage,
    loadMore: handleLoadMore,
    isLoading: query.isLoading || query.isFetching,
    isFetchingNextPage: query.isFetchingNextPage,
    isRefetching: query.isRefetching,
    refetch: query.refetch,
  };
};
