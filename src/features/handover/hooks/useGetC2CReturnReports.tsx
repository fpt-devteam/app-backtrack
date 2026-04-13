import { getC2CReturnReportsApi } from "@/src/features/handover/api";
import { C2C_RETURN_REPORTS_QUERY_KEY } from "@/src/features/handover/constants";
import type { GetC2CHandoverRequest } from "@/src/features/handover/types";
import { HANDOVER_MOCK, IS_HANDOVER_MOCK } from "@/src/shared/mocks";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useGetC2CReturnReports = (params?: GetC2CHandoverRequest) => {
  const query = useQuery({
    queryKey: [...C2C_RETURN_REPORTS_QUERY_KEY, params],
    queryFn: async () => {
      if (IS_HANDOVER_MOCK) return HANDOVER_MOCK;

      const response = await getC2CReturnReportsApi(params);

      if (!response.success || !response.data)
        throw new Error("Failed to fetch return reports");

      return response.data.items;
    },
  });

  const error = useMemo(() => {
    if (!query.error) return null;
    if (query.error instanceof Error) return query.error;
    return new Error("Failed to fetch return reports");
  }, [query.error]);

  return {
    data: query.data ?? [],
    isLoading: query.isLoading,
    error,
    refetch: query.refetch,
  };
};
