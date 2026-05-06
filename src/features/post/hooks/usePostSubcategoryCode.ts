import { usePostSubcategoryStore } from "@/src/features/post/store";
import type { PostSubcategoryCode } from "@/src/features/post/types";
import { useCallback } from "react";

export const usePostSubcategoryCode = (
  subcategoryId?: string | null,
): PostSubcategoryCode | undefined => {
  return usePostSubcategoryStore(
    useCallback(
      (state) => {
        if (!subcategoryId) return undefined;
        return state.findSubcategoryById(subcategoryId)?.code;
      },
      [subcategoryId],
    ),
  );
};
