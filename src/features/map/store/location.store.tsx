import type { UserLocation } from "@/src/features/map/types";
import type { Nullable } from "@/src/shared/types";
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type UserLocationContextValue = {
  reset: () => void;
  selection: Nullable<UserLocation>;
  onChangeSelection: (data: UserLocation) => void;
  confirmedSelection: Nullable<UserLocation>;
  onConfirmSelection: (data: UserLocation) => void;
};

const LocationSelectionContext = createContext<UserLocationContextValue | null>(
  null,
);

export const LocationSelectionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selection, setSelection] = useState<Nullable<UserLocation>>(null);
  const [confirmedSelection, setConfirmedSelection] =
    useState<Nullable<UserLocation>>(null);

  const reset = useCallback(() => {
    setSelection(null);
    setConfirmedSelection(null);
  }, []);

  const onChangeSelection = useCallback((data: UserLocation) => {
    setSelection(data);
  }, []);

  const onConfirmSelection = useCallback((data: UserLocation) => {
    setConfirmedSelection(data);
  }, []);

  const contextValue = useMemo(
    () => ({
      selection,
      onChangeSelection,
      confirmedSelection,
      onConfirmSelection,
      reset,
    }),
    [
      selection,
      onChangeSelection,
      confirmedSelection,
      onConfirmSelection,
      reset,
    ],
  );

  return (
    <LocationSelectionContext.Provider value={contextValue}>
      {children}
    </LocationSelectionContext.Provider>
  );
};

export const useLocationSelectionStore = () => {
  const context = useContext(LocationSelectionContext);
  if (!context)
    throw new Error(
      "useLocationSelectionStore must be used within LocationSelectionProvider",
    );
  return context;
};
