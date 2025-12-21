import { getPosts } from '@/src/api/posts';
import type {
  PostFilters,
  PostListItem,
} from '@/src/types/post.type';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiResponse, PagedResponse } from '../types/global.type';

interface UsePostsState {
  posts: PostListItem[];
  loading: boolean;
  refreshing: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
  totalCount: number;
}

interface UsePostsReturn extends UsePostsState {
  loadMore: () => void;
  refresh: () => void;
  retry: () => void;
}

export const usePosts = (
  filters: PostFilters,
  pageSize: number = 20
): UsePostsReturn => {
  const [state, setState] = useState<UsePostsState>({
    posts: [],
    loading: true,
    refreshing: false,
    loadingMore: false,
    error: null,
    hasMore: true,
    currentPage: 1,
    totalCount: 0,
  });

  const currentRequestRef = useRef<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchPosts = useCallback(
    async (page: number, append: boolean = false) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const requestId = ++currentRequestRef.current;
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      try {
        setState((prev) => ({
          ...prev,
          loading: page === 1 && !append && !prev.refreshing,
          loadingMore: append,
          error: null,
        }));

        const params = {
          page,
          pageSize,
          ...(filters.postType && { postType: filters.postType }),
          ...(filters.searchTerm.trim() && { searchTerm: filters.searchTerm.trim() }),
          ...(filters.location && {
            latitude: filters.location.latitude,
            longitude: filters.location.longitude,
          }),
          ...(filters.radiusInKm && { radiusInKm: filters.radiusInKm }),
        };

        const response: ApiResponse<PagedResponse<PostListItem>> = await getPosts(params);

        if (requestId !== currentRequestRef.current) {
          return;
        }

        if (!response.success || !response.data) {
          throw new Error(response.error?.message || 'Failed to fetch posts');
        }

        const { items, totalCount, page: responsePage } = response.data;
        const totalPages = Math.ceil(totalCount / pageSize);
        const hasMore = responsePage < totalPages;

        setState((prev) => ({
          ...prev,
          posts: append ? [...prev.posts, ...items] : items,
          loading: false,
          refreshing: false,
          loadingMore: false,
          currentPage: page,
          totalCount,
          hasMore,
          error: null,
        }));
      } catch (error: any) {
        if (error.name === 'AbortError' || requestId !== currentRequestRef.current) {
          return;
        }

        setState((prev) => ({
          ...prev,
          loading: false,
          refreshing: false,
          loadingMore: false,
          error: error.message || 'An error occurred while fetching posts',
        }));
      }
    },
    [filters, pageSize]
  );

  const loadMore = useCallback(() => {
    if (!state.loadingMore && !state.loading && state.hasMore) {
      fetchPosts(state.currentPage + 1, true);
    }
  }, [state.loadingMore, state.loading, state.hasMore, state.currentPage, fetchPosts]);

  const refresh = useCallback(() => {
    setState((prev) => ({ ...prev, refreshing: true }));
    fetchPosts(1, false);
  }, [fetchPosts]);

  const retry = useCallback(() => {
    fetchPosts(1, false);
  }, [fetchPosts]);

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (filters.searchTerm) {
      debounceTimerRef.current = setTimeout(() => {
        fetchPosts(1, false);
      }, 300);
    } else {
      fetchPosts(1, false);
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [filters.postType, filters.searchTerm, filters.location, filters.radiusInKm, fetchPosts]);

  return {
    ...state,
    loadMore,
    refresh,
    retry,
  };
};
