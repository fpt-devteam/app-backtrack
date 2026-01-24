import { filterNotificationsApi } from "@/src/features/notification/api/notification.api";
import { NOTIFICATIONS_QUERY_KEY } from "@/src/features/notification/constants";
import type {
  NotificationStatus,
  NotificationsFilterRequest,
  UserNotification,
} from "@/src/features/notification/types";
import type { ApiResponse, CursorScrollResponse } from "@/src/shared/api";

import { useInfiniteQuery } from "@tanstack/react-query";

export type NotificationsFilterOptions = {
  status?: NotificationStatus;
  enabled?: boolean;
};

export const useNotifications = ({
  status,
  enabled = true,
}: NotificationsFilterOptions = {}) => {
  const query = useInfiniteQuery<
    ApiResponse<CursorScrollResponse<UserNotification>>
  >({
    queryKey: [...NOTIFICATIONS_QUERY_KEY, { status }],
    enabled,
    initialPageParam: undefined,
    queryFn: async ({ pageParam }) => {
      const filterRequest: NotificationsFilterRequest = {
        status,
        cursor: pageParam as string | undefined,
      };

      const res = await filterNotificationsApi(filterRequest);
      console.log("Res", res);
      if (!res) throw new Error("Failed to fetch notifications");
      return res;
    },

    getNextPageParam: (lastPage) => {
      return lastPage.data?.hasMore ? lastPage.data.nextCursor : undefined;
    },
  });

  const items = query.data?.pages.flatMap((p) => p.data?.items ?? []) ?? [];
  const totalCount = items.length;

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
