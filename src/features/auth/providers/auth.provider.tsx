import { useCheckEmailStatus } from "@/src/features/auth/hooks";
import { EMAIL_STATUS } from "@/src/features/auth/types";
import { auth } from "@/src/shared/lib";
import { onAuthStateChanged } from "firebase/auth";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AppState } from "react-native";

type AuthState = {
  isAppReady: boolean;
  isLoggedIn: boolean;
};

type AuthContextType = AuthState & {
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { checkEmailStatus } = useCheckEmailStatus();
  const [authState, setAuthState] = useState<AuthState>({
    isAppReady: false,
    isLoggedIn: false,
  });

  const mountedRef = useRef(true);

  const syncAuthState = useCallback(async () => {
    const firebaseUser = auth.currentUser;

    try {
      if (!firebaseUser?.email) {
        if (mountedRef.current) {
          setAuthState({ isAppReady: true, isLoggedIn: false });
        }
        return;
      }

      await firebaseUser.reload();

      const emailStatusResult = await checkEmailStatus({
        email: firebaseUser.email,
      });

      const { status } = emailStatusResult;
      const isVerified = status === EMAIL_STATUS.VERIFIED;

      if (mountedRef.current) {
        setAuthState({
          isAppReady: true,
          isLoggedIn: isVerified,
        });
      }
    } catch (e) {
      console.error("Auth sync failed:", e);
      if (mountedRef.current) {
        setAuthState({ isAppReady: true, isLoggedIn: false });
      }
    }
  }, [checkEmailStatus]);

  useEffect(() => {
    mountedRef.current = true;

    const unsub = onAuthStateChanged(auth, () => {
      void syncAuthState();
    });

    const appStateSubscription = AppState.addEventListener(
      "change",
      (nextState) => {
        if (nextState === "active") {
          void syncAuthState();
        }
      },
    );

    return () => {
      mountedRef.current = false;
      unsub();
      appStateSubscription.remove();
    };
  }, [syncAuthState]);

  const contextValue = useMemo(
    () => ({
      ...authState,
      refresh: syncAuthState,
    }),
    [authState, syncAuthState],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
