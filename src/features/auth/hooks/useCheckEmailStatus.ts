import { useMutation } from "@tanstack/react-query";
import { useMemo } from "react";

import { checkEmailStatusApi } from "@/src/features/auth/api";
import { CHECK_EMAIL_STATUS_QUERY_KEY } from "@/src/features/auth/constants";
import { EmailStatusCheckRequest } from "@/src/features/auth/types";

export function useCheckEmailStatus() {
  const mutation = useMutation({
    mutationKey: CHECK_EMAIL_STATUS_QUERY_KEY,
    mutationFn: async (req: EmailStatusCheckRequest) => {
      const { email } = req;
      const res = await checkEmailStatusApi(email);

      if (!res?.data) throw new Error("Failed to check email status.");
      return res.data;
    },
  });

  const errorMessage = useMemo(() => {
    if (!mutation.error) return null;
    return mutation.error.message;
  }, [mutation.error]);

  return {
    checkEmailStatus: mutation.mutateAsync,
    loading: mutation.isPending,
    error: errorMessage,
    reset: mutation.reset,
  };
}
