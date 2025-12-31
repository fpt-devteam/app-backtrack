import { auth } from "@/src/shared/lib";
import { getErrorMessage } from "@/src/shared/utils";
import { useMutation } from "@tanstack/react-query";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useMemo } from "react";

import { LOGIN_QUERY_KEY } from "../constants";
import type { LoginRequest, LoginResponse } from "../types";

export function useLogin() {
  const mutation = useMutation<LoginResponse, Error, LoginRequest>({
    mutationKey: LOGIN_QUERY_KEY,
    mutationFn: async (req) => {
      try {
        const email = req.email.trim();
        const password = req.password;

        const cred = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await cred.user.getIdToken();

        if (!idToken) {
          throw new Error("Failed to get ID token.");
        }

        return { idToken } as LoginResponse;
      } catch (error: any) {
        const friendlyMessage = getErrorMessage(error);
        throw new Error(friendlyMessage);
      }
    },

    onError: (err) => {
      console.log("Login failed:", err.message);
    },
  });


  const errorMessage = useMemo(() => {
    if (!mutation.error) return null;
    return mutation.error.message;
  }, [mutation.error]);

  return {
    login: mutation.mutateAsync,
    loading: mutation.isPending,
    error: errorMessage,
    data: mutation.data,
    reset: mutation.reset,
  };
}
