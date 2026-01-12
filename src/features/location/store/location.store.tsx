import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { LatLng } from "react-native-maps";
import { useUserLocation } from "../hooks";

export type LocationSelection = {
  location: LatLng;
  radiusKm?: number;
};

type LocationSelectionContextValue = {
  initSelection: () => void;
  selection: LocationSelection | null;
  setSelection: (next: LocationSelection) => void;
  clearSelection: () => void;
  takeSelection: () => LocationSelection | null;
};

const LocationSelectionContext = createContext<LocationSelectionContextValue | null>(null);

export const LocationSelectionProvider = ({ children }: { children: React.ReactNode }) => {
  const [selection, setSelectionState] = useState<LocationSelection | null>(null);
  const { getUserLocation } = useUserLocation();

  const initSelection = useCallback(async () => {
    const location = await getUserLocation();
    if (!location) return;

    setSelectionState({ location });
  }, [getUserLocation]);

  const setSelection = useCallback((next: LocationSelection) => {
    setSelectionState({
      location: { latitude: next.location.latitude, longitude: next.location.longitude },
      ...(next.radiusKm ? { radiusKm: next.radiusKm } : {})
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectionState(null);
  }, []);

  const takeSelection = useCallback(() => {
    let value: LocationSelection | null = null;
    setSelectionState((prev) => {
      value = prev;
      return null; // clear
    });
    return value;
  }, []);

  const ctxValue = useMemo(
    () => ({ selection, setSelection, clearSelection, takeSelection, initSelection }),
    [selection, setSelection, clearSelection, takeSelection, initSelection]
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
