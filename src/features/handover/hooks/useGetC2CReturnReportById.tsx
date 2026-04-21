import { useAppUser } from "@/src/features/auth/providers/user.provider";
import { getC2CReturnReportByIdApi } from "@/src/features/handover/api";
import { C2C_RETURN_REPORT_DETAIL_QUERY_KEY } from "@/src/features/handover/constants";
import {
  getMockHandoverByIdForUser,
  IS_HANDOVER_MOCK,
} from "@/src/shared/mocks";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useGetC2CReturnReportById = (id: string) => {
  const { user: currentUser } = useAppUser();

  const query = useQuery({
    // Include the current user's ID in the key so the query re-runs if
    // the logged-in account changes (e.g. during development).
    queryKey: [
      ...C2C_RETURN_REPORT_DETAIL_QUERY_KEY,
      id,
      currentUser?.id ?? null,
    ],
    enabled: !!id,
    queryFn: async () => {
      if (IS_HANDOVER_MOCK) {
        const mock = getMockHandoverByIdForUser(
          id,
          currentUser?.id ?? undefined,
        );
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
