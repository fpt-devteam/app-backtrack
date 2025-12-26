import { AUTH_STORAGE_KEY } from "@/src/features/auth/constants/auth.constant";
import { AuthState } from "@/src/features/auth/types/auth.type";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

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
    idToken: "",
  });

  useEffect(() => {
    const restoreSession = async () => {
      await new Promise((res) => setTimeout(() => res(null), 1000));
      try {
        const data = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        if (data !== null) {
          const state: AuthState = {
            ...authState,
            idToken: JSON.parse(data).idToken,
            isLoggedIn: true,
          };
          setAuthState(state);
        }
      } catch (error) {
        console.log("Error fetching from storage", error);
      }
      setIsAppReady(true);
    };
    restoreSession();
  }, []);

  async function setSession(state: AuthState) {
    setAuthState(state);
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
  }

  async function clearSession() {
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    const state: AuthState = { isLoggedIn: false, idToken: "" };
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
