import { auth } from "@/src/shared/lib";
import { getErrorMessage } from "@/src/shared/utils";
import { useMutation } from "@tanstack/react-query";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useMemo } from "react";

import { REGISTER_QUERY_KEY } from "@/src/features/auth/constants";
import type {
  RegisterRequest,
  RegisterResponse,
} from "@/src/features/auth/types";

export function useRegister() {
  const mutation = useMutation<RegisterResponse, Error, RegisterRequest>({
    mutationKey: REGISTER_QUERY_KEY,
    mutationFn: async (req) => {
      try {
        const email = req.email.trim();
        const password = req.password;

        const cred = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );

        const idToken = await cred.user.getIdToken();
        if (!idToken) throw new Error("Failed to get ID token.");

        return { idToken } as RegisterResponse;
      } catch (error) {
        const friendlyMessage = getErrorMessage(error);
        throw new Error(friendlyMessage);
      }
    },

    onError: (err) => {
      console.log("Registration failed:", err.message);
    },
  });

  const errorMessage = useMemo(() => {
    if (!mutation.error) return null;
    return mutation.error.message;
  }, [mutation.error]);

  return {
    register: mutation.mutateAsync,
    loading: mutation.isPending,
    error: errorMessage,
    data: mutation.data,
    reset: mutation.reset,
  };
}
