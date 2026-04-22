import { getC2CHandoverPostApi } from "@/src/features/handover/api";
import { C2C_RETURN_REPORTS_QUERY_KEY } from "@/src/features/handover/constants";
import type {
  GetC2CHandoverPostRequest,
  Handover,
} from "@/src/features/handover/types";
import { useMutation } from "@tanstack/react-query";
import { useMemo } from "react";

export const useGetc2cHandoverPost = (params?: GetC2CHandoverPostRequest) => {
  const mutation = useMutation({
    mutationKey: [...C2C_RETURN_REPORTS_QUERY_KEY, "post-pair"],
    mutationFn: async (
      request?: GetC2CHandoverPostRequest,
    ): Promise<Handover> => {
      const finderPostId = request?.finderPostId ?? params?.finderPostId;
      const ownerPostId = request?.ownerPostId ?? params?.ownerPostId;

      if (!finderPostId || !ownerPostId) {
        throw new Error("Missing finderPostId or ownerPostId");
      }

      const response = await getC2CHandoverPostApi({
        finderPostId,
        ownerPostId,
      });

      if (!response.success || !response.data)
        throw new Error("Failed to fetch return report by posts");

      return response.data;
    },
  });

  const error = useMemo(() => {
    if (!mutation.error) return null;
    if (mutation.error instanceof Error) return mutation.error;
    return new Error("Failed to fetch return report by posts");
  }, [mutation.error]);

  return {
    data: mutation.data ?? null,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error,
    getC2CHandoverPost: mutation.mutateAsync,
    reset: mutation.reset,
  };
};
