import { getPublicProfile } from "@/src/features/profile/api";
import { PROFILE_QUERY_KEY } from "@/src/features/profile/constants";
import type { GetPublicProfileResponse } from "@/src/features/profile/types";

import { useQuery } from "@tanstack/react-query";

export const useGetPublicProfile = (userId: string) => {
  const query = useQuery<GetPublicProfileResponse>({
    queryKey: [...PROFILE_QUERY_KEY, "public", userId],
    queryFn: async () => {
      const res = await getPublicProfile(userId);
      if (!res) throw new Error("Failed to fetch public profile");
      return res;
    },
  });

  const profile = query.data?.data;

  return {
    profile,
    isLoading: query.isLoading,
  };
};
