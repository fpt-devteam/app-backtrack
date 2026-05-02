import { getUnreadCountApi } from "@/src/features/notification/api/notification.api";
import { NOTIFICATIONS_UNREAD_COUNT_KEY } from "@/src/features/notification/constants";
import type { UnreadCountResponse } from "@/src/features/notification/types";

import { useQuery } from "@tanstack/react-query";

export type useUnreadNotificationCountOptions = {
  enabled?: boolean;
};

export const useUnreadNotificationCount = ({
  enabled = true,
}: useUnreadNotificationCountOptions = {}) => {
  const query = useQuery<UnreadCountResponse>({
    queryKey: [...NOTIFICATIONS_UNREAD_COUNT_KEY],
    enabled,
    queryFn: async () => {
      const res = await getUnreadCountApi();
      if (!res) throw new Error("Failed to fetch unread count");
      return res;
    },
  });

  const count = query.data?.data?.count ?? 0;

  return {
    ...query,
    count,
  };
};
