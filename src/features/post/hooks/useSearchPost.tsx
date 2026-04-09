import { searchPost } from "@/src/features/post/api";
import { POST_SEARCH_QUERY_KEY } from "@/src/features/post/constants";
import type {
  PostSearchOptions,
  PostSearchRequest,
  PostSearchResponse,
} from "@/src/features/post/types";
import { Nullable } from "@/src/shared/types";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export type PostSearchOptionsProps = {
  options: Nullable<PostSearchOptions>;
  enabled?: boolean;
};

export const useSearchPost = ({
  options,
  enabled = true,
}: PostSearchOptionsProps) => {
  const query = useQuery<PostSearchResponse>({
    queryKey: [...POST_SEARCH_QUERY_KEY, options],
    enabled: enabled && !!options,

    queryFn: async () => {
      if (!options) throw new Error("Search options are required!");

      const req: PostSearchRequest = {
        ...options,
      };

      const res = await searchPost(req);
      if (!res.success || !res.data) throw new Error("Failed to search posts");
      return res;
    },
  });

  const items = query.data?.data ?? [];

  const error = useMemo(() => {
    if (!query.error) return null;
    if (query.error instanceof Error) return query.error;
    return new Error("Failed to search posts");
  }, [query.error]);

  return {
    error,
    items,
    isLoading: query.isLoading || query.isFetching,
    isRefetching: query.isRefetching,
    refetch: query.refetch,
  };
};
