import { getMyProfile } from "@/src/features/profile/api";
import { PROFILE_QUERY_KEY } from "@/src/features/profile/constants";
import type { GetMeResponse } from "@/src/features/profile/types";

import { useQuery } from "@tanstack/react-query";

export type UseGetMeOptions = {
  enabled?: boolean;
};

export const useGetMe = ({ enabled = true }: UseGetMeOptions = {}) => {
  const query = useQuery<GetMeResponse>({
    queryKey: [...PROFILE_QUERY_KEY, "me"],
    enabled,
    queryFn: async () => {
      const res = await getMyProfile();
      if (!res) throw new Error("Failed to fetch my profile");
      return res;
    },
  });
  const profile = query.data?.data;

  return {
    profile,
    refetch: query.refetch,
    isLoading: query.isLoading,
  };
};
