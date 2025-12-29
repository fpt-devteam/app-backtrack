import { useMutation } from "@tanstack/react-query";
import { useMemo } from "react";
import { syncUserApi } from "../api/auth.api";
import { SYNC_QUERY_KEY } from "../constants";
import { SyncRequest, SyncResponse } from "../types";

export function useSync() {

  const mutation = useMutation<SyncResponse, Error, SyncRequest>({
    mutationKey: SYNC_QUERY_KEY,

    mutationFn: async (req: SyncRequest) => {
      if (!req?.idToken) throw new Error("No token");

      const response = await syncUserApi(req);
      if (!response) throw new Error("Sync user failed");
      if (!response.success || !response.data) throw new Error(response.error?.message ?? "Sync user failed");
      return response;
    },

    onError: async (err) => {
      console.error("Sync user failed:", err.message);
    },
  });

  const error = useMemo(() => {
    if (!mutation.error) return null;
    return mutation.error instanceof Error ? mutation.error : new Error("Get profile failed");
  }, [mutation.error]);

  return {
    syncUser: mutation.mutateAsync,
    loading: mutation.isPending,
    error,
    reset: mutation.reset,
  };
}
