import { getNotifications } from "@/src/features/notification/api";
import { notificationKeys } from "@/src/features/notification/constants";
import type {
  GetNotificationsRequest,
  GetNotificationsResponse,
  NotificationItem,
} from "@/src/features/notification/types";
import { useInfiniteQuery } from "@tanstack/react-query";

export type UseInfiniteNotificationsOptions = {
  filters?: Omit<GetNotificationsRequest, "cursor" | "limit">;
  limit?: number;
  enabled?: boolean;
};

export const useInfiniteNotifications = ({
  filters = {},
  limit = 20,
  enabled = true,
}: UseInfiniteNotificationsOptions = {}) => {
  const query = useInfiniteQuery<GetNotificationsResponse>({
    queryKey: notificationKeys.list({ ...filters, limit }),
    enabled,
    initialPageParam: undefined,
    queryFn: async ({ pageParam }) => {
      const request: GetNotificationsRequest = {
        ...filters,
        cursor: pageParam as string | undefined,
        limit,
      };

      const response = await getNotifications(request);
      if (!response) throw new Error("Failed to fetch notifications");
      if (!response.success || !response.data) {
        throw new Error(
          response.error?.message || "Failed to fetch notifications",
        );
      }
      return response;
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.data) return undefined;
      return lastPage.data.hasMore ? lastPage.data.nextCursor : undefined;
    },
  });

  const items: NotificationItem[] =
    query.data?.pages.flatMap((page) => page.data?.items ?? []) ?? [];

  return {
    ...query,
    items,
  };
};
