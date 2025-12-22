import { useMutation } from "@tanstack/react-query";
import { useMemo } from "react";
import { useAuth } from "../../../providers/AuthProvider";
import { syncUser } from "../services/auth.service";
import type { AuthState, SyncRequest } from "../types/auth.type";

export function useGetMe() {
  const auth = useAuth();

  const mutation = useMutation({
    mutationKey: ["auth", "getMe"],
    mutationFn: async () => {
      const syncReq = {
        idToken: auth.idToken,
      } as SyncRequest;

      const response = await syncUser(syncReq);
      return response.data;
    },

    onSuccess: async () => {
      const authState = {
        isLoggedIn: true,
        idToken: auth.idToken,
      } as AuthState;
      await auth.setSession(authState);
    },
  });

  const error = useMemo(() => {
    if (!mutation.error) return null;
    if (mutation.error instanceof Error) return mutation.error;
    return new Error("Get profile failed");
  }, [mutation.error]);

  return {
    fetchProfile: mutation.mutateAsync,
    loading: mutation.isPending,
    error,
    data: mutation.data,
    reset: mutation.reset,
  };
}
