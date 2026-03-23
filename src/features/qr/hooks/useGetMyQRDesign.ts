import { getMyQrDesign } from "@/src/features/qr/api";
import { IS_QR_FEATURE_MOCK, QR_CODES_ME_DESIGN_QUERY_KEY } from "@/src/features/qr/constants";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useGetMyQRDesign = () => {
  const query = useQuery({
    queryKey: [...QR_CODES_ME_DESIGN_QUERY_KEY],

    enabled: IS_QR_FEATURE_MOCK,

    queryFn: async () => {
      const response = await getMyQrDesign();
      if (!response.success) throw new Error("Failed to fetch QR design");
      return response.data;
    },
  });

  const error = useMemo(() => {
    if (!query.error) return null;
    if (query.error instanceof Error) return query.error;
    return new Error("Fetch QR design failed");
  }, [query.error]);

  return {
    data: query.data,
    isLoading: query.isLoading,
    error,
    refetch: query.refetch,
  };
};
