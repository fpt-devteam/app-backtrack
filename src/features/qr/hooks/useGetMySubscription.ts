import { getMySubscription } from "@/src/features/qr/api";
import { QR_SUBSCRIPTION_ME_QUERY_KEY } from "@/src/features/qr/constants";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useAppUser } from "../../auth/providers";

export const useGetMySubscription = () => {
  const { user, isSyncing } = useAppUser();

  const query = useQuery({
    queryKey: [...QR_SUBSCRIPTION_ME_QUERY_KEY],
    enabled: !!user && !isSyncing,
    gcTime: 0,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    queryFn: async () => {
      const response = await getMySubscription();
      if (!response.success) throw new Error("Failed to fetch subscription");
      return response.data ?? null;
    },
  });

  const error = useMemo(() => {
    if (!query.error) return null;
    if (query.error instanceof Error) return query.error;
    return new Error("Fetch subscription failed");
  }, [query.error]);

  return {
    data: query.data,
    isLoading: query.isLoading,
    error,
    refetch: query.refetch,
  };
};
