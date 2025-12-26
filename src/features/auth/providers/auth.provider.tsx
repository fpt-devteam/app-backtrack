import { AUTH_STORAGE_KEY } from "@/src/features/auth/constants/auth.constant";
import { auth } from "@/src/shared/lib";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AuthState } from "../types";

type AuthContextType = AuthState & {
  isAppReady: boolean;
  setSession: (authState: AuthState) => Promise<void>;
  clearSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAppReady, setIsAppReady] = useState(false);
  const [authState, setAuthState] = useState<AuthState>({
    isLoggedIn: false,
  });

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const user = auth.currentUser;

        if (!user) {
          setIsAppReady(true);
          await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
          setAuthState({ isLoggedIn: false });
          return;
        }

        await user.getIdToken(true);
        setAuthState({ isLoggedIn: true });
      } catch (error) {
        setIsAppReady(true);
        setAuthState({ isLoggedIn: false });
        await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
        console.log("Error fetching from storage", error);
      }
    };
    restoreSession();
  }, []);

  async function setSession(state: AuthState) {
    setAuthState(state);
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
  }

  async function clearSession() {
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    const state: AuthState = { isLoggedIn: false};
    setAuthState(state);
  }

  const contextValue = useMemo(
    () => ({
      ...authState,
      isAppReady,
      setSession,
      clearSession,
    }),
    [authState, isAppReady]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
