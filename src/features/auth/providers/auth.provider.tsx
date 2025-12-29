import { auth } from '@/src/shared/lib'
import { onAuthStateChanged } from 'firebase/auth'
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { AuthState } from '../types'

type AuthContextType = AuthState
const AuthContext = createContext<AuthContextType | undefined>(undefined)

const emptyAuthState: AuthState = {
  isAppReady: false,
  isLoggedIn: false,
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(emptyAuthState)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true;
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (!firebaseUser) {
          if (mountedRef.current) setAuthState({ isAppReady: true, isLoggedIn: false });
          return;
        }

        if (mountedRef.current) setAuthState({ isAppReady: true, isLoggedIn: true });
      } catch (e) {
        console.log('Auth sync failed:', e);
        if (mountedRef.current) setAuthState({ isAppReady: true, isLoggedIn: false });
      }
    })

    return () => {
      mountedRef.current = false;
      unsub();
    }
  }, []);

  const contextValue = useMemo(() => ({ ...authState }), [authState])
  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
