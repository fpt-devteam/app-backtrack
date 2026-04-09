import {
  EventTime,
  eventTimeSchema,
  LocationSearch,
  locationSearchSchema,
  RadiusSearch,
  radiusSearchSchema,
  TextSearch,
  textSearchSchema,
} from "@/src/features/post/schemas";
import { type ItemCategory, type PostType } from "@/src/features/post/types";
import { Optional } from "@/src/shared/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type PostSearchStoreState = {
  keyword: {
    value: TextSearch;
    history: TextSearch[];
  };

  location: {
    address: TextSearch;
    coords: LocationSearch;
    radius: RadiusSearch;
    history: TextSearch[];
  };

  temporal: {
    date: EventTime;
  };

  advanced: {
    postType: Optional<PostType>;
    categories: ItemCategory[];
  };
};

type PersistedPostSearchState = {
  keyword?: {
    history?: Optional<TextSearch[]>;
  };
  location?: {
    history?: Optional<TextSearch[]>;
  };

  // Legacy persisted keys for migration compatibility.
  itemSearch?: {
    recentQueries?: Optional<TextSearch[]>;
  };
  locationSearch?: {
    recentQueries?: Optional<TextSearch[]>;
  };
};

type PostSearchActions = {
  // Keyword Actions
  updateKeyword: (value: TextSearch) => void;
  resetKeyword: () => void;
  addToKeywordHistory: (value: TextSearch) => void;

  // Location Actions
  updateLocationAddress: (address: TextSearch) => void;
  updateLocationCoords: (coords: LocationSearch) => void;
  updateRadius: (radius: RadiusSearch) => void;
  addToLocationHistory: (address: TextSearch) => void;

  // Temporal Actions
  updateEventDate: (date: EventTime) => void;

  // Advanced Actions
  updatePostType: (postType: Optional<PostType>) => void;
  updateCategories: (categories: ItemCategory[]) => void;

  // Global Actions
  resetFilters: () => void;
};

const sanitizeHistory = (
  value: Optional<TextSearch[]>,
): Optional<TextSearch[]> => {
  if (!Array.isArray(value)) return undefined;

  return value.filter((item): item is string => typeof item === "string");
};

export const usePostSearchStore = create<
  PostSearchStoreState & PostSearchActions
>()(
  persist(
    immer((set) => ({
      keyword: {
        value: textSearchSchema.getDefault(),
        history: [],
      },

      location: {
        address: textSearchSchema.getDefault(),
        coords: locationSearchSchema.getDefault(),
        radius: radiusSearchSchema.getDefault(),
        history: [],
      },

      temporal: {
        date: eventTimeSchema.getDefault(),
      },

      advanced: {
        postType: undefined,
        categories: [],
      },

      updateKeyword: (value) => {
        set((state) => {
          state.keyword.value = value;
        });
      },

      resetKeyword: () =>
        set((state) => {
          state.keyword.value = textSearchSchema.getDefault();
        }),

      addToKeywordHistory: (value) =>
        set((state) => {
          if (!value?.trim()) return;

          const filtered = state.keyword.history.filter(
            (item: TextSearch) => item !== value,
          );

          state.keyword.history = [value, ...filtered].slice(0, 10);
        }),

      updateLocationAddress: (address) =>
        set((state) => {
          state.location.address = address;
        }),

      updateLocationCoords: (coords) =>
        set((state) => {
          state.location.coords = coords;
        }),

      updateRadius: (radius) => {
        set((state) => {
          state.location.radius = radius;
        });
      },

      addToLocationHistory: (address) =>
        set((state) => {
          if (!address?.trim()) return;

          const filtered = state.location.history.filter(
            (item: TextSearch) => item !== address,
          );

          state.location.history = [address, ...filtered].slice(0, 10);
        }),

      updateEventDate: (date) => {
        set((state) => {
          state.temporal.date = date;
        });
      },

      updatePostType: (postType) => {
        set((state) => {
          state.advanced.postType = postType;
        });
      },

      updateCategories: (categories) => {
        set((state) => {
          state.advanced.categories = categories;
        });
      },

      resetFilters: () =>
        set((state) => {
          state.keyword.value = textSearchSchema.getDefault();
          state.location.address = textSearchSchema.getDefault();
          state.location.coords = locationSearchSchema.getDefault();
          state.location.radius = radiusSearchSchema.getDefault();
          state.temporal.date = eventTimeSchema.getDefault();
          state.advanced.postType = undefined;
          state.advanced.categories = [];
        }),
    })),
    {
      name: "post-search-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        keyword: { history: state.keyword.history },
        location: { history: state.location.history },
      }),
      merge: (persistedState, currentState) => {
        const persisted = (persistedState ?? {}) as PersistedPostSearchState;

        const keywordHistory = sanitizeHistory(
          persisted.keyword?.history ?? persisted.itemSearch?.recentQueries,
        );

        const locationHistory = sanitizeHistory(
          persisted.location?.history ??
            persisted.locationSearch?.recentQueries,
        );

        return {
          ...currentState,
          keyword: {
            ...currentState.keyword,
            history: keywordHistory ?? currentState.keyword.history,
          },
          location: {
            ...currentState.location,
            history: locationHistory ?? currentState.location.history,
          },
        };
      },
    },
  ),
);
