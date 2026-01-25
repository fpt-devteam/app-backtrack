import { getUnreadCountApi } from "@/src/features/notification/api/notification.api";
import { NOTIFICATIONS_QUERY_KEY } from "@/src/features/notification/constants";
import type { UnreadCountResponse } from "@/src/features/notification/types";

import { useQuery } from "@tanstack/react-query";

export type UseUnreadCountOptions = {
  enabled?: boolean;
};

export const useUnreadCount = ({
  enabled = true,
}: UseUnreadCountOptions = {}) => {
  const query = useQuery<UnreadCountResponse>({
    queryKey: [...NOTIFICATIONS_QUERY_KEY, "unread-count"],
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
