import { auth } from "@/src/shared/lib";
import { useMutation } from "@tanstack/react-query";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useMemo } from "react";
import type { LoginRequest, LoginResponse } from "../types";
import { useSync } from "./useSync";

function mapLoginError(error: unknown): Error {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/invalid-email": return new Error("Invalid email address.");
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential": return new Error("Email or password is incorrect.");
      case "auth/too-many-requests": return new Error("Too many attempts. Please try again later.");
      case "auth/network-request-failed": return new Error("Network error. Please check your connection.");
      default: return new Error(error.message || "Login failed.");
    }
  }
  return error instanceof Error ? error : new Error("Login failed.");
}

export function useLogin() {
  const { syncUser } = useSync();

  const mutation = useMutation<LoginResponse, Error, LoginRequest>({
    mutationKey: ["auth", "login"],
    mutationFn: async (req) => {
      const email = req.email.trim();
      const password = req.password;

      const cred = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await cred.user.getIdToken();

      if (!idToken) throw new Error("Failed to get ID token.");
      return { idToken } as LoginResponse;
    },

    onSuccess: async (data) => {
      await syncUser({ idToken: data.idToken });
    },

    onError: (err) => {
      console.error("Login failed:", mapLoginError(err).message);
    },
  });

  const error = useMemo(() => {
    if (!mutation.error) return null;
    return mapLoginError(mutation.error);
  }, [mutation.error]);

  return {
    login: mutation.mutateAsync,
    loading: mutation.isPending,
    error,
    data: mutation.data,
    reset: mutation.reset,
  };
}
