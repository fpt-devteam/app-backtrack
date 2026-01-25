import { useSync } from "@/src/features/auth/hooks";
import { useAuth } from "@/src/features/auth/providers/auth.provider";
import type { AppUser } from "@/src/features/auth/types";

import { useRegisterDeviceMutation } from "@/src/features/notification/hooks";
import { auth } from "@/src/shared/lib";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type AppUserContextType = {
  user: AppUser | null;
  isSyncing: boolean;
  error: Error | null;
  clearUser: () => void;
};

const AppUserContext = React.createContext<AppUserContextType | undefined>(
  undefined,
);

export const AppUserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAppReady, isLoggedIn } = useAuth();

  const { syncUser, loading, error } = useSync();
  const { mutateAsync: syncExpoToken } = useRegisterDeviceMutation();

  const [user, setUser] = useState<AppUser | null>(null);

  const mountedRef = useRef(true);
  const lastUidRef = useRef<string | null>(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const clearUser = useCallback(() => {
    setUser(null);
    lastUidRef.current = null;
  }, []);

  const doSync = useCallback(async () => {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) throw new Error("No firebase user");
    if (!mountedRef.current) return;

    const uid = firebaseUser.uid;
    const idToken = await firebaseUser.getIdToken();

    await syncExpoToken();
    const backendUser = (await syncUser({ idToken })).data;
    setUser(backendUser);
    lastUidRef.current = uid;
  }, [syncUser, syncExpoToken]);

  useEffect(() => {
    const run = async () => {
      if (!isAppReady) return;

      if (!isLoggedIn) {
        if (!mountedRef.current) return;
        clearUser();
        return;
      }

      try {
        const firebaseUser = auth.currentUser;
        if (!firebaseUser) {
          if (mountedRef.current) clearUser();
          return;
        }
        if (lastUidRef.current === firebaseUser.uid && user) return;
        await doSync();
      } catch (e) {
        console.log("User sync failed:", e);
        if (mountedRef.current) setUser(null);
      }
    };

    run();
  }, [isAppReady, isLoggedIn, syncExpoToken, clearUser, doSync, user]);

  const value = useMemo<AppUserContextType>(
    () => ({
      user,
      isSyncing: loading,
      error: error ?? null,
      clearUser,
    }),
    [user, loading, error, clearUser],
  );

  return (
    <AppUserContext.Provider value={value}>{children}</AppUserContext.Provider>
  );
};

export const useAppUser = () => {
  const ctx = useContext(AppUserContext);
  if (!ctx) throw new Error("useAppUser must be used within UserProvider");
  return ctx;
};
