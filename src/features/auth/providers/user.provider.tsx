import { auth } from '@/src/shared/lib';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useSync } from '../hooks';
import { AppUser } from '../types';
import { useAuth } from './auth.provider';

type AppUserContextType = {
  user: AppUser | null
  isUserReady: boolean
  isSyncing: boolean
  error: Error | null
  refreshUser: () => Promise<void>
  clearUser: () => void
};

const AppUserContext = React.createContext<AppUserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAppReady, isLoggedIn } = useAuth();
  const { syncUser, loading, error } = useSync();

  const [user, setUser] = useState<AppUser | null>(null);
  const [isUserReady, setIsUserReady] = useState(false);

  const mountedRef = useRef(true);
  const lastUidRef = useRef<string | null>(null);
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, []);

  const clearUser = useCallback(() => {
    setUser(null);
    setIsUserReady(true);
    lastUidRef.current = null;
  }, []);

  const doSync = useCallback(async () => {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) throw new Error('No firebase user');

    const uid = firebaseUser.uid;
    const idToken = await firebaseUser.getIdToken();

    const backendUser = (await syncUser({ idToken })).data;
    console.log('User synced:', backendUser);

    if (!mountedRef.current) return;
    setUser(backendUser);
    lastUidRef.current = uid;
  }, [syncUser]);

  useEffect(() => {
    const run = async () => {
      if (!isAppReady) return;

      if (!isLoggedIn) {
        if (!mountedRef.current) return;
        clearUser();
        return;
      }

      try {
        setIsUserReady(false);

        const firebaseUser = auth.currentUser;
        if (!firebaseUser) {
          if (mountedRef.current) clearUser();
          return;
        }

        if (lastUidRef.current === firebaseUser.uid && user) {
          if (mountedRef.current) setIsUserReady(true);
          return;
        } await doSync();
      } catch (e) {
        console.log('User sync failed:', e);
        if (mountedRef.current) setUser(null);
      } finally {
        if (mountedRef.current) setIsUserReady(true);
      }
    }

    run();
  }, [isAppReady, isLoggedIn, clearUser, doSync, user]);

  const refreshUser = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      setIsUserReady(false);
      await doSync();
    } catch (e) {
      console.log('refreshUser failed:', e);
      if (mountedRef.current) setUser(null);
    } finally {
      if (mountedRef.current) setIsUserReady(true);
    }
  }, [isLoggedIn, doSync]);

  const value = useMemo<AppUserContextType>(() => ({
    user,
    isUserReady,
    isSyncing: loading,
    error: error ?? null,
    refreshUser,
    clearUser,
  }), [user, isUserReady, loading, error, refreshUser, clearUser]);

  return <AppUserContext.Provider value={value}>{children}</AppUserContext.Provider>
}

export const useAppUser = () => {
  const ctx = useContext(AppUserContext)
  if (!ctx) throw new Error('useAppUser must be used within UserProvider')
  return ctx
}
