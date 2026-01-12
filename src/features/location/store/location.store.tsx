import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { LatLng } from "react-native-maps";
import type { PlaceDetails } from "../services/googlePlaces.service";

export type LocationSelection = {
  location: LatLng;
  place?: PlaceDetails;
  radiusKm?: number | null;
};

type LocationSelectionContextValue = {
  selection: LocationSelection | null;
  setSelection: (next: LocationSelection) => void;
  clearSelection: () => void;
  takeSelection: () => LocationSelection | null;
};

const LocationSelectionContext = createContext<LocationSelectionContextValue | null>(null);

export const LocationSelectionProvider = ({ children }: { children: React.ReactNode }) => {
  const [selection, setSelectionState] = useState<LocationSelection | null>(null);

  const setSelection = useCallback((next: LocationSelection) => {
    setSelectionState({
      location: {
        latitude: next.location.latitude,
        longitude: next.location.longitude
      },
      radiusKm: next.radiusKm ?? null,
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectionState(null);
  }, []);

  const takeSelection = useCallback(() => {
    let value: LocationSelection | null = null;
    setSelectionState((prev) => {
      value = prev;
      return null;
    });
    return value;
  }, []);

  const ctxValue = useMemo(
    () => ({ selection, setSelection, clearSelection, takeSelection }),
    [selection, setSelection, clearSelection, takeSelection]
  );

  return (
    <LocationSelectionContext.Provider value={ctxValue}>
      {children}
    </LocationSelectionContext.Provider>
  );
};

export const useLocationSelectionStore = () => {
  const ctx = useContext(LocationSelectionContext);
  if (!ctx) throw new Error("useLocationSelectionStore must be used within LocationSelectionProvider");
  return ctx;
};
