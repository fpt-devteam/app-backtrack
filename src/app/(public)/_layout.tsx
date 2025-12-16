import { useAuth } from '@/src/providers/AuthProvider';
import { Redirect, Slot } from 'expo-router';
import React from 'react';

function PublicLayout() {
  const { isAppReady, isLoggedIn } = useAuth();
  if (!isAppReady) return null;

  if (isLoggedIn) return <Redirect href="/home" />;
  return <Slot />;
}
export default PublicLayout