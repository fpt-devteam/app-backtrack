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
  refetch: () => Promise<void>;
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
    if (!firebaseUser) {
      clearUser();
      return;
    }

    try {
      const idToken = await firebaseUser.getIdToken();

      await syncExpoToken();

      const response = await syncUser({ idToken });

      if (mountedRef.current) {
        setUser(response.data);
        lastUidRef.current = firebaseUser.uid;
      }
    } catch (e) {
      console.error("[AppUserProvider] Sync failed:", e);
      if (mountedRef.current) {
      }
      throw e;
    }
  }, [syncUser, syncExpoToken, clearUser]);

  useEffect(() => {
    const handleAutoSync = async () => {
      if (!isAppReady) return;

      if (!isLoggedIn) {
        clearUser();
        return;
      }

      const firebaseUser = auth.currentUser;
      if (!firebaseUser) {
        clearUser();
        return;
      }

      if (lastUidRef.current !== firebaseUser.uid || !user) {
        try {
          await doSync();
        } catch (e) {
          console.log("Automatic sync failed silently", e);
        }
      }
    };

    handleAutoSync();
  }, [isAppReady, isLoggedIn, doSync, user, clearUser]);

  const value = useMemo<AppUserContextType>(
    () => ({
      user,
      isSyncing: loading,
      error: (error as Error) ?? null,
      clearUser,
      refetch: doSync,
    }),
    [user, loading, error, clearUser, doSync],
  );

  return (
    <AppUserContext.Provider value={value}>{children}</AppUserContext.Provider>
  );
};

export const useAppUser = () => {
  const ctx = useContext(AppUserContext);
  if (!ctx) {
    throw new Error("useAppUser must be used within AppUserProvider");
  }
  return ctx;
};
