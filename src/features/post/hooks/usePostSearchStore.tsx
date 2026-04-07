import type { UserLocation } from "@/src/features/map/types";
import { Nullable } from "@/src/shared/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type PostSearchStoreState = {
  itemSearch: {
    query: string;
    recentQuery: string[];
  };
  locationSearch: {
    query: string;
    options: Nullable<UserLocation>;
    recentQuery: string[];
  };
  eventSearch: {
    options: Date;
  };
};

type PersistedPostSearchState = {
  itemSearch?: {
    recentQuery?: string[];
  };
  locationSearch?: {
    recentQuery?: string[];
  };
};

type PostSearchActions = {
  // Item Actions
  setItemQuery: (query: string) => void;
  addItemRecent: (query: string) => void;

  // Location Actions
  setLocationQuery: (query: string) => void;
  setLocationOptions: (options: Nullable<UserLocation>) => void;
  addLocationRecent: (query: string) => void;

  // Event Actions
  setEventDate: (date: Date) => void;

  // Global Actions
  resetAll: () => void;
};

export const usePostSearchStore = create<
  PostSearchStoreState & PostSearchActions
>()(
  persist(
    immer((set) => ({
      // --- Initial State ---
      itemSearch: {
        query: "",
        recentQuery: [],
      },

      locationSearch: {
        query: "",
        options: null,
        recentQuery: [],
      },

      // Event
      eventSearch: {
        options: new Date(),
      },

      setEventDate: (date) => {
        set((state) => {
          state.eventSearch.options = date;
        });
      },
      //

      setItemQuery: (query) =>
        set((state) => {
          state.itemSearch.query = query;
        }),

      addItemRecent: (query) =>
        set((state) => {
          const filtered = state.itemSearch.recentQuery.filter(
            (q: string) => q !== query,
          );
          state.itemSearch.recentQuery = [query, ...filtered].slice(0, 10);
        }),

      setLocationQuery: (query) =>
        set((state) => {
          state.locationSearch.query = query;
        }),

      setLocationOptions: (options) =>
        set((state) => {
          state.locationSearch.options = options;
        }),

      addLocationRecent: (query) =>
        set((state) => {
          const filtered = state.locationSearch.recentQuery.filter(
            (q: string) => q !== query,
          );
          state.locationSearch.recentQuery = [query, ...filtered].slice(0, 10);
        }),

      resetAll: () =>
        set((state) => {
          state.itemSearch.query = "";
          state.locationSearch.query = "";
          state.locationSearch.options = null;
          state.eventSearch.options = new Date();
        }),
    })),
    {
      name: "post-search-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        itemSearch: { recentQuery: state.itemSearch.recentQuery },
        locationSearch: { recentQuery: state.locationSearch.recentQuery },
      }),
      merge: (persistedState, currentState) => {
        const persisted = (persistedState ?? {}) as PersistedPostSearchState;

        const itemRecentQuery = Array.isArray(persisted.itemSearch?.recentQuery)
          ? persisted.itemSearch.recentQuery.filter(
              (query): query is string => typeof query === "string",
            )
          : currentState.itemSearch.recentQuery;

        const locationRecentQuery = Array.isArray(
          persisted.locationSearch?.recentQuery,
        )
          ? persisted.locationSearch.recentQuery.filter(
              (query): query is string => typeof query === "string",
            )
          : currentState.locationSearch.recentQuery;

        return {
          ...currentState,
          itemSearch: {
            ...currentState.itemSearch,
            recentQuery: itemRecentQuery,
          },
          locationSearch: {
            ...currentState.locationSearch,
            recentQuery: locationRecentQuery,
          },
        };
      },
    },
  ),
);
