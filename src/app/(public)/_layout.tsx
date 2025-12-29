import { useAuth } from '@/src/features/auth/providers';
import { Redirect, Slot } from 'expo-router';
import React from 'react';

function PublicLayout() {
  const { isAppReady, isLoggedIn } = useAuth();
  if (!isAppReady) return null;

  if (isLoggedIn) return <Redirect href="/posts/" />;
  return <Slot />;
}
export default PublicLayout;
