import { getErrorMessage } from "@/src/shared/utils";
import { useMutation } from "@tanstack/react-query";
import { useMemo } from "react";

import { auth } from "@/src/shared/lib";
import { sendPasswordResetEmail } from "firebase/auth";
import { FORGOT_PASSWORD_QUERY_KEY } from "../constants";
import type { ForgotPasswordRequest, ForgotPasswordResponse } from "../types";

export function useForgotPassword() {
  const mutation = useMutation<ForgotPasswordResponse, Error, ForgotPasswordRequest>({
    mutationKey: FORGOT_PASSWORD_QUERY_KEY,
    mutationFn: async (req) => {
      try {
        await sendPasswordResetEmail(auth, req.email);
        return { ok: true } as ForgotPasswordResponse;
      } catch (error: any) {
        const friendlyMessage = getErrorMessage(error);
        throw new Error(friendlyMessage);
      }
    },

    onError: (err) => {
      console.log("Forgot password failed:", err.message);
    },
  });

  const errorMessage = useMemo(() => {
    if (!mutation.error) return null;
    return mutation.error.message;
  }, [mutation.error]);

  return {
    forgotPassword: mutation.mutateAsync,
    loading: mutation.isPending,
    error: errorMessage,
    data: mutation.data,
    reset: mutation.reset,
  };
}
