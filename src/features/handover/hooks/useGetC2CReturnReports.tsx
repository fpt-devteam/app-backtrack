import { useAppUser } from "@/src/features/auth/providers/user.provider";
import { getC2CReturnReportsApi } from "@/src/features/handover/api";
import { C2C_RETURN_REPORTS_QUERY_KEY } from "@/src/features/handover/constants";
import type { GetC2CHandoverRequest } from "@/src/features/handover/types";
import {
  getMockHandoverByIdForUser,
  HANDOVER_MOCK,
  IS_HANDOVER_MOCK,
} from "@/src/shared/mocks";
import { useQuery } from "@tanstack/react-query";

export const useGetC2CReturnReports = (params?: GetC2CHandoverRequest) => {
  const { user: currentUser } = useAppUser();

  const query = useQuery({
    queryKey: [
      ...C2C_RETURN_REPORTS_QUERY_KEY,
      currentUser?.id ?? null,
    ],
    queryFn: async () => {
      if (IS_HANDOVER_MOCK) {
        const data = HANDOVER_MOCK.map(
          (handover) =>
            getMockHandoverByIdForUser(
              handover.id,
              currentUser?.id ?? undefined,
            ) ?? handover,
        );

        const filtered = params?.status
          ? data.filter((handover) => handover.status === params.status)
          : data;

        if (!params?.page || !params?.pageSize) return filtered;

        const start = (params.page - 1) * params.pageSize;
        return filtered.slice(start, start + params.pageSize);
      }

      const response = await getC2CReturnReportsApi(params);

      if (!response.success || !response.data)
        throw new Error("Failed to fetch return reports");

      return response.data.items;
    },
  });

  return {
    data: query.data ?? [],
    isLoading: query.isLoading,
    isRefetching: query.isRefetching,
    error: !query.error
      ? null
      : query.error instanceof Error
        ? query.error
        : new Error("Failed to fetch return reports"),
    refetch: query.refetch,
  };
};
