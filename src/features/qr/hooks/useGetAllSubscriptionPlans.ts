import { getAllSubscriptionPlans } from "@/src/features/qr/api";
import { QR_GET_ALL_SUBSCRIPTION_PLANS_QUERY_KEY } from "@/src/features/qr/constants";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useGetAllSubscriptionPlans = () => {
  const query = useQuery({
    queryKey: [...QR_GET_ALL_SUBSCRIPTION_PLANS_QUERY_KEY],
    queryFn: async () => {
      const response = await getAllSubscriptionPlans();
      if (!response.success) throw new Error("Failed to fetch subscription plans");
      return response.data;
    },
  });

  const error = useMemo(() => {
    if (!query.error) return null;
    if (query.error instanceof Error) return query.error;
    return new Error("Fetch subscription plans failed");
  }, [query.error]);

  return {
    data: query.data,
    isLoading: query.isLoading,
    error,
    refetch: query.refetch,
  };
};
