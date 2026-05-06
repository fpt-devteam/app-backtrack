import { auth } from "@/src/shared/lib";
import { getErrorMessage } from "@/src/shared/utils";
import { useMutation } from "@tanstack/react-query";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useMemo } from "react";

import { REGISTER_QUERY_KEY } from "@/src/features/auth/constants";
import type {
  RegisterRequest,
  RegisterResponse,
} from "@/src/features/auth/types";
import { toast } from "@/src/shared/components/ui/toast";

export function useRegister() {
  const mutation = useMutation<RegisterResponse, Error, RegisterRequest>({
    mutationKey: REGISTER_QUERY_KEY,
    mutationFn: async (req) => {
      try {
        const { email, password, displayName } = req;
        const trimmedEmail = email.trim();

        const cred = await createUserWithEmailAndPassword(
          auth,
          trimmedEmail,
          password,
        );

        if (displayName) {
          await updateProfile(cred.user, {
            displayName: displayName.trim(),
          });
        }

        const idToken = await cred.user.getIdToken();
        if (!idToken)
          throw new Error("Failed to generate authentication token.");

        return { idToken } as RegisterResponse;
      } catch (error) {
        const friendlyMessage = getErrorMessage(error);
        throw new Error(friendlyMessage);
      }
    },

    onError: (err) => {
      const friendlyMessage = getErrorMessage(err);
      toast.error("Registration technical error:", friendlyMessage);
    },
  });

  const errorMessage = useMemo(() => {
    return mutation.error?.message ?? null;
  }, [mutation.error]);

  return {
    register: mutation.mutateAsync,
    loading: mutation.isPending,
    error: errorMessage,
    data: mutation.data,
    reset: mutation.reset,
    isSuccess: mutation.isSuccess,
  };
}
