import { auth } from "@/src/shared/lib";
import { mapErrorToMessage } from "@/src/shared/utils";
import { useMutation } from "@tanstack/react-query";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useMemo } from "react";

import { LOGIN_QUERY_KEY } from "@/src/features/auth/constants";
import type { LoginRequest } from "@/src/features/auth/types";

export function useLogin() {
  const mutation = useMutation({
    mutationKey: LOGIN_QUERY_KEY,
    mutationFn: async (req: LoginRequest) => {
      const { email, password } = req;
      await signInWithEmailAndPassword(auth, email, password);
    },
  });

  const errorMessage = useMemo(() => {
    if (!mutation.error) return null;
    const friendlyMessage = mapErrorToMessage(mutation.error);
    return friendlyMessage;
  }, [mutation.error]);

  return {
    login: mutation.mutateAsync,
    loading: mutation.isPending,
    error: errorMessage,
    data: mutation.data,
    reset: mutation.reset,
    success: mutation.isSuccess,
  };
}
