import { getC2CReturnReportByIdApi } from "@/src/features/handover/api";
import { C2C_RETURN_REPORT_DETAIL_QUERY_KEY } from "@/src/features/handover/constants";
import {
  getMockHandoverById,
  IS_HANDOVER_MOCK,
} from "@/src/shared/mocks";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useGetC2CReturnReportById = (id: string) => {
  const query = useQuery({
    queryKey: [...C2C_RETURN_REPORT_DETAIL_QUERY_KEY, id],
    enabled: !!id,
    queryFn: async () => {
      if (IS_HANDOVER_MOCK) {
        const mock = getMockHandoverById(id);
        if (!mock) throw new Error("Return report not found");
        return mock;
      }
      const response = await getC2CReturnReportByIdApi(id);
      if (!response.success) throw new Error("Return report not found");
      return response.data;
    },
  });

  const error = useMemo(() => {
    if (!query.error) return null;
    if (query.error instanceof Error) return query.error;
    return new Error("Failed to fetch return report");
  }, [query.error]);

  return {
    data: query.data,
    isLoading: query.isLoading,
    error,
  };
};
