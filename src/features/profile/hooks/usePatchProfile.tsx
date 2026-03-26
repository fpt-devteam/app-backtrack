import { updateMyProfile } from "@/src/features/profile/api";
import { PROFILE_QUERY_KEY } from "@/src/features/profile/constants";
import type { UpdateProfileRequest } from "@/src/features/profile/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const usePatchProfile = () => {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: (request: UpdateProfileRequest) => updateMyProfile(request),

    onSuccess: (response) => {
      qc.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });

      if (response?.data) {
        qc.setQueryData(PROFILE_QUERY_KEY, response.data);
      }
    },

    onError: (err) => {
      console.error("Mutation Error:", err);
    },
  });

  return {
    patchProfile: mutation.mutateAsync,
    isPatchingProfile: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  };
};
