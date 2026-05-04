import { getC2CReturnReportsByPartnerApi } from "@/src/features/handover/api";
import { C2C_RETURN_REPORTS_QUERY_KEY } from "@/src/features/handover/constants";
import type { Handover, HandoverStatus } from "@/src/features/handover/types";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

const IN_PROGRESS_STATUSES: HandoverStatus[] = ["Ongoing", "Delivered"];

export const useGetC2CReturnReportsByPartner = (
  partnerId: string | null | undefined,
) => {
  const query = useQuery({
    queryKey: [...C2C_RETURN_REPORTS_QUERY_KEY, "byPartner", partnerId ?? null],
    queryFn: async (): Promise<Handover[]> => {
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
