import { PostSubcategory } from "@/src/features/post/types";
import { Nullable } from "@/src/shared/types";
import { create } from "zustand";
import { getPostSubcategoriesApi } from "../api";

type PostSubcategoryState = {
  subcategories: PostSubcategory[];
  isLoaded: boolean;
};

type PostSubcategoryActions = {
  findSubcategoryById: (id: string) => Nullable<PostSubcategory>;
  setSubcategories: (subcategories: PostSubcategory[]) => void;
  loadAllSubcategories: () => Promise<void>;
}

type PostSubcategoryStore = PostSubcategoryState & PostSubcategoryActions;

export const usePostSubcategoryStore = create<PostSubcategoryStore>((set, get) => ({
  subcategories: [],
  isLoaded: false,

  findSubcategoryById: (id) => {
    return get().subcategories.find((category) => category.id === id) ?? null;
  },

  setSubcategories: (subcategories) => set({
    subcategories,
    isLoaded: true
  }),

  loadAllSubcategories: async () => {
    try {
      const response = await getPostSubcategoriesApi();
      if (!response.data) return
      set({ subcategories: response.data });
    } catch (error) {
      console.log("Failed to load subcategories:", error);
    }
    finally {
      set({ isLoaded: true });
    }
  },
}));