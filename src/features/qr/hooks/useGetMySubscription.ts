import { getMySubscription } from "@/src/features/qr/api";
import { QR_SUBSCRIPTION_ME_QUERY_KEY } from "@/src/features/qr/constants";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useGetMySubscription = () => {
  const query = useQuery({
    queryKey: [...QR_SUBSCRIPTION_ME_QUERY_KEY],
    queryFn: async () => {
      const response = await getMySubscription();
      if (!response.success) throw new Error("Failed to fetch subscription");
      return response.data;
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
