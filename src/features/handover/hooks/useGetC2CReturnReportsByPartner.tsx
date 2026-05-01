import { getC2CReturnReportsByPartnerApi } from "@/src/features/handover/api";
import { C2C_RETURN_REPORTS_QUERY_KEY } from "@/src/features/handover/constants";
import type {
  Handover,
  ReturnReportStatus,
} from "@/src/features/handover/types";
import { HANDOVER_MOCK, IS_HANDOVER_MOCK } from "@/src/shared/mocks";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

const IN_PROGRESS_STATUSES: ReturnReportStatus[] = ["Ongoing", "Delivered"];

export const useGetC2CReturnReportsByPartner = (
  partnerId: string | null | undefined,
) => {
  const query = useQuery({
    queryKey: [...C2C_RETURN_REPORTS_QUERY_KEY, "byPartner", partnerId ?? null],
    queryFn: async (): Promise<Handover[]> => {
      if (IS_HANDOVER_MOCK) {
        return HANDOVER_MOCK;
      }
      const response = await getC2CReturnReportsByPartnerApi(partnerId!);
      if (!response.success || !response.data)
        throw new Error("Failed to fetch return reports by partner");
      return response.data.items;
    },
    enabled: !!partnerId,
  });

  const inProgressHandovers = useMemo<Handover[]>(
    () =>
      (query.data ?? []).filter((h) => IN_PROGRESS_STATUSES.includes(h.status)),
    [query.data],
  );

  return {
    inProgressHandovers,
    isLoading: query.isLoading,
    error: query.error instanceof Error ? query.error : null,
  };
};
