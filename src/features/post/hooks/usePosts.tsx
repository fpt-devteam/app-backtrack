import { getFeedPostsApi } from "@/src/features/post/api";
import { POSTS_QUERY_KEY } from "@/src/features/post/constants";
import {
  POST_CATEGORIES,
  type Post,
  type PostCategory,
  type PostFeedRequest,
  type PostFeedResponse,
  type PostFilters,
} from "@/src/features/post/types";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export type PostsFiltersOptions = {
  filters: PostFilters;
  enabled?: boolean;
};

export type PostFeedSection = {
  key: PostCategory;
  items: Post[];
};

const SECTION_ORDER: PostCategory[] = Object.values(POST_CATEGORIES);

const mapCategoryToSectionKey = (category: PostCategory) => {
  switch (category) {
    case POST_CATEGORIES.ELECTRONICS:
      return "electronics";
    case POST_CATEGORIES.CARD:
      return "cards";
    case POST_CATEGORIES.PERSONAL_BELONGINGS:
      return "personal_belongings";
    default:
      return "other";
  }
};

export const usePosts = ({ filters, enabled = true }: PostsFiltersOptions) => {
  const query = useQuery<PostFeedResponse>({
    queryKey: [...POSTS_QUERY_KEY, filters],
    enabled,
    queryFn: async () => {
      const filtersRequest: PostFeedRequest = {
        searchTerm: filters.searchTerm,
        postType: filters.postType,
        authorId: filters.authorId,
        location: {
          latitude: filters.location?.latitude,
          longitude: filters.location?.longitude,
        },
        radiusInKm: filters.radiusInKm,
      };

      const res = await getFeedPostsApi(filtersRequest);
      if (!res.success || !res.data) throw new Error("Failed to fetch posts");
      return res;
    },
  });

  const sections = useMemo(() => {
    const feedData = query.data?.data;
    if (!feedData) return [] as PostFeedSection[];

    return SECTION_ORDER.map((category) => ({
      key: category,
      title: category,
      items: feedData[mapCategoryToSectionKey(category)] ?? [],
    })).filter((section) => section.items.length > 0);
  }, [query.data?.data]);

  const items = useMemo(
    () => sections.flatMap((section) => section.items),
    [sections],
  );

  const error = useMemo(() => {
    if (!query.error) return null;
    if (query.error instanceof Error) return query.error;
    return new Error("Failed to fetch posts");
  }, [query.error]);

  return {
    error,
    sections,
    items,
    isLoading: query.isLoading,
    isRefetching: query.isRefetching,
    refetch: query.refetch,
  };
};
