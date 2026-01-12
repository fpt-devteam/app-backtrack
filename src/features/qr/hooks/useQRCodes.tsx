import { useInfiniteQuery } from '@tanstack/react-query';
import { getQrCodes } from '../api';
import { QR_CODES_QUERY_KEY } from '../constants';
import type { GetQrCodesRequest, GetQrCodesResponse } from '../types';

type UseQRCodesOptions = {
  pageSize?: number;
  enabled?: boolean;
};

const useQRCodes = ({ pageSize = 20, enabled = true }: UseQRCodesOptions = {}) => {
  const query = useInfiniteQuery<GetQrCodesResponse>({
    queryKey: [...QR_CODES_QUERY_KEY, { pageSize }],
    enabled,
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const request: GetQrCodesRequest = {
        page: Number(pageParam),
        pageSize,
      };

      const res = await getQrCodes(request);
      if (!res) throw new Error('Failed to fetch QR codes');
      if (!res.success || !res.data) {
        throw new Error(res.error?.message || 'Failed to fetch QR codes');
      }
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
      if (query.hasNextPage && !query.isFetchingNextPage) {
        query.fetchNextPage();
      }
    },
    isLoading: query.isLoading || query.isFetching,
    isLoadingNextPage: query.isFetchingNextPage,
    refresh: () => query.refetch(),
  };
};

export default useQRCodes;
